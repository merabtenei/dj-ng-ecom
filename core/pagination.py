from rest_framework.pagination import PageNumberPagination

class StandardApiPagination(PageNumberPagination):
    page_size = 16
    page_size_query_param = 'per_page'
    max_page_size = 200