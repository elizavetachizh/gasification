"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  useAgreedOrderMutation,
  useCanceledOrderMutation,
  useGetOrdersQuery,
  useRejectedOrderMutation,
} from "@/src/lib/features/orders/ordersApi";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import TableWithPagination from "../tableWithPagination";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

export default function TableProfile() {
  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(5);
  const [status, setStatus] = useState("created");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const {
    data: orders,
    isLoading,
    isFetching,
  } = useGetOrdersQuery(
    { status: status, page, page_size },
    { skip: !accessToken },
  );
  const [
    deleteOrder,
    { isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete },
  ] = useCanceledOrderMutation();
  const [
    agreeOrder,
    { isSuccess: isSuccessAgree, isError: isErrorAgree, error: errorAgree },
  ] = useAgreedOrderMutation();
  const [
    rejectOrder,
    { isSuccess: isSuccessReject, isError: isErrorReject, error: errorReject },
  ] = useRejectedOrderMutation();
  const [selected, setSelected] = useState<number[]>([]);

  const { handleAction: handleDeleteSelected } = useHandleSelected(deleteOrder);
  const { handleAction: handleAgreeSelected } = useHandleSelected(agreeOrder);
  const { handleAction: handleRejectSelected } = useHandleSelected(rejectOrder);

  return (
    <>
      {(isSuccessDelete || isSuccessAgree || isSuccessReject) && (
        <SuccessAlertComponent
          isInitialOpen={
            isSuccessDelete
              ? isSuccessDelete
              : isSuccessAgree
                ? isSuccessAgree
                : isSuccessReject
                  ? isSuccessReject
                  : false
          }
          message={
            isSuccessDelete
              ? "Выбранная заявка отменена!"
              : isSuccessAgree
                ? "Выбранные заявки приняты c предложенной датой!"
                : isSuccessReject
                  ? "Выбранные заявки приняты с указанной вами датой!"
                  : ""
          }
        />
      )}
      {isSuccessReject && (
        <SuccessAlertComponent
          isInitialOpen={isSuccessReject}
          message={"Выбранные заявки приняты с указанной вами датой!"}
        />
      )}
      {(isErrorDelete || isErrorAgree || isErrorReject) && (
        <ErrorAlertComponent
          isInitialOpen={
            isErrorDelete
              ? isErrorDelete
              : isErrorAgree
                ? isErrorAgree
                : isErrorReject
                  ? isErrorReject
                  : false
          }
          message={"Что-то пошло не так, попробуйте еще раз..."}
        />
      )}
      <TableWithPagination
        orders={orders?.result}
        count={orders?.count}
        isLoading={isLoading}
        isFetching={isFetching}
        selected={selected}
        setSelected={setSelected}
        status={status}
        setStatus={setStatus}
        onConfirmText={"Предложен перенос заявок"}
        handleAgreeSelectedAction={handleAgreeSelected}
        handleDeleteSelectedAction={handleDeleteSelected}
        handleRejectSelectedAction={handleRejectSelected}
        setPage={setPage}
        page={page}
        setPageSize={setPageSize}
        page_size={page_size}
      />
    </>
  );
}
