import React, { useEffect, useState } from 'react';
import AppBar from './components/AppBar';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import UserLogin from './components/UserLogin';
import Homepage from './components/Homepage';
//import UserSignup from './components/UserSignup';
import './App.css'
import axios from 'axios';
import PublisherSignup from './components/PublisherSignup';
import PublisherLogin from './components/PublisherLogin';

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
  const [user, setUser] = useState<string | null>(null);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  useEffect(()=>{
    try {
      const fetchPublsiher = async () => {
        const publisher = await axios.get("http://localhost:3000/publisher/profile", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        });

        if(publisher){
          setUser("Publisher");
        }
      }
      fetchPublsiher();
    } catch (error) {
      console.log(error);
    }
  },[]);


  if (user === "Publisher") {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <div>
          </div>
        </RecoilRoot>
      </ThemeProvider>
    );
  }else{
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <div>
            <AppBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <PublisherLogin/>
          </div>
        </RecoilRoot>
      </ThemeProvider>
    );
  }

  
};

export default App;