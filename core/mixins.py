
import traceback
from rest_framework.validators import ValidationError
from rest_framework import serializers
from rest_framework.utils import model_meta
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, serializers

from django.db import transaction
class WritableNestedThroughMixin():

    @transaction.atomic
    def create(self, validated_data):
        main_obj = None
        
        popped_items_list = []
        
        validated_data_no_nested = validated_data.copy()
        #print('########### ------------------#')
        print(validated_data)
        #print('#----------------###########')
        print(validated_data_no_nested)
        for key, value in self.get_fields().items():
            #print(type(value))
            if isinstance(value, serializers.ListSerializer):
                #print('will pop: ', value.source if value.source is not None else key)
                popped_items_list.append(validated_data_no_nested.pop(value.source if value.source is not None else key, None))

        #print('POPPED: -------------')
        print(popped_items_list)
        #print('#----------------###########')
        print(validated_data_no_nested)
        try:
            main_obj = self.Meta.model._default_manager.create(**validated_data_no_nested)
        except TypeError:
            tb = traceback.format_exc()
            msg = (
                'Got a `TypeError` when calling `%s.%s.create()`. '
                'This may be because you have a writable field on the '
                'serializer class that is not a valid argument to '
                '`%s.%s.create()`. You may need to make the field '
                'read-only, or override the %s.create() method to handle '
                'this correctly.\nOriginal exception was:\n %s' %
                (
                    self.Meta.model.__name__,
                    self.Meta.model._default_manager.name,
                    self.Meta.model.__name__,
                    self.Meta.model._default_manager.name,
                    self.__class__.__name__,
                    tb
                )
            )
            raise TypeError(msg)

        for key, value in self.get_fields().items():
            if isinstance(value, serializers.ListSerializer):
                items = validated_data.pop(value.source if value.source is not None else key, None)
                if items is not None:
                    ItemModel = value.child.Meta.model
                    link_field = None
                    for field in ItemModel._meta.fields:
                        if field.related_model == self.Meta.model:
                            link_field = field.name
                    #print('### PARENT FIELD : ', parent_field)
                    if link_field is not None:
                        for item in items:
                            item[link_field] = main_obj
                            ItemModel.objects.create(**item)

        main_obj.save()
        return main_obj

    @transaction.atomic
    def update(self, instance, validated_data):
        
        m2m_fields = []
        info = model_meta.get_field_info(instance)
        for key, value in validated_data.items():
            if key in info.relations and info.relations[key].to_many:
                m2m_fields.append((key, value))
                
            else:
                setattr(instance, key, value)
        
        #instance.save()

        # print('validated_data ^^^^^^^^^^^^^^^^^^')
        # print(validated_data)
        # print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
        new_items = []
        for key, value in self.get_fields().items():
            
            err_list = []
            exception_found = False
            if isinstance(value, serializers.ListSerializer):
                source = value.source if value.source is not None else key
                #print(key, ' IS LIST, source : ', source)
                #print('validated_data ^^^^^^^^^^^^^^^^^^')
                #print(validated_data)
                #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                #print(validated_data[source] , '######')
                items = validated_data.pop(value.source if value.source is not None else key, None)
                # print('validated_data after pop^^^^^^^^^^^^^^^^^^')
                # print(validated_data)
                # print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                if items is not None:
                    
                    ItemModel = value.child.Meta.model
                    ItemModelSerializer = value.child
                    pk_name = ItemModel._meta.pk.name

                    related_instance_field_name = None
                    
                    for item_field in ItemModel._meta.fields:
                        if item_field.related_model == self.Meta.model:
                            related_instance_field_name = item_field.name

                    # delete current items and create new ones from data
                    current = ItemModel.objects.filter(**{related_instance_field_name: instance})
                    for item in current:
                        item.delete()

                    link_field = None
                    
                    for field in ItemModel._meta.fields:
                        if field.related_model == self.Meta.model:
                            link_field = field.name
                    
                    if link_field is not None:
                        for item in items:
                            # transform all objects into pk value
                            for ik, iv in item.items():
                                item[ik] = iv.pk if hasattr(iv, 'pk') else iv
                            serializer = ItemModelSerializer.__class__(data=item)
                            try:
                                serializer.is_valid(raise_exception=True)
                                err_list.append({})
                            except ValidationError as err:
                                err_list.append(err.detail)
                                exception_found = True

                            item_validated_data = serializer.validated_data.copy()
                            item_validated_data[link_field] = instance
                            new_items.append(ItemModel(**item_validated_data))

            if exception_found:
                raise ValidationError(detail={key: err_list}, code=400)

        for item in new_items:
            item.save()

        #resave instance to trigger any nested objects computed values
        instance.save()

        return instance


class RepresentationMixin():
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['_display_'] = str(instance)
        response['_pk_'] = instance.pk

        return response

class BulkUpdateMixin():
    @action(methods=['patch'], detail=False)
    def bulk_update(self, request):
        try:
            for el in request.data:
                elID = el.get('id') if el.get('id') is not None else el.get('_pk_')
                inst = self.get_queryset().get(id=elID)
                serializer = self.get_serializer(inst, data=el, partial=True)
                serializer.is_valid(raise_exception=True)
                for k, v in el.items():
                    if hasattr(inst, k):
                        setattr(inst, k, v)

                inst.save()
                
            return Response({}, status=status.HTTP_200_OK)

        except Exception as e:
            print(str(e))
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)