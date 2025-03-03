[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/routes/utils](src.routes.utils.md) / safeParseSearchParams

# Function: safeParseSearchParams()

```ts
function safeParseSearchParams<T>(
  schema: T,
  searchParams: URLSearchParams,
): z.infer<T>;
```

Defined in: [src/routes/utils.ts:9](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/routes/utils.ts#L9)

## Type Parameters

| Type Parameter             |
| -------------------------- |
| `T` _extends_ `ZodTypeAny` |

## Parameters

| Parameter      | Type              |
| -------------- | ----------------- |
| `schema`       | `T`               |
| `searchParams` | `URLSearchParams` |

## Returns

`z.infer`\<`T`\>
