import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';
import type { MaintenanceServiceClient as _maintenance_MaintenanceServiceClient, MaintenanceServiceDefinition as _maintenance_MaintenanceServiceDefinition } from './maintenance/MaintenanceService';
type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
    new (...args: ConstructorParameters<Constructor>): Subtype;
};
export interface ProtoGrpcType {
    maintenance: {
        CancelMaintenanceRequest: MessageTypeDefinition;
        CancelMaintenanceResponse: MessageTypeDefinition;
        CheckConflictRequest: MessageTypeDefinition;
        CheckConflictResponse: MessageTypeDefinition;
        CreateMaintenanceRequest: MessageTypeDefinition;
        CreateMaintenanceResponse: MessageTypeDefinition;
        GetCollegeMaintenanceRequest: MessageTypeDefinition;
        GetCollegeMaintenanceResponse: MessageTypeDefinition;
        GetGroundMaintenanceRequest: MessageTypeDefinition;
        GetGroundMaintenanceResponse: MessageTypeDefinition;
        GetMaintenanceRequest: MessageTypeDefinition;
        Maintenance: MessageTypeDefinition;
        MaintenanceService: SubtypeConstructor<typeof grpc.Client, _maintenance_MaintenanceServiceClient> & {
            service: _maintenance_MaintenanceServiceDefinition;
        };
    };
}
export {};
//# sourceMappingURL=maintenance.d.ts.map