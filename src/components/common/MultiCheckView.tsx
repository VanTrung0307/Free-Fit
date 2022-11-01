import { Button, Checkbox, FormGroup, Box, Grid, GridSize, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { OptionsTimeFilter } from 'models/dto/timeFilter';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RadioGroupFieldProps {
  label?: string;
  disabled?: boolean;
  isRow?: boolean;
  options: OptionsTimeFilter[];
  value: OptionsTimeFilter[];
  xs: number;
  lg: number;
  md: number;
  limit: number;
}

export default function MultiCheckView({
  label,
  disabled,
  options,
  isRow,
  lg,
  md,
  xs,
  value,
  limit,
}: RadioGroupFieldProps) {
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [limitItem, setLimitItems] = useState<number>(limit);
  const { t } = useTranslation();
  const handelShowMore = () => {
    if (!isShowMore) {
      setLimitItems(options.length);
    } else {
      setLimitItems(limit);
    }
    setIsShowMore(!isShowMore);
  };
  return (
    <>
      <FormControl
        disabled={disabled}
        margin="normal"
        component="fieldset"
        style={{ marginTop: '0px', marginBottom: '0px' }}
      >
        <FormLabel component="legend">{label}</FormLabel>

        <FormGroup row={isRow}>
          <Grid container>
            {options.slice(0, limitItem).map((option) => (
              <Grid
                item
                xs={xs as GridSize}
                md={md as GridSize}
                lg={lg as GridSize}
                key={`option-time ${option.id}`}
              >
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={
                    <Checkbox checked={Boolean(value.find((x) => x.id === option.id)) || false} />
                  }
                  label={option.name}
                />
              </Grid>
            ))}
          </Grid>
          <Button color="primary" onClick={handelShowMore} fullWidth>
            <Typography variant="body2">
              {!isShowMore ? t('common.viewMore') : t('common.collapse')}
            </Typography>
          </Button>
        </FormGroup>
      </FormControl>
    </>
  );
}
