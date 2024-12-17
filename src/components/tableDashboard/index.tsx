"use client";
import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import {
  useAcceptedOrderMutation,
  useGetOrdersQuery,
  useOnConfirmedOrderMutation,
} from "@/src/lib/features/orders/ordersApi";
import Button from "@mui/material/Button";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import FormDialog from "@/src/components/dialogs/formDialog";
import { DateConversion } from "@/src/utils/dateConversion";

export default function TableDashboard() {
  const [status, setStatus] = useState("created");
  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrdersQuery(status);
  const [acceptOrder] = useAcceptedOrderMutation();
  const [confirmOrder] = useOnConfirmedOrderMutation();
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && orders) {
      setSelected(orders.map((order) => order.id));
    } else {
      setSelected([]);
    }
  };
  const handleSelectOne = (id: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((orderId) => orderId !== id)
        : [...prevSelected, id],
    );
  };

  const { handleAction: handleAcceptSelected } = useHandleSelected(
    acceptOrder,
    "Выбранные заявки приняты",
  );

  const handleConfirmSelected = async () => {
    try {
      await Promise.all(
        selected.map((id) => confirmOrder({ id, on_date: date }).unwrap()),
      );
      setSelected([]);
    } catch (err) {
      console.error("Ошибка при удалении заявок:", err);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue);
  };

  const showOrdersCount = useCallback(
    (selectedStatus: string) => {
      return selectedStatus === status ? `(${orders?.length})` : "";
    },
    [orders?.length, status],
  );

  return (
    <React.Fragment>
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs value={status} onChange={handleChange} centered>
            <Tab
              value={"created"}
              label={`Новые заявки ${showOrdersCount("created")}`}
            />
            <Tab
              value={"on_confirm"}
              label={`Заявки на согласовании ${showOrdersCount("on_confirm")}`}
            />
            <Tab
              value={"accepted"}
              label={`Принятые заявки ${showOrdersCount("accepted")}`}
            />
          </Tabs>
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              {!!selected?.length && status === "created" && (
                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAcceptSelected(selected, setSelected)}
                  >
                    Принять
                  </Button>

                  <FormDialog
                    date={date}
                    setDateAction={setDate}
                    handleConfirmSelectedAction={handleConfirmSelected}
                  />
                </Grid>
              )}
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {status === "created" && (
                        <TableCell>
                          <Checkbox
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < orders?.length
                            }
                            checked={
                              orders?.length > 0 &&
                              selected.length === orders?.length
                            }
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                      )}
                      <TableCell>№</TableCell>
                      <TableCell>Дата подачи</TableCell>
                      <TableCell>Дата вызова представителя</TableCell>
                      {status === "accepted" && (
                        <TableCell>Соглавсованная дата</TableCell>
                      )}
                      <TableCell>ФИО заявителя</TableCell>
                      <TableCell>Код объекта</TableCell>
                      <TableCell>Вид производимых работ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders?.map((order, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          key={order.id}
                          hover
                          tabIndex={-1}
                          selected={selected.includes(order.id)}
                        >
                          {status === "created" && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={selected.includes(order.id)}
                                onChange={() => handleSelectOne(order.id)}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                          )}
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {DateConversion(order.created_at)}
                          </TableCell>
                          <TableCell>
                            {DateConversion(order.selected_date)}
                          </TableCell>
                          {status === "accepted" && (
                            <TableCell>
                              {order?.on_date
                                ? DateConversion(order?.on_date)
                                : ""}
                            </TableCell>
                          )}
                          <TableCell>{order.applicant}</TableCell>
                          <TableCell>
                            {order.construction_object?.code}
                          </TableCell>
                          <TableCell>{order.order_type?.order_type}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </React.Fragment>
  );
}
