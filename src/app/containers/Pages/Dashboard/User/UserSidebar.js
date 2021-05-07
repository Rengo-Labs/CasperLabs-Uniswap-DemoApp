import Cookies from "js-cookie";
import React from "react";
import { Link } from "react-router-dom";
import StorageIcon from '@material-ui/icons/Storage';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
function AdminSidebar(props) {
  let handleLogout = (e) => {
    localStorage.removeItem("Address");
    Cookies.remove("Authorization");
    
    // setTimeout(() => { }, 1);
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
            
            <li className={props.activeTab.myCubes}>
              <Link to={`${props.match.url}/myCubes`}>
                <i className="fas fa-cubes"></i><span>My Cubes</span>
              </Link>
            </li>


            {/* <li className={props.activeTab.totalUserAccount}>
              <Link to={`${props.match.url}/totalUserAccount`}>
                <i className="fa fa-file-medical"></i>{" "}
                <span>Total Accounts</span>
              </Link>
            </li>
            <li className={props.activeTab.pendingUserAccount}>
              <Link to={`${props.match.url}/pendingUserAccount`}>
                <i className="fa fa-hourglass"></i>{" "}
                <span>Pending Accounts</span>
              </Link>
            </li>
            <li className={props.activeTab.disputedOrders}>
              <Link to={`${props.match.url}/disputedOrders`}>
                <i className="fas fa-exclamation"></i>
                {" "}
                <span>Disputed Orders</span>
              </Link>
            </li>
            <li className={props.activeTab.resolvedDisputedOrders}>
              <Link to={`${props.match.url}/resolvedDisputedOrders`}>
                <i className="fas fa-check"></i>
                {" "}
                <span>Resolved Disputes</span>
              </Link>
            </li>
            <li className={props.activeTab.tradeListOrders}>
              <Link to={`${props.match.url}/tradeListOrders`}>
                <i className="fas fa-clipboard-list"></i>
                {" "}
                <span>Total Trades</span>
              </Link>
            </li>
            <li className={props.activeTab.earningsList}>
              <Link to={`${props.match.url}/earningsList`}>
              <i className="fas fa-hand-holding-usd"></i>
                {" "}
                <span>Earning List</span>
              </Link>
            </li> */}
            {/* <li className={props.activeTab.referralEarnings}>
              <Link to={`${props.match.url}/referralEarnings`}>
              <i className="fas fa-dollar-sign"></i>
                {" "}
                <span>Referral Earnings</span>
              </Link>
            </li> */}


            <li className="menu-title">
              <span>Settings</span>
            </li>
            {/* <li className={props.activeTab.settings}>
              <Link to={`${props.match.url}/profilesettings`}>
                <i className="fa fa-cog"></i> <span>Profile Settings</span>
              </Link>
            </li> */}
            {/* <li className={props.activeTab.changePassword}>
              <Link to={`${props.match.url}/changepassword`}>
                <i className="fa fa-key"></i> <span>Change Password</span>
              </Link>
            </li> */}
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

export default AdminSidebar;
