"use client";
import { TablePagination } from "@mui/material";
import React from "react";

interface TablePaginationInterface {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  count?: number;
  page: number;
  page_size: number;
}

export default function TablePaginationComponent({
  count,
  setPage,
  page,
  setPageSize,
  page_size,
}: TablePaginationInterface) {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={count}
      rowsPerPage={page_size}
      page={page - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage="Строк на странице:"
    />
  );
}
