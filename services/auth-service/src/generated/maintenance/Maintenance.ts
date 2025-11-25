// Original file: src/proto/maintenance.proto


export interface Maintenance {
  'id'?: (string);
  'groundId'?: (string);
  'groundName'?: (string);
  'startDateTime'?: (string);
  'endDateTime'?: (string);
  'description'?: (string);
  'createdByUserId'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
}

export interface Maintenance__Output {
  'id': (string);
  'groundId': (string);
  'groundName': (string);
  'startDateTime': (string);
  'endDateTime': (string);
  'description': (string);
  'createdByUserId': (string);
  'createdAt': (string);
  'updatedAt': (string);
}
