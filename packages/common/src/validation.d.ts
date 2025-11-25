import Joi from 'joi';
export declare const schemas: {
    email: Joi.StringSchema<string>;
    password: Joi.StringSchema<string>;
    uuid: Joi.StringSchema<string>;
    college: Joi.StringSchema<string>;
    fullName: Joi.StringSchema<string>;
    pagination: {
        page: Joi.NumberSchema<number>;
        limit: Joi.NumberSchema<number>;
    };
    date: Joi.DateSchema<Date>;
    futureDate: Joi.DateSchema<Date>;
};
export declare const validation: {
    email: (value: string) => boolean;
    password: (value: string) => boolean;
    uuid: (value: string) => boolean;
};
export declare function validate<T>(schema: Joi.Schema, data: any): {
    value: T;
    error: null;
} | {
    value: null;
    error: string;
};
//# sourceMappingURL=validation.d.ts.map