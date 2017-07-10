# -*- coding:utf-8 -*-
from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$',views.index, name='index'),
    url(r'^aboutus/$',views.aboutus, name='aboutus'), 
    url(r'^notice/$',views.notice, name='notice'), 
    url(r'^notice/(\d+)/$',views.notice2, name='notice2'), 
    url(r'^news/$',views.news, name='news'), 
    url(r'^news/(\d+)/$',views.news2, name='news2'), 
    url(r'^recruit/$',views.recruit, name='recruit'),
    url(r'^tester/$',views.tester, name='tester'),
    url(r'^hyapplic/$',views.hyapplication, name='hyapplic'),
    url(r'^login/$',views.login, name='login'),
    url(r'^enquiry/$',views.enquiry, name='enquiry'),
    url(r'^welcome/$',views.welcome, name='welcome'),
    url(r'^test/$',views.test, name='test'),
               ]


