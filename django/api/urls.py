from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
from rest_framework import routers
from rest_framework.authtoken import views as auth_view


urlpatterns = {

    url(r'^login/', auth_view.obtain_auth_token),

    url(r'^posts/$', PostPublicListView.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', PostDetailsView.as_view()), # include seller rating
    url(r'^posts/(?P<post_id>[0-9]+)/interested/$', PostPotentialBuyerListView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/interested/new/$', PotentialBuyerCreateView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/interested/delete/$', PotentialBuyerDeleteView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/rate/buyer/$', BuyerRatingCreateView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/rate/buyer/edit/$', BuyerRatingUpdateView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/rate/seller/$', SellerRatingCreateView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/rate/seller/edit/$', SellerRatingUpdateView.as_view()),
    url(r'^posts/new/$', PostCreateView.as_view()),
    url(r'^posts/update/(?P<pk>[0-9]+)/$', PostUpdateView.as_view()),
    url(r'^posts/delete/(?P<pk>[0-9]+)/$', PostDeleteView.as_view()),

    url(r'^messages/$', MessageListView.as_view()),
    url(r'^messages/send/$', MessageCreateView.as_view()),
    url(r'^messages/(?P<pk>[0-9]+)/$', MessageDetailsView.as_view()),

    url(r'^users/(?P<pk>[0-9]+)/$', UserDetailsView.as_view()), # include buyer rating, seller rating
    url(r'^users/new/$', UserCreateView.as_view()),
    url(r'^users/update/(?P<pk>[0-9]+)/$', UserUpdateView.as_view()),
    url(r'^users/delete/(?P<pk>[0-9]+)/$', UserDeleteView.as_view()),

    url(r'^self/$', SelfUserDetailsView.as_view()),
    url(r'^self/posts/$', SelfPostListView.as_view()),
    url(r'^self/posts/(?P<pk>[0-9]+)/$', SelfPostDetailsView.as_view()),
    url(r'^self/interested/$', SelfPotentialBuyerListView.as_view()),

    url(r'^staff/users/$', StaffUserListView.as_view()),
    url(r'^staff/messages/$', StaffMessageListView.as_view()),
    url(r'^staff/buyer_ratings/$', StaffBuyerRatingListView.as_view()),
    url(r'^staff/seller_ratings/$', StaffSellerRatingListView.as_view()),
    url(r'^staff/interested/$', StaffPotentialBuyerListView.as_view()),
}

urlpatterns = format_suffix_patterns(urlpatterns)
