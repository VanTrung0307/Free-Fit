import { ReactNode, useMemo } from 'react';
// material
import {
  alpha,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  createTheme,
  useTheme,
  adaptV4Theme,
} from '@mui/material/styles';
// hooks
import useSettings from '../hooks/useSettings';
//
import componentsOverride from '../theme/overrides';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// ----------------------------------------------------------------------

type ThemePrimaryColorProps = {
  children: ReactNode;
};

export default function ThemePrimaryColor({ children }: ThemePrimaryColorProps) {
  const defaultTheme = useTheme();
  const { setColor } = useSettings();

  const themeOptions = useMemo(
    () => ({
      ...defaultTheme,
      palette: {
        ...defaultTheme.palette,
        primary: setColor,
      },
      customShadows: {
        ...defaultTheme.customShadows,
        primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
      },
    }),
    [setColor, defaultTheme]
  );

  const theme = createTheme(adaptV4Theme(themeOptions));
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
