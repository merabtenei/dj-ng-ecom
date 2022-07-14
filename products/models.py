from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.translation import gettext as _
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.db.models import Max, Value
from django.db.models.functions import Coalesce

# Create your models here.

def get_last_category_ordering():
    return ProductCategory.objects.all().aggregate(last=Coalesce(Max('ordering'), 0))['last'] + 1

class ProductCategory(MPTTModel):
    parent = TreeForeignKey('self', related_name='sub_category', on_delete=models.SET_NULL, blank=True, null=True, verbose_name=_('parent'), default=None)
    name = models.CharField(max_length=200, verbose_name=_('name'), unique=True)
    desc = models.TextField(null=True, blank=True, verbose_name=_('description'))
    slug = models.SlugField(max_length=200, unique=True, verbose_name=_('slug'), editable=False)
    ordering = models.IntegerField(default=get_last_category_ordering, null=True, blank=True, verbose_name=_('ordering'))
    
    class MPTTMeta:
        order_insertion_by = ['ordering']
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ('-ordering', 'name')

    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


    @staticmethod
    def get_default():
        obj, created = ProductCategory.objects.get_or_create(name=_('Others'), defaults={'slug': _('others')})
        return obj

def get_last_brand_ordering():
    return ProductBrand.objects.all().aggregate(last=Coalesce(Max('ordering'), 0))['last'] + 1

class ProductBrand(models.Model):
    name    = models.CharField(max_length=127, verbose_name=_('name'), unique=True)
    slug    = models.SlugField(max_length=127, unique=True, verbose_name=_('slug'), editable=False)
    image   = models.ImageField(upload_to='brands/', blank=True, null=False, verbose_name=_('image'))
    ordering = models.IntegerField(default=get_last_brand_ordering, verbose_name=_('ordering'))
    class Meta:
        verbose_name = _('brand')
        verbose_name_plural = _('brand')
        ordering = ('ordering',)

    def __str__(self):
        return self.name

    def clean(self):
        if self.name: 
            self.name = self.name.upper()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @staticmethod
    def get_default():
        obj, created = ProductBrand.objects.get_or_create(name=_('Others'), defaults={'slug': _('others')})
        return obj


class Product(models.Model):
    ref             = models.CharField(max_length=127, verbose_name=_('Reference'), unique=True)
    category        = models.ForeignKey(ProductCategory, related_name='products', default=ProductCategory.get_default, on_delete=models.SET_DEFAULT, verbose_name=_('Category'))
    brand           = models.ForeignKey(ProductBrand, related_name='products', default=ProductBrand.get_default, on_delete=models.SET_DEFAULT, verbose_name=_('Brand'))
    name            = models.CharField(max_length=255, verbose_name=_('Name'))
    slug            = models.SlugField(max_length=255, unique=True, verbose_name=_('Slug'), editable=False)
    
    desc            = models.TextField(blank=True, null=True, verbose_name=_('Description'))
    is_featured     = models.BooleanField(default=False, verbose_name=_('Is featured'))
    price           = models.DecimalField(verbose_name=_('Price'), decimal_places=2, max_digits=16, default=0)
    discount        = models.DecimalField(verbose_name=_('Discount'), decimal_places=2, max_digits=16, default=0)
    available       = models.BooleanField(default=True, verbose_name=_('Available'))

    image           = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name=_('Image'))
    created_at      = models.DateTimeField(auto_now_add=True, verbose_name=_('Created at'), editable=False)
    updated_at      = models.DateTimeField(auto_now=True, verbose_name=_('Updated at'), editable=False)


    class Meta:
        verbose_name = _('product')
        verbose_name_plural = _('products')
        ordering = ('name',)

    def __str__(self):
        return f'{self.name}'

    def save(self, *args, **kwargs):
        self.slug = slugify(f'{self.ref}-{self.name}')

        featuredChanged = False
        try:
            old = Product.objects.get(pk=self.pk)
            if(old.is_featured != self.is_featured):
                featuredChanged = True
        except:
            pass
    
        super().save(*args, **kwargs)

        #if(featuredChanged):
        #    cache.delete('allfeatured')
