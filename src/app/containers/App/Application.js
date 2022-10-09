import { SnackbarProvider } from 'notistack';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddLiquidity from "../Pages/Users/AddLiquidity";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pairs from "../Pages/Users/Pairs";
import Pool from "../Pages/Users/Pool";
import RemoveLiquidity from "../Pages/Users/RemoveLiquidity";
import Swap from "../Pages/Users/Swap";
import Tokens from "../Pages/Users/Tokens";

function App() {

  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/pool") {
      return <Route element={Pool} />;
    } else if (path === "/pool/addLiquidity") {
      return <Route element={AddLiquidity} />
    } else if (path === "/pool/removeLiquidity") {
      return <Route element={RemoveLiquidity} />
    } else if (path === "/swap") {
      return <Route element={Swap} />;
    } else if (path === "/tokens") {
      return <Route element={Tokens} />;
    } else if (path === "/pairs") {
      return <Route element={Pairs} />;
    } else {
      return <Route element={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />;
          <Route exact path="/pool" element={<Pool />} />
          <Route exact path="/pool/addLiquidity" element={<AddLiquidity />} />
          <Route exact path="/pool/removeLiquidity/:tokenAAddress/:tokenBAddress" element={<RemoveLiquidity />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/pairs" element={<Pairs />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
