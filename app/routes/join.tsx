import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';

import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { z } from 'zod';

import { ActionContextProvider } from '~/components/ActionContextProvider';
import { RouteErrorBoundary } from '~/components/Boundaries';
import { Card } from '~/components/Card';
import { FormTextField } from '~/components/FormTextField';
import { InlineAlert } from '~/components/InlineAlert';
import { PrimaryButton, PrimaryButtonLink } from '~/components/PrimaryButton';
import { SecondaryButtonLink } from '~/components/SecondaryButton';
import { ToggleColorMode } from '~/components/ToggleColorMode';
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
  return {
    title: `${PRODUCT_NAME} - Create Account`,
  };
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
  const result = await Schema.safeParseAsync(fields);
  if (!result.success) {
    return processBadRequest(result.error, fields);
  }
  const { email, fullName, password } = result.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return badRequest({
      fields,
      fieldErrors: { email: ['A user already exists with this email'] },
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
    <div className="flex min-h-full flex-col items-stretch">
      <div className="flex flex-row items-center p-4">
        <PrimaryButtonLink to={AppLinks.Home} className="font-semibold">
          To Home Page
        </PrimaryButtonLink>
        <div className="grow" />
        <ToggleColorMode aria-label="Toggle Dark Mode" />
      </div>
      <div className="flex grow flex-col items-center justify-center py-8">
        <div className="lg:[40%] flex w-full flex-col items-stretch justify-center p-4 md:w-[80%]">
          <Form method="post">
            <ActionContextProvider {...actionData} isSubmitting={isProcessing}>
              <div className="flex flex-col items-stretch gap-6">
                <Card>
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-lg font-semibold">
                      ShutterBugs - Create Account
                    </h1>
                  </div>
                  <div className="flex flex-col items-stretch gap-4">
                    <FormTextField
                      name="fullName"
                      type="text"
                      label="Full Name"
                    />
                    <FormTextField
                      name="email"
                      type="email"
                      label="Email Address"
                    />
                    <FormTextField
                      name="password"
                      label="Password"
                      type="password"
                    />
                    <FormTextField
                      name="passwordConfirmation"
                      label="Re-Enter Password"
                      type="password"
                    />
                    {hasFormError(actionData) && (
                      <InlineAlert>{actionData.formError}</InlineAlert>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-stretch gap-4">
                    <PrimaryButton type="submit" disabled={isProcessing}>
                      {isProcessing ? 'Creating Account...' : 'Create Account'}
                    </PrimaryButton>
                    <SecondaryButtonLink to={AppLinks.Login} className="w-full">
                      Already Have An Account
                    </SecondaryButtonLink>
                  </div>
                </Card>
              </div>
            </ActionContextProvider>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
