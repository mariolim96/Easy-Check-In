[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/routes/hooks](src.routes.hooks.md) / useSearchParams

# Function: useSearchParams()

```ts
function useSearchParams<Params, Search>(
  builder: RouteBuilder<Params, Search>,
): z.output<Search>;
```

Defined in: [src/routes/hooks.ts:45](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/routes/hooks.ts#L45)

## Type Parameters

| Type Parameter               | Default type                               |
| ---------------------------- | ------------------------------------------ |
| `Params` _extends_ `ZodType` | -                                          |
| `Search` _extends_ `ZodType` | `ZodObject`\<\{\}, `"strip"`, \{\}, \{\}\> |

## Parameters

| Parameter | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `builder` | [`RouteBuilder`](src.routes.makeRoute.TypeAlias.RouteBuilder.md)\<`Params`, `Search`\> |

## Returns

`z.output`\<`Search`\>
