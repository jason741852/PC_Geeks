from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
from rest_framework import routers
from rest_framework.authtoken import views as auth_view


urlpatterns = {

    url(r'^login/', auth_view.obtain_auth_token),
    url(r'^register/', UserCreateView.as_view()),
    url(r'^report/', ReportViewSet.as_view()),

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
    url(r'^posts/(?P<post_id>[0-9]+)/images/$', PostImageListView.as_view()),
    url(r'^posts/(?P<post_id>[0-9]+)/images/new/$', ImageCreateView.as_view()),

    url(r'^images/', ImageListView.as_view()),
    url(r'^images/delete/(?P<pk>[0-9]+)/$', ImageDeleteView.as_view()),

    url(r'^messaging/$', MessageListView.as_view()),
    url(r'^messaging/show/$', MessageHeadView.as_view()),
    url(r'^messaging/new/$', MessageCreateView.as_view()),
    url(r'^messaging/post/(?P<pid>[0-9]+)/buyer/(?P<bid>[0-9]+)/$', MessageConversationView.as_view()),

    url(r'^user/(?P<pk>[0-9]+)/$', UserDetailsView.as_view()), # include buyer rating, seller rating

    url(r'^self/$', SelfUserDetailsView.as_view()),
    url(r'^self/update/$', SelfUserUpdateView.as_view()),
    url(r'^self/delete/$', SelfUserDeleteView.as_view()),
    url(r'^self/posts/$', SelfPostListView.as_view()),
    url(r'^self/posts/(?P<pk>[0-9]+)/$', SelfPostDetailsView.as_view()),
    url(r'^self/interested/$', SelfPotentialBuyerListView.as_view()),

    url(r'^staff/users/$', StaffUserListView.as_view()),
    url(r'^staff/users/update/$', StaffUserUpdateView.as_view()),
    url(r'^staff/users/delete/$', StaffUserDeleteView.as_view()),
    url(r'^staff/messages/$', StaffMessageListView.as_view()),
    url(r'^staff/buyer_ratings/$', StaffBuyerRatingListView.as_view()),
    url(r'^staff/seller_ratings/$', StaffSellerRatingListView.as_view()),
    url(r'^staff/interested/$', StaffPotentialBuyerListView.as_view()),
}

urlpatterns = format_suffix_patterns(urlpatterns)

