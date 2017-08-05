from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
from rest_framework import routers
from rest_framework.authtoken import views as auth_view


urlpatterns = {
	url(r'^report/', ReportViewSet.as_view()),
    url(r'^login/', auth_view.obtain_auth_token),
    url(r'^all-posts/$', PostPublicListView.as_view()),
    url(r'^posts/$', PostPrivateListCreateView.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', PostInstanceView.as_view(), name="details"),
    url(r'^messaging/$', CreateViewMessaging.as_view(), name="create"),
    url(r'^messaging/(?P<pk>[0-9]+)/$', DetailsViewMessaging.as_view(), name="details"),
    url(r'^users/', UserView.as_view({'get': 'list', 'post': 'create'}), name="name"),
    url(r'^users/(?P<pk>[0-9]+)/$', UserView.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}))
}

urlpatterns = format_suffix_patterns(urlpatterns)
