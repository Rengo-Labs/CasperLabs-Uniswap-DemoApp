import React from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";
import Drops from "./Home/Drops";
import HomeBanner from "./Home/HomeBanner";
import Market from "./Home/Market";

function HomeScreen() {

  return (
    <div className="main-wrapper">
      <div className="home-section home-full-height">
        <HeaderHome selectedNav={"Home"} />
        <HomeBanner />
        <Market />
        <Drops />
      </div>
      <Footer position={"relative"} />
    </div>
  );
}

export default HomeScreen;
