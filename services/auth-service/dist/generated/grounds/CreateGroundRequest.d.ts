import type { PeakHourSlots as _grounds_PeakHourSlots, PeakHourSlots__Output as _grounds_PeakHourSlots__Output } from '../grounds/PeakHourSlots';
export interface CreateGroundRequest {
    'name'?: (string);
    'college'?: (string);
    'location'?: (string);
    'description'?: (string);
    'capacity'?: (number);
    'amenities'?: (string)[];
    'peakHours'?: ({
        [key: string]: _grounds_PeakHourSlots;
    });
    'photos'?: (string)[];
    'adminUserId'?: (string);
    'timezone'?: (string);
}
export interface CreateGroundRequest__Output {
    'name': (string);
    'college': (string);
    'location': (string);
    'description': (string);
    'capacity': (number);
    'amenities': (string)[];
    'peakHours': ({
        [key: string]: _grounds_PeakHourSlots__Output;
    });
    'photos': (string)[];
    'adminUserId': (string);
    'timezone': (string);
}
//# sourceMappingURL=CreateGroundRequest.d.ts.map