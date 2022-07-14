
from django.http import QueryDict
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth.models import User, Group, Permission
from core.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = {
        'username': ['exact', 'contains'],
        'is_staff': ['exact', 'in'],
        'email': ['exact', 'contains'],
    }
    
    search_fields = ['username', 'email']

    @action(methods=['post'], detail=False, permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.is_active = True
        user.set_password(request.data.get('password'))
        user.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)