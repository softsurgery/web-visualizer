import { Group, Paginated, QueryParams, SyncGroupsResponse } from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '10',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams = {}): Promise<Paginated<Group>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Group>>(`/groups`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort = 'order',
  search = '',
  filter = '',
  join = '',
  limit = '1000'
}: QueryParams = {}): Promise<Group[]> => {
  const params: { [key: string]: any } = {
    sort,
    limit
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<any>>(`/groups`, {
    params
  });

  const docs = response.data.docs || [];
  return docs.map((doc: any) => ({
    id: String(doc.id),
    uuid: doc.uuid || String(doc.id),
    name: doc.name,
    layout: doc.layout,
    urls: (doc.urls || []).map((u: any) => ({
      url: u.url,
      name: u.name,
      pointToCenter: u.pointToCenter,
    })),
  }));
};

const findById = async (id: string): Promise<Group> => {
  const response = await axios.get<any>(`/groups/${id}`);
  const doc = response.data;
  return {
    id: String(doc.id),
    uuid: doc.uuid || String(doc.id),
    name: doc.name,
    layout: doc.layout,
    urls: (doc.urls || []).map((u: any) => ({
      url: u.url,
      name: u.name,
      pointToCenter: u.pointToCenter,
    })),
  };
};

const findByShareUuid = async (uuid: string): Promise<Group | null> => {
  try {
    const response = await axios.get<{ group: Group }>(`/groups/share/${encodeURIComponent(uuid)}`);
    return response.data.group || null;
  } catch (e) {
    return null;
  }
};

const create = async (data: Partial<Group>): Promise<Group> => {
  const response = await axios.post<Group>(`/groups`, data);
  return response.data;
};

const update = async (id: string, data: Partial<Group>): Promise<Group> => {
  const response = await axios.patch<Group>(`/groups/${id}`, data);
  return response.data;
};

const remove = async (id: string): Promise<{ message?: string }> => {
  const response = await axios.delete<{ message?: string }>(`/groups/${id}`);
  return response.data;
};

const sync = async (groupsList: Group[]): Promise<SyncGroupsResponse> => {
  const response = await axios.post<SyncGroupsResponse>(`/groups/sync`, groupsList);
  return response.data;
};

export const groups = {
  findPaginated,
  findAll,
  findById,
  findByShareUuid,
  create,
  update,
  remove,
  sync
};

export default groups;
