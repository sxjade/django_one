# -*- coding:utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from .models import News,Notice,Recruit,Industry,ProdIndustry,Company,Users,Order,Trade
import os 
import uuid
from .pages import Page

# Create your views here.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def index(request):
    new_list = News.objects.order_by('-updatetime')[:3]
    notice = Notice.objects.last()
    notice2 = Notice.objects.order_by('-updatetime')[1]
    
    content = {'new_list':new_list, 'notice':notice, 'notice2':notice2}
    
    return render(request,'trade/index.html',content)

def aboutus(request):
    return render(request,'trade/aboutus.html')

def loginTrueOrF(request):
    try:
        if request.session['username']:
            return True
    except:
        return False

def welcome(request):
    return render(request,'trade/welcome.html')

def enquiry(request):
    # 基础化工,品名,贸易方式,质量标准,原产地,交货地
    if loginTrueOrF(request) == False:
#         return HttpResponseRedirect('trade/login')
        return render(request,'trade/login.html')
            
    if request.session['username']:
        status = {}
        product = request.GET.get('product')
        place = request.GET.get('place')
        quality = request.GET.get('quality')
        delivplace = request.GET.get('delivplace')
             
        if product:
            status['product'] = product
                 
        if place:
            status['place'] = place
                 
        if quality:
            status['quality'] = quality
                 
        if delivplace:
            status['delivplace'] = delivplace
             
        current_page = request.GET.get('page','1')
             
        all_item = Order.objects.filter(**status).count()
             
        page_obj = Page(current_page,status)
        order_list = Order.objects.filter(**status).order_by('-updatetime')[page_obj.start():page_obj.end()]   # order_by('-updatetime')
             
        page_str,all_page,fir_page,end_page = page_obj.page_str(all_item, '/trade/enquiry')
        page_list = range(1,all_page+1)
        print page_str
        content = {'order_list':order_list,'page_str':page_str,'all_page':all_page,'page_list':page_list,'fir_page':fir_page,'end_page':end_page}
             
        return render(request,'trade/enquiry.html',content)
    else:
        return render(request,'trade/login.html')


def recruit(request):
    return render(request,'trade/recruit.html')

def login(request):
#     if request.method == 'GET':
#         request.session['login_from'] =  request.META.get('HTTP_REFERER','/')
#         print '1',request.session['login_from']
#         return render(request,'trade/login.html')
    if request.method == 'POST':
        usernm = request.POST.get('username')
        passwd = request.POST.get('password')
        webfrom =  request.META.get('HTTP_REFERER','/')
#         comeurl = request.session['login_from']
#         print '2',comeurl
        user = Users.objects.filter(username=usernm,password=passwd)
        
        if user:
            request.session['username'] = usernm
            return render(request,'trade/welcome.html',{'comeurl':webfrom})
#             return HttpResponse('<meta http-equiv="refresh" content="3;url=http://127.0.0.1:8000/trade/enquiry/">welcome!')
            
    
    return render(request,'trade/login.html')

def tester(request):
    test = Recruit.objects.get(id = 2)
    content = {'test':test}
    return render(request,'trade/zhaop/tester.html',content)

def hyapplication(request):
    if request.method == 'POST':
        companyname = request.POST.get('companyName')
        addr = request.POST.get('companyAddr')
        companyInd = request.POST.get('companyIndustry')
        nature = request.POST.get('companyKind','test')
        product = request.POST.get('companyProduct','test')
        area = request.POST.get('companyArea','test') 
        users = request.POST.get('companyUsers','1')
        outputvalue = request.POST.get('companyPrevOutput','1')
        profit = request.POST.get('companyPrevProfit','1')
        status = request.POST.get('companyPosition','test')
        
        license = request.FILES.get('companyLicensefileId','test')
        bankfile = request.FILES.get('companyBankfileId','test')
        reportfile = request.FILES.get('companyAuditfileId','test')
        
        
        lice = uploadfile(license,license.name)
        bank = uploadfile(bankfile,bankfile.name)
        report = uploadfile(reportfile,reportfile.name)
        
        applic = Industry(companyname=companyname,addr=addr,companyInd=companyInd,nature=nature,product=product,area=area,\
                          users=int(users),outputvalue=int(outputvalue),profit=int(profit),status=status,license=lice,bankfile=bank,reportfile=report
                          )
        applic.save()
    return render(request,'trade/hyapplic.html')


def uploadfile(srcfile,dstfile):
    dst = BASE_DIR + '\\upload\\' + str(uuid.uuid1()) + dstfile
    with open(dst,'wb+') as dest:
        for chunk in srcfile.chunks():
            dest.write(chunk)
            
    return dst

def notice(request):
    title = u'平台公告'
    gg = 'li_on'
    last_notice = Notice.objects.last()
    notice_list = Notice.objects.order_by('-updatetime')
    
    content = {'last_notice':last_notice,'notice_list':notice_list,'title':title,'gg':gg}
    
    return render(request, 'trade/notice.html', content)

def notice2(request,noticeid):
    title = u'平台公告'
    gg = 'li_on'
    
    notice_list = Notice.objects.get(id = noticeid)
    notice_list.times += 1
    notice_list.save()
    content = {'notice_list':notice_list,'title':title,'gg':gg}
    
    return render(request, 'trade/notice2.html', content)

def news(request):
    title = u'公司新闻'
    xw = 'li_on'
    last_notice = News.objects.last()
    notice_list = News.objects.order_by('-updatetime')
    
    content = {'last_notice':last_notice,'notice_list':notice_list,'title':title,'xw':xw}
    
    return render(request, 'trade/notice.html', content)

def news2(request,noticeid):
    title = u'公司新闻'
    xw = 'li_on'
    notice_list = News.objects.get(id = noticeid)
    notice_list.times += 1
    notice_list.save()
    content = {'notice_list':notice_list,'title':title,'xw':xw}
    
    return render(request, 'trade/notice2.html', content)


def test(request):
    return render(request, 'trade/trade_index.html')


