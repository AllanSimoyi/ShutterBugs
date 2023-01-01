import { HStack, Img } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import logo from "~/../public/images/logo.png";

export function AppTitle () {
  return (
    <Link to="/">
      <HStack align="center" spacing={2}>
        <Img height={"48px"} objectFit="contain" src={logo} alt="Property267" />
      </HStack>
    </Link>
  )
}