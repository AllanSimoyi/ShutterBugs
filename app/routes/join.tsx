import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';

import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { z } from 'zod';

import { ActionContextProvider } from '~/components/ActionContextProvider';
import { AppTitle } from '~/components/AppTitle';
import { RouteErrorBoundary } from '~/components/Boundaries';
import { Footer } from '~/components/Footer';
import { FormTextField } from '~/components/FormTextField';
import { InlineAlert } from '~/components/InlineAlert';
import { PrimaryButton } from '~/components/PrimaryButton';
import { SecondaryButtonLink } from '~/components/SecondaryButton';
import {
  EmailSchema,
  FullNameSchema,
  PasswordSchema,
} from '~/lib/auth.validations';
import { PRODUCT_NAME } from '~/lib/constants';
import { badRequest, processBadRequest } from '~/lib/core.validations';
import { getRawFormFields, hasFormError } from '~/lib/forms';
import { AppLinks } from '~/lib/links';
import { createUser, getUserByEmail } from '~/lib/user.server';
import { createUserSession, getUserId } from '~/session.server';

export const meta: MetaFunction = () => {
  return { title: `${PRODUCT_NAME} - Create Account` };
};

const Schema = z
  .object({
    email: EmailSchema,
    fullName: FullNameSchema,
    password: PasswordSchema,
    passwordConfirmation: PasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export async function loader({ request }: LoaderArgs) {
  const currentUserId = await getUserId(request);
  if (currentUserId) {
    return redirect('/');
  }
  return json({});
}

export async function action({ request }: ActionArgs) {
  const fields = await getRawFormFields(request);
  const result = Schema.safeParse(fields);
  if (!result.success) {
    return processBadRequest(result.error, fields);
  }
  const { email, fullName, password } = result.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return badRequest({
      fields,
      fieldErrors: { email: ['Email already used by another user'] },
      formError: undefined,
    });
  }

  const user = await createUser({ email, fullName, password, imageId: '' });
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: '/',
  });
}

export default function CreateAccount() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isProcessing = navigation.state !== 'idle';

  return (
    <div className="flex h-full flex-col items-stretch justify-center">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="grow" />
        <Form
          method="post"
          className="flex w-full flex-col items-stretch justify-center gap-2 p-4 sm:w-[80%] md:w-[60%] lg:w-[40%]"
        >
          <ActionContextProvider {...actionData} isSubmitting={isProcessing}>
            <div className="flex flex-col items-center justify-center">
              <Link to={AppLinks.Home}>
                <AppTitle />
              </Link>
            </div>
            <div className="flex flex-col items-stretch gap-4">
              <FormTextField name="fullName" type="text" label="Name" />
              <FormTextField name="email" type="email" label="Email" />
              <FormTextField name="password" label="Password" type="password" />
              <FormTextField
                name="passwordConfirmation"
                label="Re-Enter Password"
                type="password"
              />
              {hasFormError(actionData) && (
                <InlineAlert>{actionData.formError}</InlineAlert>
              )}
            </div>
            <div className="flex w-full flex-col items-stretch gap-4 py-6">
              <PrimaryButton type="submit" disabled={isProcessing}>
                {isProcessing ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>
              <SecondaryButtonLink to={AppLinks.Login}>
                Already Have An Account
              </SecondaryButtonLink>
            </div>
          </ActionContextProvider>
        </Form>
        <div className="grow" />
      </div>
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
