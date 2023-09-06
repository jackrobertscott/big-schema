import {
  Schema,
  SchemaToType,
  ValidationErrorMap,
  ValidationErrorType,
  ValidationResult,
} from "./schema";

/**
 * A generic function for validating values against schemas.
 * @template T - The Schema shape.
 * @param schema - The schema object to validate against.
 * @param value - The value to validate.
 * @param path - The current path location.
 * @returns The result of the validation operation, with either the adjusted value or an object of error locations and error messages.
 */
export const validate = <T extends Schema>(
  schema: T,
  value: any,
  path: string = ""
): ValidationResult<SchemaToType<T>> => {
  const errors: ValidationErrorMap = {};
  const addError = (type: ValidationErrorType, message: string) => {
    if (!errors[path]) errors[path] = [];
    errors[path].push({ type, message });
  };

  if (value == null) {
    if ("required" in schema && schema.required)
      addError("REQUIRED", "Field is required.");
    return { ok: false, errors };
  }

  switch (schema.type) {
    case "string":
      if (typeof value !== "string") {
        addError("TYPE", "Expected a string.");
        break;
      }
      if (schema.trim) value = value.trim();
      if (schema.lowercase) value = value.toLowerCase();
      if (schema.uppercase) value = value.toUpperCase();
      if (schema.min && value.length < schema.min)
        addError("MIN", `Minimum length is ${schema.min}`);
      if (schema.max && value.length > schema.max)
        addError("MAX", `Maximum length is ${schema.max}`);
      if (schema.length && value.length !== schema.length)
        addError("OTHER", `Must be exactly ${schema.length} characters`);
      if (schema.pattern && !schema.pattern.test(value))
        addError("PATTERN", "Pattern mismatch");
      if (schema.email && !/\S+@\S+\.\S+/.test(value))
        addError("OTHER", "Invalid email");
      if (schema.uri && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value))
        addError("OTHER", "Invalid URI");
      break;

    case "number":
      if (typeof value !== "number") {
        addError("TYPE", "Expected a number.");
        break;
      }
      if (schema.min !== undefined && value < schema.min)
        addError("MIN", `Minimum value is ${schema.min}`);
      if (schema.max !== undefined && value > schema.max)
        addError("MAX", `Maximum value is ${schema.max}`);
      if (schema.greater !== undefined && value <= schema.greater)
        addError("OTHER", `Must be greater than ${schema.greater}`);
      if (schema.less !== undefined && value >= schema.less)
        addError("OTHER", `Must be less than ${schema.less}`);
      if (schema.integer && !Number.isInteger(value))
        addError("OTHER", "Expected an integer");
      if (schema.positive && value <= 0) addError("OTHER", "Must be positive");
      if (schema.negative && value >= 0) addError("OTHER", "Must be negative");
      break;

    case "boolean":
      if (typeof value !== "boolean") addError("TYPE", "Expected a boolean.");
      if (schema.oneOf && !schema.oneOf.includes(value))
        addError("OTHER", "Invalid value");
      break;

    case "array":
      if (!Array.isArray(value)) {
        addError("TYPE", "Expected an array.");
        break;
      }
      if (schema.min && value.length < schema.min)
        addError("MIN", `Minimum length is ${schema.min}`);
      if (schema.max && value.length > schema.max)
        addError("MAX", `Maximum length is ${schema.max}`);
      if (schema.length && value.length !== schema.length)
        addError("OTHER", `Must contain exactly ${schema.length} items`);
      if (schema.unique && new Set(value).size !== value.length)
        addError("OTHER", "Must have unique items");
      value.forEach((v, i) => {
        const result = (validate as any)(schema.of, v, `${path}[${i}]`);
        if (!result.ok) Object.assign(errors, result.errors);
      });
      break;

    case "object":
      if (typeof value !== "object" || value === null) {
        addError("TYPE", "Expected an object.");
        break;
      }
      for (const key in schema.keys) {
        const result = (validate as any)(
          schema.keys[key] as Schema,
          (value as any)[key],
          `${path}.${key}`
        );
        if (!result.ok) Object.assign(errors, result.errors);
      }
      break;

    case "date":
      if (!(value instanceof Date)) {
        addError("TYPE", "Expected a date.");
        break;
      }
      if (schema.min && value < schema.min)
        addError("MIN", `Date should be after ${schema.min}`);
      if (schema.max && value > schema.max)
        addError("MAX", `Date should be before ${schema.max}`);
      if (schema.greater && value <= schema.greater)
        addError("OTHER", `Date should be greater than ${schema.greater}`);
      if (schema.less && value >= schema.less)
        addError("OTHER", `Date should be less than ${schema.less}`);
      break;

    case "union":
      const isValid = schema.of.some((s) => (validate as any)(s, value).ok);
      if (!isValid) addError("TYPE", "None of the union types match");
      break;
  }

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value: value as SchemaToType<T> };
};
