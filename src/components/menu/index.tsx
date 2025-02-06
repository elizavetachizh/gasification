"use client";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";

export default function MenuComponent({
  is_approved,
  is_active,
  id,
  setOpenBlockUserDialogAction,
  setOpenResendEmailClientDialogAction,
}: {
  is_approved: boolean | undefined;
  is_active: string | undefined;
  id: number;
  setOpenBlockUserDialogAction: React.Dispatch<React.SetStateAction<string>>;
  setOpenResendEmailClientDialogAction: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}) {
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={openMenu ? "long-menu" : undefined}
        aria-expanded={openMenu ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={openMenu}
        open={Boolean(openMenu)}
        onClose={() => setOpenMenu(null)}
      >
        {!is_approved && (
          <MenuItem onClick={() => setOpenResendEmailClientDialogAction(id)}>
            Повторная отправка письма для регистрации
          </MenuItem>
        )}

        <MenuItem
          onClick={() =>
            setOpenBlockUserDialogAction(
              is_active ? `${id}-block` : `${id}-unblock`,
            )
          }
        >
          {is_active ? "Заблокировать" : "Разблокировать"}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
