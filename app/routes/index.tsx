import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Footer, StatusCode } from "remix-chakra-reusables";
import { Toolbar } from "~/components/Toolbar";
import { PRODUCT_NAME } from "~/lib/constants";

import { useOptionalUser } from "~/utils";

export async function loader ({ request }: LoaderArgs) {
  const developerLink = process.env.DEVELOPER_WEBSITE_LINK;
  if (!developerLink) {
    throw new Response("Developer website link is missing", { status: StatusCode.NotFound });
  }

  return json({ developerLink });
}

export default function Index () {
  const user = useOptionalUser();
  const { developerLink } = useLoaderData<typeof loader>();

  return (
    <VStack align="stretch" minH="100vh">
      <Toolbar currentUserName={user?.fullName || ""} />
      <VStack align="stretch" flexGrow={1} py={8}>
        
      </VStack>
      <Footer
        appTitle={PRODUCT_NAME}
        developerName={"Allan Simoyi"}
        developerLink={developerLink}
      />
    </VStack>
  );
}
