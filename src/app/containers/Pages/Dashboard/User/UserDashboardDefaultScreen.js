import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

function UserDashboardDefaultScreen(props) {
  let [approved, setApproved] = useState(0);
  let [pending, setPending] = useState(0);
  let [disputed, setDisputed] = useState(0);

  let getCounts = () => {
    axios
      .get("/api/v1/admin/getCounts")
      .then((response) => {
        console.log(response);
        setApproved(response.data.approved);
        setPending(response.data.pending);
        setDisputed(response.data.UnderDisputed)
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  };

  useEffect(() => {
    props.setActiveTab({
      dashboard: "active",
      totalUserAccount: "",
      pendingUserAccount: "",
      disputedOrders: "",
      mySeason:"",
      earningsList:"",
      referralEarnings:"",
      settings: "",
      changePassword: "",
    });
    // getCounts();// eslint-disable-next-line
  }, []);

  return (
    <>
      {/* <!-- Page Header --> */}
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">Welcome User!</h3>
            <ul className="breadcrumb">
              <li
                className="breadcrumb-item active"
                style={{ color: "rgb(167, 0, 0)" }}
              >
                Dashboard
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- /Page Header --> */}

      {/* <div className="row">
        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/totalUserAccount`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-warning border-warning">
                    <i className="fa fa-file-medical"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{approved}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Accounts</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-warning w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/pendingUserAccount`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-secondary border-secondary">
                    <i className="fa fa-hourglass"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{pending}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Pending Accounts</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-secondary w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/disputedOrders`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-danger border-danger">
                    <i className="fa fa-user"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{disputed}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Disputed Orders</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-danger w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/resolvedDisputedOrders`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success border-success">
                  <i className="fas fa-check"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{1}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Resolved Disputes</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/tradeListOrders`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-info border-info">
                  <i className="fas fa-clipboard-list"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{7}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Trades</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-info w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
     */}
    </>
  );
}

export default UserDashboardDefaultScreen;
