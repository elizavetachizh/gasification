import AppBarProfile from "@/src/components/appBarProfile";
import { Box } from "@mui/material";
import WithAuth from "@/src/utils/withAuth";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box>
      <AppBarProfile />
      <WithAuth>{children}</WithAuth>
    </Box>
  );
}
