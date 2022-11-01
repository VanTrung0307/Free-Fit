import roundViewAgenda from '@iconify/icons-ic/round-view-agenda';
import roundViewDay from '@iconify/icons-ic/round-view-day';
import roundViewWeek from '@iconify/icons-ic/round-view-week';
import { Icon } from '@iconify/react';
import { Box, ToggleButton, Tooltip } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import { selectStoresOptions } from 'features/store-management/storeSlice';
import { selectFilter } from 'features/trade-zone-version/tzVersionSlice';
import { TzVersionRequest } from 'models';
import { useTranslation } from 'react-i18next';
import { CalendarView } from '../../../@types/calendar';
//
import { MHidden } from '../../@material-extend';

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  // { value: 'dayGridMonth', label: 'Month', icon: roundViewModule },
  { value: 'timeGridWeek', label: 'Week', icon: roundViewWeek },
  { value: 'timeGridDay', label: 'Day', icon: roundViewDay },
  { value: 'listWeek', label: 'Agenda', icon: roundViewAgenda },
] as const;

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3, 0),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    padding: theme.spacing(1.75, 3),
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

type CalendarToolbarProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  date: Date;
  view: CalendarView;
  onChangeView: (view: CalendarView) => void;
  onChange?: (newFilter: TzVersionRequest) => void;
};

export default function CalendarToolbar({ view, onChangeView, onChange }: CalendarToolbarProps) {
  const storesOptions = useAppSelector(selectStoresOptions);
  const { t } = useTranslation();
  const filter = useAppSelector(selectFilter);
  const handelStoreChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: TzVersionRequest = {
      ...filter,
      storeId: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <RootStyle>
      <Box width={300}>
        <SelectMUI
          isAll={true}
          label={t('store.storeName')}
          labelId="filterByStoreName"
          options={storesOptions}
          onChange={handelStoreChange}
          selected={filter.storeId}
        />
      </Box>
      <MHidden width="smDown">
        <Box sx={{ '& > *:not(:last-of-type)': { mr: 1 } }}>
          {VIEW_OPTIONS.map((viewOption) => (
            <Tooltip key={viewOption.value} title={viewOption.label}>
              <ToggleButton
                value={view}
                selected={viewOption.value === view}
                onChange={() => onChangeView(viewOption.value)}
                sx={{ width: 32, height: 32, padding: 0 }}
              >
                <Icon icon={viewOption.icon} width={20} height={20} />
              </ToggleButton>
            </Tooltip>
          ))}
        </Box>
      </MHidden>

      {/* <Typography variant="h5" sx={{ my: { xs: 1, sm: 0 } }}>
        {fDate(date)}
      </Typography> */}

      {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onPrevDate}>
          <Icon icon={arrowIosBackFill} width={18} height={18} />
        </IconButton>

        <Button size="small" color="error" variant="contained" onClick={onToday} sx={{ mx: 0.5 }}>
          Today
        </Button>

        <IconButton onClick={onNextDate}>
          <Icon icon={arrowIosForwardFill} width={18} height={18} />
        </IconButton>
      </Box> */}
    </RootStyle>
  );
}
