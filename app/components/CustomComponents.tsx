import type { CardProps, StackProps } from "@chakra-ui/react";
import { Card, HStack, useColorMode, VStack } from "@chakra-ui/react";
import { RouteCatchBoundary, RouteErrorBoundary } from "remix-chakra-reusables";
import { AppLinks } from "~/lib/links";

export function CustomRootBoundaryError ({ error }: { error: Error }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="shadow-md rounded-lg p-6 space-y-2">
        <h1 className="text-xl font-bold">
          Error 500 - Internal Server Error
        </h1>
        <p>
          We encountered an unexpected error. We're already working on fixing it. <br />
          {error.message && (
            <div className="font-bold py-2">
              Detail: "{error.message}" <br />
            </div>
          )}
          Please try reloading the page. <br />
          If the issue pesists, <a className="underline text-blue-500" href={AppLinks.CustomerCare}>contact Customer Care</a>.
        </p>
      </div>
    </div>
  )
}

interface FeedCenteredViewProps extends StackProps {
  children: React.ReactNode;
}

export function FeedCenteredView (props: FeedCenteredViewProps) {
  const { children, ...restOfProps } = props
  return (
    <>
      <HStack justify="center" align="stretch" {...restOfProps}>
        <VStack align="stretch" w={{ base: "100%", md: "80%", lg: "60%" }}>
          {/* <VStack align="stretch" w={{ base: "100%", md: "60%", lg: "40%" }}> */}
          {children}
        </VStack>
      </HStack>
    </>
  )
}

export function CustomCatchBoundary () {
  return (
    <VStack justify="center" align="center" p={4}>
      <RouteCatchBoundary
        customerCareLink={AppLinks.CustomerCare}
        loginLink={AppLinks.Login}
      />
    </VStack>
  )
}

export function CustomErrorBoundary ({ error }: { error: Error }) {
  return (
    <VStack justify="center" align="center" p={4}>
      <RouteErrorBoundary
        error={error}
        customerCareLink={AppLinks.CustomerCare}
      />
    </VStack>
  )
}

interface CustomCardProps extends CardProps {
  children: React.ReactNode;
}
export function CustomCard (props: CustomCardProps) {
  const { children, ...restOfProps } = props;
  const { colorMode } = useColorMode();

  return (
    <Card
      bgColor={colorMode === "light" ? "white" : undefined}
      {...restOfProps}
    >
      {children}
    </Card>
  )
}