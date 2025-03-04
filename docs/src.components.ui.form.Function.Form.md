[**nextjs-template**](README.md)

---

[nextjs-template](README.md) / [src/components/ui/form](src.components.ui.form.md) / Form

# Function: Form()

```ts
function Form<TFieldValues, TContext, TTransformedValues>(
  props: FormProviderProps<TFieldValues, TContext, TTransformedValues>,
): Element;
```

Defined in: [src/components/ui/form.tsx:19](https://github.com/mariolim96/Easy-Check-In/blob/e840a4393cceae48bed5204292fc61d73f9f5dbb/src/components/ui/form.tsx#L19)

A provider component that propagates the `useForm` methods to all children components via [React Context](https://reactjs.org/docs/context.html) API. To be used with useFormContext.

## Type Parameters

| Type Parameter                                              | Default type |
| ----------------------------------------------------------- | ------------ |
| `TFieldValues` _extends_ `FieldValues`                      | -            |
| `TContext`                                                  | `any`        |
| `TTransformedValues` _extends_ `undefined` \| `FieldValues` | `undefined`  |

## Parameters

| Parameter | Type                                                                    | Description         |
| --------- | ----------------------------------------------------------------------- | ------------------- |
| `props`   | `FormProviderProps`\<`TFieldValues`, `TContext`, `TTransformedValues`\> | all useForm methods |

## Returns

`Element`

## Remarks

[API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)

## Example

```tsx
function App() {
  const methods = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}
```
