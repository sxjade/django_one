# -*- coding:utf-8 -*-
from django.db import models
import datetime
import django.utils.timezone as timezone
# Create your models here.


class News(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=30)       # 标题
    content = models.TextField(max_length=800)       # 内容
    times = models.IntegerField(default=0)       # 浏览次数
    author = models.CharField(max_length=20)       # 发布者
    updatetime =models.DateTimeField()
    
    def __unicode__(self):
        return self.title
    
    def getday(self):
        return datetime.datetime.strftime(self.updatetime,'%m-%d')
    
    def getyear(self):
        return datetime.datetime.strftime(self.updatetime,'%Y')
    
    def getdate(self):
        return datetime.datetime.strftime(self.updatetime,'%Y/%m/%d')
    
    
class Notice(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=30)       # 标题
    content = models.TextField(max_length=800)       # 内容
    times = models.IntegerField(default=0)       # 浏览次数
    author = models.CharField(max_length=20)       # 发布者
    updatetime =models.DateTimeField()    
    
    def __unicode__(self):
        return self.title
    
    def getday(self):
        return datetime.datetime.strftime(self.updatetime,'%m-%d')
    
    def getyear(self):
        return datetime.datetime.strftime(self.updatetime,'%Y')
    
    def getdate(self):
        return datetime.datetime.strftime(self.updatetime,'%Y/%m/%d')
    
class Recruit(models.Model):
    id = models.AutoField(primary_key=True)
    position = models.CharField(max_length=30)       # 职位
    description = models.TextField()       # 描述
    ask = models.TextField()       # 要求
    updatetime =models.DateTimeField()    
    
    def __unicode__(self):
        return self.position
    
class Industry(models.Model):
    id = models.AutoField(primary_key=True)
    companyname = models.CharField(max_length=50,unique=True)  # 公司名称
    addr = models.CharField(max_length=50)      # 企业所在地
    companyInd = models.CharField(max_length=20)      # 企业所在行业    
    nature = models.CharField(max_length=20)      # 企业性质
    product = models.CharField(max_length=20)      # 企业主营产品
    area = models.CharField(max_length=20)      # 企业产品销售区域
    users = models.IntegerField()      # 企业员工人数
    outputvalue = models.IntegerField()      # 企业上一年产值
    profit = models.IntegerField()      # 企业上一年净利润
    status = models.CharField(max_length=20)      # 企业行业地位
    license = models.FileField(upload_to='./upload')      # 企业营业执照上传
    bankfile = models.FileField(upload_to='./upload')      # 银行账户开户批准上传
    reportfile = models.FileField(upload_to='./upload')      # 上年审计报表上传
    updatetime = models.DateTimeField(default=timezone.now)
    
    def __unicode__(self):
        return self.companyname
    
class ProdIndustry(models.Model):
    id = models.AutoField(primary_key=True)
    companyid = models.ForeignKey(Industry)      # Industry表外键   一对多
    indust = models.CharField(max_length=20)      # 行业
    product = models.CharField(max_length=20)      # 品名
    mode = models.CharField(max_length=20)      # 贸易方式
    quality = models.CharField(max_length=50)      # 质量指标
    place = models.CharField(max_length=20)      # 原产地
    delivplace = models.CharField(max_length=20)      # 交货地
    unitsandpack = models.CharField(max_length=20)      # 数量单位与包装
    unit = models.CharField(max_length=20)      # 计价单位
    proportion = models.CharField(max_length=20)      # 定金比例
    inspection = models.FileField(upload_to='./upload')      # 商品质检单上传
    placeProve = models.FileField(upload_to='./upload')      # 商品原地产证明上传
    xczlicense = models.FileField(upload_to='./upload')      # 商品生产许可证上传
    otherfile = models.FileField(upload_to='./upload')      # 商品其他证明文件上传
    updatetime = models.DateTimeField()
    
    
    
class Company(models.Model):
    id =  models.AutoField(primary_key=True)
    companyname = models.CharField(max_length=50,unique=True)       # 企业名
    companyaddr = models.CharField(max_length=50)       # 地址
    telphone = models.CharField(max_length=20)       # 电话
    fax = models.CharField(max_length=50)       # 传真
    mobilePhone = models.CharField(max_length=20)       # 移动电话
    updatetime = models.DateTimeField()       # 
    
    def __unicode__(self):
        return self.companyname
    
class Users(models.Model):
    id =  models.AutoField(primary_key=True)
    companyid = models.ForeignKey(Company)       # 企业id Company外键，一对多
    username = models.CharField(max_length=30,unique=True)       # 用户名
    password = models.CharField(max_length=30)       # 密码
    telphone = models.CharField(max_length=20)       # 电话
    fax = models.CharField(max_length=50)       # 传真
    mobilePhone = models.CharField(max_length=20)       # 移动电话
    email = models.EmailField(max_length=50)       # email
    updatetime = models.DateTimeField()
    
    def __unicode__(self):
        return self.username
    
    
