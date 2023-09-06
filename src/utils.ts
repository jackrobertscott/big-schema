import {
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  Schema,
  StringSchema,
  UnionSchema,
} from "./schema";

/**
 * Create a StringSchema object.
 * @param opts - Optional configuration for the schema.
 * @returns A StringSchema object.
 */
export function str(opts?: Omit<StringSchema, "type">): StringSchema {
  return { type: "string", ...opts };
}

/**
 * Create a NumberSchema object.
 * @param opts - Optional configuration for the schema.
 * @returns A NumberSchema object.
 */
export function num(opts?: Omit<NumberSchema, "type">): NumberSchema {
  return { type: "number", ...opts };
}

/**
 * Create a BooleanSchema object.
 * @param opts - Optional configuration for the schema.
 * @returns A BooleanSchema object.
 */
export function bool(opts?: Omit<BooleanSchema, "type">): BooleanSchema {
  return { type: "boolean", ...opts };
}

/**
 * Create an ArraySchema object.
 * @param of - Schema for validating items within the array.
 * @param opts - Optional configuration for the schema.
 * @returns An ArraySchema object.
 */
export function arr<T extends Schema>(
  of: T,
  opts?: Omit<ArraySchema<T>, "type" | "of">
): ArraySchema<T> {
  return { type: "array", of, ...opts };
}

/**
 * Create an ObjectSchema object.
 * @param keys - Schema for validating keys within the object.
 * @param opts - Optional configuration for the schema.
 * @returns An ObjectSchema object.
 */
export function obj<T extends { [key: string]: Schema }>(
  keys: T,
  opts?: Omit<ObjectSchema<T>, "type" | "keys">
): ObjectSchema<T> {
  return { type: "object", keys, ...opts };
}

/**
 * Create a DateSchema object.
 * @param opts - Optional configuration for the schema.
 * @returns A DateSchema object.
 */
export function date(opts?: Omit<DateSchema, "type">): DateSchema {
  return { type: "date", ...opts };
}

/**
 * Create a UnionSchema object.
 * @param of - Array of schemas for validating items within the union.
 * @returns A UnionSchema object.
 */
export function union<T extends Schema[]>(of: T): UnionSchema<T> {
  return { type: "union", of };
}
