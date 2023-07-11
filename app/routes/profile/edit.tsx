import type { LinksFunction, LoaderArgs } from '@remix-run/server-runtime';

import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import carouselUrl from 'react-gallery-carousel/dist/index.css';

import { RouteErrorBoundary } from '~/components/Boundaries';
import { ImageUploadSizeLimit } from '~/lib/post.server';
import { requireUser } from '~/session.server';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: carouselUrl }];
};

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);
  return json({ imageSizeLimit: ImageUploadSizeLimit });
}

export default function EditProfile() {
  useLoaderData<typeof loader>();
  return <div>cdcdc</div>;
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
