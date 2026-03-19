import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, Avatar, Spin, Empty } from '@arco-design/web-react';
import { Bell, Heart, MessageCircle, Briefcase, Info, Check, CheckCheck, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import {
  getNotificationsApi,
  getUnreadCountApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
} from '@/service/notification';
import { INotification, NotificationType } from '@/types/notification';
import notificationStore from '@/store/notification';
import { apiConfig } from '@/config';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const TabPane = Tabs.TabPane;

// 通知类型配置
const NOTIFICATION_TYPE_CONFIG: Record<NotificationType | 'all', {
  label: string;
  icon: React.ReactNode;
  color: string;
}> = {
  all: { label: '全部', icon: <Bell size={14} />, color: 'text-blue-500' },
  like: { label: '点赞', icon: <Heart size={14} />, color: 'text-red-500' },
  comment: { label: '评论', icon: <MessageCircle size={14} />, color: 'text-green-500' },
  referral: { label: '内推', icon: <Briefcase size={14} />, color: 'text-purple-500' },
  system: { label: '系统', icon: <Info size={14} />, color: 'text-gray-500' },
};

// 单条通知组件
const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: INotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.system;
  const avatarUrl = notification.sender?.avatar
    ? `${apiConfig.baseUrl}${notification.sender.avatar}`
    : '';

  const handleMarkRead = useCallback(() => {
    if (!notification.isRead) {
      onMarkRead(notification.id);
    }
  }, [notification.id, notification.isRead, onMarkRead]);

  const handleDelete = useCallback(() => {
    onDelete(notification.id);
  }, [notification.id, onDelete]);

  return (
    <div
      className={`flex items-start gap-3 p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
        notification.isRead ? 'opacity-60' : 'bg-white'
      }`}
      role="listitem"
      tabIndex={0}
      aria-label={`${notification.sender?.username || '系统'}: ${notification.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleMarkRead();
        }
      }}
    >
      {/* 未读圆点 */}
      <div className="flex-shrink-0 pt-2">
        {!notification.isRead ? (
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        ) : (
          <div className="w-2 h-2" />
        )}
      </div>

      {/* 头像 */}
      <div className="flex-shrink-0">
        <Avatar size={40}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="头像" />
          ) : (
            notification.sender?.username?.charAt(0) || 'S'
          )}
        </Avatar>
      </div>

      {/* 通知内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`flex items-center gap-1 text-xs ${typeConfig.color}`}>
            {typeConfig.icon}
            {typeConfig.label}
          </span>
          <span className="text-xs text-gray-400">
            {dayjs(notification.createdAt).fromNow()}
          </span>
        </div>

        <p className="text-sm text-gray-800 mb-1">
          <span className="font-medium">{notification.sender?.username || '系统'}</span>
          {' '}
          {notification.title}
        </p>

        {notification.content && (
          <p className="text-xs text-gray-500 truncate">
            {notification.content}
          </p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {!notification.isRead && (
          <button
            type="button"
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            onClick={handleMarkRead}
            aria-label="标记已读"
            title="标记已读"
          >
            <Check size={14} />
          </button>
        )}
        <button
          type="button"
          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          onClick={handleDelete}
          aria-label="删除通知"
          title="删除通知"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

// 通知中心页面
const NotificationsPage = observer(() => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // 获取通知列表
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['notifications', activeTab, page],
    queryFn: () =>
      getNotificationsApi({
        page,
        pageSize: 20,
        type: activeTab === 'all' ? undefined : (activeTab as NotificationType),
      }).then((res) => res.data.data),
    staleTime: 1000 * 30,
  });

  // 获取未读数量
  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => getUnreadCountApi().then((res) => res.data.data),
    staleTime: 1000 * 10,
  });

  // 同步未读数量到 store
  useEffect(() => {
    if (unreadData) {
      notificationStore.setUnreadCount(unreadData.count);
    }
  }, [unreadData]);

  // 标记已读
  const markReadMutation = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      notificationStore.decrementUnreadCount();
    },
  });

  // 全部已读
  const markAllReadMutation = useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      notificationStore.clearUnreadCount();
    },
  });

  // 删除通知
  const deleteMutation = useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const handleMarkRead = useCallback((id: string) => {
    markReadMutation.mutate(id);
  }, [markReadMutation]);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const handleMarkAllRead = useCallback(() => {
    markAllReadMutation.mutate();
  }, [markAllReadMutation]);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
    setPage(1);
  }, []);

  const notifications = data?.notifications || [];
  const pagination = data?.pagination;
  const hasMore = pagination ? page * pagination.pageSize < pagination.total : false;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* 页面头部 */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Bell size={16} className="text-gray-600" />
              </div>
              <h1 className="text-base font-semibold text-gray-800">通知</h1>
              {notificationStore.unreadCount > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-red-500 text-white rounded-full px-1">
                  {notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount}
                </span>
              )}
            </div>

            {notificationStore.unreadCount > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
                aria-label="全部标记为已读"
              >
                <CheckCheck size={14} />
                全部已读
              </button>
            )}
          </div>

          {/* 分类标签 */}
          <Tabs
            activeTab={activeTab}
            onChange={handleTabChange}
            size="small"
            type="capsule"
          >
            {Object.entries(NOTIFICATION_TYPE_CONFIG).map(([key, config]) => (
              <TabPane
                key={key}
                title={
                  <span className="flex items-center gap-1 text-sm">
                    {config.icon}
                    {config.label}
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>

        {/* 通知列表 */}
        <div className="bg-white" role="list" aria-label="通知列表">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size={24} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Empty description="暂无通知" />
            </div>
          ) : (
            <>
              {notifications.map((notification: INotification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}

              {/* 加载更多 */}
              {hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isFetching}
                  >
                    {isFetching ? '加载中...' : '加载更多'}
                  </button>
                </div>
              )}

              {/* 底部提示 */}
              {!hasMore && notifications.length > 0 && (
                <div className="text-center text-xs text-gray-400 py-4">
                  没有更多通知了
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default NotificationsPage;
