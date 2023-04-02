import 'assets/fonts/FontFace.css';
import themes from 'config/theme/AppTheme';
import NavigationScroll from 'components/elements/NavigationScroll';
import MainRoutes from 'config/router/MainRoutes';
import { Routes } from 'react-router';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

export default function AppBrowser() {
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(sidebarReducer)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes children={MainRoutes} />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
