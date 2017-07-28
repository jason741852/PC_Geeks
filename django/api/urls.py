from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
from rest_framework import routers


urlpatterns = {
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^all-posts/$', PostPublicListView.as_view()),
    url(r'^posts/$', PostPrivateListCreateView.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', PostInstanceView.as_view(), name="details"),
    url(r'^messaging/$', CreateViewMessaging.as_view(), name="create"),
    url(r'^messaging/(?P<pk>[0-9]+)/$', DetailsViewMessaging.as_view(), name="details"),
    url(r'^users/', UserView.as_view({'get': 'list', 'post': 'create'}), name="name"),
    url(r'^search/$', CreateViewSearch.as_view(), name="create"),
    url(r'^search/(?P<pk>[0-9]+)/$', DetailsViewSearch.as_view(), name="details"),
}

urlpatterns = format_suffix_patterns(urlpatterns)
