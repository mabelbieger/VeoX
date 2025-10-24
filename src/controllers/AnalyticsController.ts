import { supabase } from '../services/supabaseClient';
import { Analytics } from '../types';

export class AnalyticsController {
  static async getVideoAnalytics(videoId: string): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('video_id', videoId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getUserAnalytics(userId: string): Promise<any> {
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id')
      .eq('user_id', userId);

    if (videosError) throw videosError;

    const videoIds = videos.map(v => v.id);

    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .in('video_id', videoIds);

    if (analyticsError) throw analyticsError;

    return analytics || [];
  }

  static async createAnalytics(videoId: string) {
    const mockData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      mockData.push({
        video_id: videoId,
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
        engagement_rate: Math.random() * 10 + 2,
        date: date.toISOString().split('T')[0],
      });
    }

    const { error } = await supabase
      .from('analytics')
      .insert(mockData);

    if (error) throw error;
  }
}
