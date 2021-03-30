import Cookies from "js-cookie";
import React from "react";
import { Link } from "react-router-dom";


function ExporterSidebar(props) {
  let handleLogout = (e) => {
    Cookies.remove("Authorization");
    setTimeout(() => { }, 1);
  };

  return (
    <div
      className="sidebar"
      id="sidebar"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>Main</span>
            </li>
            <li className={props.activeTab.dashboard}>
              <Link to={`${props.match.url}`}>
                <i className="fa fa-home"></i> <span>Dashboard</span>
              </Link>
            </li>
            <li className={props.activeTab.newOrders}>
              <Link to={`${props.match.url}/newOrder`}>
                <i className="fa fa-file-medical"></i> {" "}
                <span>New Order</span>
              </Link>
            </li>
            <li className={props.activeTab.orders}>
              <Link to={`${props.match.url}/orders`}>
                <i className="fa fa-paper-plane"></i>{" "}
                <span>Orders Sent</span>
              </Link>
            </li>
            <li className={props.activeTab.ordersReceived}>
              <Link to={`${props.match.url}/ordersReceived`}>
                <i className="fab fa-get-pocket"></i>{" "}
                <span>Orders Received</span>
              </Link>
            </li>
            <li className="menu-title">
              <span>Settings</span>
            </li>

            <li className={props.activeTab.settings}>
              <Link to={`${props.match.url}/profilesettings`}>
                <i className="fa fa-cog"></i> <span>Profile Settings</span>
              </Link>
            </li>

            <li className={props.activeTab.changePassword}>
              <Link to={`${props.match.url}/changepassword`}>
                <i className="fa fa-key"></i> <span>Change Password</span>
              </Link>
            </li>
            <li className={props.activeTab.termsandconditions}>
              <Link to={`${props.match.url}/terms-&-conditions`}>
                <i className="fas fa-file-contract"></i><span>Terms & Conditions</span>
              </Link>
            </li>
            <li className={props.activeTab.privacyPolicy}>
              <Link to={`${props.match.url}/privacyPolicy`}>
                <i className="fas fa-file-contract"></i><span>Privacy Policy</span>
              </Link>
            </li>

            <li>
              <Link to={"/"} onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"></i> <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExporterSidebar;
