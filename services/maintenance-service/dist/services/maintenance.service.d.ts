export interface GetGroundMaintenanceParams {
    groundId: string;
    startDate?: string;
    endDate?: string;
}
export interface MaintenanceSchedule {
    id: string;
    groundId: string;
    startDateTime: string;
    endDateTime: string;
    description: string;
    createdByUserId: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Service for managing maintenance schedules
 */
export declare class MaintenanceService {
    /**
     * Get maintenance windows for a ground
     * Optionally filter by date range
     *
     * @param params - Parameters including ground ID and optional date range
     * @returns Array of maintenance schedules
     */
    getGroundMaintenance(params: GetGroundMaintenanceParams): Promise<MaintenanceSchedule[]>;
    /**
     * Check if a time range conflicts with maintenance
     *
     * @param groundId - Ground UUID
     * @param startDateTime - ISO 8601 date-time string
     * @param endDateTime - ISO 8601 date-time string
     * @returns true if there is a conflict
     */
    checkConflict(groundId: string, startDateTime: string, endDateTime: string): Promise<boolean>;
}
export declare const maintenanceService: MaintenanceService;
//# sourceMappingURL=maintenance.service.d.ts.map