import { Box, CssBaseline } from "@mui/material";
import AppBarWithDrawerComponent from "../../components/appBarWithDrawer";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarWithDrawerComponent />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}
