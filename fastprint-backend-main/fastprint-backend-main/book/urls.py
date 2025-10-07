from django.urls import path
from .views import admin_all_orders, admin_order_detail, admin_shipment_orders, prepare_shipment, update_order_status

from .views import (
    UploadBookProjectView,
    SaveOrderAPIView,
    user_books,
    book_detail,
    update_book,
    delete_book,
    user_unpaid_projects,
    user_paid_orders,
)

urlpatterns = [
    path('upload-book/', UploadBookProjectView.as_view(), name='upload-book'),
    path('save-order/', SaveOrderAPIView.as_view(), name='save-order'),
    path('book-projects/', user_books, name='my-books'),
    path('books/<int:pk>/', book_detail, name='book-detail'),          # GET single project
    path('books/<int:pk>/update/', update_book, name='book-update'),   # PUT/PATCH update project
    path('<int:pk>/delete/', delete_book, name='book-delete'),
    path("all-orders/", admin_all_orders, name="admin-all-orders"),
    path('user-unpaid-projects/', user_unpaid_projects, name='user-unpaid-projects'),
    path('user-paid-orders/', user_paid_orders, name='user-paid-orders'),
    path('orders/<int:pk>/status/', update_order_status, name='update-order-status'),
    # urls.py
path('admin/orders/<int:pk>/', admin_order_detail, name='admin-order-detail'),
path('admin/orders/<int:pk>/prepare-shipment/', prepare_shipment, name='prepare-shipment'),
path('admin/shipment-orders/', admin_shipment_orders, name='admin-shipment-orders'),
]
