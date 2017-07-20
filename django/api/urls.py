from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import CreateView, DetailsView
from .views import CreateViewMessaging, DetailsViewMessaging

urlpatterns = {
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'posts/$', CreateView.as_view(), name="create"),
    url(r'^posts/(?P<pk>[0-9]+)/$', DetailsView.as_view(), name="details"),
    url(r'messaging/$', CreateViewMessaging.as_view(), name="create"),
    url(r'^messaging/(?P<pk>[0-9]+)/$', DetailsViewMessaging.as_view(), name="details"),
}

urlpatterns = format_suffix_patterns(urlpatterns)
