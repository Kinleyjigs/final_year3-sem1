// Original file: src/proto/maintenance.proto


export interface GetGroundMaintenanceRequest {
  'groundId'?: (string);
  'startDate'?: (string);
  'endDate'?: (string);
  '_startDate'?: "startDate";
  '_endDate'?: "endDate";
}

export interface GetGroundMaintenanceRequest__Output {
  'groundId': (string);
  'startDate'?: (string);
  'endDate'?: (string);
  '_startDate'?: "startDate";
  '_endDate'?: "endDate";
}
