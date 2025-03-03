[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/server/db/schemas/auth](src.server.db.schemas.auth.md) / userRoleEnums

# Function: userRoleEnums()

## Call Signature

```ts
function userRoleEnums(): PgEnumColumnBuilderInitial<
  "",
  ["user", "admin", "superAdmin"]
>;
```

Defined in: [src/server/db/schemas/auth.ts:3](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/server/db/schemas/auth.ts#L3)

### Returns

`PgEnumColumnBuilderInitial`\<`""`, \[`"user"`, `"admin"`, `"superAdmin"`\]\>

## Call Signature

```ts
function userRoleEnums<TName>(
  name: TName,
): PgEnumColumnBuilderInitial<TName, ["user", "admin", "superAdmin"]>;
```

Defined in: [src/server/db/schemas/auth.ts:3](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/server/db/schemas/auth.ts#L3)

### Type Parameters

| Type Parameter             |
| -------------------------- |
| `TName` _extends_ `string` |

### Parameters

| Parameter | Type    |
| --------- | ------- |
| `name`    | `TName` |

### Returns

`PgEnumColumnBuilderInitial`\<`TName`, \[`"user"`, `"admin"`, `"superAdmin"`\]\>

## Call Signature

```ts
function userRoleEnums<TName>(
  name?: TName,
): PgEnumColumnBuilderInitial<TName, ["user", "admin", "superAdmin"]>;
```

Defined in: [src/server/db/schemas/auth.ts:3](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/server/db/schemas/auth.ts#L3)

### Type Parameters

| Type Parameter             |
| -------------------------- |
| `TName` _extends_ `string` |

### Parameters

| Parameter | Type    |
| --------- | ------- |
| `name`?   | `TName` |

### Returns

`PgEnumColumnBuilderInitial`\<`TName`, \[`"user"`, `"admin"`, `"superAdmin"`\]\>
