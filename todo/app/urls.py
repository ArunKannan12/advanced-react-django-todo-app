from django.urls import path
from .views import TodoListCreateView, TodoDetailView,TodoStatsView

urlpatterns = [
    path('todos/', TodoListCreateView.as_view(), name='todo-list-create'),
    path('todos/<uuid:id>/', TodoDetailView.as_view(), name='todo-detail'),
    path('todos/stats/',TodoStatsView.as_view(),name='todo-stats')
]
