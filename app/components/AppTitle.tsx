import { Heading } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export function AppTitle () {
  return (
    <Link to="/">
      <Heading>Shutter</Heading>
    </Link>
  )
}