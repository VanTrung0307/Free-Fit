import { Autocomplete, TextField } from '@mui/material';
import { Control, useController } from 'react-hook-form';

export interface SelectOptions {
  name?: string;
  id: number | string;
}
interface SelectFieldProps {
  name: string;
  control: Control<any>;
  size?: 'medium' | 'small';
  label?: string;
  disabled?: boolean;
  options: SelectOptions[];
  onChange: (e: any, value: any) => void;
}

export default function AutoCompleteField({
  name,
  control,
  label,
  disabled,
  options,
  onChange,
}: SelectFieldProps) {
  const {
    field: { value, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  return (
    <Autocomplete
      fullWidth
      multiple
      disabled={disabled}
      defaultValue={[]}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name || ''}
      renderInput={(params) => (
        <TextField {...params} label={label} error={invalid} helperText={error?.message} />
      )}
    />
  );
}
