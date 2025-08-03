from django.db import models


class Role(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    STUDENT = "STUDENT", "Student"
    TEACHER = "TEACHER", "Teacher"
