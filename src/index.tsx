// scroll bar
import 'simplebar/src/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
// contexts
import { I18nextProvider } from 'react-i18next';
import i18n from 'translation/i18n';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
//
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import 'react-toastify/dist/ReactToastify.min.css';
import './index.css';

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                  <App />
                  <ToastContainer />
                </I18nextProvider>
              </BrowserRouter>
            </LocalizationProvider>
          </Provider>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
