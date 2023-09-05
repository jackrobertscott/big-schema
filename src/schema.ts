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
export type ArraySchema = {
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
  of?: Schema;
};

/** Schema for validating object data types */
export type ObjectSchema = {
  type: "object";
  /** Specifies if the field is required */
  required?: boolean;
  /** Schema for validating keys within the object */
  keys?: { [key: string]: Schema };
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

/** Union type for all possible schemas */
export type Schema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | ArraySchema
  | ObjectSchema
  | DateSchema;
