from django.contrib import admin
from .models import UserList
# Register your models here.

class UserListAdmin(admin.ModelAdmin):
    fields = ['username','age']
    
admin.site.register(UserList,UserListAdmin)
