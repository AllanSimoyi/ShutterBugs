import { Card, useColorMode } from "@chakra-ui/react";
import { RouteCatchBoundary, RouteErrorBoundary } from "remix-chakra-reusables"
import { AppLinks } from "~/lib/links"

export function CustomCatchBoundary () {
  return (
    <RouteCatchBoundary
      customerCareLink={AppLinks.CustomerCare}
      loginLink={AppLinks.Login}
    />
  )
}

export function CustomErrorBoundary ({ error }: { error: Error }) {
  return (
    <RouteErrorBoundary
      error={error}
      customerCareLink={AppLinks.CustomerCare}
    />
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