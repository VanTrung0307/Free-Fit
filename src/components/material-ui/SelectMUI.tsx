import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface SelectMUIProps {
  label: string;
  labelId: string;

  selected?: any;
  isAll: boolean;
  options: any[];
  disabled?: boolean;
  onChange?: (id: number) => void;
}

export default function SelectMUI({
  selected,
  isAll,
  options,
  onChange,
  label,
  labelId,
  disabled,
}: SelectMUIProps) {
  const { t } = useTranslation();
  //  const handelChangeEvent = (e: ChangeEvent<{ name?: string; value: unknown }>)
  const handelChangeEvent = (e: any) => {
    if (!onChange) return;
    const selectedId = e.target.value ? Number(e.target.value) : 0;
    onChange(selectedId);
  };
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={selected || ''}
        onChange={options.length === 0 ? () => {} : handelChangeEvent}
        label={label}
        disabled={disabled}
      >
        {isAll && options.length > 0 ? (
          <MenuItem value="">
            <em>{t('common.all')}</em>
          </MenuItem>
        ) : (
          <MenuItem value="">
            <em>{t('common.noData')}</em>
          </MenuItem>
        )}

        {options?.map((e) => (
          <MenuItem key={e.id} value={e.id}>
            {e.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
