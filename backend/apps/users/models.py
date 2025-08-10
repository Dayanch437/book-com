from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.db.models import ForeignKey
from django.utils import timezone
from django.db import models
from .enums import Role
from .managers import UserManager

class Faculty(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE,related_name='departments')

    def __str__(self):
        return self.name


class User(AbstractUser):
    avatar = models.ImageField(upload_to="avatars", blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",  # changed from default `user_set`
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
    father_name = models.CharField(max_length=10, blank=True, null=True)
    faculty = ForeignKey(Faculty, on_delete=models.CASCADE,null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    department = ForeignKey(Department, on_delete=models.CASCADE,null=True, blank=True)

    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=10)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"
