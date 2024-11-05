"use client";
import React from "react";
import { Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import { drawerWidth } from "@/src/const";
import { IAppBar } from "@/src/interfaces";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarComponent: React.FC<IAppBar> = ({ open, setOpen }) => {
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  return (
    <AppBar open={open} position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={[
            {
              marginRight: 5,
            },
            !!open && { display: "none" },
          ]}
        >
          <MenuIcon />
        </IconButton>
        <Avatar sx={{ mr: 2 }}>U</Avatar>
        <Typography variant="h6" noWrap>
          Welcome, John Doe
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default AppBarComponent;
