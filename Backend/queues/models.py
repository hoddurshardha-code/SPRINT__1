from django.db import models


class Candidate(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    college = models.CharField(max_length=150)
    position = models.CharField(max_length=100)
    token_number = models.PositiveIntegerField(unique=True, null=True, blank=True)
    status = models.CharField(max_length=20, default="Waiting")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name