import { ReactNode } from "react";

export default function RestrictedPage({
  validAccess,
  children,
}: {
  validAccess: boolean;
  children: ReactNode;
}) {
  return children;
  //   return validAccess ? children : <>Admin restricted page</>;
}
