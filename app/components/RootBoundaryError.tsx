import { AppLinks } from "~/lib/links"

interface Props {
  error: Error
}

export function RootBoundaryError ({ error }: Props) {

  return (
    <div className="shadow-md rounded-lg p-6 space-y-2">
      <h1 className="text-xl font-bold">
        {error.message ? error.message : "Something went wrong"}
      </h1>
      <p>
        This is a technical issue at our end. We're already working on fixing it. <br />
        Please try reloading the page. <br />
        If the issue pesists, <a className="underline" href={AppLinks.CustomerCare}>contact Customer Care</a>.
      </p>
    </div>
  )
}