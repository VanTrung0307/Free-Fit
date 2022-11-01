import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import { Icon } from '@iconify/react';
import { Box, Link, LinkProps, List, ListItem, Popover, Stack } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { ReactNode, useState } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
//
import { MenuItemProps, MenuProps } from './MainNavbar';

// ----------------------------------------------------------------------

interface Linkstyleprops extends LinkProps {
  component?: ReactNode;
  to?: string;
}

const LinkStyle = styled(Link)<Linkstyleprops>(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
  marginRight: theme.spacing(5),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    opacity: 0.48,
    textDecoration: 'none',
  },
}));

interface ListItemstyleprops extends LinkProps {
  component?: ReactNode;
  to?: string;
}

const ListItemStyle = styled(ListItem)<ListItemstyleprops>(({ theme }) => ({
  ...theme.typography.body2,
  padding: 0,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  transition: theme.transitions.create('color'),
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));

// ----------------------------------------------------------------------

export type IconBulletProps = {
  type?: 'subheader' | 'item';
};

// function IconBullet({ type = 'item' }: IconBulletProps) {
//   return (
//     <Box sx={{ width: 24, height: 16, display: 'flex', alignItems: 'center' }}>
//       <Box
//         component="span"
//         sx={{
//           ml: '2px',
//           width: 4,
//           height: 4,
//           borderRadius: '50%',
//           bgcolor: 'currentColor',
//           ...(type !== 'item' && { ml: 0, width: 8, height: 2, borderRadius: 2 }),
//         }}
//       />
//     </Box>
//   );
// }

type MenuDesktopItemProps = {
  item: MenuItemProps;
  pathname: string;
  isHome: boolean;
  isOffset: boolean;
};

function MenuDesktopItem({ item, pathname, isHome, isOffset }: MenuDesktopItemProps) {
  const { title, path, children } = item;
  // const isActive = pathname === path;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = (event: any) => {
    setAnchorEl(null);
  };

  const openPopper = Boolean(anchorEl);

  if (children) {
    return (
      <div key={title}>
        <LinkStyle
          onClick={handleClick}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            color: 'text.primary',
            ...(isOffset && {}),
            ...(openPopper && { opacity: 0.48 }),
          }}
        >
          {title}
          <Box
            component={Icon}
            icon={openPopper ? arrowIosUpwardFill : arrowIosDownwardFill}
            sx={{ ml: 0.5, width: 16, height: 16 }}
          />
        </LinkStyle>

        <Popover
          open={openPopper}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handleClose}
          PaperProps={{
            sx: {
              p: 3,
              pb: 0,
              margin: 'auto',
              borderRadius: 2,
              boxShadow: (theme) => theme.customShadows.z24,
            },
          }}
        >
          {children.map((list) => {
            const { subheader, items } = list;

            return (
              <Box key={subheader}>
                <List disablePadding>
                  {items.map((item) => (
                    <ListItemStyle
                      key={item.title}
                      to={item.path}
                      component={RouterLink}
                      underline="none"
                      sx={{
                        p: 0,
                        typography: 'body2',
                        color: 'text.secondary',
                        transition: (theme) => theme.transitions.create('color'),
                        '&:hover': { color: 'text.primary' },
                        ...(item.path === pathname && {
                          typography: 'subtitle2',
                          color: 'text.primary',
                        }),
                      }}
                    >
                      <>{item.title}</>
                    </ListItemStyle>
                  ))}
                </List>
              </Box>
            );
          })}
        </Popover>
      </div>
    );
  }

  return (
    <LinkStyle
      key={title}
      to={path}
      component={RouterLink}
      sx={{
        color: 'text.primary',
        ...(isOffset && {}),
        ...(openPopper && { opacity: 0.48 }),
      }}
    >
      {title}
    </LinkStyle>
  );
}

export default function MenuDesktop({ isOffset, isHome, navConfig }: MenuProps) {
  const { pathname } = useLocation();

  return (
    <Stack direction="row">
      {navConfig.map((link) => (
        <MenuDesktopItem
          key={link.title}
          item={link}
          pathname={pathname}
          isOffset={isOffset}
          isHome={isHome}
        />
      ))}
    </Stack>
  );
}
