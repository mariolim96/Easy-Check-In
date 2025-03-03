[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/components/ui/toast](src.components.ui.toast.md) / Toast

# Function: Toast()

```ts
function Toast(
  props: Omit<ToastProps & RefAttributes<HTMLLIElement>, "ref"> &
    VariantProps<
      (
        props?: ConfigVariants<{
          variant: { default: string; destructive: string };
        }> &
          ClassProp,
      ) => string
    > &
    RefAttributes<HTMLLIElement>,
): ReactNode;
```

Defined in: [src/components/ui/toast.tsx:43](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/components/ui/toast.tsx#L43)

## Parameters

| Parameter | Type                                                                                                                                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `props`   | `Omit`\<`ToastProps` & `RefAttributes`\<`HTMLLIElement`\>, `"ref"`\> & `VariantProps`\<(`props`?: ConfigVariants\<\{ variant: \{ default: string; destructive: string; \}; \}\> & ClassProp) => `string`\> & `RefAttributes`\<`HTMLLIElement`\> |

## Returns

`ReactNode`
