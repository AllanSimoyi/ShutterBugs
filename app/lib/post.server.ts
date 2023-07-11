import { flattenFieldErrors } from '~/lib/forms.validations';

interface FlattenErrorsProps {
  fieldErrors: {
    [x: string]: string[] | undefined;
  };
  formErrors: string[];
}

export const ImageUploadSizeLimit = {
  Value: 2_000_000,
  Caption: '2MB',
};

export function flattenErrors(props: FlattenErrorsProps) {
  const { fieldErrors, formErrors } = props;

  const flattenedFieldErrors = fieldErrors
    ? flattenFieldErrors(fieldErrors)
    : '';
  const flattenedFormErrors = formErrors.join(', ');

  return [flattenedFieldErrors, flattenedFormErrors].filter(Boolean).join(', ');
}
