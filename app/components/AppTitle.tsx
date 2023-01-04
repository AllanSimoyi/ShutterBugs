import { Heading } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export function AppTitle () {
  return (
    <Link to="/">
      <Heading size="md">Shutter</Heading>
    </Link>
  )
}