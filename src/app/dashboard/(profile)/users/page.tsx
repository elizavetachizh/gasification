"use client";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  useResendEmailClientMutation,
} from "@/src/lib/features/accounts/accountsClientsApi";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import FormCreateUserDialog from "@/src/components/dialogs/formCreateUserDialog";
import ToolbarComponent from "@/src/components/toolbar";
import AlertDialog from "@/src/components/dialogs/deleteAlertDialog";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import BlockUserDialog from "@/src/components/dialogs/blockUserDialog";
import ResendUserEmailDialog from "@/src/components/dialogs/resendUserEmailDialog";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

export default function UsersPage() {
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
  const [openBlockUserDialog, setOpenBlockUserDialog] = useState<
    null | number | boolean
  >(null);
  const [openResendEmailClientDialog, setOpenResendEmailClientDialog] =
    useState<null | number>(null);
  const { data: clients, isLoading } = useGetClientsQuery();
  const [
    deleteClient,
    { isLoading: isLoadingDelete, isSuccess, error: errorDelete },
  ] = useDeleteClientMutation();
  const [
    resendEmailClient,
    { error: errorResendEmailClient, isSuccess: isSuccessResendEmailClient },
  ] = useResendEmailClientMutation();
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectOne = (id: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((clientId) => clientId !== id)
        : [...prevSelected, id],
    );
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { handleAction: handleDeleteSelected } =
    useHandleSelected(deleteClient);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };
  const handleOpenBlockUserDialog = (id: number) => {
    setOpenBlockUserDialog(id);
  };

  const handleResendEmailClient = async (id: number) => {
    await resendEmailClient(id).unwrap();
    setOpenResendEmailClientDialog(null);
  };

  return (
    <>
      {isSuccessResendEmailClient && (
        <SuccessAlertComponent
          message={
            "Пользователю было выслано повторное письмо с паролем на указанный email."
          }
          isInitialOpen={isSuccessResendEmailClient}
        />
      )}
      {isSuccess && (
        <SuccessAlertComponent
          message={"Пользователь успешно был заблокирован."}
          isInitialOpen={isSuccess}
        />
      )}
      {errorResendEmailClient && (
        <ErrorAlertComponent
          message={`Ошибка при создании пользователя`}
          isInitialOpen={!!errorResendEmailClient}
        />
      )}
      {errorDelete && (
        <ErrorAlertComponent
          message={`Ошибка при удалении пользователя`}
          isInitialOpen={!!errorDelete}
        />
      )}
      <Typography variant="h4" gutterBottom>
        Список пользователей
      </Typography>
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", mb: 2 }}>
          <ToolbarComponent
            length={selected.length}
            content={
              !!selected.length ? (
                <React.Fragment>
                  <AlertDialog
                    isLoadingDelete={isLoadingDelete}
                    dataTypeToDelete={"users"}
                    handleDelete={async () => {
                      await handleDeleteSelected(selected, setSelected);
                    }}
                  />
                </React.Fragment>
              ) : (
                <Tooltip title="Добавить нового пользователя">
                  <IconButton onClick={handleClickOpen}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )
            }
          />

          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>№</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>email</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {clients?.result?.map((client, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      key={client.id}
                      hover
                      tabIndex={-1}
                      selected={selected.includes(client.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selected.includes(client.id)}
                          onChange={() => handleSelectOne(client.id)}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        {client?.is_approved === false ? (
                          <Chip label="Chip Filled" />
                        ) : client.is_active ? (
                          <Chip label="Активный" color="success" />
                        ) : (
                          <Chip label={"Заблокирован"} color="error" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
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
                            <MenuItem
                              onClick={() =>
                                setOpenResendEmailClientDialog(client.id)
                              }
                            >
                              Отправить письмо для подтверждения регистрации
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleOpenBlockUserDialog(client.id)
                              }
                            >
                              Заблокировать
                            </MenuItem>
                          </Menu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {open && <FormCreateUserDialog handleClose={handleClose} open={open} />}
      {openBlockUserDialog && (
        <BlockUserDialog
          open={!!openBlockUserDialog}
          setOpen={setOpenBlockUserDialog}
          handleDelete={async () => {
            await handleDeleteSelected(selected, setSelected);
          }}
        />
      )}
      {openResendEmailClientDialog && (
        <ResendUserEmailDialog
          handleResendUserEmail={() =>
            handleResendEmailClient(openResendEmailClientDialog)
          }
          open={!!openResendEmailClientDialog}
          setOpen={setOpenResendEmailClientDialog}
        />
      )}
    </>
  );
}
