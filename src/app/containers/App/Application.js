import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pool from "../Pages/Users/Pool";
import Swap from "../Pages/Users/Swap";
import Tokens from "../Pages/Users/Tokens";

function App() {
  let isLoggedIn;
  let jwtDecoded;
  let checkLoginStatus = () => {
    // Cookies.remove("Authorization");
    let jwt = Cookies.get("Authorization");
    if (jwt) {
      console.log(jwtDecode(jwt));
      // setjwtDecoded(jwtDecode(jwt));
      jwtDecoded = jwtDecode(jwt);
      console.log("jwtDecoded", jwtDecoded);
      isLoggedIn = true;
      // setIsLoggedIn(true);
    } else {
      // setIsLoggedIn(false);
      isLoggedIn = false;
    }
  };

  useEffect(() => {

    checkLoginStatus();// eslint-disable-next-line
  }, []);



  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    checkLoginStatus();
    if (path === "/pool") {
      return <Route component={Pool} />;
    } else if (path === "/swap") {
      return <Route component={Swap} />;
    } else if (path === "/tokens") {
      return <Route component={Tokens} />;
    } else {
      return <Route component={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Switch>
          <LoginRegisterRedirectCheck exact path="/" />
          {/* <LoginRegisterRedirectCheck exact path="/login" /> */}
          <LoginRegisterRedirectCheck exact path="/register" />
          <LoginRegisterRedirectCheck exact path="/marketPlace" />
          <LoginRegisterRedirectCheck exact path="/admin-login" />
          <LoginRegisterRedirectCheck exact path="/login" />
          {/* <LoginRegisterRedirectCheck exact path="/" /> */}

          <Route path="/pool" component={Pool} />
          <Route path="/swap" component={Swap} />
          <Route path="/tokens" component={Tokens} />

        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
