export interface SearchGroundsRequest {
    college?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
}
export interface Ground {
    id: string;
    name: string;
    college: string;
    location: string;
    description: string;
    capacity: number;
    amenities: string[];
    photos: string[];
    is_active: boolean;
    timezone: string;
    created_at: string;
    updated_at: string;
    peak_hours?: any;
    admin_user_id?: string;
}
export interface SearchGroundsResponse {
    grounds: Ground[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
export interface GetGroundRequest {
    id: string;
}
export interface IsPeakTimeRequest {
    ground_id: string;
    date_time: string;
}
export interface IsPeakTimeResponse {
    is_peak: boolean;
}
/**
 * Create a gRPC client for the Grounds Service
 */
export declare function createGroundsClient(serviceUrl?: string): any;
export declare const groundsClient: any;
//# sourceMappingURL=grounds-client.d.ts.map