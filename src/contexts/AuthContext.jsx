import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
    setLoading(false);
  };

  const signUp = async (email, password, fullName, role = 'student', inviteToken = null) => {
    // If signing up as instructor, validate invite token
    if (role === 'instructor') {
      if (!inviteToken) {
        throw new Error('An invite token is required to create an instructor account.');
      }

      const { data: invite, error: inviteError } = await supabase
        .from('instructor_invites')
        .select('*')
        .eq('token', inviteToken)
        .is('used_by', null)
        .single();

      if (inviteError || !invite) {
        throw new Error('Invalid or already used invite token.');
      }

      // Check expiry if set
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        throw new Error('This invite token has expired.');
      }
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        role,
      });

      // Mark invite as used
      if (role === 'instructor' && inviteToken) {
        await supabase
          .from('instructor_invites')
          .update({ used_by: data.user.id, used_at: new Date().toISOString() })
          .eq('token', inviteToken);
      }
    }

    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
