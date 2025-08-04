from django.db import models

from apps.users.models import User
from apps.utils.models import BaseModel


class Competition(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="competitions"
    )
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.title


class Book(BaseModel):
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="books"
    )
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="competition_books/")

    def __str__(self):
        return self.title


class CompetitionRegistration(BaseModel):
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="competition_registrations"
    )
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="registrations"
    )
    student_cart = models.CharField(max_length=6)



    class Meta:
        unique_together = ("student", "competition")

    def __str__(self):
        return f"{self.student} registered for {self.competition}"

class StudentComment(BaseModel):
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="student_comments"
    )
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="student_comments"
    )
    comment = models.TextField()