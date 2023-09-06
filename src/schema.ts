/** Schema for validating string data types */
export type StringSchema = {
  type: "string";
  /** Specifies if the field is required */
  required?: boolean;
  /** Minimum length of the string */
  min?: number;
  /** Maximum length of the string */
  max?: number;
  /** Exact length of the string */
  length?: number;
  /** Regular expression pattern the string must match */
  pattern?: RegExp;
  /** Indicates that the string should be a valid email */
  email?: boolean;
  /** Indicates that the string should be a valid URI */
  uri?: boolean;
  /** Indicates that the string should be trimmed */
  trim?: boolean;
  /** Indicates that the string should be lowercase */
  lowercase?: boolean;
  /** Indicates that the string should be uppercase */
  uppercase?: boolean;
};

/** Schema for validating number data types */
export type NumberSchema = {
  type: "number";
  /** Specifies if the field is required */
  required?: boolean;
  /** Minimum value of the number */
  min?: number;
  /** Maximum value of the number */
  max?: number;
  /** Indicates that the number should be positive */
  positive?: boolean;
  /** Indicates that the number should be negative */
  negative?: boolean;
  /** Indicates that the number should be an integer */
  integer?: boolean;
  /** Specifies that the number should be greater than this value */
  greater?: number;
  /** Specifies that the number should be less than this value */
  less?: number;
};

/** Schema for validating boolean data types */
export type BooleanSchema = {
  type: "boolean";
  /** Specifies if the field is required */
  required?: boolean;
  /** Specifies a whitelist of boolean values */
  oneOf?: boolean[];
};

/** Schema for validating array data types */
export type ArraySchema<T extends Schema> = {
  type: "array";
  /** Specifies if the field is required */
  required?: boolean;
  /** Minimum number of items in the array */
  min?: number;
  /** Maximum number of items in the array */
  max?: number;
  /** Exact number of items in the array */
  length?: number;
  /** Indicates that all items in the array should be unique */
  unique?: boolean;
  /** Schema for validating items within the array */
  of: T;
};

/** Schema for validating object data types */
export type ObjectSchema<T extends { [key: string]: Schema }> = {
  type: "object";
  /** Specifies if the field is required */
  required?: boolean;
  /** Schema for validating keys within the object */
  keys: T;
  /** Allows properties not defined in `keys` */
  unknown?: boolean;
};

/** Schema for validating date data types */
export type DateSchema = {
  type: "date";
  /** Specifies if the field is required */
  required?: boolean;
  /** Minimum date value */
  min?: Date;
  /** Maximum date value */
  max?: Date;
  /** Specifies that the date should be greater than this value */
  greater?: Date;
  /** Specifies that the date should be less than this value */
  less?: Date;
};

/** Schema for validating union data types */
export type UnionSchema<T extends Schema[]> = {
  type: "union";
  /** Schema for validating items within the union */
  of: T;
};

/** Union type for all possible schemas */
export type Schema<T extends Schema = any> =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | DateSchema
  | ArraySchema<T>
  | ObjectSchema<{ [key: string]: T }>
  | UnionSchema<T[]>;

/** Map schema to TypeScript type **/
export type SchemaToType<T extends Schema> = T extends StringSchema
  ? string
  : T extends NumberSchema
  ? number
  : T extends BooleanSchema
  ? boolean
  : T extends ArraySchema<infer U>
  ? Array<SchemaToType<U>>
  : T extends ObjectSchema<infer U>
  ? { [K in keyof U]: SchemaToType<U[K]> }
  : T extends DateSchema
  ? Date
  : T extends UnionSchema<infer U>
  ? U[number] extends Schema
    ? SchemaToType<U[number]>
    : never
  : never;

/**
 * Represents the type of validation error.
 */
export type ValidationErrorType =
  | "REQUIRED"
  | "MIN"
  | "MAX"
  | "PATTERN"
  | "TYPE"
  | "OTHER";

/**
 * Represents a single validation error.
 */
export interface ValidationError {
  message: string;
  type: ValidationErrorType;
}

/**
 * Represents a map from schema location to a list of validation errors.
 */
export type ValidationErrorMap = {
  [location: string]: ValidationError[];
};

/**
 * Represents the result of a validation operation.
 * @template T - The TypeScript type that corresponds to the schema.
 */
export type ValidationResult<T> =
  /** Indicates a successful validation with the adjusted value. */
  | { ok: true; value: T }
  /** Indicates a failed validation with an object of error locations and error messages. */
  | { ok: false; errors: ValidationErrorMap };
