import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

function ExporterDashboardDefaultScreen(props) {
  let [orderPlaced, setOrderPlaced] = useState(0);
  let [orderReceived, setOrderReceived] = useState(0);
  let jwt = Cookies.get("Authorization");
  console.log('jwt',jwt);

  let jwtDecoded = jwtDecode(jwt);
  console.log('jwtDecoded',jwtDecoded);

  let exporterId = jwtDecoded.id;

  let getCounts = () => {
    axios
      .get("/api/v1/exporter/getOrderCounts/" + exporterId)
      .then((response) => {
        console.log("response", response);
        setOrderPlaced(response.data.OrderPlaced);
        setOrderReceived(response.data.OrderReceived)
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
      });
  };

  useEffect(() => {
    props.setActiveTab({
      dashboard: "active",
      ordersReceived: "",
      privacyPolicy:"",
      termsandconditions: "",
      settings: "",
      changePassword: "",
    });
    getCounts();// eslint-disable-next-line
  }, []);

  return (
    <>
      {/* <!-- Page Header --> */}
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">Welcome Exporter!</h3>
            <ul className="breadcrumb">
              <li
                className="breadcrumb-item active"
                style={{ color: "#174153" }}
              >
                Dashboard
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- /Page Header --> */}

      <div className="row">
        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/orders`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-warning border-warning">
                    <i className="fa fa-paper-plane"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{orderPlaced}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Order Sent</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-warning w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-sm-3">
          <Link to={`${props.match.url}/ordersReceived`}>
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-dark border-dark">
                    <i className="fab fa-get-pocket"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{orderReceived}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Order Received</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-dark w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ExporterDashboardDefaultScreen;
