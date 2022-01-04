import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import AddLiquidity from "../Pages/Users/AddLiquidity";
import Pairs from "../Pages/Users/Pairs";
import Pool from "../Pages/Users/Pool";
import Swap from "../Pages/Users/Swap";
import Tokens from "../Pages/Users/Tokens";
import RemoveLiquidity from "../Pages/Users/RemoveLiquidity";

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
    } else if (path === "/pool/addLiquidity") {
      return <Route component={AddLiquidity} />
    } else if (path === "/pool/removeLiquidity") {
      return <Route component={RemoveLiquidity} />
    } else if (path === "/swap") {
      return <Route component={Swap} />;
    } else if (path === "/tokens") {
      return <Route component={Tokens} />;
    } else if (path === "/pairs") {
      return <Route component={Pairs} />;
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

          <Route exact path="/pool" component={Pool} />
          <Route exact path="/pool/addLiquidity" component={AddLiquidity} />
          <Route exact path="/pool/removeLiquidity/:tokenAAddress/:tokenBAddress" component={RemoveLiquidity} />
          <Route path="/swap" component={Swap} />
          <Route path="/tokens" component={Tokens} />
          <Route path="/pairs" component={Pairs} />

        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
