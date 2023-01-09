import { Button, CardBody, CardFooter, CardHeader, Center, Heading, HStack, Spacer, VStack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import type { CustomActionData} from "remix-chakra-reusables";
import { ActionContextProvider, badRequest, CustomAlert, FullNameSchema, getRawFormFields, PrimaryButton, processBadRequest, TextField, ToggleColorMode } from "remix-chakra-reusables";
import { z } from "zod";
import { CustomCard, CustomCatchBoundary, CustomErrorBoundary } from "~/components/CustomComponents";
import { EmailSchema, PasswordSchema } from "~/lib/auth.validations";
import { PRODUCT_NAME } from "~/lib/constants";
import { AppLinks } from "~/lib/links";
import { createUser, getUserByEmail } from "~/lib/user.server";
import { createUserSession, getUserId } from "~/session.server";

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
    path: ["passwordConfirmation"],
  });

export async function loader ({ request }: LoaderArgs) {
  const currentUserId = await getUserId(request);
  if (currentUserId) {
    return redirect("/");
  }
  return json({});
}

export async function action ({ request }: ActionArgs) {
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
      fieldErrors: { email: ["A user already exists with this email"] },
      formError: undefined,
    });
  }

  const user = await createUser({ email, fullName, password, picId: "" });
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: "/",
  });
}

export default function CreateAccount () {
  const actionData = useActionData<CustomActionData<typeof Schema>>();
  const transition = useTransition();

  const isProcessing = transition.state === "submitting" ||
    transition.state === "loading";

  return (
    <VStack align="stretch" minH="100vh">
      <HStack p={4}>
        <Spacer />
        <ToggleColorMode aria-label="Toggle Dark Mode" />
      </HStack>
      <VStack justify="center" align="stretch" flexGrow={1} py={8}>
        <Center>
          <VStack justify={"center"} align="stretch" p={4} w={["100%", "80%", "40%"]}>
            <Form method="post">
              <ActionContextProvider {...actionData} isSubmitting={isProcessing}>
                <VStack align="stretch" spacing={6}>
                  <CustomCard>
                    <CardHeader>
                      <VStack justify="center" align="center">
                        <Heading size='md'>
                          ShutterBugs - Create Account
                        </Heading>
                      </VStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <TextField
                          name="fullName"
                          type="text"
                          label="Full Name"
                        />
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
                        <TextField
                          name="passwordConfirmation"
                          label="Re-Enter Password"
                          type="password"
                        />
                        {actionData?.formError && (
                          <CustomAlert status={"error"}>
                            {actionData.formError}
                          </CustomAlert>
                        )}
                      </VStack>
                    </CardBody>
                    <CardFooter>
                      <VStack w="100%" align="stretch" spacing={4}>
                        <PrimaryButton type="submit" isDisabled={isProcessing}>
                          {isProcessing ? "Creating Account..." : "Create Account"}
                        </PrimaryButton>
                        <Button
                          as={Link}
                          prefetch="render"
                          to={AppLinks.Login}
                          type="button"
                          fontSize="sm"
                          variant="outline"
                          isDisabled={isProcessing}
                          w="100%"
                        >
                          {"Already Have An Account"}
                        </Button>
                      </VStack>
                    </CardFooter>
                  </CustomCard>
                </VStack>
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