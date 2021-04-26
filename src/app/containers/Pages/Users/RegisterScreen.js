import React from "react";
import windowSize from "react-window-size";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import Header from "../../../components/Headers/Header";
import MainForm from "./MainForm";
// import loginBanner from "../../../assets/img/importExport.jpg";



function RegisterScreen(props) {

  return (
    <div className="main-wrapper">
      <div className="account-page">
        <Header />
        <div className="content"
          style={{ paddingTop: "150px",paddingBottom:'150px' }}
          position="absolute"
        >
          <div className="container-fluid">
            <div
              className="row"
              style={{
                height: `${props.windowHeight}`,
                marginRight: "5px"
              }}
            >
              <div className="col-md-8 offset-md-2">
                <div className="account-content">
                  <div className="row align-items-center justify-content-center">
                    <div
                      className="col-md-8 col-lg-7 login-left"
                      style={{ textAlign: "center" }}
                    >
                      {/* <img
                        src={loginBanner}
                        className="img-fluid"
                        alt="Doccure Login"
                        style={{ height: "400px", paddingTop: "20px" }}
                      /> */}
                    </div>
                    <div className="col-md-11 col-lg-5 login-right">

                      <div className="login-header">
                        <h3 style={{ textAlign: "center" }}>Sign Up</h3>
                      </div>
                      <br />
                      <MainForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer
          style={{
            position: "relative",
            height: "200px",
            paddingTop: "-200px",
          }}
        />
      </div>
    </div>
  );
}

export default windowSize(RegisterScreen);
