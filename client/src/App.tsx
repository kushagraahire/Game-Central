import React, { useState } from 'react';
import AppBar from './components/AppBar';
import { createTheme, ThemeProvider, CssBaseline} from '@mui/material';
import { RecoilRoot } from 'recoil';
import UserLogin from './components/UserLogin';
//import UserSignup from './components/UserSignup';
import './App.css'

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <RecoilRoot>
      <div>
        <AppBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
      </div>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;