class Order(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30)       # 挂单用户名
    product = models.CharField(max_length=20)       # 挂单品种
    byorsell = models.IntegerField()        # 0:buy  1:sell
    price = models.DecimalField(max_digits=8,decimal_places=2)       # 挂单价格 
    place = models.CharField(max_length=20)       # 产地
    delivplace = models.CharField(max_length=20)      # 交货地
    pay = models.CharField(max_length=20)       # 付款方式
    quality = models.CharField(max_length=50)      # 质量标准
    delivmethod = models.CharField(max_length=20)       # 提货方式
    putnumb = models.IntegerField()       # 挂单数量
    dealnumb = models.IntegerField(default=0)       # 成交数量
    deposit = models.IntegerField()       # 定金（百分比），程序内需要乘以100
    state = models.IntegerField()       # 成交状态，0：未成交，1：部分成交，2：全部成交，3：失效
    delvDate =models.DateField()       # 交货期
    livetime = models.DateTimeField()       # 有效期
    updatetime = models.DateTimeField()
    
    def __unicode__(self):
        return self.product
    
    def getday(self):
        return datetime.datetime.strftime(self.updatetime,'%Y-%m-%d')
    
    def gettime(self):
        return datetime.datetime.strftime(self.updatetime,'%H:%M')
    
    def getbyorsell(self):
        if self.byorsell == 0:
            return 'purchase_img'
        else:
            return 'sale_img'
    def getsurplus(self):
        return self.putnumb - self.dealnumb
            
    def getdeal(self):
        if self.dealnumb == self.putnumb:
            return 'all_bargin'
        else:
            return ''
    
class Trade(models.Model):
    id = models.AutoField(primary_key=True)
    orderid = models.ForeignKey(Order,related_name='orderid')       # 挂单用户id Order 外键，一对多
    tradeid = models.ForeignKey(Order,related_name='tradeid')       # 挂单用户id Order 外键，一对多
    product = models.CharField(max_length=20)       # 挂单品种
    dealnum = models.IntegerField()       # 成交数量
    updatetime = models.DateTimeField()
    
    def __unicode__(self):
        return self.product
    
class Product1(models.Model):
    ''' 产品品种一级大类'''
    id = models.AutoField(primary_key=True)
    prokey = models.CharField(max_length=20)       # 挂单品种键
    productname = models.CharField(max_length=20)       # 挂单品种
    updatetime = models.DateTimeField()
    
    def __unicode__(self):
        return self.productname
    
class Product2(models.Model):
    ''' 产品品种二级大类'''
    id = models.AutoField(primary_key=True)
    orderid = models.ForeignKey(Product1)       # 一级大类id Product1 外键，一对多
    prokey = models.CharField(max_length=20)       # 挂单品种键
    productname = models.CharField(max_length=20)       # 挂单品种
    updatetime = models.DateTimeField()    
    
    def __unicode__(self):
        return self.productname
    
class Modes(models.Model):    
    id = models.AutoField(primary_key=True)
    modekey = models.CharField(max_length=20)       # 贸易键
    mode = models.CharField(max_length=20)       # 贸易方式
    updatetime = models.DateTimeField()
    
    def __unicode__(self):
        return self.mode
    
class Places(models.Model):    
    id = models.AutoField(primary_key=True)
    plackey = models.CharField(max_length=20)       # 产地键
    place = models.CharField(max_length=20)       # 原产地
    updatetime = models.DateTimeField()
    
    def __unicode__(self):
        return self.place    
    
class Delivery(models.Model):    
    id = models.AutoField(primary_key=True)
    delivkey = models.CharField(max_length=20)       # 交货地键
    delivplace = models.CharField(max_length=20)       # 交货地
    updatetime = models.DateTimeField()
            
    def __unicode__(self):
        return self.delivplace

class Delivme(models.Model):    
    id = models.AutoField(primary_key=True)
    delivmvkey = models.CharField(max_length=20)       # 提货方式键
    delivmv = models.CharField(max_length=20)       # 提货方式
    updatetime = models.DateTimeField()
            
    def __unicode__(self):
        return self.delivmv

    
class Pay(models.Model):    
    id = models.AutoField(primary_key=True)
    paykey = models.CharField(max_length=20)       # 付款方式键
    pay = models.CharField(max_length=20)       # 付款方式
    updatetime = models.DateTimeField()
            
    def __unicode__(self):
        return self.pay
    
class Quality(models.Model):    
    id = models.AutoField(primary_key=True)
    qualkey = models.CharField(max_length=20)       # 质量标准键
    qual = models.CharField(max_length=20)       # 质量标准
    updatetime = models.DateTimeField()
            
    def __unicode__(self):
        return self.qual        
    
class Deposit(models.Model):    
    id = models.AutoField(primary_key=True)
    deposkey = models.CharField(max_length=20)       # 定金键
    deposvalue = models.IntegerField()       # 定金键
    depos = models.CharField(max_length=20)       # 质量标准
    updatetime = models.DateTimeField()
            
    def __unicode__(self):
        return self.depos    
    
    