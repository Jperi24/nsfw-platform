import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession();
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }
  
  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    redirect('/');
  }
  
  return user;
}

export async function requirePremium() {
  const user = await getCurrentUser();
  
  if (!user || user.membershipStatus !== 'premium') {
    redirect('/membership');
  }
  
  return user;
}