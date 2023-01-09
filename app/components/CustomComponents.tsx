import { Card, useColorMode, VStack } from "@chakra-ui/react";
import { RouteCatchBoundary, RouteErrorBoundary } from "remix-chakra-reusables";
import { AppLinks } from "~/lib/links";

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

interface CustomCardProps {
  children: React.ReactNode;
}
export function CustomCard (props: CustomCardProps) {
  const { children } = props;
  const { colorMode } = useColorMode();

  return (
    <Card bgColor={colorMode === "light" ? "white" : undefined}>
      {children}
    </Card>
  )
}