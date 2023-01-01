import { useCatch, useNavigate } from "@remix-run/react";
import { CustomCatchBoundary } from "~/components/CustomCatchBoundary";

import { useCallback } from "react";

export function PageCatchBoundary () {
  const caught = useCatch();
  const navigate = useNavigate();
  
  const reload = useCallback(() => {
    navigate('.', { replace: true })
  }, [navigate]);

  return <CustomCatchBoundary
    reload={reload}
    caught={caught}
  />
}