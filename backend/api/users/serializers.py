from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.users.models import User, Faculty, Department


class UserSerializer(serializers.ModelSerializer):
    faculty = serializers.CharField(source='faculty.name', read_only=True)
    department = serializers.CharField(source='department.name', read_only=True)
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "faculty",
            'department',
            "avatar",
            "father_name",
            "role",
        ]


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "father_name",
            "department",
            "faculty"
        ]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    class Meta:
        extra_kwargs = {"username":{"required":False}}
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["role"] = user.role
        return data


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordWithOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        return value

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ["id", "name"]

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name","faculty"]
