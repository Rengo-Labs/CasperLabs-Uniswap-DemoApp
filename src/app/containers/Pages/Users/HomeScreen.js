import React from "react";
import { useState } from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";

function HomeScreen() {
  // eslint-disable-next-line
  let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
  return (
    <div className="main-wrapper">
      <div className="home-section home-full-height">
        <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Home"} />
        <div
          className="content"
          style={{ paddingTop: "100px"}}
          position="absolute"
        >
          <HomeBanner />
        </div>
      </div>

      <Footer position={"relative"} />
    </div>
  );
}

export default HomeScreen;
