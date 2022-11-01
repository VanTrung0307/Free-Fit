import { Checkbox, FormGroup, FormHelperText, Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { OptionsTimeFilter } from 'models/dto/timeFilter';
import { Control, useController } from 'react-hook-form';

interface RadioGroupFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  disabled?: boolean;
  isRow?: boolean;
  options: OptionsTimeFilter[];
  getValues: any;
  setValue: any;
}

export default function RadioGroupFieldTimeInDay({
  name,
  control,
  label,
  disabled,
  options,
  isRow,
  getValues,
  setValue,
}: RadioGroupFieldProps) {
  const {
    field: { value, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  // const { setValue, getValues } = useForm();
  const handleChecked = (e: any, name: string) => {
    const valueDateTime: OptionsTimeFilter[] = getValues(name);
    if (options === undefined) return;
    if (e.target.checked) {
      const data = options?.find((x) => x.id === Number(e.target.value));
      if (data !== undefined) {
        setValue(name, [...valueDateTime, data], {
          shouldDirty: true,
        });
      }
    } else {
      const index = options?.findIndex((x) => x.id === Number(e.target.value));
      if (index !== -1) {
        setValue(name, valueDateTime.splice(index, 1), {
          shouldDirty: true,
        });
      }
    }
  };
  return (
    <FormControl
      disabled={disabled}
      margin="normal"
      component="fieldset"
      error={invalid}
      style={{ marginTop: '0px', marginBottom: '0px' }}
    >
      <FormLabel component="legend">{label}</FormLabel>

      <FormGroup onBlur={onBlur} row={isRow}>
        <Grid container>
          {options.map((option) => (
            <Grid item xs={3} md={2} lg={2} key={`option-time ${option.id}`}>
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Checkbox value={Boolean(value.find((x) => x.id === option.id)) || ''} />}
                label={option.name}
                onChange={(e: any) => handleChecked(e, name)}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  );
}
