// Original file: src/proto/maintenance.proto


export interface CreateMaintenanceRequest {
  'groundId'?: (string);
  'startDateTime'?: (string);
  'endDateTime'?: (string);
  'description'?: (string);
  'adminUserId'?: (string);
}

export interface CreateMaintenanceRequest__Output {
  'groundId': (string);
  'startDateTime': (string);
  'endDateTime': (string);
  'description': (string);
  'adminUserId': (string);
}
