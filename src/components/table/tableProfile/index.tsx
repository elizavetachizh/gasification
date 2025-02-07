"use client";

import React, { useState } from "react";
import {
  useAgreedOrderMutation,
  useCanceledOrderMutation,
  useRejectedOrderMutation,
} from "@/src/lib/features/orders/ordersApi";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import TableWithPagination from "../tableWithPagination";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

export default function TableProfile() {
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
        selected={selected}
        setSelected={setSelected}
        onConfirmText={"Предложен перенос заявок"}
        handleAgreeSelectedAction={handleAgreeSelected}
        handleDeleteSelectedAction={handleDeleteSelected}
        handleRejectSelectedAction={handleRejectSelected}
      />
    </>
  );
}
