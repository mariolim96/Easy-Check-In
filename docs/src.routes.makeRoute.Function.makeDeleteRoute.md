[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/routes/makeRoute](src.routes.makeRoute.md) / makeDeleteRoute

# Function: makeDeleteRoute()

```ts
function makeDeleteRoute<Params, Search>(
  route: string,
  info: RouteInfo<Params, Search>,
): DeleteRouteBuilder<Params, Search>;
```

Defined in: [src/routes/makeRoute.tsx:389](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/routes/makeRoute.tsx#L389)

## Type Parameters

| Type Parameter               |
| ---------------------------- |
| `Params` _extends_ `ZodType` |
| `Search` _extends_ `ZodType` |

## Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `route`   | `string`                                                                         |
| `info`    | [`RouteInfo`](src.routes.makeRoute.TypeAlias.RouteInfo.md)\<`Params`, `Search`\> |

## Returns

`DeleteRouteBuilder`\<`Params`, `Search`\>
