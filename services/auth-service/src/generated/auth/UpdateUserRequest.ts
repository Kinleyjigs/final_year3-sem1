// Original file: src/proto/auth.proto


export interface UpdateUserRequest {
  'userId'?: (string);
  'fullName'?: (string);
  'college'?: (string);
  '_fullName'?: "fullName";
  '_college'?: "college";
}

export interface UpdateUserRequest__Output {
  'userId': (string);
  'fullName'?: (string);
  'college'?: (string);
  '_fullName'?: "fullName";
  '_college'?: "college";
}
