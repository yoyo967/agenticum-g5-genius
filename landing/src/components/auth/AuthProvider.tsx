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
      
      // Phase 40: Auto-login anonymously for guests to ensure UID for Firestore rules
      if (!currentUser) {
        import('firebase/auth').then(({ signInAnonymously }) => {
          signInAnonymously(auth).catch(console.warn);
        });
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
