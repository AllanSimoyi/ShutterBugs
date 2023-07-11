import type { CustomFieldErrors, CustomFormFields } from '../lib/forms';

import { createContext, useContext } from 'react';

interface ContextProps<SchemaType extends Record<string, FormDataEntryValue>> {
  formError?: string;
  fields?: CustomFormFields<SchemaType>;
  fieldErrors?: CustomFieldErrors<SchemaType>;
  isSubmitting?: boolean;
}

export const ActionContext = createContext<ContextProps<Record<any, any>>>({
  formError: undefined,
  fields: {},
  fieldErrors: {},
  isSubmitting: false,
});

interface Props extends ContextProps<Record<string, FormDataEntryValue>> {
  children: React.ReactNode;
}
export function ActionContextProvider(props: Props) {
  const { children, ...restOfProps } = props;
  return (
    <ActionContext.Provider value={restOfProps}>
      {children}
    </ActionContext.Provider>
  );
}

function useActionContext<
  SchemaType extends Record<string, FormDataEntryValue>
>() {
  const context = useContext<ContextProps<SchemaType>>(ActionContext);
  if (!context) {
    throw new Error(
      `useActionContext must be used within a ActionContextProvider`
    );
  }
  return context;
}

export function useField<SchemaType extends Record<string, FormDataEntryValue>>(
  name: keyof SchemaType
) {
  const { fields, fieldErrors } = useActionContext<SchemaType>();
  return {
    value: fields?.[name],
    error: fieldErrors?.[name],
  };
}

export function useFormError<
  SchemaType extends Record<string, FormDataEntryValue>
>() {
  const { formError } = useActionContext<SchemaType>();
  return formError;
}

export function useIsSubmitting<
  SchemaType extends Record<string, FormDataEntryValue>
>() {
  const { isSubmitting } = useActionContext<SchemaType>();
  return isSubmitting;
}
