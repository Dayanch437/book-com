from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

from .enums import Role
from .managers import UserManager


class User(AbstractUser):
    avatar = models.ImageField(upload_to="avatars", blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # changed from default `user_set`
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    father_name = models.CharField(max_length=10, blank=True, null=True)


    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"
