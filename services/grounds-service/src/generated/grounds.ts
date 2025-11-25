import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GroundsServiceClient as _grounds_GroundsServiceClient, GroundsServiceDefinition as _grounds_GroundsServiceDefinition } from './grounds/GroundsService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  grounds: {
    CreateGroundRequest: MessageTypeDefinition
    DeactivateGroundRequest: MessageTypeDefinition
    GetGroundRequest: MessageTypeDefinition
    GetGroundsByCollegeRequest: MessageTypeDefinition
    GetGroundsByCollegeResponse: MessageTypeDefinition
    Ground: MessageTypeDefinition
    GroundsService: SubtypeConstructor<typeof grpc.Client, _grounds_GroundsServiceClient> & { service: _grounds_GroundsServiceDefinition }
    IsPeakTimeRequest: MessageTypeDefinition
    IsPeakTimeResponse: MessageTypeDefinition
    PeakHourSlots: MessageTypeDefinition
    SearchGroundsRequest: MessageTypeDefinition
    SearchGroundsResponse: MessageTypeDefinition
    UpdateGroundRequest: MessageTypeDefinition
  }
}

