import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import * as React from 'react';
import { Control, useController } from 'react-hook-form';

interface CheckFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
}

export default function CheckField({ name, control, label, ...inputProps }: CheckFieldProps) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={value} onChange={onChange} onBlur={onBlur} inputRef={ref} />}
        label={label}
      />
      <FormHelperText>{error?.message}</FormHelperText>
    </>
  );
}
