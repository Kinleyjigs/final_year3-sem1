const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Ground {
  id: string;
  name: string;
  college: string;
  location: string;
  description: string;
  capacity: number;
  amenities: string[];
  photos: string[];
  peak_hours?: Record<string, Array<{ start: string; end: string }>>;
  is_active: boolean;
  timezone: string;
  admin_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchGroundsResponse {
  grounds: Ground[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SearchGroundsParams {
  college?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
  booking_id?: string;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface GetAvailabilityResponse {
  ground_id: string;
  start_date: string;
  end_date: string;
  availability: DayAvailability[];
}

export interface GetAvailabilityParams {
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
}

/**
 * API client for interacting with the backend
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Get default headers with optional auth token
   */
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(requiresAuth),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `Failed to POST ${endpoint}`);
    }

    return response.json();
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(requiresAuth),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `Failed to DELETE ${endpoint}`);
    }

    return response.json();
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(requiresAuth),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `Failed to GET ${endpoint}`);
    }

    return response.json();
  }

  /**
   * Search for grounds with optional filters
   */
  async searchGrounds(params: SearchGroundsParams = {}): Promise<SearchGroundsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.college) queryParams.append('college', params.college);
    if (params.is_active !== undefined) queryParams.append('is_active', String(params.is_active));
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));

    const url = `${this.baseUrl}/api/grounds${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Failed to fetch grounds' } }));
      throw new Error(error.error?.message || 'Failed to fetch grounds');
    }

    return response.json();
  }

  /**
   * Get a single ground by ID
   */
  async getGround(id: string): Promise<Ground> {
    const url = `${this.baseUrl}/api/grounds/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Failed to fetch ground' } }));
      throw new Error(error.error?.message || 'Failed to fetch ground');
    }

    return response.json();
  }

  /**
   * Get availability for a ground
   */
  async getAvailability(groundId: string, params: GetAvailabilityParams): Promise<GetAvailabilityResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('start_date', params.start_date);
    queryParams.append('end_date', params.end_date);

    const url = `${this.baseUrl}/api/grounds/${groundId}/availability?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Failed to fetch availability' } }));
      throw new Error(error.error?.message || 'Failed to fetch availability');
    }

    return response.json();
  }
}

// Default API client instance
export const apiClient = new ApiClient();
