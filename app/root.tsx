// root.tsx
import { ChakraProvider, cookieStorageManagerSSR, localStorageManager, useColorMode, VStack } from '@chakra-ui/react';
import { withEmotionCache } from '@emotion/react';
import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node'; // Depends on the runtime you choose
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import React, { useContext, useEffect } from 'react';
import { CloudinaryContextProvider, RootBoundaryError } from 'remix-chakra-reusables';
import { ClientStyleContext, ServerStyleContext } from './context';
import { PRODUCT_NAME } from './lib/constants';
import { AppLinks } from './lib/links';
import customStylesUrl from "./styles/custom.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import theme from './theme';

export const meta: MetaFunction = () => {
  const description = "Home of enthusiastic photographers";
  return {
    charset: 'utf-8',
    title: PRODUCT_NAME,
    description,
    keywords: "Pictures, Photographers, Zimbabwe, Camera, Art, Aesthetic",
    viewport: 'width=device-width,initial-scale=1',
    "twitter:image": "https://res.cloudinary.com/df5xcjry9/image/upload/v1673178596/shutter_bugs_photo_daupcl.jpg",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@simoyi_allan",
    "twitter:site": "@simoyi_allan",
    "twitter:title": PRODUCT_NAME,
    "twitter:description": description,
  }
};

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap'
    },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: customStylesUrl }
  ]
}

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en" className="h-full">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body className="min-h-full">
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export async function loader ({ request }: LoaderArgs) {
  // const user = await getUser(request);

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
  const UPLOAD_RESET = process.env.CLOUDINARY_UPLOAD_RESET || "";

  const cookies = request.headers.get("cookie") ?? '';

  return json({ CLOUD_NAME, UPLOAD_RESET, cookies });
}

function Bg ({ children }: { children: React.ReactNode; }) {
  const { colorMode } = useColorMode();
  return (
    <VStack
      align="stretch"
      minH="100vh"
      bgColor={colorMode === "light" ? "blackAlpha.100" : undefined}
    >
      {children}
    </VStack>
  )
}

export default function App () {
  const { CLOUD_NAME, UPLOAD_RESET, cookies } = useLoaderData<typeof loader>();

  return (
    <Document>
      <ChakraProvider
        theme={theme}
        colorModeManager={
          typeof cookies === 'string'
            ? cookieStorageManagerSSR(cookies)
            : localStorageManager
        }
      >
        <CloudinaryContextProvider CLOUDINARY_CLOUD_NAME={CLOUD_NAME} CLOUDINARY_UPLOAD_RESET={UPLOAD_RESET}>
          <Bg>
            <Outlet />
          </Bg>
        </CloudinaryContextProvider>
      </ChakraProvider>
    </Document>
  )
}

export function ErrorBoundary ({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>
          Oh no!
        </title>
        <Meta />
        <Links />
      </head>
      <body>
        <RootBoundaryError
          error={error}
          customerCareLink={AppLinks.CustomerCare}
        />
        <Scripts />
      </body>
    </html>
  );
}