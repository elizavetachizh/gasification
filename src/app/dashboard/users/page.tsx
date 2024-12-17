"use client";
import { useGetClientsQuery } from "@/src/lib/features/accounts/accountsClientsApi";
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

export default function UsersPage() {
  const { data: clients, isLoading } = useGetClientsQuery();
  console.log(clients);
  const [selected, setSelected] = useState<number>(0);

  const handleSelect = (id: number) => {
    setSelected(id);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              <Toolbar
                sx={[
                  {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                  },
                ]}
              >
                <Typography
                  sx={{ flex: "1 1 100%" }}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Nutrition
                </Typography>

                <Tooltip title="Добавить нового пользователя">
                  <IconButton onClick={handleClickOpen}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
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
                          selected={selected === client.id}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={selected === client.id}
                              onChange={() => handleSelect(client.id)}
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
