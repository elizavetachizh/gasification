type ApiFunction = (id: number) => Promise<any>;

export const useHandleSelected = (apiFunction: ApiFunction) => {
  const handleAction = async (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    try {
      await Promise.all(selected.map((id) => apiFunction(id)));
      setSelected([]); // Очищаем выбранные заявки
    } catch (err) {
      console.error(`Ошибка при выполнении операции: ${err}`);
    }
  };

  return { handleAction };
};
