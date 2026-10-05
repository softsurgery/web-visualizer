import { CheckFrameableResponse } from '@/types';
import axios from '../axios';

const checkFrameable = async (url: string): Promise<CheckFrameableResponse> => {
  const response = await axios.get<CheckFrameableResponse>(`/check-frameable`, {
    params: { url }
  });
  return response.data;
};

export const frameable = {
  checkFrameable
};

export default frameable;
