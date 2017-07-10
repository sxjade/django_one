# -*- coding:utf-8 -*-
'''
Created on 2017-5-16

@author: liuyang
'''
from django.conf.urls import include, url
from . import views


urlpatterns = [
    url(r'^$',views.user_list, name='index'),
    
    
               ]
