# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('companyname', models.CharField(unique=True, max_length=50)),
                ('companyaddr', models.CharField(max_length=50)),
                ('telphone', models.CharField(max_length=20)),
                ('fax', models.CharField(max_length=50)),
                ('mobilePhone', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('delivplace', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Industry',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('companyname', models.CharField(unique=True, max_length=50)),
                ('addr', models.CharField(max_length=50)),
                ('companyInd', models.CharField(max_length=20)),
                ('nature', models.CharField(max_length=20)),
                ('product', models.CharField(max_length=20)),
                ('area', models.CharField(max_length=20)),
                ('users', models.IntegerField()),
                ('outputvalue', models.IntegerField()),
                ('profit', models.IntegerField()),
                ('status', models.CharField(max_length=20)),
                ('license', models.FileField(upload_to=b'./upload')),
                ('bankfile', models.FileField(upload_to=b'./upload')),
                ('reportfile', models.FileField(upload_to=b'/upload')),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Modes',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('mode', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('title', models.CharField(max_length=30)),
                ('content', models.TextField(max_length=800)),
                ('times', models.IntegerField(default=0)),
                ('author', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Notice',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('title', models.CharField(max_length=30)),
                ('content', models.TextField(max_length=800)),
                ('times', models.IntegerField(default=0)),
                ('author', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('username', models.CharField(max_length=30)),
                ('product', models.CharField(max_length=20)),
                ('byorsell', models.IntegerField()),
                ('price', models.DecimalField(max_digits=8, decimal_places=2)),
                ('place', models.CharField(max_length=20)),
                ('delivplace', models.CharField(max_length=20)),
                ('pay', models.CharField(max_length=20)),
                ('quality', models.CharField(max_length=50)),
                ('delivmethod', models.CharField(max_length=20)),
                ('putnumb', models.IntegerField()),
                ('dealnumb', models.IntegerField(default=0)),
                ('deposit', models.IntegerField()),
                ('state', models.IntegerField()),
                ('delvDate', models.DateField()),
                ('livetime', models.DateTimeField()),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Places',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('place', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='ProdIndustry',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('indust', models.CharField(max_length=20)),
                ('product', models.CharField(max_length=20)),
                ('mode', models.CharField(max_length=20)),
                ('quality', models.CharField(max_length=50)),
                ('place', models.CharField(max_length=20)),
                ('delivplace', models.CharField(max_length=20)),
                ('unitsandpack', models.CharField(max_length=20)),
                ('unit', models.CharField(max_length=20)),
                ('proportion', models.CharField(max_length=20)),
                ('inspection', models.FileField(upload_to=b'./upload')),
                ('placeProve', models.FileField(upload_to=b'./upload')),
                ('xczlicense', models.FileField(upload_to=b'./upload')),
                ('otherfile', models.FileField(upload_to=b'./upload')),
                ('updatetime', models.DateTimeField()),
                ('companyid', models.ForeignKey(to='trade.Industry')),
            ],
        ),
        migrations.CreateModel(
            name='Product1',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('productname', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Product2',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('productname', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
                ('orderid', models.ForeignKey(to='trade.Product1')),
            ],
        ),
        migrations.CreateModel(
            name='Recruit',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('position', models.CharField(max_length=30)),
                ('description', models.TextField()),
                ('ask', models.TextField()),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Trade',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('product', models.CharField(max_length=20)),
                ('dealnum', models.IntegerField()),
                ('updatetime', models.DateTimeField()),
                ('orderid', models.ForeignKey(related_name='orderid', to='trade.Order')),
                ('tradeid', models.ForeignKey(related_name='tradeid', to='trade.Order')),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('username', models.CharField(unique=True, max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('telphone', models.CharField(max_length=20)),
                ('fax', models.CharField(max_length=50)),
                ('mobilePhone', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=50)),
                ('updatetime', models.DateTimeField()),
                ('companyid', models.ForeignKey(to='trade.Company')),
            ],
        ),
    ]
