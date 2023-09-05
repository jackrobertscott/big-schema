import {
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from "./schema";

export function bigString(options: Omit<StringSchema, "type">): StringSchema {
  return { type: "string", ...options };
}

export function bigNumber(options: Omit<NumberSchema, "type">): NumberSchema {
  return { type: "number", ...options };
}

export function bigBoolean(
  options: Omit<BooleanSchema, "type">
): BooleanSchema {
  return { type: "boolean", ...options };
}

export function bigArray(options: Omit<ArraySchema, "type">): ArraySchema {
  return { type: "array", ...options };
}

export function bigObject(options: Omit<ObjectSchema, "type">): ObjectSchema {
  return { type: "object", ...options };
}

export function bigDate(options: Omit<DateSchema, "type">): DateSchema {
  return { type: "date", ...options };
}
