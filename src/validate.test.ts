import { arr, bool, date, num, obj, str, union } from "./utils"; // Update the import based on your actual file location
import { validate } from "./validate";

describe("Schema Validation Library", () => {
  describe("String Schema", () => {
    it("should validate required strings", () => {
      const schema = str({ required: true });
      expect(validate(schema, "hello").ok).toBe(true);
      expect(validate(schema, null).ok).toBe(false);
      expect(validate(schema, undefined).ok).toBe(false);
    });

    it("should validate optional strings", () => {
      const schema = str({ required: false });
      expect(validate(schema, "hello").ok).toBe(true);
      expect(validate(schema, null).ok).toBe(true);
      expect(validate(schema, undefined).ok).toBe(true);
    });

    it("should validate min length", () => {
      const schema = str({ min: 3 });
      expect(validate(schema, "hi").ok).toBe(false);
      expect(validate(schema, "hey").ok).toBe(true);
      expect(validate(schema, "hello").ok).toBe(true);
    });

    it("should validate max length", () => {
      const schema = str({ max: 3 });
      expect(validate(schema, "hello").ok).toBe(false);
      expect(validate(schema, "hey").ok).toBe(true);
      expect(validate(schema, "hi").ok).toBe(true);
    });

    it("should validate length range", () => {
      const schema = str({ min: 3, max: 5 });
      expect(validate(schema, "hi").ok).toBe(false);
      expect(validate(schema, "hey").ok).toBe(true);
      expect(validate(schema, "hello").ok).toBe(true);
      expect(validate(schema, "helloworld").ok).toBe(false);
    });

    it("should validate pattern match", () => {
      const schema = str({ pattern: /^[a-z]+$/ });
      expect(validate(schema, "hello").ok).toBe(true);
      expect(validate(schema, "Hey").ok).toBe(false);
      expect(validate(schema, "123").ok).toBe(false);
    });

    // it("should validate enum values", () => {
    //   const schema = str({ enum: ["yes", "no"] });
    //   expect(validate(schema, "yes").ok).toBe(true);
    //   expect(validate(schema, "no").ok).toBe(true);
    //   expect(validate(schema, "maybe").ok).toBe(false);
    // });

    // it("should validate with custom validator", () => {
    //   const schema = str({
    //     custom: (value) => {
    //       if (value.includes("test")) {
    //         return 'Cannot include "test"';
    //       }
    //     },
    //   });
    //   expect(validate(schema, "hello").ok).toBe(true);
    //   expect(validate(schema, "testhello").ok).toBe(false);
    // });
  });

  describe("Number Schema", () => {
    it("should validate required numbers", () => {
      const schema = num({ required: true });
      expect(validate(schema, 42).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(false);
      expect(validate(schema, undefined).ok).toBe(false);
    });

    it("should validate optional numbers", () => {
      const schema = num({ required: false });
      expect(validate(schema, 42).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(true);
      expect(validate(schema, undefined).ok).toBe(true);
    });

    it("should validate minimum value", () => {
      const schema = num({ min: 10 });
      expect(validate(schema, 5).ok).toBe(false);
      expect(validate(schema, 10).ok).toBe(true);
      expect(validate(schema, 15).ok).toBe(true);
    });

    it("should validate maximum value", () => {
      const schema = num({ max: 10 });
      expect(validate(schema, 15).ok).toBe(false);
      expect(validate(schema, 10).ok).toBe(true);
      expect(validate(schema, 5).ok).toBe(true);
    });

    it("should validate value range", () => {
      const schema = num({ min: 10, max: 20 });
      expect(validate(schema, 5).ok).toBe(false);
      expect(validate(schema, 15).ok).toBe(true);
      expect(validate(schema, 25).ok).toBe(false);
    });

    it("should validate integers", () => {
      const schema = num({ integer: true });
      expect(validate(schema, 42.5).ok).toBe(false);
      expect(validate(schema, 42).ok).toBe(true);
    });

    // it('should validate enums', () => {
    //   const schema = num({ enum: [1, 2, 3] });
    //   expect(validate(schema, 1).ok).toBe(true);
    //   expect(validate(schema, 2).ok).toBe(true);
    //   expect(validate(schema, 3).ok).toBe(true);
    //   expect(validate(schema, 4).ok).toBe(false);
    // });

    // it('should validate with custom validator', () => {
    //   const schema = num({
    //     custom: (value) => {
    //       if (value % 2 !== 0) {
    //         return 'Must be an even number';
    //       }
    //     }
    //   });
    //   expect(validate(schema, 42).ok).toBe(true);
    //   expect(validate(schema, 43).ok).toBe(false);
    // });
  });

  describe("Boolean Schema", () => {
    it("should validate required booleans", () => {
      const schema = bool({ required: true });
      expect(validate(schema, true).ok).toBe(true);
      expect(validate(schema, false).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(false);
      expect(validate(schema, undefined).ok).toBe(false);
    });

    it("should validate optional booleans", () => {
      const schema = bool({ required: false });
      expect(validate(schema, true).ok).toBe(true);
      expect(validate(schema, false).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(true);
      expect(validate(schema, undefined).ok).toBe(true);
    });

    // it('should validate enums', () => {
    //   const schema = bool({ enum: [true] });
    //   expect(validate(schema, true).ok).toBe(true);
    //   expect(validate(schema, false).ok).toBe(false);
    // });

    // it('should validate with custom validator', () => {
    //   const schema = bool({
    //     custom: (value) => {
    //       if (value === false) {
    //         return 'Value must be true';
    //       }
    //     },
    //   });
    //   expect(validate(schema, true).ok).toBe(true);
    //   expect(validate(schema, false).ok).toBe(false);
    // });
  });

  describe("Array Schema", () => {
    it("should validate required arrays", () => {
      const schema = arr(num(), { required: true });
      expect(validate(schema, [1, 2, 3]).ok).toBe(true);
      expect(validate(schema, []).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(false);
      expect(validate(schema, undefined).ok).toBe(false);
    });

    it("should validate optional arrays", () => {
      const schema = arr(num(), { required: false });
      expect(validate(schema, [1, 2, 3]).ok).toBe(true);
      expect(validate(schema, []).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(true);
      expect(validate(schema, undefined).ok).toBe(true);
    });

    it("should validate min length", () => {
      const schema = arr(num(), { min: 2 });
      expect(validate(schema, [1]).ok).toBe(false);
      expect(validate(schema, [1, 2]).ok).toBe(true);
    });

    it("should validate max length", () => {
      const schema = arr(num(), { max: 2 });
      expect(validate(schema, [1, 2, 3]).ok).toBe(false);
      expect(validate(schema, [1, 2]).ok).toBe(true);
    });

    it("should validate array items", () => {
      const schema = arr(num({ min: 1 }));
      expect(validate(schema, [1, 2, 3]).ok).toBe(true);
      expect(validate(schema, [0, 1, 2]).ok).toBe(false);
    });

    // it('should validate with custom validator', () => {
    //   const schema = arr(num(), {
    //     custom: (value) => {
    //       if (value.includes(0)) {
    //         return 'Array should not include 0';
    //       }
    //     },
    //   });
    //   expect(validate(schema, [1, 2, 3]).ok).toBe(true);
    //   expect(validate(schema, [0, 1, 2]).ok).toBe(false);
    // });
  });

  describe("Object Schema", () => {
    it("should validate required objects", () => {
      const schema = obj({ name: str({ required: true }) }, { required: true });

      expect(validate(schema, { name: "John" }).ok).toBe(true);
      expect(validate(schema, {}).ok).toBe(false);
      expect(validate(schema, null).ok).toBe(false);
      expect(validate(schema, undefined).ok).toBe(false);
    });

    it("should validate optional objects", () => {
      const schema = obj(
        { name: str({ required: false }) },
        { required: false }
      );

      expect(validate(schema, { name: "John" }).ok).toBe(true);
      expect(validate(schema, {}).ok).toBe(true);
      expect(validate(schema, null).ok).toBe(true);
      expect(validate(schema, undefined).ok).toBe(true);
    });

    it("should validate object properties", () => {
      const schema = obj({
        name: str({ min: 3 }),
        age: num({ min: 18 }),
        isActive: bool(),
      });

      expect(
        validate(schema, { name: "John", age: 25, isActive: true }).ok
      ).toBe(true);
      expect(validate(schema, { name: "Jo", age: 17, isActive: true }).ok).toBe(
        false
      );
    });

    it("should validate nested objects", () => {
      const schema = obj(
        {
          profile: obj(
            { name: str({ required: true }), age: num({ min: 18 }) },
            { required: true }
          ),
        },
        { required: true }
      );

      expect(validate(schema, { profile: { name: "John", age: 25 } }).ok).toBe(
        true
      );
      expect(validate(schema, { profile: { name: "John", age: 17 } }).ok).toBe(
        false
      );
    });

    // it("should validate extra properties", () => {
    //   const schema = obj({
    //     properties: {
    //       name: str({ required: true }),
    //     },
    //     additionalProperties: false,
    //   });
    //   expect(validate(schema, { name: "John", extra: "field" }).ok).toBe(false);
    //   expect(validate(schema, { name: "John" }).ok).toBe(true);
    // });

    // it("should validate with custom validator", () => {
    //   const schema = obj({
    //     custom: (value) => {
    //       if (value.name === "restricted") {
    //         return 'Name cannot be "restricted"';
    //       }
    //     },
    //   });
    //   expect(validate(schema, { name: "John" }).ok).toBe(true);
    //   expect(validate(schema, { name: "restricted" }).ok).toBe(false);
    // });
  });

  describe("Date Schema", () => {
    it("should validate required dates", () => {
      const schema = date({
        required: true,
      });

      expect(validate(schema, new Date()).ok).toBe(true);
      // expect(validate(schema, "2023-09-06").ok).toBe(true); // Assuming the utility can parse date strings
      expect(validate(schema, null).ok).toBe(false);
      expect(validate(schema, undefined).ok).toBe(false);
    });

    it("should validate optional dates", () => {
      const schema = date({
        required: false,
      });

      expect(validate(schema, new Date()).ok).toBe(true);
      // expect(validate(schema, "2023-09-06").ok).toBe(true);
      expect(validate(schema, null).ok).toBe(true);
      expect(validate(schema, undefined).ok).toBe(true);
    });

    it("should validate date ranges", () => {
      const schema = date({
        min: new Date("2022-01-01"),
        max: new Date("2023-01-01"),
      });

      expect(validate(schema, new Date("2022-06-01")).ok).toBe(true);
      expect(validate(schema, new Date("2021-12-31")).ok).toBe(false);
      expect(validate(schema, new Date("2023-01-02")).ok).toBe(false);
    });
  });

  describe("Union Schema", () => {
    it("should validate valid union types", () => {
      const schema = union([str({ min: 3 }), num({ min: 10 })]);

      expect(validate(schema, "test").ok).toBe(true);
      expect(validate(schema, 15).ok).toBe(true);
      expect(validate(schema, "ok").ok).toBe(false);
    });

    it("should invalidate invalid union types", () => {
      const schema = union([str({ min: 3 }), num({ min: 10 })]);

      expect(validate(schema, "no").ok).toBe(false);
      expect(validate(schema, 5).ok).toBe(false);
      expect(validate(schema, {}).ok).toBe(false);
    });

    it("should validate nested union types", () => {
      const schema = union([
        str({ min: 3 }),
        obj({ key: str({ required: true }) }),
      ]);

      expect(validate(schema, "test").ok).toBe(true);
      expect(validate(schema, { key: "value" }).ok).toBe(true);
    });

    it("should invalidate nested invalid union types", () => {
      const schema = union([
        str({ min: 3 }),
        obj({ key: str({ required: true }) }),
      ]);

      expect(validate(schema, "no").ok).toBe(false);
      expect(validate(schema, { key: null }).ok).toBe(false);
    });
  });

  describe("Complex Cases", () => {
    it("should handle complex nested schemas", () => {
      const schema = obj({
        info: obj({
          name: str({ required: true }),
          age: num({ min: 0 }),
        }),
        tags: arr(str({ min: 2 })),
        extra: union([str(), num()]),
      });

      const result = validate(schema, {
        info: { name: "John", age: 30 },
        tags: ["apple", "banana"],
        extra: "extra",
      });

      expect(result).toEqual({
        ok: true,
        value: {
          info: { name: "John", age: 30 },
          tags: ["apple", "banana"],
          extra: "extra",
        },
      });
    });
  });
});
