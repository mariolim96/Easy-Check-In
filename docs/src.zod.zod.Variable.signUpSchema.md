[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/zod/zod](src.zod.zod.md) / signUpSchema

# Variable: signUpSchema

```ts
const signUpSchema: ZodEffects<
  ZodObject<
    {
      name: ZodString;
      email: ZodString;
      password: ZodString;
      confirmPassword: ZodString;
    },
    "strip",
    {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }
  >,
  {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
  {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
>;
```

Defined in: [src/zod/zod.ts:18](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/zod/zod.ts#L18)
