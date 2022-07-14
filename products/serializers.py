from core.mixins import RepresentationMixin, WritableNestedThroughMixin
from rest_framework import serializers

from products.models import ProductBrand, ProductCategory, Product

class ProductBrandSerializer(RepresentationMixin, serializers.ModelSerializer):
    
    class Meta:
        model = ProductBrand
        fields = '__all__'

class ProductCategorySerializer(RepresentationMixin, serializers.ModelSerializer):
    
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(RepresentationMixin, serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['brand'] = ProductBrandSerializer(instance.brand).data
        rep['category'] = ProductCategorySerializer(instance.category).data
        return rep
