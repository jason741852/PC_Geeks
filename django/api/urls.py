from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
from rest_framework import routers
from rest_framework.authtoken import views as auth_view


urlpatterns = {
    url(r'^login/', auth_view.obtain_auth_token),

    url(r'^posts/$', PostPublicListView.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', PostDetailsView.as_view()),
    url(r'^posts/new/$', PostCreateView.as_view()),
    url(r'^posts/delete/(?P<pk>[0-9]+)/$', PostDeleteView.as_view()),

    url(r'^messages/$', MessageListView.as_view()),
    url(r'^messages/send/$', MessageCreateView.as_view()),
    url(r'^messages/(?P<pk>[0-9]+)/$', MessageDetailsView.as_view()),

    url(r'^users/$', UserListView.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', UserDetailsView.as_view()),
    url(r'^users/self/$', UserSelfView.as_view()),
    url(r'^users/new/$', UserCreateView.as_view()),
    url(r'^users/delete/(?P<pk>[0-9]+)/$', UserDeleteView.as_view()),
    url(r'^users/posts/(?P<pk>[0-9]+)/$', PostPrivateListView.as_view()),
}

urlpatterns = format_suffix_patterns(urlpatterns)
