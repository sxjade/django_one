# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0003_auto_20170502_1728'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pay',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('paykey', models.CharField(max_length=20)),
                ('pay', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Quality',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('qualkey', models.CharField(max_length=20)),
                ('qual', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.AddField(
            model_name='delivery',
            name='delivkey',
            field=models.CharField(default=b'zg', max_length=20),
        ),
        migrations.AddField(
            model_name='modes',
            name='modekey',
            field=models.CharField(default=b'zg', max_length=20),
        ),
        migrations.AddField(
            model_name='places',
            name='plackey',
            field=models.CharField(default=b'zg', max_length=20),
        ),
        migrations.AddField(
            model_name='product1',
            name='prokey',
            field=models.CharField(default=b'zg', max_length=20),
        ),
        migrations.AddField(
            model_name='product2',
            name='prokey',
            field=models.CharField(default=b'zg', max_length=20),
        ),
    ]
