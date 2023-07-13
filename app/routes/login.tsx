import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';

import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { z } from 'zod';

import { ActionContextProvider } from '~/components/ActionContextProvider';
import { AppTitle } from '~/components/AppTitle';
import { RouteErrorBoundary } from '~/components/Boundaries';
import { Footer } from '~/components/Footer';
import { FormTextField } from '~/components/FormTextField';
import { InlineAlert } from '~/components/InlineAlert';
import { PrimaryButton } from '~/components/PrimaryButton';
import { SecondaryButtonLink } from '~/components/SecondaryButton';
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
  return { title: `${PRODUCT_NAME} - Login` };
};

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect('/');
  }

  const { redirectTo } = getQueryParams(request.url, ['redirectTo']);
  return json({ redirectTo });
}

const Schema = z.object({
  email: EmailSchema,
  password: z.string().min(1),
  redirectTo: z.string(),
});

export async function action({ request }: ActionArgs) {
  const fields = await getRawFormFields(request);
  const result = Schema.safeParse(fields);
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
  const { redirectTo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  const isProcessing = navigation.state !== 'idle';

  return (
    <div className="flex h-full flex-col items-stretch justify-center">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="grow" />
        <Form
          method="post"
          className="flex w-full flex-col items-stretch justify-center gap-12 p-4 md:w-[80%] lg:w-[40%]"
        >
          <ActionContextProvider {...actionData} isSubmitting={isProcessing}>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="flex flex-col items-center justify-center">
              <Link to={AppLinks.Home}>
                <AppTitle title={PRODUCT_NAME} />
              </Link>
            </div>
            <div className="flex flex-col items-stretch gap-4">
              <FormTextField name="email" type="email" label="Email Address" />
              <FormTextField name="password" label="Password" type="password" />
              {hasFormError(actionData) && (
                <InlineAlert>{actionData.formError}</InlineAlert>
              )}
            </div>
            <div className="flex flex-col items-stretch gap-4">
              <PrimaryButton type="submit" disabled={isProcessing}>
                {isProcessing ? 'Logging In...' : 'Log In'}
              </PrimaryButton>
              <SecondaryButtonLink to={AppLinks.Join} type="button">
                Don't Have An Account
              </SecondaryButtonLink>
            </div>
          </ActionContextProvider>
        </Form>
        <div className="grow" />
      </div>
      <Footer appTitle={PRODUCT_NAME} />
    </div>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
