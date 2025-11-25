import { NextResponse } from 'next/server';
import { getSignUpUrl } from '@workos-inc/authkit-nextjs';

export async function GET() {
  try {
    const signUpUrl = await getSignUpUrl();
    return NextResponse.json({ url: signUpUrl });
  } catch (error) {
    console.error('Error generating sign-up URL:', error);
    return NextResponse.json({ error: 'Failed to generate sign-up URL' }, { status: 500 });
  }
}
