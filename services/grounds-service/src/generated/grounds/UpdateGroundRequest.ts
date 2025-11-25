// Original file: src/proto/grounds.proto

import type { PeakHourSlots as _grounds_PeakHourSlots, PeakHourSlots__Output as _grounds_PeakHourSlots__Output } from '../grounds/PeakHourSlots';

export interface UpdateGroundRequest {
  'groundId'?: (string);
  'name'?: (string);
  'location'?: (string);
  'description'?: (string);
  'capacity'?: (number);
  'amenities'?: (string)[];
  'peakHours'?: ({[key: string]: _grounds_PeakHourSlots});
  'photos'?: (string)[];
  'isActive'?: (boolean);
  '_name'?: "name";
  '_location'?: "location";
  '_description'?: "description";
  '_capacity'?: "capacity";
  '_isActive'?: "isActive";
}

export interface UpdateGroundRequest__Output {
  'groundId': (string);
  'name'?: (string);
  'location'?: (string);
  'description'?: (string);
  'capacity'?: (number);
  'amenities': (string)[];
  'peakHours': ({[key: string]: _grounds_PeakHourSlots__Output});
  'photos': (string)[];
  'isActive'?: (boolean);
  '_name'?: "name";
  '_location'?: "location";
  '_description'?: "description";
  '_capacity'?: "capacity";
  '_isActive'?: "isActive";
}
