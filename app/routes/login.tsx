import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';

import { useToast } from '@chakra-ui/react';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { useEffect } from 'react';
import { z } from 'zod';

import { ActionContextProvider } from '~/components/ActionContextProvider';
import { RouteErrorBoundary } from '~/components/Boundaries';
import { Card } from '~/components/Card';
import { FormTextField } from '~/components/FormTextField';
import { InlineAlert } from '~/components/InlineAlert';
import { PrimaryButton, PrimaryButtonLink } from '~/components/PrimaryButton';
import { SecondaryButtonLink } from '~/components/SecondaryButton';
import { ToggleColorMode } from '~/components/ToggleColorMode';
import { EmailSchema } from '~/lib/auth.validations';
import { PRODUCT_NAME } from '~/lib/constants';
import {
  badRequest,
  getQueryParams,
  processBadRequest,
} from '~/lib/core.validations';
import { getRawFormFields, hasFormError } from '~/lib/forms';
import { AppLinks } from '~/lib/links';
import { verifyLogin } from '~/lib/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect } from '~/utils';

export const meta: MetaFunction = () => {
  return {
    title: `${PRODUCT_NAME} - Login`,
  };
};

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect('/');
  }

  const { message, redirectTo } = getQueryParams(request.url, [
    'message',
    'redirectTo',
  ]);
  return json({ message: message?.replace(/_/g, ' '), redirectTo });
}

const Schema = z.object({
  email: EmailSchema,
  password: z.string().min(1),
  redirectTo: z.string(),
});

export async function action({ request }: ActionArgs) {
  const fields = await getRawFormFields(request);
  const result = await Schema.safeParseAsync(fields);
  if (!result.success) {
    return processBadRequest(result.error, fields);
  }
  const { email, password } = result.data;

  const user = await verifyLogin(email, password);
  if (!user) {
    return badRequest({ fields, formError: `Incorrect credentials` });
  }

  const redirectTo = safeRedirect(fields.redirectTo, '/');
  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo,
  });
}

export default function LoginPage() {
  const { message, redirectTo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const toast = useToast();

  const isProcessing = navigation.state !== 'idle';

  useEffect(() => {
    if (message) {
      toast({ title: message, status: 'error', isClosable: true });
    }
  }, [toast, message]);

  return (
    <div className="flex min-h-full flex-col items-stretch">
      <div className="flex flex-row items-center p-4">
        <PrimaryButtonLink to={AppLinks.Home}>To Home Page</PrimaryButtonLink>
        <div className="grow" />
        <ToggleColorMode aria-label="Toggle Dark Mode" />
      </div>
      <div className="flex grow flex-col items-center justify-center py-8">
        <div className="flex w-full flex-col items-stretch justify-center gap-12 p-4 md:w-[80%] lg:w-[40%]">
          <Form method="post">
            <ActionContextProvider {...actionData} isSubmitting={isProcessing}>
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <Card>
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-lg font-semibold">
                    ShutterBugs - Log In
                  </h1>
                </div>
                <div className="flex flex-col items-stretch gap-4">
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
                  {hasFormError(actionData) && (
                    <InlineAlert>{actionData.formError}</InlineAlert>
                  )}
                </div>
                <div className="flex w-full flex-col items-stretch gap-4">
                  <PrimaryButton type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Logging In...' : 'Log In'}
                  </PrimaryButton>
                  <SecondaryButtonLink to={AppLinks.Join} type="button">
                    Don't Have An Account
                  </SecondaryButtonLink>
                </div>
              </Card>
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
