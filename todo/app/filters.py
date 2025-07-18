import django_filters
from .models import Todo
from datetime import date


class TodoFilter(django_filters.FilterSet):
    overdue = django_filters.BooleanFilter(method='filter_overdue')

    class Meta:
        model = Todo
        fields = ['is_completed', 'due_date', 'created_at', 'overdue']

    def filter_overdue(self, queryset, name, value):
        if value:
            return queryset.filter(due_date__lt=date.today(), is_completed=False)
        return queryset