import { $axios } from '../../api';
import { ApiOk } from '../../api/types';
import { INotificationListResponse, IUnreadCountResponse, NotificationType } from '../../types/notification';

// 获取通知列表
export const getNotificationsApi = async (params?: {
  page?: number;
  pageSize?: number;
  type?: NotificationType;
  isRead?: boolean;
}) => {
  return await $axios.get<ApiOk<INotificationListResponse>>('/notifications', {
    params,
  });
};

// 获取未读通知数量
export const getUnreadCountApi = async () => {
  return await $axios.get<ApiOk<IUnreadCountResponse>>('/notifications/unread-count');
};

// 标记单条通知为已读
export const markAsReadApi = async (id: string) => {
  return await $axios.put<ApiOk<null>>(`/notifications/${id}/read`);
};

// 标记全部通知为已读
export const markAllAsReadApi = async () => {
  return await $axios.put<ApiOk<{ affectedCount: number }>>('/notifications/read-all');
};

// 删除通知
export const deleteNotificationApi = async (id: string) => {
  return await $axios.delete<ApiOk<null>>(`/notifications/${id}`);
};
