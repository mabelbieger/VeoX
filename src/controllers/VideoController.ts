import { supabase } from '../services/supabaseClient';
import { VideoFormData, Video } from '../types';

export class VideoController {
  static async createVideo(userId: string, formData: VideoFormData): Promise<Video> {
    const videoData = {
      user_id: userId,
      title: formData.description.substring(0, 100),
      description: formData.description,
      platform: formData.platform,
      objective: formData.objective,
      target_audience: formData.target_audience,
      tone: formData.tone,
      language: formData.language,
      duration: formData.duration,
      status: 'processing' as const,
    };

    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (error) throw error;

    setTimeout(async () => {
      await VideoController.completeVideo(data.id);
    }, 3000);

    return data;
  }

  static async completeVideo(videoId: string) {
    const { error } = await supabase
      .from('videos')
      .update({
        status: 'completed',
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      })
      .eq('id', videoId);

    if (error) throw error;
  }

  static async getUserVideos(userId: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getVideoById(videoId: string): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async deleteVideo(videoId: string) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) throw error;
  }
}
