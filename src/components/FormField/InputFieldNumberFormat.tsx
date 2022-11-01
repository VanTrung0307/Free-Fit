import { TextField } from '@mui/material';
import * as React from 'react';
import { Control, useController } from 'react-hook-form';
import NumberFormat from 'react-number-format';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  label?: string;
  suffix: string;
}

export default function InputFieldNumberFormat({
  name,
  control,
  suffix,
  label,
  ...inputProps
}: TextFieldProps) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  return (
    <NumberFormat
      fullWidth
      value={value === undefined ? '' : value}
      name={name}
      onBlur={onBlur}
      label={label}
      customInput={TextField}
      suffix={` ${suffix}`}
      isNumericString
      getInputRef={ref}
      error={invalid}
      helperText={error?.message}
      inputProps={inputProps}
      thousandSeparator
      onValueChange={({ value: v }) => onChange({ target: { name, value: v } })}
      onChange={onChange}
    />
  );
}
