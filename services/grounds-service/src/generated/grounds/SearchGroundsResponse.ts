// Original file: src/proto/grounds.proto

import type { Ground as _grounds_Ground, Ground__Output as _grounds_Ground__Output } from '../grounds/Ground';

export interface SearchGroundsResponse {
  'grounds'?: (_grounds_Ground)[];
  'total'?: (number);
  'page'?: (number);
  'totalPages'?: (number);
}

export interface SearchGroundsResponse__Output {
  'grounds': (_grounds_Ground__Output)[];
  'total': (number);
  'page': (number);
  'totalPages': (number);
}
