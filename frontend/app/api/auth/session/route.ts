import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // WorkOS stores user info in the request headers via middleware
    // For now, we'll check if the session cookie exists
    const session = request.cookies.get('wos-session');
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Session exists, user is authenticated
    // The actual user data will be available after callback
    // For now, return a basic authenticated status
    return NextResponse.json({ 
      user: {
        id: 'authenticated',
        email: 'user@example.com',
        firstName: null,
        lastName: null,
        profilePictureUrl: null,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
