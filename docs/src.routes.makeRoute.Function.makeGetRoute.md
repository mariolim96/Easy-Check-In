[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/routes/makeRoute](src.routes.makeRoute.md) / makeGetRoute

# Function: makeGetRoute()

```ts
function makeGetRoute<Params, Search, Result>(
  route: string,
  info: RouteInfo<Params, Search>,
  getInfo: GetInfo<Result>,
): GetRouteBuilder<Params, Search, Result>;
```

Defined in: [src/routes/makeRoute.tsx:345](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/routes/makeRoute.tsx#L345)

## Type Parameters

| Type Parameter               |
| ---------------------------- |
| `Params` _extends_ `ZodType` |
| `Search` _extends_ `ZodType` |
| `Result` _extends_ `ZodType` |

## Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `route`   | `string`                                                                         |
| `info`    | [`RouteInfo`](src.routes.makeRoute.TypeAlias.RouteInfo.md)\<`Params`, `Search`\> |
| `getInfo` | [`GetInfo`](src.routes.makeRoute.TypeAlias.GetInfo.md)\<`Result`\>               |

## Returns

`GetRouteBuilder`\<`Params`, `Search`, `Result`\>
