from django.urls import path
from .views import register_candidate, queue_status, next_candidate, complete_candidate, skip_candidate, current_candidate, queue_stats
urlpatterns = [
    path('register/', register_candidate),
    path('queue/', queue_status),
    path('next/', next_candidate),
    path('complete/<int:token_number>/', complete_candidate),
    path('skip/<int:token_number>/', skip_candidate),
    path('current/', current_candidate),
    path('stats/', queue_stats),
]