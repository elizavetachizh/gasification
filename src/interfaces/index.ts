import React from "react";

export interface IAppBar {
    open?: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    is_staff?: boolean;
}