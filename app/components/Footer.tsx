import { Link as ChakraLink, Spacer, Stack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { CenteredView } from "./CenteredView";

export function Footer () {
  return (
    <VStack align="stretch" bgColor={"blackAlpha.200"}>
      <CenteredView p={4}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 1, lg: 4 }}
          align="flex-start">
          <Text fontSize="sm" fontWeight="thin">
            Copyright © {dayjs().format("YYYY")} www.property267.com - All rights reserved.
          </Text>
          <Spacer />
          <Stack
            spacing={{ base: 1, lg: 4 }}
            align="flex-start"
            divider={<StackDivider borderColor={{ base: "transparent", lg: 'blackAlpha.400' }} />}
            direction={{ base: "column", lg: "row" }}
          >
            <Link to="/terms-and-conditions">
              <ChakraLink fontSize="sm" color="red.600">
                Terms and Conditions
              </ChakraLink>
            </Link>
            <Link to="/privacy-policy">
              <ChakraLink fontSize="sm" color="red.600">
                Privacy Policy
              </ChakraLink>
            </Link>
          </Stack>
        </Stack>
      </CenteredView>
    </VStack>
  )
}