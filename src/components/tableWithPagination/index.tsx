"use client";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
const sampleApplications = [
  { id: 1, name: "Application A", status: "Pending", created: "2024-10-01" },
  { id: 2, name: "Application B", status: "Approved", created: "2024-10-05" },
  { id: 3, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 4, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 5, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 6, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 7, name: "Application A", status: "Pending", created: "2024-10-01" },
  { id: 8, name: "Application B", status: "Approved", created: "2024-10-05" },
  { id: 9, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 10, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 11, name: "Application C", status: "Rejected", created: "2024-10-10" },
  { id: 12, name: "Application C", status: "Rejected", created: "2024-10-10" },
];
export default function TableWithPagination() {
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const visibleRows = React.useMemo(
    () =>
      [...sampleApplications].slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [page, rowsPerPage],
  );
  console.log(visibleRows);

  return (
    <React.Fragment>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((app, index) => {
              const isItemSelected = selected.includes(app.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow key={app.id} hover tabIndex={-1}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell>{app.created}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 6, 9]}
        component="div"
        count={sampleApplications.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
}
