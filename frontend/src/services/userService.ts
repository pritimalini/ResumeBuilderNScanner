import supabase from '../utils/supabaseClient.js';

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export const userService = {
  /**
   * Get the current logged-in user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }
      
      if (!user) return null;
      
      // Get additional user data from the database
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      return {
        id: user.id,
        email: user.email!,
        name: data?.name,
        created_at: user.created_at,
      };
    } catch (error) {
      console.error('Unexpected error getting current user:', error);
      return null;
    }
  },
  
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name?: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { user: null, error: error.message };
      }
      
      if (!data.user) {
        return { user: null, error: 'User registration failed' };
      }
      
      // Create user profile in the database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name,
          });
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }
      
      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          name,
          created_at: data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error: any) {
      return { user: null, error: error.message || 'An unexpected error occurred' };
    }
  },
  
  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { user: null, error: error.message };
      }
      
      // Get user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('name')
        .eq('id', data.user.id)
        .single();
      
      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          name: profileData?.name,
          created_at: data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error: any) {
      return { user: null, error: error.message || 'An unexpected error occurred' };
    }
  },
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred' };
    }
  },
  
  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred' };
    }
  },
  
  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: { name?: string }): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
        
      if (error) {
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred' };
    }
  }
};

export default userService; 