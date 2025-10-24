import { supabase } from '../services/supabaseClient';

export class AuthController {
  static async signUp(email: string, password: string, username: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha ao criar usuário');

    const { error: profileError } = await supabase
      .from('users_profile')
      .insert({
        id: authData.user.id,
        username,
        plan_type: 'free',
      });

    if (profileError) throw profileError;

    return authData;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static onAuthStateChange(callback: (user: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
    return subscription;
  }
}
