import { Grid } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import { selectGroupZoneOptions } from 'features/group-zone/groupZoneSlice';
import { TzVersionRequest } from 'models';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type TzVersionFilterProps = {
  filter: TzVersionRequest;
  onChange?: (newFilter: TzVersionRequest) => void;
};

export default function TzVersionFilter({ filter, onChange }: TzVersionFilterProps) {
  const { t } = useTranslation();
  const groupZoneOptions = useAppSelector(selectGroupZoneOptions);

  // const { timeFilterOptions, dateFilterOptions } = GetConstantTimeFilter();
  // const dateSelected = useAppSelector(selectDateFilterSelected);
  // const timeSelected = useAppSelector(selectTimeFilterSelected);
  // const dateSelectedList = dateFilterOptions.filter(({ id }) => dateSelected.includes(id));
  // const timeSelectedList = timeFilterOptions.filter(({ id }) => timeSelected.includes(id));
  // const handelTimeSelected = (e, value) => {
  //   const timeFilter = convertListToBinaryFilter(24, value as OptionsTimeFilter[]);
  //   const newFilter: TzVersionRequest = {
  //     ...filter,
  //     timeSlot: timeFilter
  //   };
  //
  //   if (onChange) onChange(newFilter);
  // };
  // const handelDateSelected = (e, value) => {
  //   const dateFilter = convertListToBinaryFilter(7, value as OptionsTimeFilter[]);
  //   const newFilter: TzVersionRequest = {
  //     ...filter,
  //     dateFilter: dateFilter
  //   };
  //
  //   if (onChange) onChange(newFilter);
  // };
  const handelGzChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: TzVersionRequest = {
      ...filter,
      groupZoneId: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <Grid container spacing={2} padding={1}>
      <Grid item xs={6} md={3} lg={3}>
        <SelectMUI
          isAll={true}
          label={t('groupZone.name')}
          labelId="filterByGz"
          options={groupZoneOptions}
          onChange={handelGzChange}
          selected={filter.groupZoneId}
        />
        {/* <Autocomplete
          fullWidth
          multiple
          defaultValue={[]}
          value={dateSelectedList}
          onChange={handelDateSelected}
          options={dateFilterOptions}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label={t('tz.dateFilter')} />}
        /> */}
      </Grid>
      {/* <Grid item xs={6} md={6} lg={6}>
        <Autocomplete
          fullWidth
          multiple
          defaultValue={[]}
          value={timeSelectedList}
          onChange={handelTimeSelected}
          options={timeFilterOptions}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label={t('tz.timeFilter')} />}
        />
      </Grid> */}
    </Grid>
  );
}
