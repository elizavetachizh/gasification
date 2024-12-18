"use client";
import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { OrderOriginal } from "@/src/lib/features/orders/ordersApi";
import SplitButton from "@/src/components/table/tableWithPagination/buttonGroup";
import { DateConversion } from "@/src/utils/dateConversion";
import AlertDialog from "@/src/components/dialogs/deleteAlertDialog";
import TabsComponent from "@/src/components/table/tableWithPagination/tabs";
import { getOnDateForStatus } from "@/src/utils/getOnDateByOnConfirmStatus";
import Button from "@mui/material/Button";
import FormDialog from "@/src/components/dialogs/formDialog";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CollapseTableHistory from "@/src/components/table/CollapseTableHistory";
import ToolbarComponent from "@/src/components/toolbar";

interface TableWithPaginationInterface {
  typeTable?: string;
  orders: OrderOriginal[];
  isLoading: boolean;
  isFetching: boolean;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  status: string;
  onConfirmText?: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteSelectedAction?: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => void;
  handleAgreeSelectedAction?: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => Promise<void>;
  handleRejectSelectedAction?: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => Promise<void>;
  handleAcceptSelectedAction?: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => Promise<void>;
  handleConfirmSelectedAction?: () => void;
  date?: string;
  setDateAction?: React.Dispatch<React.SetStateAction<string>>;
}

export default function TableWithPagination({
  typeTable = "profile",
  orders,
  isLoading,
  isFetching,
  selected,
  setSelected,
  status,
  setStatus,
  onConfirmText,
  handleDeleteSelectedAction,
  handleAgreeSelectedAction,
  handleRejectSelectedAction,
  handleAcceptSelectedAction,
  handleConfirmSelectedAction,
  date,
  setDateAction,
}: TableWithPaginationInterface) {
  const [open, setOpen] = useState(false);
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

  return (
    <React.Fragment>
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TabsComponent
            status={status}
            setStatus={setStatus}
            length={orders?.length}
            onConfirmText={onConfirmText}
          />
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              {!!selected?.length && (
                <React.Fragment>
                  {status === "created" &&
                    (typeTable === "profile" ? (
                      <ToolbarComponent
                        length={selected.length}
                        content={
                          <AlertDialog
                            handleDelete={() =>
                              handleDeleteSelectedAction
                                ? handleDeleteSelectedAction(
                                    selected,
                                    setSelected,
                                  )
                                : undefined
                            }
                          />
                        }
                      />
                    ) : (
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
                          onClick={() =>
                            handleAcceptSelectedAction
                              ? handleAcceptSelectedAction(
                                  selected,
                                  setSelected,
                                )
                              : undefined
                          }
                        >
                          Принять
                        </Button>
                        <FormDialog
                          date={date}
                          setDateAction={setDateAction}
                          handleConfirmSelectedAction={
                            handleConfirmSelectedAction
                              ? handleConfirmSelectedAction
                              : undefined
                          }
                        />
                      </Grid>
                    ))}
                  {typeTable === "profile" && status === "on_confirm" && (
                    <SplitButton
                      onAgreeAction={handleAgreeSelectedAction}
                      onRejectAction={handleRejectSelectedAction}
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
                      {((typeTable === "profile" && status !== "accepted") ||
                        (typeTable === "dashboard" &&
                          status === "created")) && (
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
                      {typeTable === "dashboard" && status === "accepted" && (
                        <TableCell></TableCell>
                      )}
                      <TableCell>№</TableCell>
                      <TableCell>Дата подачи</TableCell>
                      <TableCell>Дата вызова представителя</TableCell>
                      {status === "accepted" && (
                        <TableCell>Соглавсованная дата</TableCell>
                      )}
                      {status === "on_confirm" && (
                        <TableCell>
                          {typeTable === "profile"
                            ? "Предлагаемая дата вызова"
                            : "Предложенная дата переноса"}
                        </TableCell>
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
                        <React.Fragment key={order.id}>
                          <TableRow
                            hover
                            tabIndex={-1}
                            selected={selected.includes(order.id)}
                          >
                            {((typeTable === "profile" &&
                              status !== "accepted") ||
                              (typeTable === "dashboard" &&
                                status === "created")) && (
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
                            {typeTable === "dashboard" &&
                              status === "accepted" && (
                                <TableCell>
                                  <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpen(!open)}
                                  >
                                    {open ? (
                                      <KeyboardArrowUpIcon />
                                    ) : (
                                      <KeyboardArrowDownIcon />
                                    )}
                                  </IconButton>
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
                            <TableCell>
                              {order.order_type?.order_type}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={8}
                            >
                              <CollapseTableHistory
                                statusHistory={order.status_history}
                                open={open}
                              />
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
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
