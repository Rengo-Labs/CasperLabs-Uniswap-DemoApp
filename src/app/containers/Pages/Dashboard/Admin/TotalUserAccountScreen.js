import axios from "axios";
import React, { useEffect, useState } from "react";


function TotalUserAccountScreen(props) {
  useEffect(() => {
    getApprovedPractitionerAccounts();
    props.setActiveTab({
      dashboard: "",
      totalUserAccount: "active",
      pendingUserAccount: "",
      disputedOrders: "",
      tradeListOrders: "",
      earningsList:"",
      referralEarnings:"",
      settings: "",
      changePassword: "",
      resolvedDisputedOrders: "",
    });// eslint-disable-next-line
  }, []);

  let [data, setData] = useState([]);
  let getApprovedPractitionerAccounts = () => {
    axios
      .get(`/api/v1/admin/approvedAccounts`)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const download = e => {
  //   console.log(e.target.href);
  //   fetch(e.target.href, {
  //     method: "GET",
  //     headers: {}
  //   })
  //     .then(response => {
  //       response.arrayBuffer().then(function (buffer) {
  //         const url = window.URL.createObjectURL(new Blob([buffer]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", "image.png"); //or any other extension
  //         document.body.appendChild(link);
  //         link.click();
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  return (
    <div className="card">
      <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Total User Accounts</li>
      </ul>

      <div className="card-body">
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <div className="table-responsive" style={{ paddingTop: "20px" }}>
                {/* <label>Transaction Summary</label> */}

                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      {/* <th>Selfie</th> */}
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Address</th>
                      <th>Passport Picture</th>
                      <th>Selfie With Passport</th>
                      <th>Factory</th>
                      <th>Business Certificate Photo</th>
                      <th>Other Pictures</th>
                      <th>Roles</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((i, index) => (
                      <tr key={i._id}>
                        <td>{index + 1}</td>
                        {/* <td style={{ textAlign: 'center', alignContent: 'center' }}>
                          <a href={"https://imex-backend.herokuapp.com/" + i.selfiepictures[0]}
                            download
                            target='_blank'
                            rel="noopener noreferrer"
                          >
                            <img
                              src={"https://imex-backend.herokuapp.com/" + i.selfiepictures[0]}
                              alt="selfie" className="zoom" width={50} height={50}></img>
                          </a>
                        </td> */}
                        {/* <td></td> */}
                        <td>{i.name}</td>
                        {i.emailConfirmed ? (
                          <td>
                            <i
                              className="fa fa-check-circle verified"
                              aria-hidden="true"
                            ></i>{" "}
                            {i.email}
                          </td>
                        ) : (
                          <td>{i.email}</td>
                        )}
                        <td>{i.mobile}</td>
                        <td>{i.city}</td>
                        <td>{i.country}</td>
                        <td>{i.address}</td>
                        <td style={{ textAlign: 'center', alignContent: 'center' }}>
                          <a href={"https://imex-backend.herokuapp.com/" + i.passportpicture}
                            download
                            target='_blank'
                            rel="noopener noreferrer"
                          >
                            <img
                              src={"https://imex-backend.herokuapp.com/" + i.passportpicture}
                              alt="passport" className="zoom" width={50} height={50}></img>
                          </a>
                        </td>
                        <td style={{ textAlign: 'center', alignContent: 'center' }}>
                          <a href={"https://imex-backend.herokuapp.com/" + i.passportsselfie[0]}
                            download
                            target='_blank'
                            rel="noopener noreferrer"
                          >
                            <img
                              src={"https://imex-backend.herokuapp.com/" + i.passportsselfie[0]}
                              alt="Passport selfie" className="zoom" width={50} height={50}></img>
                          </a>

                        </td>
                        <td>{i.factories}</td>
                        <td style={{ textAlign: 'center', alignContent: 'center' }}>
                          <a href={"https://imex-backend.herokuapp.com/" + i.businesscertificate[0]}
                            download
                            target='_blank'
                            rel="noopener noreferrer"
                          >
                            <img
                              src={"https://imex-backend.herokuapp.com/" + i.passportsselfie[0]}
                              alt="Business Certificate" className="zoom" width={50} height={50}></img>
                          </a>
                        </td>
                        <td style={{ textAlign: 'center', alignContent: 'center' }}>
                          {i.picturesofproducts.map((j, jIndex) => (
                            <a key={jIndex} href={"https://imex-backend.herokuapp.com/" + j}
                              download
                              target='_blank'
                              rel="noopener noreferrer"
                            >
                              <img
                                src={"https://imex-backend.herokuapp.com/" + j}
                                alt="products" style={{ marginRight: '10px' }} className="zoom" width={50} height={50}></img>
                            </a>
                          ))}

                        </td>
                        <td>
                          {i.roles.map((role) => (
                            <tr key={role}>{role}</tr>
                          ))}
                        </td>
                        <td>{i.status}</td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalUserAccountScreen;
