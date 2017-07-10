from django.contrib import admin
from .models import News,Notice,Recruit,Industry,ProdIndustry,Company,Users,Order,Trade,Product2,\
            Product1,Modes,Places,Delivery,Pay,Quality,Delivme,Deposit

# Register your models here.

class NewAdmin(admin.ModelAdmin):
    fields = ['title','content','author','updatetime']

class NoticeAdmin(admin.ModelAdmin):
    fields = ['title','content','author','updatetime']

class RecruitAdmin(admin.ModelAdmin):
    fields = ['position','description','ask','updatetime']

class UsersInline(admin.StackedInline):
    model = Users
    extra = 1
    
class CompanyAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,      {'fields':['companyname']}),
        ('Company info',{'fields':['companyaddr','telphone','fax','mobilePhone','updatetime']}),
                 ]
    inlines = [UsersInline]

class OrderAdmin(admin.ModelAdmin):
    list_display = ('username','product_name','byorsell','price','place','delivplace','pay','quality',\
              'delivmethod','putnumb','dealnumb','deposit','state','delvDate','livetime','updatetime')

    def product_name(self,Product2):
        return ('%s' % Product2.product).upper()
    product_name.short_description = 'product_name'

class Product2Inline(admin.StackedInline):
    model = Product2
    extra = 3

class Product1Admin(admin.ModelAdmin):
    fieldsets = [
        (None,      {'fields':['productname']}),
        ('product info',{'fields':['prokey','updatetime']}),
                ]
    inlines = [Product2Inline]

    
class ModesAdmin(admin.ModelAdmin):
    fields = ['modekey','mode','updatetime']
    
class PlacesAdmin(admin.ModelAdmin):
    fields = ['plackey','place','updatetime']
    
class DeliveryAdmin(admin.ModelAdmin):
    fields = ['delivkey','delivplace','updatetime']
    
class PayAdmin(admin.ModelAdmin):
    fields = ['paykey','pay','updatetime']

class QualityAdmin(admin.ModelAdmin):
    fields = ['qualkey','qual','updatetime']

class DepositAdmin(admin.ModelAdmin):
    fields = ['deposkey','deposvalue','depos','updatetime']
    
class DelivmeAdmin(admin.ModelAdmin):
    fields = ['delivmvkey','delivmv','updatetime']    
    
admin.site.register(News,NewAdmin)
admin.site.register(Notice,NoticeAdmin)
admin.site.register(Recruit,RecruitAdmin)
admin.site.register(Company,CompanyAdmin)
admin.site.register(Product1,Product1Admin)
admin.site.register(Order,OrderAdmin)
admin.site.register(Modes,ModesAdmin)
admin.site.register(Places,PlacesAdmin)
admin.site.register(Delivery,DeliveryAdmin)
admin.site.register(Pay,PayAdmin)
admin.site.register(Quality,QualityAdmin)
admin.site.register(Deposit,DepositAdmin)
admin.site.register(Delivme,DelivmeAdmin)







