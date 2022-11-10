// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import fetch from 'cross-fetch';
import { Address } from 'models';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { splitWktToLatLng, splitWktTopPostLatLng } from 'utils/common';
import { useDebouncedCallback } from './DebounceHook';

interface SearchAddressProps {
  onChangeAddress?: (address: Address) => void;
}
export function SearchAddress({ onChangeAddress }: SearchAddressProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const searchData = (keySearch) => {
    if (keySearch === '') {
      setOptions([]);
      return;
    }
    let active = true;

    setLoading(true);
    setOptions([]);
    // osm-nominatim-elastic
    (async () => {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || 'https://freefit.azurewebsites.net/api/v1.0'
        }/address/osm-nominatim-elastic?KeySearch=${keySearch}&IsSearchForBrand=false`
      ); // For demo purposes.
      const countries = await response.json();
      if (active) {
        const ops = Object.keys(countries).map((key) => countries[key] as Address);
        const newOps = [...ops];
        setOptions(newOps);
      }
    })();
    setLoading(false);
    // eslint-disable-next-line consistent-return
    return () => {
      active = false;
    };
  };
  const handelInputChange = useDebouncedCallback((event, newInputValue) => {
    searchData(newInputValue);
  }, 800);

  const handelSelected = (e, value) => {
    if (value === [] || value === undefined || value === null) return;
    if (!onChangeAddress) return;
    const rs = splitWktToLatLng(value.geom);
    const postLatLng = splitWktTopPostLatLng(value.geom);
    value.latlng = rs;
    value.postLatLng = postLatLng;
    onChangeAddress(value);
  };

  return (
    <Autocomplete
      fullWidth
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handelSelected}
      // when search alway show all option
      filterOptions={(f) => f}
      getOptionLabel={(option) => option?.address}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={options}
      size="small"
      loading={true}
      loadingText={t('common.searchLoadingText')}
      noOptionsText={t('common.noOption')}
      onInputChange={handelInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('common.searchAddress')}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
