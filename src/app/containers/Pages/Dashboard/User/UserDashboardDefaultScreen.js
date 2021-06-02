// eslint-disable-next-line
import axios from "axios";// eslint-disable-next-line
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import React, { useEffect } from "react";
// import ListAltIcon from '@material-ui/icons/ListAlt';
// import StorageIcon from '@material-ui/icons/Storage';
function UserDashboardDefaultScreen(props) {

  // let [totalCubes, setTotalCubes] = useState(0);
  // let [totalNFTs, setTotalNFTs] = useState(0);
  // let [totalDrops, setTotalDrops] = useState(0);
  // let [totalSeasons, setTotalSeasons] = useState(0);
  // let [totalCollections, setTotalCollections] = useState(0);

  // let getCounts = () => {
  //   axios
  //     .get("/api/v1/admin/getCounts")
  //     .then((response) => {
  //       console.log(response);
  //       // setTotalCubes(response.data.approved);
  //       // setTotalNFTs(response.data.pending);
  //       // setTotalDrops(response.data.UnderDisputed);
  //       // setTotalSeasons(0);
  //       // setTotalCollections(0);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log(error.response);
  //     });
  // };

  useEffect(() => {
    props.setActiveTab({
      dashboard: "active",
      newNFT: "",
      orders: "",
      myNFTs: "",
      myCubes: "",
      myDrops: "",
      mySeason: "",
      settings: "",
      privacyPolicy: "",
      termsandconditions: "",
      changePassword: "",
      newDrop: "",
      newSupefNFT: "",
      newCollection: "",
      newRandomDrop: "",
    });
    // getCounts();
    // eslint-disable-next-line
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
                    <ListAltIcon />
                  </span>
                  <div className="dash-count">
                    <h3>{totalNFTs}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total NFTs</h6>
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
                    <i className="fas fa-cubes">
                  </span>
                  <div className="dash-count">
                    <h3>{totalCubes}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Cubes</h6>
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
                    <StorageIcon/>
                  </span>
                  <div className="dash-count">
                    <h3>{totalDrops}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Drops</h6>
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
                    <i className="fas fa-boxes"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{totalSeasons}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Seasons</h6>
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
                    <i className="fas fa-layer-group"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{totalCollections}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Collections</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-info w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div> */}

    </>
  );
}

export default UserDashboardDefaultScreen;
