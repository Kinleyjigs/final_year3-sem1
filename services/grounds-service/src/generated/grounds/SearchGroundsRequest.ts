// Original file: src/proto/grounds.proto


export interface SearchGroundsRequest {
  'college'?: (string);
  'startDate'?: (string);
  'endDate'?: (string);
  'page'?: (number);
  'limit'?: (number);
  '_college'?: "college";
  '_startDate'?: "startDate";
  '_endDate'?: "endDate";
}

export interface SearchGroundsRequest__Output {
  'college'?: (string);
  'startDate'?: (string);
  'endDate'?: (string);
  'page': (number);
  'limit': (number);
  '_college'?: "college";
  '_startDate'?: "startDate";
  '_endDate'?: "endDate";
}
