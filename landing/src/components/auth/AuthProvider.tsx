import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAppStore } from '../../store/useAppStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    // Listen for Firebase Auth state changes globally
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Sync the session to our global Zustand store
      setUser(currentUser);
      // Removed auto-login (signInAnonymously) to avoid 'auth/admin-restricted-operation'
      // since the jury will not log in and Firebase Auth is disabled.
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
