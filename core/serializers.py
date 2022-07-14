from core.mixins import RepresentationMixin, WritableNestedThroughMixin
from rest_framework import serializers

from django.contrib.auth.models import User, Group, Permission

class UserSerializer(RepresentationMixin, serializers.ModelSerializer):
    
    class Meta:
        model = User
        exclude = ['password']
        #fields = '__all__'