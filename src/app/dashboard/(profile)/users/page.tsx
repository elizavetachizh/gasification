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
  FormControl,
  IconButton,
  InputLabel,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import FormCreateUserDialog from "@/src/components/dialogs/formCreateUserDialog";
import ToolbarComponent from "@/src/components/toolbar";
import AlertDialog from "@/src/components/dialogs/deleteAlertDialog";
import MenuItem from "@mui/material/MenuItem";
import BlockUserDialog from "@/src/components/dialogs/blockUserDialog";
import ResendUserEmailDialog from "@/src/components/dialogs/resendUserEmailDialog";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";
import TablePaginationComponent from "@/src/components/table/tableWithPagination/pagination";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";
import MenuComponent from "@/src/components/menu";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(5);
  const [is_active, setIsActive] = useState<string | undefined>("");
  const [ordering, setOrdering] = useState("");
  const [open, setOpen] = useState(false);
  const [openBlockUserDialog, setOpenBlockUserDialog] = useState<string>("");
  const [openResendEmailClientDialog, setOpenResendEmailClientDialog] =
    useState<null | number>(null);

  const { data: clients, isLoading } = useGetClientsQuery({
    search,
    page,
    page_size,
    is_active,
    ordering,
  });
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { handleAction: handleDeleteSelected } =
    useHandleSelected(deleteClient);

  const handleResendEmailClient = async (id: number) => {
    await resendEmailClient(id).unwrap();
    setOpenResendEmailClientDialog(null);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    setIsActive(selectedValue);
  };

  const createSortHandler = (property: string) => {
    setOrdering((prevOrdering) => {
      if (prevOrdering === property) return `-${property}`; // Было "name" → станет "-name"
      if (prevOrdering === `-${property}`) return ""; // Было "-name" → станет ""
      return property; // Было "" или другое поле → станет "name"
    });
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
          {!!selected.length ? (
            <ToolbarComponent
              length={selected.length}
              content={
                <AlertDialog
                  isLoadingDelete={isLoadingDelete}
                  dataTypeToDelete={"users"}
                  handleDelete={async () => {
                    await handleDeleteSelected(selected, setSelected);
                  }}
                />
              }
            />
          ) : (
            <Toolbar
              sx={[
                {
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                },
              ]}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flex: "1 1 100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <SearchIcon sx={{ color: "action.active" }} />
                  <TextField
                    sx={{ minWidth: "250px", mr: 3 }}
                    id="standard-search"
                    label="Поиск пользователя по имени"
                    type="search"
                    value={search}
                    size={"small"}
                    onChange={(event) => setSearch(event.target.value)}
                    variant="standard"
                  />
                </Box>
                <FormControl variant="standard" sx={{ minWidth: "250px" }}>
                  <InputLabel id="demo-simple-select-label">
                    Статус пользователя
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={is_active}
                    label="Статус пользователя"
                    onChange={handleChange}
                  >
                    <MenuItem value={""}>
                      <em>Выберите статус пользователя</em>
                    </MenuItem>
                    <MenuItem value={"true"}>Активный</MenuItem>
                    <MenuItem value={"false"}>Заблокирован</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <Tooltip title="Добавить нового пользователя">
                <IconButton onClick={handleClickOpen}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          )}

          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>№</TableCell>
                  <TableCell
                    sortDirection={ordering === "-name" ? "desc" : "asc"}
                  >
                    <TableSortLabel
                      active={ordering === "name" || ordering === "-name"}
                      direction={ordering === "-name" ? "desc" : "asc"}
                      onClick={() => createSortHandler("name")}
                    >
                      Имя
                      <Box component="span" sx={visuallyHidden}>
                        {ordering === "name"
                          ? "сортировка по возрастанию"
                          : "сортировка по убыванию"}
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={ordering === "-email" ? "desc" : "asc"}
                  >
                    <TableSortLabel
                      active={ordering === "email" || ordering === "-email"}
                      direction={ordering === "-email" ? "desc" : "asc"}
                      onClick={() => createSortHandler("email")}
                    >
                      email
                      <Box component="span" sx={visuallyHidden}>
                        {ordering === "email"
                          ? "сортировка по возрастанию"
                          : "сортировка по убыванию"}
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Последний вход</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {clients?.result?.map((client, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const numberRow = page > 1 ? (page - 1) * page_size + 1 : 1;
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

                      <TableCell>{index + numberRow}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        {client.is_active ? (
                          <Chip label="Активный" size="small" color="success" />
                        ) : (
                          <Chip
                            label={"Заблокирован"}
                            size="small"
                            color="error"
                          />
                        )}
                        {client?.is_approved === false && (
                          <Chip
                            sx={{ ml: 2 }}
                            size="small"
                            label="Не подтвержден"
                          />
                        )}
                      </TableCell>
                      <TableCell>{client?.last_login}</TableCell>
                      <TableCell>
                        <div>
                          <MenuComponent
                            id={client.id}
                            setOpenBlockUserDialogAction={
                              setOpenBlockUserDialog
                            }
                            setOpenResendEmailClientDialogAction={
                              setOpenResendEmailClientDialog
                            }
                            is_active={client.is_active}
                            is_approved={client.is_approved}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePaginationComponent
            count={clients?.count}
            page_size={page_size}
            page={page}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </Paper>
      )}
      {open && <FormCreateUserDialog handleClose={handleClose} open={open} />}
      {openBlockUserDialog && (
        <BlockUserDialog
          open={openBlockUserDialog}
          setOpen={setOpenBlockUserDialog}
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
