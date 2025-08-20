from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.users.models import User
from apps.utils.models import BaseModel

from .enums import BookCategory, CommentType


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
    category = models.CharField(max_length=255, choices=BookCategory.choices)
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="books"
    )
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="competition_books/")
    author = models.CharField(max_length=255)

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
    group_number = models.CharField(max_length=6)

    class Meta:
        unique_together = ("student", "competition")

    def __str__(self):
        return f"{self.student} registered for {self.competition}"


class StudentComment(BaseModel):
    type = models.CharField(max_length=255, choices=CommentType.choices)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="student_comments"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()

    def __str__(self):
        return f"{self.student} commented on {self.competition}"


class DailyPages(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_pages")
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="daily_pages"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    page = models.IntegerField()

    def __str__(self):
        return f"{self.competition} user {self.user}"


class BookRating(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="book_ratings"
    )
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="book_ratings"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    def __str__(self):
        return f"{self.competition} rating {self.rating}"


class Achievement(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="achievements"
    )
    name = models.CharField(max_length=255)


class Notification(BaseModel):
    competition = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="notifications"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    text = models.CharField(max_length=255)

    def get_user_full_name(self):
        return self.user.first_name + " " + self.user.last_name

    def __str__(self):
        return self.text
