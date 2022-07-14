import bisect
from collections import OrderedDict
from traceback import print_tb
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, serializers

from products.models import ProductBrand, ProductCategory, Product
from products.serializers import ProductBrandSerializer, ProductCategorySerializer, ProductSerializer
from core.mixins import BulkUpdateMixin
from django.db.transaction import atomic
from datetime import datetime

import random

class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_fields = {
        'brand': ['in', 'exact'],
        'category': ['in', 'exact'],
    }
    
    search_fields = ['name', 'ref']

    @atomic()
    @action(methods=['get'], detail=False)
    def featured(self, request):
        featured_products = Product.objects.filter(is_featured=True)
        per_page = request.GET.get('per_page', 12)
        # Get random featured products
        # (use day as seed to have daily changes)
        featured_ids = featured_products.values_list('id', flat=True)
        featured_count = featured_products.count()
        today = datetime.today()
        random.seed(today.day + today.month * 100)
        random_indices = random.sample(list(featured_ids), min(per_page, featured_count))
        selected = list(featured_products.filter(id__in=random_indices))
        selected.sort(key=lambda album: random_indices.index(album.id))
        
        serializer = self.get_serializer(selected, many=True)
        return Response({'count': len(selected), 'results': serializer.data})

    @atomic()
    @action(methods=['get'], detail=False)
    def discounted(self, request):
        discounted_products = Product.objects.filter(discount__gt=0)
        per_page = request.GET.get('per_page', 12)
        # Get random featured products
        # (use day as seed to have daily changes)
        featured_ids = discounted_products.values_list('id', flat=True)
        featured_count = discounted_products.count()
        today = datetime.today()
        random.seed(today.day + today.month * 100)
        random_indices = random.sample(list(featured_ids), min(per_page, featured_count))
        selected = list(discounted_products.filter(id__in=random_indices))
        selected.sort(key=lambda album: random_indices.index(album.id))
        
        serializer = self.get_serializer(selected, many=True)
        return Response({'count': len(selected), 'results': serializer.data})

class ProductBrandViewSet(viewsets.ModelViewSet, BulkUpdateMixin):

    queryset = ProductBrand.objects.all()
    serializer_class = ProductBrandSerializer


def insort(seq, item, key=lambda v: v):
    """Insert an item into a sorted list using a separate corresponding
       sorted keys list and a keyfunc() to extract the key from each item.

    Based on insert() method in SortedCollection recipe:
    http://code.activestate.com/recipes/577197-sortedcollection/
    """
    k = key(item)  # Get key.
    keys = [key(el) for el in seq]
    i = bisect.bisect_left(keys, k)  # Determine where to insert item.
    keys.insert(i, k)  # Insert key of item to keys list.
    seq.insert(i, item)  # Insert the item itself in the corresponding place.

class ProductCategoryViewSet(viewsets.ModelViewSet, BulkUpdateMixin):

    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

    def flat_tree_to_dict(self, nodes, max_depth):
        tree = []
        last_levels = [None] * max_depth
        for n in nodes:
            parentId = n.parent
            if(parentId):
                parentId = parentId.id
            serializer = self.get_serializer(n)
            d = serializer.data
            
            if n.level == 0:
                insort(tree, d, key=lambda e: e['ordering'])
            else:
                print('n.level - 1 : ', n.level - 1)
                parent_dict = last_levels[n.level - 1]
                print('parent_dict : ', parent_dict)
                
                if 'children' not in parent_dict:
                    parent_dict['children'] = []
                
                insort(parent_dict['children'], d, key=lambda e: e['ordering'])

            last_levels[n.level] = d
        return tree 

    def list(self, request):
        tree = request.GET.get('tree')
        if tree is not None:
            categories = self.get_queryset()
            # flat_tree_to_dict won't work if query is sorted
            items = self.flat_tree_to_dict(categories, 4)
            items.sort(key=lambda e: e['ordering'])
            return Response({
                    'count': categories.count(),
                    'results': items
                    })
        return super(ProductCategoryViewSet, self).list(request)
