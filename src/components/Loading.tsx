import { Box, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function Loading({ children }: { children: ReactNode }) {
  const { status } = useSession();

  const LoadingSpinner = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        position: "absolute",
        top: 0,
        bottom: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
  return status === "loading" ? <LoadingSpinner /> : children;
}
