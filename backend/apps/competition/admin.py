from django.contrib import admin

from .models import (
    Achievement,
    Book,
    BookRating,
    Competition,
    CompetitionRegistration,
    DailyPages,
    Notification,
    StudentComment,
)

# Register your models here.
admin.site.register(Competition)
admin.site.register(CompetitionRegistration)
admin.site.register(StudentComment)
admin.site.register(Book)
admin.site.register(BookRating)
admin.site.register(DailyPages)
admin.site.register(Notification)
admin.site.register(Achievement)
