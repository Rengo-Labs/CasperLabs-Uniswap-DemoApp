import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import UserDashboard from "../Pages/Dashboard/UserDashboard";
import AuctionDrops from "../Pages/Users/AuctionDrops";
import CubeNFTs from "../Pages/Users/Drops/CubeNFTs";
import DropCubes from "../Pages/Users/Drops/DropCubes";
// import ExporterDashboard from "../Pages/Dashboard/ExporterDashboard";
// import ImporterDashboard from "../Pages/Dashboard/ImporterDashboard";
import EmailVerification from "../Pages/Users/EmailVerification";
import ForgotPassword from "../Pages/Users/ForgotPassword";
import HomeScreen from "../Pages/Users/HomeScreen";
import LoginScreen from "../Pages/Users/LoginScreen";
import MarketPlace from "../Pages/Users/MarketPlace";
import AuctionCubeNFTs from "../Pages/Users/MarketPlace/AuctionCubeNFT";
import SaleCubeNFTs from "../Pages/Users/MarketPlace/SaleCubeNFT";
import PrivacyPolicy from "../Pages/Users/PrivacyPolicy";
import RegisterScreen from "../Pages/Users/RegisterScreen";
import TermsAndConditions from "../Pages/Users/TermsAndConditions";
import UserLoginScreen from "../Pages/Users/UserLoginScreen";
import UserProfileScreen from "../Pages/Users/UserProfileScreen";

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

  const PrivateRoute = ({ path, ...rest }) => {
    // checkLoginStatus();
    if (jwtDecoded && isLoggedIn) {
      if (jwtDecoded.roles === "admin") {
        return (
          <Route
            {...rest}
            render={(props) =>
              isLoggedIn ? (
                <AdminDashboard {...props} jwtDecoded={jwtDecoded} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        );
      }
      else if (jwtDecoded.roles === "user") {
        return (
          <Route
            {...rest}
            render={(props) =>
              isLoggedIn ? (
                <UserDashboard {...props} jwtDecoded={jwtDecoded} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        );
      }
    
    }
    else {
      return <Redirect to="/" />;
    }
  };

  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    checkLoginStatus();
    if (jwtDecoded && isLoggedIn && jwtDecoded.roles === "admin") {
      return <Redirect to="/dashboard" />;
    } else if (path === "/admin-login") {
      return <Route component={LoginScreen} />;
    } else if (path === "/login") {
      return <Route component={UserLoginScreen} />;
    } else if (path === "/register") {
      return <Route component={RegisterScreen} />;
    } else if (path === "/marketPlace") {
      return <Route component={MarketPlace} />;
    } else if (path === "/auctionDrops") {
      return <Route component={AuctionDrops} />;
    } else if (path === "/auctionDrops/DropCubes/:dropId") {
      return <Route exact path="/auctionDrops/DropCubes/:dropId" render={(routeProps) => <DropCubes {...routeProps} />} />
    } else if (path === "/auctionDrops/DropCubes/Nfts/:dropId/:cubeId") {
      return <Route exact path="/auctionDrops/DropCubes/Nfts/:dropId/:cubeId" component={CubeNFTs} />;
    } else if (path === "/marketPlace/Cubes/Nfts/notdrop/:expiresAt/:cubeId/:auctionId") {
      return <Route exact path="/marketPlace/Cubes/Nfts/notdrop/:expiresAt/:cubeId/:auctionId" component={SaleCubeNFTs} />;
    } else if (path === "/marketPlace/Cubes/Nfts/userauction/:cubeId/:auctionId") {
      return <Route exact path="/marketPlace/Cubes/Nfts/userauction/:cubeId/:auctionId" component={AuctionCubeNFTs} />;
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
          <LoginRegisterRedirectCheck exact path="/auctionDrops" />
          <LoginRegisterRedirectCheck exact path="/auctionDrops/DropCubes/:dropId" component={DropCubes} />
          <LoginRegisterRedirectCheck exact path="/auctionDrops/DropCubes/Nfts/:dropId/:cubeId" component={CubeNFTs} />
          <LoginRegisterRedirectCheck exact path="/marketPlace/Cubes/Nfts/notdrop/:expiresAt/:cubeId/:auctionId" component={SaleCubeNFTs} />
          <LoginRegisterRedirectCheck exact path="/marketPlace/Cubes/Nfts/userauction/:cubeId/:auctionId" component={AuctionCubeNFTs} />

          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route
            path="/users/emailverification/:email/:token"
            render={(routeProps) => <EmailVerification {...routeProps} />}
          />
          {/* <Route exact path="/admin-login"component={LoginScreen} /> */}
          <Route path="/termsandconditions" component={TermsAndConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          
          <Route
            exact path="/User/Profile/Detail/:userRole/:userId/:cubeId"
            render={(routeProps) => (
              <UserProfileScreen {...routeProps} />
            )}
          />

          <PrivateRoute path="/dashboard" />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
