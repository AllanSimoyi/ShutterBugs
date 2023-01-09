import type { CardProps, StackProps } from "@chakra-ui/react";
import { Card, HStack, useColorMode, VStack } from "@chakra-ui/react";
import { RouteCatchBoundary, RouteErrorBoundary } from "remix-chakra-reusables";
import { AppLinks } from "~/lib/links";

interface FeedCenteredViewProps extends StackProps {
  children: React.ReactNode;
}

export function FeedCenteredView (props: FeedCenteredViewProps) {
  const { children, ...restOfProps } = props
  return (
    <>
      <HStack justify="center" align="stretch" {...restOfProps}>
        <VStack align="stretch" w={{ base: "100%", md: "60%", lg: "40%" }}>
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