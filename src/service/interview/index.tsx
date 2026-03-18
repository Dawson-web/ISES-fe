import { $axios } from '@/api';
import { ApiOk } from '@/api/types';
import {
  IInterviewListRequest,
  IInterviewListResponse,
  IInterviewPost,
  IInterviewPostRequest,
  IInterviewStats,
} from '@/types/interview';

// 获取面经列表
export const getInterviewListApi = async (params: IInterviewListRequest) => {
  const res = await $axios.post<ApiOk<IInterviewListResponse>>('/interview-posts/list', params);
  return res.data;
};

// 获取面经详情
export const getInterviewDetailApi = async (id: string) => {
  const res = await $axios.get<ApiOk<IInterviewPost>>(`/interview-posts/detail/${id}`);
  return res.data;
};

// 发布面经
export const createInterviewPostApi = async (data: IInterviewPostRequest) => {
  const res = await $axios.post<ApiOk<IInterviewPost>>('/interview-posts/', data);
  return res.data;
};

// 编辑面经
export const updateInterviewPostApi = async (id: string, data: Partial<IInterviewPostRequest>) => {
  const res = await $axios.put<ApiOk<IInterviewPost>>(`/interview-posts/${id}`, data);
  return res.data;
};

// 删除面经
export const deleteInterviewPostApi = async (id: string) => {
  const res = await $axios.delete<ApiOk<null>>(`/interview-posts/${id}`);
  return res.data;
};

// 获取面经统计
export const getInterviewStatsApi = async () => {
  const res = await $axios.get<ApiOk<IInterviewStats>>('/interview-posts/stats');
  return res.data;
};

// 获取热门面经
export const getHotInterviewsApi = async () => {
  const res = await $axios.get<ApiOk<IInterviewPost[]>>('/interview-posts/hot');
  return res.data;
};

// 点赞/取消点赞
export const toggleInterviewLikeApi = async (targetId: string) => {
  const res = await $axios.post<ApiOk<{ isLiked: boolean; likeCount: number }>>('/interview-posts/like/toggle', { targetId });
  return res.data;
};
