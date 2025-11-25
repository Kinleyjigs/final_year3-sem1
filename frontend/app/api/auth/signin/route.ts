import { NextResponse } from 'next/server';
import { getSignInUrl } from '@workos-inc/authkit-nextjs';

export async function GET() {
  try {
    const signInUrl = await getSignInUrl();
    return NextResponse.json({ url: signInUrl });
  } catch (error) {
    console.error('Error generating sign-in URL:', error);
    return NextResponse.json({ error: 'Failed to generate sign-in URL' }, { status: 500 });
  }
}
