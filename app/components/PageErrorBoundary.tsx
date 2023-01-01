import { useNavigate } from "@remix-run/react";
import { CustomErrorBoundary } from "~/components/CustomErrorBoundary";

import { useCallback } from "react";

interface Props {
  error: Error;
}

export function PageErrorBoundary (props: Props) {
  const { error } = props;
  
  const navigate = useNavigate();

  const reload = useCallback(() => {
    navigate('.', { replace: true })
  }, [navigate]);
  
  return <CustomErrorBoundary reload={reload} error={error} />
}