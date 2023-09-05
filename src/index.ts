/** Schema for validating string data types */
type StringSchema = {
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
type NumberSchema = {
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
type BooleanSchema = {
  type: "boolean";
  /** Specifies if the field is required */
  required?: boolean;
  /** Specifies a whitelist of boolean values */
  oneOf?: boolean[];
};

/** Schema for validating array data types */
type ArraySchema = {
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
type ObjectSchema = {
  type: "object";
  /** Specifies if the field is required */
  required?: boolean;
  /** Schema for validating keys within the object */
  keys?: { [key: string]: Schema };
  /** Allows properties not defined in `keys` */
  unknown?: boolean;
};

/** Schema for validating date data types */
type DateSchema = {
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
type Schema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | ArraySchema
  | ObjectSchema
  | DateSchema;

function ioString(options: Omit<StringSchema, "type">): StringSchema {
  return { type: "string", ...options };
}

function ioNumber(options: Omit<NumberSchema, "type">): NumberSchema {
  return { type: "number", ...options };
}

function ioBoolean(options: Omit<BooleanSchema, "type">): BooleanSchema {
  return { type: "boolean", ...options };
}

function ioArray(options: Omit<ArraySchema, "type">): ArraySchema {
  return { type: "array", ...options };
}

function ioObject(options: Omit<ObjectSchema, "type">): ObjectSchema {
  return { type: "object", ...options };
}

function ioDate(options: Omit<DateSchema, "type">): DateSchema {
  return { type: "date", ...options };
}

function validateData(schema: Schema, data: any): boolean {
  if (schema.required && data == null) {
    return false;
  }

  switch (schema.type) {
    case "string":
      if (typeof data !== "string") return false;
      if (schema.min && data.length < schema.min) return false;
      if (schema.max && data.length > schema.max) return false;
      if (schema.length && data.length !== schema.length) return false;
      if (schema.pattern && !schema.pattern.test(data)) return false;
      if (schema.email && !/^\S+@\S+\.\S+$/.test(data)) return false;
      if (schema.uri && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(data))
        return false;
      if (schema.trim && data.trim() !== data) return false;
      if (schema.lowercase && data.toLowerCase() !== data) return false;
      if (schema.uppercase && data.toUpperCase() !== data) return false;
      break;

    case "number":
      if (typeof data !== "number") return false;
      if (schema.min && data < schema.min) return false;
      if (schema.max && data > schema.max) return false;
      if (schema.positive && data <= 0) return false;
      if (schema.negative && data >= 0) return false;
      if (schema.integer && !Number.isInteger(data)) return false;
      if (schema.greater && data <= schema.greater) return false;
      if (schema.less && data >= schema.less) return false;
      break;

    case "boolean":
      if (typeof data !== "boolean") return false;
      if (schema.oneOf && !schema.oneOf.includes(data)) return false;
      break;

    case "array":
      if (!Array.isArray(data)) return false;
      if (schema.min && data.length < schema.min) return false;
      if (schema.max && data.length > schema.max) return false;
      if (schema.length && data.length !== schema.length) return false;
      if (schema.unique && new Set(data).size !== data.length) return false;
      if (schema.of) {
        for (const item of data) {
          if (!validateData(schema.of, item)) return false;
        }
      }
      break;

    case "object":
      if (typeof data !== "object" || Array.isArray(data) || data === null)
        return false;
      if (schema.unknown === false) {
        for (const key in data) {
          if (!schema.keys?.hasOwnProperty(key)) return false;
        }
      }
      if (schema.keys) {
        for (const [key, keySchema] of Object.entries(schema.keys)) {
          if (!validateData(keySchema, data[key])) return false;
        }
      }
      break;

    case "date":
      if (!(data instanceof Date)) return false;
      if (schema.min && data < schema.min) return false;
      if (schema.max && data > schema.max) return false;
      if (schema.greater && data <= schema.greater) return false;
      if (schema.less && data >= schema.less) return false;
      break;

    default:
      return false;
  }

  return true;
}
