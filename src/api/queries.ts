import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groups } from './groups';
import { users } from './users';
import { metadata } from './metadata';
import { frameable } from './frameable';
import type { Group, QueryParams } from '@/types';

export const queryKeys = {
  groups: {
    all: ['groups'] as const,
    list: (params?: QueryParams) => ['groups', 'list', params] as const,
    detail: (id: string) => ['groups', 'detail', id] as const,
  },
  users: {
    me: ['users', 'me'] as const,
  },
  metadata: (url: string) => ['metadata', url] as const,
  frameable: (url: string) => ['frameable', url] as const,
};

export function useGroupsQuery(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.groups.list(params),
    queryFn: () => groups.findPaginated(params),
  });
}

export function useAllGroupsQuery(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.groups.all,
    queryFn: () => groups.findAll(params),
  });
}

export function useGroupQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => groups.findById(id),
    enabled: Boolean(id),
  });
}

export function useSyncGroupsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGroups: Group[]) => groups.sync(newGroups),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: users.getMe,
  });
}

export function useWebsiteMetadataQuery(url: string) {
  return useQuery({
    queryKey: queryKeys.metadata(url),
    queryFn: () => metadata.getMetadata(url),
    enabled: Boolean(url),
  });
}

export function useCheckFrameableQuery(url: string) {
  return useQuery({
    queryKey: queryKeys.frameable(url),
    queryFn: () => frameable.checkFrameable(url),
    enabled: Boolean(url),
  });
}
