import { SuccessAlertComponent } from "@/src/components/alert/success";

type ApiFunction = (id: number) => Promise<any>;

export const useHandleSelected = (
  apiFunction: ApiFunction,
  successMessage: string,
) => {
  const handleAction = async (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    try {
      await Promise.all(selected.map((id) => apiFunction(id)));
      setSelected([]); // Очищаем выбранные заявки
      // alert(successMessage);
      return <SuccessAlertComponent message={successMessage} />;
    } catch (err) {
      console.error(`Ошибка при выполнении операции: ${err}`);
    }
  };

  return { handleAction };
};
