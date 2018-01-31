import ReactGA from 'react-ga';
import ElectronCookies from '@exponent/electron-cookies';

export const initGA = () => {
  ElectronCookies.enable({
    origin: 'https://desktop.splish.io',
  });

  ReactGA.initialize('UA-112512937-2');
};

export const logPageView = () => {
  console.log(window.location.pathname);
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
