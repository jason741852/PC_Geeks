from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
from rest_framework import routers
from rest_framework.authtoken import views as auth_view


urlpatterns = {

    url(r'^login/', auth_view.obtain_auth_token),
    url(r'^report/', ReportViewSet.as_view()),

    url(r'^posts/$', PostPublicListView.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', PostDetailsView.as_view()),
    url(r'^posts/new/$', PostCreateView.as_view()),
    url(r'^posts/update/(?P<pk>[0-9]+)/$', PostUpdateView.as_view()),
    url(r'^posts/delete/(?P<pk>[0-9]+)/$', PostDeleteView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/images/$', PostImageListView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/images/new/$', ImageCreateView.as_view()),

    url(r'^images/', ImageListView.as_view()),
    url(r'^images/delete/(?P<pk>[0-9]+)/$', ImageDeleteView.as_view()),

    url(r'^messages/$', MessageListView.as_view()),
    url(r'^messages/send/$', MessageCreateView.as_view()),
    url(r'^messages/(?P<pk>[0-9]+)/$', MessageDetailsView.as_view()),

    url(r'^users/$', UserListView.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', UserDetailsView.as_view()),
    url(r'^users/self/$', UserSelfView.as_view()),
    url(r'^users/new/$', UserCreateView.as_view()),
    url(r'^users/update/(?P<pk>[0-9]+)/$', UserUpdateView.as_view()),
    url(r'^users/delete/(?P<pk>[0-9]+)/$', UserDeleteView.as_view()),
    url(r'^users/posts/(?P<pk>[0-9]+)/$', PostPrivateListView.as_view()),

    url(r'^buyer_ratings/new/$', CreateBuyerRatingView.as_view()),
    url(r'^buyer_ratings/(?P<pk>[0-9]+)/$', BuyerRatingInstanceView.as_view()),
    url(r'^seller_ratings/new/$', CreateSellerRatingView.as_view()),
    url(r'^seller_ratings/(?P<pk>[0-9]+)/$', SellerRatingInstanceView.as_view()),
    url(r'^potential_buyer/new/$', CreatePotentialBuyerView.as_view()),
    url(r'^potential_buyer/(?P<pk>[0-9]+)/$', PotentialBuyerInstanceView.as_view()),
    url(r'^potential_buyer/post/(?P<pk>[0-9]+)/$', PotentialBuyerListView.as_view()),

}

urlpatterns = format_suffix_patterns(urlpatterns)

