[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/routes/hooks](src.routes.hooks.md) / usePush

# Function: usePush()

```ts
function usePush<Params, Search>(
  builder: RouteBuilder<Params, Search>,
): (
  p: input<Params>,
  search?: input<Search>,
  options?: NavigateOptions,
) => void;
```

Defined in: [src/routes/hooks.ts:18](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/routes/hooks.ts#L18)

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

`Function`

### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| `p`        | `input`\<`Params`\> |
| `search`?  | `input`\<`Search`\> |
| `options`? | `NavigateOptions`   |

### Returns

`void`
