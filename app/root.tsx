import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';

import { Cloudinary } from '@cloudinary/url-gen';
import { json } from '@remix-run/node'; // Depends on the runtime you choose
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useMemo } from 'react';

import { CloudinaryContextProvider } from './components/CloudinaryContextProvider';
import { PRODUCT_NAME } from './lib/constants';
import { Env } from './lib/environment';
import { AppLinks } from './lib/links';
import { getUser } from './session.server';
import customStylesUrl from './styles/custom.css';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const meta: MetaFunction = () => {
  const description = 'Organize, group, collaborate, share, great photography';
  return {
    charset: 'utf-8',
    title: PRODUCT_NAME,
    description,
    keywords: 'Pictures, Photographers, Zimbabwe, Camera, Art, Aesthetic',
    viewport: 'width=device-width,initial-scale=1',
    'twitter:image':
      'https://res.cloudinary.com/df5xcjry9/image/upload/v1673178596/shutter_bugs_photo_daupcl.jpg',
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@simoyi_allan',
    'twitter:site': '@simoyi_allan',
    'twitter:title': PRODUCT_NAME,
    'twitter:description': description,
  };
};

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600;700&display=swap',
    },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    { rel: 'stylesheet', href: customStylesUrl },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  const CLOUD_NAME = Env.CLOUDINARY_CLOUD_NAME;
  const UPLOAD_RESET = Env.CLOUDINARY_UPLOAD_RESET;

  return json({ user, CLOUD_NAME, UPLOAD_RESET });
}

export default function App() {
  const { CLOUD_NAME, UPLOAD_RESET } = useLoaderData<typeof loader>();

  const CloudinaryUtil = useMemo(() => {
    return new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });
  }, [CLOUD_NAME]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <CloudinaryContextProvider
          CLOUDINARY_CLOUD_NAME={CLOUD_NAME}
          CLOUDINARY_UPLOAD_RESET={UPLOAD_RESET}
          CloudinaryUtil={CloudinaryUtil}
        >
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </CloudinaryContextProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="space-y-2 rounded-lg p-6 shadow-md">
            <h1 className="text-xl font-bold">
              Error 500 - Internal Server Error
            </h1>
            <p>
              We encountered an unexpected error. We're already working on
              fixing it. <br />
              {error.message && (
                <div className="py-2 font-bold">
                  Detail: "{error.message}" <br />
                </div>
              )}
              Please try reloading the page. <br />
              If the issue pesists,{' '}
              <a
                className="text-blue-500 underline"
                href={AppLinks.CustomerCare}
              >
                contact Customer Care
              </a>
              .
            </p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
