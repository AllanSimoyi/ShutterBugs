import type { MetaFunction } from "@remix-run/node";

import { RootBoundaryError } from "~/components/RootBoundaryError";

export const meta: MetaFunction = () => {
  return {
    title: "Board",
  };
};

export default function LoginPage () {

  return (
    <div className="flex flex-col justify-center items-center p-8">
      <RootBoundaryError error={new Error("Something went wrong")} />
    </div>
  );
}
