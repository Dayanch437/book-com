from django.contrib import admin

from .models import Competition,Book,CompetitionRegistration,StudentComment,BookRating,DailyPages

# Register your models here.
admin.site.register(Competition)
admin.site.register(CompetitionRegistration)
admin.site.register(StudentComment)
admin.site.register(Book)
admin.site.register(BookRating)
admin.site.register(DailyPages)
