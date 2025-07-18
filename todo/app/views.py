from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Todo
from .serializers import TodoSerializer
from .filters import TodoFilter
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at']
    filterset_fields = ['is_completed','due_date',]
    filterset_class = TodoFilter

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user).order_by('-created_at')  # 🔥 added

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)


class TodoStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now().date()

        todos = Todo.objects.filter(user=user)

        total = todos.count()
        completed = todos.filter(is_completed=True).count()
        incomplete = todos.filter(is_completed=False).count()
        overdue = todos.filter(due_date__lt=now, is_completed=False).count()
        completed_overdue = todos.filter(is_completed=True, due_date__lt=now).count()

        return Response({
            'total': total,
            'completed': completed,
            'incomplete': incomplete,
            'overdue': overdue,
            'completed_overdue': completed_overdue,
        })