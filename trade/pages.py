# -*- coding:utf-8 -*-
from django.utils.safestring import mark_safe


class Page:
    def __init__(self,current_page,dicts):
        self.current_page = int(current_page)
        self.status = dicts
        
    def start(self):
        return (self.current_page-1) * 3
    
    def end(self):
        return self.current_page * 3
    
    def getdict(self):
        dictstr = ''
        
        for i in self.status.keys():
            sta = i + '=' + self.status[i]
            dictstr = dictstr + '&' + sta
            
        return dictstr
    
    def page_str(self,all_item,url_dir):
        all_page,dev = divmod(all_item,3)
        
        if dev > 0 :
            all_page += 1
            
        page_list = []
        dictstr = self.getdict().encode("utf-8")
        end_page_str = str(all_page) + dictstr
        per_page_str = str(self.current_page-1) + dictstr
        
        fir_page = '<a href="%s/?page=1%s">首页</a>' % (url_dir,dictstr)
        end_page = '<a href="%s/?page=%s">末页</a>' % (url_dir,end_page_str)
        # 定义上一页
        if self.current_page == 1:
            per_page = '<a href="">上一页</a>' 
        else:
            per_page = '<a href="%s/?page=%s">上一页</a>' % (url_dir,per_page_str)
            
        # 定义下一页
        if self.current_page == all_page:
            next_page = '<a href="">下一页</a>' 
        else:
            next_page = '<a href="%s/?page=%d%s">下一页</a>' % (url_dir,self.current_page+1,dictstr)
        
        page_str = mark_safe("".join([per_page,next_page]))
        print page_str
        
        return page_str,all_page,fir_page,end_page
        
        
        
        
        
        
        
        
        
        