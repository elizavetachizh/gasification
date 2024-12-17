"use client";
import {
  alpha,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  OrderOriginal,
  useAgreedOrderMutation,
  useCanceledOrderMutation,
  useGetOrdersQuery,
  useRejectedOrderMutation,
} from "@/src/lib/features/orders/ordersApi";
import SplitButton from "@/src/components/tableWithPagination/buttonGroup";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import dayjs from "dayjs";
import { DateConversion, useDateConversion } from "@/src/utils/dateConversion";

export default function TableWithPagination() {
  const [status, setStatus] = useState("created");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrdersQuery(status, { skip: !accessToken });
  const [deleteOrder] = useCanceledOrderMutation();
  const [agreeOrder] = useAgreedOrderMutation();
  const [rejectOrder] = useRejectedOrderMutation();
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
  const { handleAction: handleDeleteSelected } = useHandleSelected(
    deleteOrder,
    "Выбранные заявки удалены",
  );
  const { handleAction: handleAgreeSelected } = useHandleSelected(
    agreeOrder,
    "Выбранные заявки приняты",
  );

  const handleRejectSelected = async () => {
    try {
      await Promise.all(selected.map((id) => rejectOrder(id).unwrap()));
      setSelected([]);
      alert("Выбранные заявки приняты");
    } catch (err) {
      console.error("Ошибка при удалении заявок:", err);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue);
  };

  const getOnDateForStatus = (
    statusHistory: OrderOriginal["status_history"],
  ) => {
    const statusEntry = statusHistory?.find(
      (entry) => entry.status === "on_confirm",
    );
    return statusEntry?.on_date || null;
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs value={status} onChange={handleChange} centered>
            <Tab value={"created"} label="Новые заявки" />
            <Tab value={"on_confirm"} label="Предложен перенос заявки" />
            <Tab value={"accepted"} label="Принятые заявки" />
          </Tabs>
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              {!!selected?.length && (
                <React.Fragment>
                  {status === "created" && (
                    <Toolbar
                      sx={[
                        {
                          pl: { sm: 2 },
                          pr: { xs: 1, sm: 1 },
                        },
                        selected.length > 0 && {
                          bgcolor: (theme) =>
                            alpha(
                              theme.palette.primary.main,
                              theme.palette.action.activatedOpacity,
                            ),
                        },
                      ]}
                    >
                      <Typography
                        sx={{ flex: "1 1 100%" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                      >
                        {selected.length} выбрано
                      </Typography>

                      <Tooltip title="Отменить заявку">
                        <IconButton>
                          <DeleteIcon
                            onClick={() =>
                              handleDeleteSelected(selected, setSelected)
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </Toolbar>
                  )}
                  {status === "on_confirm" && (
                    <SplitButton
                      onAgreeAction={handleAgreeSelected}
                      onRejectAction={handleRejectSelected}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                </React.Fragment>
              )}
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {status !== "accepted" && (
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
                      {status === "on_confirm" && (
                        <TableCell>Предлагаемая дата вызова</TableCell>
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
                          {status !== "accepted" && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={selected.includes(order.id)}
                                onChange={() => handleSelectOne(+order.id)}
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
                          {status === "on_confirm" && (
                            <TableCell>
                              {getOnDateForStatus(order.status_history) ||
                                "Нет данных"}
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
