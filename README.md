# Robust Data Validation for TypeScript

Big-Schema is a TypeScript library designed for robust schema-based data validation. Using Big-Schema, you can easily define what your data should look like and ensure that it fits the mold. It is perfect for validating API requests, user inputs, configuration files, or any other structured data.

## Features

- Type-First: Schema definitions that create TypeScript types.
- Comprehensive: Supports strings, numbers, booleans, arrays, objects, dates, and even unions.
- Type-safe: Leverage TypeScript's type system for maximum reliability.

## Installation

```bash
npm install big-schema
```

## Quick Start

### Import

```typescript
import { str, num, bool, obj, arr, date, union, validate } from "big-schema";
```

### Validate Data

```typescript
const userSchema = obj({
  name: str({ required: true }),
  age: num({ min: 0 }),
  isAdmin: bool(),
});

const result = validate(userSchema, {
  name: "John",
  age: 30,
  isAdmin: true
});

if (result.ok) {
  console.log("Valid data: ", result.value);
} else {
  console.log("Validation errors: ", result.errors);
}
```

## Schema Types and Properties

### `StringSchema`

- `required`: Indicates if the field is required.
- `min`: Minimum length of the string.
- `max`: Maximum length of the string.
- `length`: Exact length of the string.
- `pattern`: Regular expression the string must match.
- `email`: Indicates the string should be a valid email.
- `uri`: Indicates the string should be a valid URI.
- `trim`: Indicates that the string should be trimmed.
- `lowercase`: Indicates the string should be in lowercase.
- `uppercase`: Indicates the string should be in uppercase.

### `NumberSchema`

- `required`: Indicates if the field is required.
- `min`: Minimum value of the number.
- `max`: Maximum value of the number.
- `positive`: Indicates the number should be positive.
- `negative`: Indicates the number should be negative.
- `integer`: Indicates the number should be an integer.
- `greater`: Specifies that the number should be greater than this value.
- `less`: Specifies that the number should be less than this value.

### `BooleanSchema`

- `required`: Indicates if the field is required.
- `oneOf`: Specifies a whitelist of boolean values.

### `ArraySchema`

- `required`: Indicates if the field is required.
- `min`: Minimum number of items in the array.
- `max`: Maximum number of items in the array.
- `length`: Exact number of items in the array.
- `unique`: Indicates that all items in the array should be unique.
- `of`: Schema for validating items within the array.

### `ObjectSchema`

- `required`: Indicates if the field is required.
- `keys`: Schema for validating keys within the object.
- `unknown`: Allows properties not defined in `keys`.

### `DateSchema`

- `required`: Indicates if the field is required.
- `min`: Minimum date value.
- `max`: Maximum date value.
- `greater`: Specifies that the date should be greater than this value.
- `less`: Specifies that the date should be less than this value.

### `UnionSchema`

- `of`: An array of schemas for validating the union.

## Advanced Examples

### Nested Object and Array

```typescript
const productSchema = obj({
  id: num({ required: true }),
  name: str({ required: true, min: 1 }),
  tags: arr(str({ min: 1 }), { min: 1 }),
  manufacturer: obj({
    name: str({ required: true }),
    location: str(),
  }),
});

const productData = {
  id: 1,
  name: "Laptop",
  tags: ["Electronics", "Portable"],
  manufacturer: {
    name: "TechCorp",
    location: "USA",
  },
};

const result = validate(productSchema, productData);
```

### Union Schema

```typescript
const petSchema = union([
  obj({
    type: str({ required: true, pattern: /^Dog$/ }),
    breed: str({ required: true }),
  }),
  obj({
    type: str({ required: true, pattern: /^Cat$/ }),
    livesLeft: num({ min: 0, max: 9 }),
  }),
]);

const petData = {
  type: "Cat",
  livesLeft: 7,
};

const result = validate(petSchema, petData);
```

## Contribution

If you find any bugs or have a feature request, please open an issue. Contributions are welcome.
