import { AuthGuard } from '@/app/components/auth/AuthGuard'; // Adjust path if necessary

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap the children (protected pages) with the AuthGuard
  return <AuthGuard>{children}</AuthGuard>;
} 