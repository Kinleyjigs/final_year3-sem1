import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || 'dev-service-token';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const mockUserId = 'admin-user-1';
    
    const response = await fetch(`${API_BASE_URL}/api/admin/grounds/${params.id}`, {
      method: 'PUT',
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
        { error: data.error || 'Failed to update ground' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Update ground error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const mockUserId = 'admin-user-1';

    const response = await fetch(`${API_BASE_URL}/api/admin/grounds/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SERVICE_TOKEN}`,
        'X-User-Id': mockUserId,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to deactivate ground' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Deactivate ground error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
