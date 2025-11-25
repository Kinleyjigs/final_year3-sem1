import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// For development, we'll use a service token
// In production, you should use proper authentication
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || 'dev-service-token';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated via WorkOS session
    const cookieStore = await cookies();
    const session = cookieStore.get('wos-session');

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // For now, we'll use a mock user ID
    // In production, you'd decode the WorkOS session to get the actual user
    const mockUserId = 'admin-user-1';

    const response = await fetch(`${API_BASE_URL}/api/admin/grounds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_TOKEN}`,
        'X-User-Id': mockUserId,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create ground' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Create ground error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
