import { Typography } from "@mui/material";
import { ReactNode } from "react";

export default function RestrictedPage({
  validAccess,
  children,
}: {
  validAccess: boolean;
  children: ReactNode;
}) {
  return validAccess ? children : <Typography className="text-center">Admin restricted page</Typography>;
}
