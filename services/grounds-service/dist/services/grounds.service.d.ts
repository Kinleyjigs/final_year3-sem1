export interface SearchGroundsParams {
    college?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}
export interface SearchGroundsResult {
    grounds: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class GroundsService {
    /**
     * Search for grounds with optional filters and pagination
     * @param params - Search parameters (college, isActive, page, limit)
     * @returns Paginated list of grounds
     */
    searchGrounds(params: SearchGroundsParams): Promise<SearchGroundsResult>;
    /**
     * Get a single ground by ID with full details
     * @param id - Ground UUID
     * @returns Ground details including peak hours
     */
    getGround(id: string): Promise<any>;
    /**
     * Check if a given time slot falls within peak hours for a ground
     * @param groundId - Ground UUID
     * @param dateTime - ISO 8601 date-time string
     * @returns true if the time is during peak hours
     */
    isPeakTime(groundId: string, dateTime: string): Promise<boolean>;
}
export declare const groundsService: GroundsService;
//# sourceMappingURL=grounds.service.d.ts.map