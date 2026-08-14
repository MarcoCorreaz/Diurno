import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import posthog from "posthog-js";

export interface AppUser {
  id: string;
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  raw: User;
}

interface AuthContextType {
  currentUser: AppUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function formatAppUser(user: User | null): AppUser | null {
  if (!user) return null;
  return {
    id: user.id,
    uid: user.id,
    email: user.email,
    displayName:
      user.user_metadata?.full_name ||
      user.user_metadata?.displayName ||
      user.email?.split('@')[0] ||
      'Usuário',
    photoURL: user.user_metadata?.avatar_url || '',
    raw: user,
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(formatAppUser(session?.user ?? null));
      if (session?.user) {
        posthog.identify(session.user.id);
      } else {
        posthog.reset();
      }
      setLoading(false);
    });

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setCurrentUser(formatAppUser(session?.user ?? null));
        if (session?.user) {
          posthog.identify(session.user.id);
        } else {
          posthog.reset();
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
