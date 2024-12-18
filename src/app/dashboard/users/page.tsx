"use client";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
} from "@/src/lib/features/accounts/accountsClientsApi";
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import FormCreateUserDialog from "@/src/components/dialogs/formCreateUserDialog";
import AppBarWithDrawerComponent from "@/src/components/appBarWithDrawer";
import ToolbarComponent from "@/src/components/toolbar";
import AlertDialog from "@/src/components/dialogs/deleteAlertDialog";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";

export default function UsersPage() {
  const { data: clients, isLoading } = useGetClientsQuery();
  const [deleteClient] = useDeleteClientMutation();
  console.log(clients);
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectOne = (id: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((clientId) => clientId !== id)
        : [...prevSelected, id],
    );
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { handleAction: handleDeleteSelected } = useHandleSelected(
    deleteClient,
    "Выбранные заявки удалены",
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBarWithDrawerComponent />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
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
                    <AlertDialog
                      handleDelete={() =>
                        handleDeleteSelected(selected, setSelected)
                      }
                    />
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients?.map((client, index) => {
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
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
          {open && (
            <FormCreateUserDialog handleClose={handleClose} open={open} />
          )}
        </Box>
      </Box>
    </>
  );
}
