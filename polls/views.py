# -*- coding:utf-8 -*-
from django.shortcuts import render,HttpResponse
from models import UserList
from django.utils.safestring import mark_safe
# Create your views here.

class Page:
    def __init__(self,current_page):
        self.current_page = int(current_page)
        
    def start(self):
        return (self.current_page-1)*10
    
    def end(self):
        return self.current_page*10
    
    def page_str(self,all_item,base_url):
        all_page, div = divmod(all_item, 10)
        
        if div > 0:
            all_page += 1
            
        pager_list = []
        '''
                            如果总页数 <= 11 比如9页：
　　                            那么，还有必要让页码动起来吗？就没必要了直接显示总共页数就行了！start就是1，end就是9就行了
        else：
　　                            如果当前页小宇6：
　　　　                            start:1
　　　　                            end:11
　　                            如果当前页大于6：
　　　　                            start：当前页-5
　　　　                            end：当前页+6
　　　　                            如果当前页+6 >总页数：
　　　　　　                            start：总页数-10
　　　　　　                            end：总页数
            '''
        if all_page <= 11:
            start = 1
            end = all_page
        else:
            if self.current_page <= 6:
                start = 1
                end = 11
            else:
                start = self.current_page -5
                end = self.current_page + 6
                if self.current_page + 6 > all_page:
                    start = all_page - 10
                    end = all_page
        
        
        for i in range(start, end):
            if i == self.current_page:
                temp = '<a style="color:red;font-size:26px;padding:5px" href="%s?page=%d">%d</a>&nbsp' % (base_url,i,i)
            else:
                temp = '<a styel="padding:5px" href="%s?page=%d">%d</a>&nbsp' % (base_url,i,i)
            pager_list.append(temp) 
            
        if self.current_page >1:
            pre_page = '<a href="%s?page=%d">上一页</a>' % (base_url,self.current_page-1)
        else:
            pre_page = '<a href="javascript:void(0);">上一页</a>'
            
        if self.current_page >= all_page:
            next_page = '<a href="javascript:void(0);">下一页</a>'
        else:
            next_page = '<a href="%s?page=%d">下一页</a>' % (base_url,self.current_page+1)
        
        pager_list.insert(0,pre_page)
        pager_list.append(next_page)    
        return mark_safe("".join(pager_list))

def user_list(request):
    current_page = int(request.GET.get('page','1'))
    print current_page
    page_obj = Page(current_page)
    
    result = UserList.objects.all()[page_obj.start():page_obj.end()]
    all_item = UserList.objects.all().count()
        
    pager_str = page_obj.page_str(all_item, '/polls/')
    print pager_str
    
    return render(request,'polls/index.html',{'result':result,'pager_str':pager_str})

