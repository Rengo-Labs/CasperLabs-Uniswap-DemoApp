import React from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";
import Collectible from "./Home/Collectibles";
import DigitalArt from "./Home/DigitalArt";
import HomeBanner from "./Home/HomeBanner";
import PricingBanner from "./Home/PricingBanner";
import TrendingCollections from "./Home/TrendingCollections";
import VirtailWorlds from "./Home/VirtualWorlds";

function MarketPlace() {

  return (
    <>
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome selectedNav={"Market"} />
          <HomeBanner />
          <DigitalArt />

        </div>

        <Footer position={"relative"} />
      </div>
    </>
  );
}

export default MarketPlace;
