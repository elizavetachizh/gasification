"use client";
import React from "react";
import { Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import { drawerWidth } from "@/src/const";
import { IAppBar } from "@/src/interfaces";
import {
  accountsApi,
  useGetUserQuery,
} from "@/src/lib/features/accounts/accountsApi";
import { RootState } from "@/src/lib/store";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeModeContext } from "@/src/context/theme";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { resetState } from "@/src/lib/slices/authSlice";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarComponent: React.FC<IAppBar> = ({ open, setOpen }) => {
  const accessToken = useAppSelector(
    (state: RootState) => state.auth.accessToken,
  );
  const { data: userData } = useGetUserQuery(undefined, { skip: !accessToken });

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

  // Кнопка переключения темы
  const ThemeToggleButton: React.FC = () => {
    const { toggleTheme, mode } = useThemeModeContext();
    return (
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>
    );
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Сбрасываем состояние
    console.log("ffff");
    dispatch(resetState());
    localStorage.removeItem("refreshToken");
    // Очищаем кэш запросов API
    dispatch(accountsApi.util.resetApiState());
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
        <Avatar sx={{ mr: 2 }} onClick={handleMenu}>
          U
        </Avatar>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <Typography sx={{ textAlign: "center" }}>
              Подразделение: СЗ
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ textAlign: "center" }}>
              Табельный номер: 10858
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ textAlign: "center" }}>
              Email: johndoe@example.com
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ textAlign: "center" }}>
              Контактный телефон: +375444640092
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ textAlign: "center" }}>
              ФИО: Иванов Иван Иванович
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Выйти</MenuItem>
        </Menu>
        <Typography variant="h6" noWrap>
          {userData?.name}
        </Typography>
        <div>
          <ThemeToggleButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default AppBarComponent;
