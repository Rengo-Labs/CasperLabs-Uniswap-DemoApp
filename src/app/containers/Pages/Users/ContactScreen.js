import React from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import Header from "../../../components/Headers/Header";
import Contact from "./Home/Contact";

function ContactScreen() {
  return (
    <>
      <div className="main-wrapper" style={{ height: "inherit" }}>
        <div
          className="home-section home-full-height"
          style={{ height: "inherit" }}
        >
          <Header selectedNav={"contact"} />

          <Contact />

          <div></div>
          <Footer position={"relative"} />
        </div>
      </div>
    </>
  );
}
export default ContactScreen;
