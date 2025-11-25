import type { PeakHourSlots as _grounds_PeakHourSlots, PeakHourSlots__Output as _grounds_PeakHourSlots__Output } from '../grounds/PeakHourSlots';
export interface Ground {
    'id'?: (string);
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
    'isActive'?: (boolean);
    'timezone'?: (string);
    'adminUserId'?: (string);
    'createdAt'?: (string);
    'updatedAt'?: (string);
}
export interface Ground__Output {
    'id': (string);
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
    'isActive': (boolean);
    'timezone': (string);
    'adminUserId': (string);
    'createdAt': (string);
    'updatedAt': (string);
}
//# sourceMappingURL=Ground.d.ts.map