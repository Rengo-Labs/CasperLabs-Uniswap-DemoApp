import React from "react";

function PricingBanner() {
  return (

    <>

      <div className="container-fluid">
        {/* <!-- Page Header --> */}
        <div className="page-header">
          <div className="row" style={{ justifyContent: "center" }}>
            <div className="col-12 col-md-3" style={{ paddingTop: "190px" }}>
              <div className="card" style={{ paddingBottom: "18px" }}>
                <div className="card-body">
                  <div className="container">
                    <div>
                      {" "}
                      <h4 style={{ color: "#07631F", paddingBottom: "25px" }}>
                        Shared Clusters
                      </h4>
                    </div>
                    <br />
                    <div>
                      {" "}
                      <p>
                        For teams learning or developing small
                        applications.
                      </p>
                    </div>
                    <div style={{ paddingTop: "15px" }}>
                      <ul>
                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>

                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>
                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div style={{ paddingTop: "80px" }}>
                      <button
                        className="btn btn-block btn-lg login-btn"
                        style={{
                          borderColor: "rgb(167,0,0)",
                          color: "rgb(167,0,0)",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        Create a Cluster
                      </button>
                    </div>
                    <br />
                    <div style={{ textAlign: "center" }}>
                      <span>Starting at</span>
                      <br />
                      <span style={{ color: "blue", fontSize: "28px" }}>
                        FREE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3" style={{ paddingTop: "170px" }}>
              <div
                className="card"
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
              >
                <div className="card-body">
                  <div className="container">
                    <div>
                      {" "}
                      <h4 style={{ color: "#07631F", paddingBottom: "25px" }}>
                        Dedicated Clusters
                      </h4>
                    </div>
                    <br />
                    <div>
                      {" "}
                      <p>
                        For teams learning or developing small
                        applications.
                      </p>
                    </div>
                    <div style={{ paddingTop: "15px" }}>
                      <ul>
                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>

                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>
                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div style={{ paddingTop: "80px" }}>
                      <button
                        className="btn btn-block btn-lg login-btn"
                      // style={{
                      //     borderColor: "rgb(167,0,0)", color: "rgb(167,0,0)",
                      //     backgroundColor: "#ffffff"
                      // }}
                      >
                        Create a Cluster
                      </button>
                    </div>
                    <br />
                    <div style={{ textAlign: "center" }}>
                      <span>Starting at</span>
                      <br />
                      <span style={{ fontSize: "28px" }}>$0.08/hr*</span>
                      <br />
                      <span style={{ fontSize: "12px" }}>
                        *estimated cost $56.94/month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3" style={{ paddingTop: "190px" }}>
              <div className="card">
                <div className="card-body">
                  <div className="container">
                    <div>
                      {" "}
                      <h4 style={{ color: "#07631F" }}>
                        Dedicated Multi-Region Clusters
                      </h4>
                    </div>
                    <br />
                    <div>
                      {" "}
                      <p>
                        For teams learning or developing small
                        applications.
                      </p>
                    </div>
                    <div style={{ paddingTop: "15px" }}>
                      <ul>
                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>

                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>
                        <li>
                          <span>
                            {/* &#10003; */}
                            Highly available auto healing cluster
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div style={{ paddingTop: "80px" }}>
                      <button
                        className="btn btn-block btn-lg login-btn"
                        style={{
                          borderColor: "rgb(167,0,0)",
                          color: "rgb(167,0,0)",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        Create a Cluster
                      </button>
                    </div>
                    <br />
                    <div style={{ textAlign: "center" }}>
                      <span>Starting at</span>
                      <br />
                      <span style={{ fontSize: "28px" }}>$0.13/hr*</span>
                      <br />
                      <span style={{ fontSize: "12px" }}>
                        *estimated cost $98.55/month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* </div> */}
      </div>

      {/* </div>
                </div>
            </div> */}
    </>
  );
}

export default PricingBanner;
