import { redirect } from 'next/navigation';

/**
 * Root page - redirects to the public grounds listing page
 * This follows Next.js 13+ App Router best practices for route organization
 */
export default function RootPage() {
  redirect('/grounds');
}
