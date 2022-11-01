// material
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useRef, useState } from 'react';
import { MIconButton } from '../../components/@material-extend';
// components
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'vi',
    label: 'Vietnam',
    icon: '/static/icons/vietnam.svg',
  },
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { currentLang, onChangeLang } = useLocales();
  const lag = LANGS.find((e) => e.value === currentLang);
  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={() => setOpen(true)}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && { bgcolor: 'action.selected' }),
        }}
      >
        <img src={lag?.icon || LANGS[0].icon} alt={lag?.icon || LANGS[0].label} />
      </MIconButton>

      <MenuPopover open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current}>
        <Box sx={{ py: 1 }}>
          {LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang}
              onClick={() => {
                onChangeLang(option.value);
                setOpen(false);
              }}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
