import Cookies from "js-cookie";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import {
  Link,
  withRouter
} from "react-router-dom";
import "../../assets/css/adminStyle.css";
// import {  } from "react-router-dom";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import patient from "../../assets/img/patients/patient.jpg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

function ProfileHeader(props) {
  let [menuOpenedClass, setMenuOpenedClass] = useState();
  let [slideNavClass, setSlideNavClass] = useState();

  let handleSlideNav = (e) => {
    e.preventDefault();
    if (slideNavClass !== "" && menuOpenedClass !== "") {
      setMenuOpenedClass("");
      setSlideNavClass("");
    } else {
      setMenuOpenedClass("menu-opened");
      setSlideNavClass("slide-nav");
    }
  };
  return (
    <div
    //  className={`main-wrapper ${slideNavClass}`}
    >
      {/* <!-- Header --> */}
      <div className={`admin-header ${menuOpenedClass}`}>
        {/* <!-- Logo --> */}
        <div className="header-left">
          <a
            href="/"
            className="logo"
            onClick={(e) => e.preventDefault()}
            style={{ color: '#ed0b25' }}
          >
            {/* <img src={logo} alt="Logo" /> */}

            Casper Swap
          </a>
          <a
            href="/"
            className="logo logo-small"
            onClick={(e) => e.preventDefault()}
            style={{ color: '#ed0b25' }}
          >
            {/* <img src={logoSmall} alt="Logo" width="30" height="30" /> */}
            Casper Swap
          </a>
        </div>
        {/* <!-- /Logo --> */}

        {/* <!-- Mobile Menu Toggle --> */}

        <a href="/" className="mobile_btn" id="mobile_btn" onClick={handleSlideNav}>
          <i className="fa fa-bars"></i>
        </a>
        {/* <!-- /Mobile Menu Toggle --> */}

        {/* <!-- Header Right Menu --> */}
        <ul className="nav user-menu">
          {/* <!-- User Menu --> */}

          <li className="nav-item dropdown has-arrow"></li>

          <li
            className="nav-item dropdown has-arrow"
            style={{ paddingTop: "10px" }}
          >
            <Dropdown>
              <Dropdown.Toggle
                style={{
                  backgroundColor: "transparent",
                  border: "0",
                  // padding: "0"
                }}
              >
                <span className="admin-img">
                  {/* {props.userData.pictureURL !== undefined ? ( */}
                  <img
                    className="avatar-sm rounded-circle"
                    // src={props.userData.pictureURL}
                    width="50"
                    alt="Ryan Taylor"
                  />
                  {/* ) : ( */}
                  <img
                    className="avatar-sm rounded-circle"
                    src={patient}
                    width="50"
                    alt="Ryan Taylor"
                  />
                  {/* )} */}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu alignRight="true">
                <Dropdown.Item>
                  <div className="admin-header">
                    <div className="avatar avatar-sm">
                      {/* {props.userData.pictureURL !== undefined ? ( */}
                      {/* <img
                        // src={props.userData.pictureURL}
                        alt="Image"
                        className="avatar-img rounded-circle"
                      /> */}
                      {/* ) : ( */}
                      <img
                        className="avatar-sm rounded-circle"
                        src={patient}
                        width="50"
                        alt="Ryan Taylor"
                      />

                      {/* )} */}
                    </div>
                    <div className="Admin-text">
                      {/* <h6>{props.userData.name}</h6> */}
                      <p className="text-muted mb-0">Admin</p>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Divider />
                <Dropdown.Divider />
                <Dropdown.Item>
                  <Link to="/dashboard" style={{ width: "100%" }}>
                    Dashboard
                  </Link>
                </Dropdown.Item>

                <Dropdown.Item>
                  <Link
                    onClick={() => {
                      Cookies.remove("Authorization");
                      Cookies.remove("PNT");
                    }}
                    to="/"
                    style={{ width: "100%" }}
                  >
                    Disconnect
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          {/* <!-- /User Menu --> */}
        </ul>
        {/* <!-- /Header Right Menu --> */}
      </div>
      {/* <!-- /Header --> */}
    </div>
  );
}

export default withRouter(connect(mapStateToProps)(ProfileHeader));
