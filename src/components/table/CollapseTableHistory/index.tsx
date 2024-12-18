"use client";
import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { StatusHistoryItem } from "@/src/lib/features/orders/ordersApi";
import { DateConversion } from "@/src/utils/dateConversion";
import { StatusConversion } from "@/src/utils/StatusConversion";

interface CollapseTableHistoryInterface {
  statusHistory: StatusHistoryItem[] | undefined;
  open: boolean;
}
export default function CollapseTableHistory({
  statusHistory,
  open,
}: CollapseTableHistoryInterface) {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          История
        </Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusHistory?.map((historyRow) => (
              <TableRow key={historyRow?.created_at}>
                <TableCell component="th" scope="row">
                  {DateConversion(historyRow?.created_at)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {StatusConversion(historyRow.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
}
