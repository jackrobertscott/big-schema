import { Schema } from "./schema";

export type ValidationResult<T> = {
  value: T | null;
  errors: ValidationError[];
};

export type ValidationError = string;

export function validateBig<T>(
  schema: Schema,
  data: T,
  prefix: string = "Field"
): ValidationResult<T> {
  let errors: ValidationError[] = [];
  let value: T | null = null;

  if (schema.required && (data === null || data === undefined)) {
    return { value, errors: [`${prefix} is required.`] };
  }

  if (data === null || data === undefined) {
    return { value: data, errors };
  }

  switch (schema.type) {
    case "string":
      if (typeof data !== "string") {
        errors.push(`${prefix} must be a string.`);
      } else {
        if (schema.min !== undefined && data.length < schema.min) {
          errors.push(`${prefix} must have at least ${schema.min} characters.`);
        }
        if (schema.max !== undefined && data.length > schema.max) {
          errors.push(
            `${prefix} must have no more than ${schema.max} characters.`
          );
        }
        if (schema.length !== undefined && data.length !== schema.length) {
          errors.push(
            `${prefix} must have exactly ${schema.length} characters.`
          );
        }
        if (schema.pattern && !schema.pattern.test(data)) {
          errors.push(`${prefix} must match the pattern ${schema.pattern}.`);
        }
        if (schema.email && !/\S+@\S+\.\S+/.test(data)) {
          errors.push(`${prefix} must be a valid email.`);
        }
        if (schema.uri && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(data)) {
          errors.push(`${prefix} must be a valid URI.`);
        }
      }
      break;

    case "number":
      if (typeof data !== "number") {
        errors.push(`${prefix} must be a number.`);
      } else {
        if (schema.min !== undefined && data < schema.min) {
          errors.push(`${prefix} must be at least ${schema.min}.`);
        }
        if (schema.max !== undefined && data > schema.max) {
          errors.push(`${prefix} must be no greater than ${schema.max}.`);
        }
        if (schema.positive && data <= 0) {
          errors.push(`${prefix} must be positive.`);
        }
        if (schema.negative && data >= 0) {
          errors.push(`${prefix} must be negative.`);
        }
        if (schema.integer && !Number.isInteger(data)) {
          errors.push(`${prefix} must be an integer.`);
        }
      }
      break;

    case "boolean":
      if (typeof data !== "boolean") {
        errors.push(`${prefix} must be a boolean.`);
      } else {
        if (schema.oneOf && !schema.oneOf.includes(data)) {
          errors.push(`${prefix} must be one of [${schema.oneOf.join(", ")}].`);
        }
      }
      break;

    case "array":
      if (!Array.isArray(data)) {
        errors.push(`${prefix} must be an array.`);
      } else {
        if (schema.min !== undefined && data.length < schema.min) {
          errors.push(`${prefix} must have at least ${schema.min} items.`);
        }
        if (schema.max !== undefined && data.length > schema.max) {
          errors.push(`${prefix} must have no more than ${schema.max} items.`);
        }
        if (schema.length !== undefined && data.length !== schema.length) {
          errors.push(`${prefix} must have exactly ${schema.length} items.`);
        }
        if (schema.unique && new Set(data).size !== data.length) {
          errors.push(`${prefix} must have unique items.`);
        }
        if (schema.of) {
          data.forEach((item, index) => {
            const itemResult = validateBig(
              schema.of!,
              item,
              `${prefix}[${index}]`
            );
            errors = errors.concat(itemResult.errors);
          });
        }
      }
      break;

    case "object":
      if (typeof data !== "object" || Array.isArray(data)) {
        errors.push(`${prefix} must be an object.`);
      } else {
        if (schema.keys) {
          for (const key in schema.keys) {
            const subResult = validateBig(
              schema.keys[key],
              (data as any)[key],
              `${prefix}.${key}`
            );
            errors = errors.concat(subResult.errors);
          }
        }
        if (!schema.unknown) {
          for (const key in data) {
            if (!schema.keys || !schema.keys[key]) {
              errors.push(`${prefix} has an unknown key: ${key}`);
            }
          }
        }
      }
      break;

    case "date":
      if (!(data instanceof Date)) {
        errors.push(`${prefix} must be a date.`);
      } else {
        if (schema.min && data < schema.min) {
          errors.push(
            `${prefix} must be greater than or equal to ${schema.min}.`
          );
        }
        if (schema.max && data > schema.max) {
          errors.push(`${prefix} must be less than or equal to ${schema.max}.`);
        }
        if (schema.greater && data <= schema.greater) {
          errors.push(`${prefix} must be greater than ${schema.greater}.`);
        }
        if (schema.less && data >= schema.less) {
          errors.push(`${prefix} must be less than ${schema.less}.`);
        }
      }
      break;
  }

  return { value: data, errors };
}
