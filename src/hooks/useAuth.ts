import { useState, useEffect } from 'react';
import { AuthController } from '../controllers/AuthController';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthController.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const subscription = AuthController.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
