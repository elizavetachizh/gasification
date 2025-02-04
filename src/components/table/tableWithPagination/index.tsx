"use client";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
import TablePaginationComponent from "@/src/components/table/tableWithPagination/pagination";
import ButtonGroup from "@mui/material/ButtonGroup";
import TableHeadComponent from "@/src/components/table/tableWithPagination/tableHead";

interface TableWithPaginationInterface {
  typeTable?: string;
  orders?: OrderOriginal[];
  count?: number;
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
  date?: string | null;
  setDateAction?: React.Dispatch<React.SetStateAction<string>>;
  setPage: (page: number) => void;
  page: number;
  setPageSize: (pageSize: number) => void;
  page_size: number;
}

export default function TableWithPagination({
  typeTable = "profile",
  orders = [],
  count = 0,
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
  date = null,
  setDateAction,
  setPage,
  page,
  setPageSize,
  page_size,
}: TableWithPaginationInterface) {
  const [open, setOpen] = useState<null | number>(null);
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
            length={count || 0}
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
                            dataTypeToDelete={"request"}
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
                          alignItems: "center",
                        }}
                      >
                        <ButtonGroup
                          variant="text"
                          aria-label="Basic button group"
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
                            selected={selected}
                            setSelectedAction={setSelected}
                          />
                        </ButtonGroup>
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
              <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
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
                      {status === "accepted" && <TableCell />}
                      <TableHeadComponent />

                      {status === "accepted" && (
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Соглавсованная дата
                        </TableCell>
                      )}
                      {status === "on_confirm" && (
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {typeTable === "profile"
                            ? "Предлагаемая дата вызова"
                            : "Предложенная дата переноса"}
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders?.map((order, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const numberRow =
                        page > 1 ? (page - 1) * page_size + 1 : 1;
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
                                  checked={selected.includes(order.id)}
                                  onChange={() => handleSelectOne(order.id)}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                />
                              </TableCell>
                            )}
                            {status === "accepted" && (
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() => setOpen(order.id)}
                                >
                                  {open === order.id ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                            )}
                            <TableCell>{index + numberRow}</TableCell>
                            <TableCell>
                              {DateConversion(order.created_at)}
                            </TableCell>
                            <TableCell>{order.applicant}</TableCell>
                            <TableCell>{order.phone_number}</TableCell>
                            <TableCell>
                              {order.order_type?.order_type}
                            </TableCell>
                            <TableCell>
                              {order.construction_object?.code}
                            </TableCell>
                            <TableCell>
                              {order.construction_object?.work_packages.map(
                                (workPackage, index) => (
                                  <p key={index}>{workPackage}</p>
                                ),
                              )}
                            </TableCell>
                            <TableCell>
                              {order.construction_object?.address}
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
                          </TableRow>
                          {status === "accepted" && (
                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={8}
                              >
                                {open === order.id && (
                                  <CollapseTableHistory
                                    statusHistory={order.status_history}
                                    open={open}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePaginationComponent
                count={count}
                page_size={page_size}
                page={page}
                setPage={setPage}
                setPageSize={setPageSize}
              />
            </>
          )}
        </>
      )}
    </React.Fragment>
  );
}
