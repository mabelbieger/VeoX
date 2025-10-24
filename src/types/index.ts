export interface User {
  id: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  company_name?: string;
  company_area?: string;
  target_audience?: string;
  plan_type: 'free' | 'pro' | 'business' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string;
  platform: 'tiktok' | 'reels' | 'shorts';
  objective?: string;
  target_audience?: string;
  tone?: string;
  language: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  video_id: string;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  date: string;
  created_at: string;
}

export interface VideoFormData {
  description: string;
  platform: 'tiktok' | 'reels' | 'shorts';
  objective: string;
  target_audience: string;
  tone: string;
  language: string;
  duration: number;
}
