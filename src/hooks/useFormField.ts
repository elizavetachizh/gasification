import { useState } from "react";

type ValidationFn = (value: string) => boolean;

interface UseFormFieldProps {
  initialValue?: string;
  validate?: ValidationFn;
  errorMessage?: string;
}

export const useFormField = ({
  initialValue = "",
  validate,
  errorMessage = "Invalid input",
}: UseFormFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(true);
  const [helperText, setHelperText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (validate) {
      const isValid = validate(newValue);
      setError(!isValid);
      setHelperText(isValid ? "" : errorMessage);
    }
  };

  const reset = () => {
    setValue(initialValue);
    setError(false);
    setHelperText("");
  };

  return {
    value,
    error,
    helperText,
    handleChange,
    reset,
  };
};
