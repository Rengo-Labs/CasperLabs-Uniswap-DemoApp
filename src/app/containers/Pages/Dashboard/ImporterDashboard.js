import Cookies from "js-cookie";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  Link, Route,
  Switch,
  useRouteMatch
} from "react-router-dom";
import "../../../assets/css/adminStyle.css";
// import {  } from "react-router-dom";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from '../../../assets/img/logo.png';
import patient from "../../../assets/img/patients/patient.jpg";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import PrivacyPolicy from "./Importer/PrivacyPolicy";
import ChangePassword from "./ChangePassword";
import TermsAndConditions from "./Importer/TermsAndConditions";
import ImporterDashboardDefaultScreen from "./Importer/ImporterDashboardDefaultScreen";
import ImporterSidebar from "./Importer/ImporterSidebar";
import NewOrder from "./Importer/NewOrder";
import Orders from "./Importer/Orders";
import OrdersReceived from "./Importer/OrdersReceived";
import ProfileSetting from "./Importer/ProfileSetting";

function ImporterDashboard(props) {
  let { path } = useRouteMatch();
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

  let [activeTab, setActiveTab] = useState({
    dashboard: "active",
    newOrder: "",
    orders: "",
    privacyPolicy:"",
    termsandconditions: "",
    settings: "",
    changePassword: "",
  });


  return (
    <div className={`main-wrapper ${slideNavClass}`}>
      {/* <!-- Header --> */}
      <div className={`admin-header ${menuOpenedClass}`}>
        {/* <!-- Logo --> */}
        <div className="header-left">
          <a
            href="/"
            className="logo"
            onClick={(e) => e.preventDefault()}
            style={{ color: 'rgb(167,0,0)' }}
          >
            <img src={Logo} alt="Logo" />
            {/* IMEX */}
          </a>
          <a
            href="/"
            className="logo logo-small"
            onClick={(e) => e.preventDefault()}
            style={{ color: 'rgb(167,0,0)' }}
          >
            <img src={Logo} alt="Logo" width="30" height="30" />
            {/* IMEX */}
          </a>
        </div>

        <a href='/' className="mobile_btn" id="mobile_btn" onClick={handleSlideNav}>
          <i className="fa fa-bars"></i>
        </a>
        <ul className="nav user-menu">
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
                }}
              >
                <span className="admin-img">
                  <img
                    className="avatar-sm rounded-circle"
                    src={patient}
                    width="50"
                    alt="Ryan Taylor"
                  />
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu alignRight="true" style={{ backgroundColor: "#f8f9fa" }}>
                <Dropdown.Item>
                  <Link
                    to="/dashboard" style={{ color: 'rgb(167,0,0)', width: "100%" }}>
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
                    style={{ color: 'rgb(167,0,0)', width: "100%" }}
                  >
                    Logout
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

      <ImporterSidebar
        match={props.match}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Switch>
            <Route exact path={`${path}`}>
              <ImporterDashboardDefaultScreen
                match={props.match}
                setActiveTab={setActiveTab}
              />
            </Route>

            <Route exact path={`${path}/orders`}>
              <Orders setActiveTab={setActiveTab} />
            </Route>
            <Route exact path={`${path}/ordersReceived`}>
              <OrdersReceived setActiveTab={setActiveTab} />
            </Route>
            <Route exact path={`${path}/newOrder`}>
              <NewOrder setActiveTab={setActiveTab} />
            </Route>

            <Route exact path={`${path}/profilesettings`}>
              <ProfileSetting
                setActiveTab={setActiveTab}
              />
            </Route>
            <Route exact path={`${path}/terms-&-conditions`}>
              <TermsAndConditions setActiveTab={setActiveTab} />
            </Route>
            <Route exact path={`${path}/changepassword`}>
              <ChangePassword setActiveTab={setActiveTab} />
            </Route>
            <Route exact path={`${path}/privacyPolicy`}>
              <PrivacyPolicy setActiveTab={setActiveTab} />
            </Route>
            <Route path={`${path}`}>
              <ImporterDashboardDefaultScreen
                match={props.match}
                setActiveTab={setActiveTab}
              />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}
export default ImporterDashboard;
