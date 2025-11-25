/**
 * Maintenance Service gRPC Client
 * Provides type-safe access to Maintenance Service RPCs
 */
export interface Maintenance {
    id: string;
    ground_id: string;
    ground_name: string;
    start_date_time: string;
    end_date_time: string;
    description: string;
    created_by_user_id: string;
    created_at: string;
    updated_at: string;
}
export interface GetGroundMaintenanceRequest {
    ground_id: string;
    start_date?: string;
    end_date?: string;
}
export interface GetGroundMaintenanceResponse {
    maintenance_windows: Maintenance[];
}
export interface CheckConflictRequest {
    ground_id: string;
    start_date_time: string;
    end_date_time: string;
}
export interface CheckConflictResponse {
    has_conflict: boolean;
    message: string;
    conflicting_windows: Maintenance[];
}
/**
 * Create Maintenance Service gRPC client
 */
export declare function createMaintenanceClient(): unknown;
export declare function getMaintenanceClient(): any;
export declare const maintenanceClient: any;
//# sourceMappingURL=maintenance-client.d.ts.map