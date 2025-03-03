[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/zod/zod](src.zod.zod.md) / resetPasswordSchema

# Variable: resetPasswordSchema

```ts
const resetPasswordSchema: ZodEffects<
  ZodObject<
    {
      password: ZodString;
      confirmPassword: ZodString;
    },
    "strip",
    {
      password: string;
      confirmPassword: string;
    },
    {
      password: string;
      confirmPassword: string;
    }
  >,
  {
    password: string;
    confirmPassword: string;
  },
  {
    password: string;
    confirmPassword: string;
  }
>;
```

Defined in: [src/zod/zod.ts:37](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/zod/zod.ts#L37)
