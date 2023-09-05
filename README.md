# Data Validation Library

This library provides a set of helper functions to create schemas for various JavaScript data types, along with a `validateData` function to validate data against these schemas.

## Installation

NPM:

```shell
npm install --save validate-io
```

Yarn:

```shell
yarn add validate-io
```

## Types of Schemas

We support the following types of schemas:

- String
- Number
- Boolean
- Array
- Object
- Date

## Demos

### Example 1: Nested Object Schema

Suppose you have an object with nested objects and arrays.

```typescript
const userSchema = ioObject({
  keys: {
    name: ioString({ required: true, min: 3 }),
    age: ioNumber({ required: true, min: 18 }),
    contact: ioObject({
      keys: {
        email: ioString({ email: true }),
        phone: ioString({ pattern: /^[0-9]{10}$/ }),
      },
    }),
    roles: ioArray({ of: ioString({}) }),
  },
});

const isValidUser = validateData(userSchema, {
  name: 'John Doe',
  age: 30,
  contact: {
    email: 'john@example.com',
    phone: '1234567890',
  },
  roles: ['admin', 'user'],
});

console.log(isValidUser);  // Should print true if the data is valid
```

### Example 2: Array of Objects

Suppose you have an array where each item is an object with specific properties.

```typescript
const bookSchema = ioArray({
  of: ioObject({
    keys: {
      title: ioString({ required: true }),
      author: ioString({ required: true }),
      publishedYear: ioNumber({ min: 1900 }),
    },
  }),
  min: 1,
});

const isValidBooks = validateData(bookSchema, [
  { title: '1984', author: 'George Orwell', publishedYear: 1949 },
  { title: 'Brave New World', author: 'Aldous Huxley', publishedYear: 1932 },
]);

console.log(isValidBooks);  // Should print true if the data is valid
```

### Example 3: Complex Nested Schema

Imagine a schema for a user where each user has a list of orders, and each order has a list of products.

```typescript
const complexUserSchema = ioObject({
  keys: {
    name: ioString({ required: true }),
    orders: ioArray({
      of: ioObject({
        keys: {
          orderId: ioNumber({ required: true }),
          date: ioDate({ required: true }),
          products: ioArray({
            of: ioObject({
              keys: {
                productId: ioNumber({ required: true }),
                quantity: ioNumber({ min: 1, required: true }),
              },
            }),
            min: 1,
          }),
        },
      }),
      min: 1,
    }),
  },
});

const isValidComplexUser = validateData(complexUserSchema, {
  name: 'Jane',
  orders: [
    {
      orderId: 1,
      date: new Date('2022-01-01'),
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    },
    {
      orderId: 2,
      date: new Date('2022-01-10'),
      products: [
        { productId: 3, quantity: 1 },
      ],
    },
  ],
});

console.log(isValidComplexUser);  // Should print true if the data is valid
```

These are just examples to illustrate complex schema shapes. The actual behavior would depend on your implementation of `validateData`.

## Helper Functions

### `ioString(options)`

Creates a schema for validating strings.

Options:

- `required`: Specifies if the field is required.
- `min`: Minimum length of the string.
- `max`: Maximum length of the string.
- `length`: Exact length of the string.
- `pattern`: Regular expression pattern the string must match.
- `email`: Indicates that the string should be a valid email.
- `uri`: Indicates that the string should be a valid URI.
- `trim`: Indicates that the string should be trimmed.
- `lowercase`: Indicates that the string should be lowercase.
- `uppercase`: Indicates that the string should be uppercase.

Example:

```typescript
const stringSchema = ioString({ min: 3, max: 50, email: true });
```

### `ioNumber(options)`

Creates a schema for validating numbers.

Options:

- `required`: Specifies if the field is required.
- `min`: Minimum value of the number.
- `max`: Maximum value of the number.
- `positive`: Indicates that the number should be positive.
- `negative`: Indicates that the number should be negative.
- `integer`: Indicates that the number should be an integer.
- `greater`: Specifies that the number should be greater than this value.
- `less`: Specifies that the number should be less than this value.

Example:

```typescript
const numberSchema = ioNumber({ min: 0, max: 100 });
```

### `ioBoolean(options)`

Creates a schema for validating booleans.

Options:

- `required`: Specifies if the field is required.
- `oneOf`: Specifies a whitelist of boolean values.

Example:

```typescript
const booleanSchema = ioBoolean({ oneOf: [true] });
```

### `ioArray(options)`

Creates a schema for validating arrays.

Options:

- `required`: Specifies if the field is required.
- `min`: Minimum number of items in the array.
- `max`: Maximum number of items in the array.
- `length`: Exact number of items in the array.
- `unique`: Indicates that all items in the array should be unique.
- `of`: Schema for validating items within the array.

Example:

```typescript
const arraySchema = ioArray({ min: 1, max: 5, of: ioNumber({ min: 1 }) });
```

### `ioObject(options)`

Creates a schema for validating objects.

Options:

- `required`: Specifies if the field is required.
- `keys`: Schema for validating keys within the object.
- `unknown`: Allows properties not defined in `keys`.

Example:

```typescript
const objectSchema = ioObject({ keys: { name: ioString({ required: true }) } });
```

### `ioDate(options)`

Creates a schema for validating dates.

Options:

- `required`: Specifies if the field is required.
- `min`: Minimum date value.
- `max`: Maximum date value.
- `greater`: Specifies that the date should be greater than this value.
- `less`: Specifies that the date should be less than this value.

Example:

```typescript
const dateSchema = ioDate({ min: new Date('2021-01-01'), max: new Date('2022-01-01') });
```

## validateData Function

The `validateData` function takes a schema and a data item as arguments and returns a boolean indicating whether the data item is valid according to the schema.

```typescript
function validateData(schema: Schema, data: any): boolean {
  // ... implementation here
}
```

Example:

```typescript
const isValid = validateData(ioString({ min: 3 }), 'abc');
console.log(isValid); // Should print true
```
