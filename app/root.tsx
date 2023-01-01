// root.tsx
import { ChakraProvider } from '@chakra-ui/react';
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
import { CloudinaryContextProvider } from './components/CloudinaryContextProvider';
import { RootBoundaryError } from './components/RootBoundaryError';
import { ClientStyleContext, ServerStyleContext } from './context';
import { getUser } from "./session.server";
import customStylesUrl from "./styles/custom.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import theme from './theme';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Shutter',
  viewport: 'width=device-width,initial-scale=1',
});

export let links: LinksFunction = () => {
  return [
    // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    // { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      // rel: 'stylesheet',
      rel: 'preconnect',
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
  const user = await getUser(request);

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
  const UPLOAD_RESET = process.env.CLOUDINARY_UPLOAD_RESET || "";

  return json({ user, CLOUD_NAME, UPLOAD_RESET });
}

export default function App () {
  const { CLOUD_NAME, UPLOAD_RESET } = useLoaderData<typeof loader>();

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <CloudinaryContextProvider CLOUDINARY_CLOUD_NAME={CLOUD_NAME} CLOUDINARY_UPLOAD_RESET={UPLOAD_RESET}>
          <Outlet />
        </CloudinaryContextProvider>
      </ChakraProvider>
    </Document>
  )
}

export function ErrorBoundary ({ error }: { error: Error }) {
  console.error(error.message, error.stack);

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
        <RootBoundaryError error={error} />
        <Scripts />
      </body>
    </html>
  );
}