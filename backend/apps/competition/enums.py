from django.db import models

class BookCategory(models.TextChoices):
    FICTION = "Fiction"
    NON_FICTION = "Non-fiction"
    SCIENCE = "Science"
    HISTORY = "History"
    BIOGRAPHY = "Biography"
    CHILDREN = "Children"
    MYSTERY = "Mystery"
    FANTASY = "Fantasy"
    ROMANCE = "Romance"
    SELF_HELP = "Self-help"
    PHILOSOPHY = "Philosophy"
    RELIGION = "Religion"
    EDUCATION = "Education"
    TECHNOLOGY = "Technology"
    ART = "Art"
    POETRY = "Poetry"
    COOKING = "Cooking"
    TRAVEL = "Travel"
    HEALTH = "Health & Fitness"
    BUSINESS = "Business"
    LAW = "Law"
    POLITICS = "Politics"
    DRAMA = "Drama"
    HORROR = "Horror"
    ADVENTURE = "Adventure"
    CLASSICS = "Classics"

class Status(models.TextChoices):
    REGISTERED = "Registered"
    UNREGISTERED = "Unregistered"

class CommentType(models.TextChoices):
    BOOK_SUMMARY = "book summary"
    FAVORITE_PARTS = "favorite parts"
    NOTES = "notes"
    THOUGHTS = "thoughts"
    FAVORITE_QUOTES = "favorite quotes"

