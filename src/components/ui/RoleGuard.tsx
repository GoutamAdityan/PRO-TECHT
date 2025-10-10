
// src/components/ui/RoleGuard.tsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  allowed: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowed, children }) => {
  const { user, profile } = useAuth();

  if (!user || !profile || !allowed.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
};
