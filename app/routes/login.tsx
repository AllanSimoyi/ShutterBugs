import { Button, CardBody, CardFooter, CardHeader, Center, Heading, HStack, Link as ChakraLink, Spacer, useToast, VStack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useSearchParams, useTransition } from "@remix-run/react";
import { useEffect } from "react";
import type { CustomActionData, Result} from "remix-chakra-reusables";
import { ActionContextProvider, badRequest, CustomAlert, formResultProps, getRawFormFields, PrimaryButton, processBadRequest, TextField, ToggleColorMode } from "remix-chakra-reusables";
import { z } from "zod";
import { CustomCard, CustomCatchBoundary, CustomErrorBoundary } from "~/components/CustomComponents";
import { EmailSchema } from "~/lib/auth.validations";
import { PRODUCT_NAME } from "~/lib/constants";
import { AppLinks } from "~/lib/links";
import { verifyLogin } from "~/lib/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const meta: MetaFunction = () => {
  return {
    title: `${PRODUCT_NAME} - Login`,
  };
};

export async function loader ({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }

  const url = new URL(request.url);
  const message = url.searchParams.get("message") || '';

  return json({
    message: message.replace(/_/g, " "),
  });
}

const Schema = z.object({
  email: EmailSchema,
  password: z.string().min(1),
  redirectTo: z.string(),
})

export async function action ({ request }: ActionArgs) {
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

  const redirectTo = safeRedirect(fields.redirectTo, "/");
  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo,
  });
}

type Ok = { success: true, postId: string };
type Err = CustomActionData<typeof Schema>;

export default function LoginPage () {
  const { message } = useLoaderData<typeof loader>();
  const actionData = useActionData<Result<Ok, Err>>();
  const transition = useTransition();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const isProcessing = transition.state === "submitting" ||
    transition.state === "loading";

  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (message) {
      toast({
        title: message,
        status: "error",
        isClosable: true,
      });
    }
  }, [toast, message]);

  return (
    <VStack align="stretch" minH="100vh">
      <HStack p={4}>
        <ChakraLink as={Link} to={AppLinks.Home} fontSize="md" fontWeight="bold">
          To Home Page
        </ChakraLink>
        <Spacer />
        <ToggleColorMode aria-label="Toggle Dark Mode" />
      </HStack>
      <VStack justify="center" align="stretch" flexGrow={1} py={8}>
        <Center>
          <VStack justify="center" align="stretch" w={["100%", "80%", "40%"]} spacing={12} p={4}>
            <Form method="post">
              <ActionContextProvider {...formResultProps(actionData)} isSubmitting={isProcessing}>
                <input
                  type="hidden"
                  name="redirectTo"
                  value={redirectTo}
                />
                <CustomCard>
                  <CardHeader>
                    <VStack justify="center" align="center">
                      <Heading size='md'>
                        ShutterBugs - Log In
                      </Heading>
                    </VStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <TextField
                        name="email"
                        type="email"
                        label="Email Address"
                      />
                      <TextField
                        name="password"
                        label="Password"
                        type="password"
                      />
                      {!actionData?.success && actionData?.err.formError && (
                        <CustomAlert status={"error"}>
                          {actionData?.err.formError}
                        </CustomAlert>
                      )}
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <VStack w="100%" align="stretch" spacing={4}>
                      <PrimaryButton type="submit" isDisabled={isProcessing}>
                        {isProcessing ? "Logging In..." : "Log In"}
                      </PrimaryButton>
                      <Button
                        as={Link}
                        prefetch="render"
                        to={AppLinks.Join}
                        type="button"
                        fontSize="sm"
                        variant="outline"
                        isDisabled={isProcessing}
                        w="100%"
                      >
                        {"Don't Have An Account"}
                      </Button>
                    </VStack>
                  </CardFooter>
                </CustomCard>
              </ActionContextProvider>
            </Form>
          </VStack>
        </Center>
      </VStack>
    </VStack>
  );
}

export function CatchBoundary () {
  return <CustomCatchBoundary />
}

export function ErrorBoundary ({ error }: { error: Error }) {
  return <CustomErrorBoundary error={error} />
}