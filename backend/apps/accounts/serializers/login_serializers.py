from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userId", "email", "username"]
        read_only_fields = ["id"]
