import { apiClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
}

export async function getMe(token: string): Promise<UserProfile> {
  return apiClient<UserProfile>('/auth/me', {
    token,
    method: 'GET',
  });
}
