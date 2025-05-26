'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
        router.push('/login');
      });
  };

  return (
    <Button onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;