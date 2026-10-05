import { WebsiteMetadataResponse } from '@/types';
import axios from '../axios';

const getMetadata = async (url: string): Promise<WebsiteMetadataResponse> => {
  const response = await axios.get<WebsiteMetadataResponse>(`/metadata`, {
    params: { url }
  });
  return response.data;
};

export const metadata = {
  getMetadata
};

export default metadata;
