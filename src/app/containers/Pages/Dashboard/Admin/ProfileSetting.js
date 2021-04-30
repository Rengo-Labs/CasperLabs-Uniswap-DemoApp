import React, { useState, useEffect } from "react";

import axios from "axios";
import { Spinner, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";

function ProfileSetting(props) {
  let [isImageSelected, setIsImageSelected] = useState(false);
  let [imageData, setImageData] = useState();
  let [mobileInput, setMobileInput] = useState();
  let [isSavingChanges, setIsSavingChanges] = useState(false);
  let [isFieldsChanged, setIsFieldChanged] = useState(false);
  let [check, setCheck] = useState(false);
  let handleSet2FAcheck = (e) => {
    setCheck(!check);
    setIsFieldChanged(true);
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  let [fileType, setFileType] = useState();
  let [fileName, setFileName] = useState();
  let onChangePictureHandler = (event) => {
    if (event.target.files[0] !== undefined) {
      let fileParts = event.target.files[0].name.split(".");
      setFileName(`${props.userData._id}${Date.now()}`);
      setFileType(fileParts[1]);
      setImageData(event.target.files[0]);
      setIsImageSelected(true);
    }
  };
  useEffect(() => {
    if (props.userData) {
      if (props.userData._2FA) {
        setCheck(props.userData._2FA);
      }
    }
    props.setActiveTab({
      dashboard: "",
      totalUserAccount: "",
      pendingUserAccount: "",
      earningsList: "",
      tradeListOrders: "",
      referralEarnings: "",
      disputedOrders: "",
      resolvedDisputedOrders: "",
      settings: "active",
      changePassword: "",
    });// eslint-disable-next-line
  }, []);
  let onSubmitHandleEvent = (event) => {
    setIsSavingChanges(true);
    event.preventDefault();

    if (isImageSelected) {
      axios
        .post("/api/v1/users/sign_s3", {
          fileName: fileName,
          fileType: fileType,
        })
        .then((response) => {
          var returnData = response.data.data.returnData;
          var signedRequest = returnData.signedRequest;
          var url = returnData.url;
          delete axios.defaults.headers.common["Authorization"];
          // Put the fileType in the headers for the upload
          var options = {
            headers: {
              "Content-Type": fileType,
            },
          };
          axios
            .put(signedRequest, imageData, options)
            .then((result) => {
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${Cookies.get("Authorization")}`;
              axios
                .post(`/api/v1/users/upload/image/${props.userData._id}`, {
                  url: url,
                })
                .then((response) => {
                  if (!isFieldsChanged) {
                    setIsSavingChanges(false);
                    handleShowSuccessModal();
                    props.handleDataUpdated();
                  }
                })
                .catch((error) => {
                  setIsSavingChanges(false);
                  if (process.env.NODE_ENV === "development") {
                    console.log(error);
                  }
                });
            })
            .catch((error) => {
              if (process.env.NODE_ENV === "development") {
                alert("ERROR " + JSON.stringify(error));
                console.log(error);
              }
              setIsSavingChanges(false);
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${Cookies.get("Authorization")}`;
              // setMsg("Couldn't Upload File, try again");
              // handleShowSuccessModal();
            });
        })
        .catch((error) => {
          if (process.env.NODE_ENV === "development") {
            alert(JSON.stringify(error));
          }
          setIsSavingChanges(false);
          // setMsg("Couldn't Get Signed URL ");
          // handleShowSuccessModal();
        });
    }
    if (isFieldsChanged) {
      let data = {
        mobile: mobileInput,
        _2FA: check,
      };
      axios
        .put(`/api/v1/users/${props.userData._id}`, data, {})
        .then((response) => {
          setIsSavingChanges(false);
          handleShowSuccessModal();
          props.handleDataUpdated();
        })
        .catch((error) => {
          setIsSavingChanges(false);
          if (process.env.NODE_ENV === "development") {
            console.log(error);
          }
        });
    }
  };
  return (
    <>
      {/* {props.userData.name !== undefined ? ( */}
      <div className="card">
        <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
          <li className="breadcrumb-item">
            <a href="/">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Profile Settings</li>
        </ul>
        <div className="card-body">
          {/* // <!-- Profile Settings Form --> */}
          <form onSubmit={onSubmitHandleEvent}>
            <div className="row form-row">
              <div className="col-12 col-md-12">
                <div className="form-group">
                  <div className="change-avatar">
                    <div className="profile-img">
                      {/* {props.userData.pictureURL !== undefined ? ( */}
                      {/* <img
                      src={props.userData.pictureURL}
                      alt="User Image"
                      /> */}
                      {/* ) : (
                            <> */}
                      <div
                        style={{
                          background: "#E9ECEF",
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <p
                          style={{
                            color: "#00D0F1",
                            fontSize: "24px",
                            marginLeft: "35%",
                            paddingTop: "33%",
                          }}
                        >
                          {/* <strong>{props.userData.name[0]}</strong> */}
                        </p>
                      </div>
                      {/* </>
                          )} */}
                    </div>
                    <div className="upload-img">
                      <div
                        className="change-photo-btn"
                        style={{ backgroundColor: "rgb(167,0,0)" }}
                      >
                        <span>
                          <i className="fa fa-upload"></i>
                          Upload Photo
                        </span>
                        <input
                          name="sampleFile"
                          type="file"
                          className="upload"
                          accept=".png,.jpg,.jpeg,.gif"
                          onChange={onChangePictureHandler}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                  // defaultValue={props.userData.name}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Email ID</label>
                  <input
                    disabled
                    type="email"
                    className="form-control"
                  // defaultValue={props.userData.email}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    // pattern="[+]852[0-9]{8}"
                    type="text"
                    // defaultValue={props.userData.mobile}
                    className="form-control"
                    onChange={(e) => {
                      setMobileInput(e.target.value);
                      setIsFieldChanged(true);
                    }}
                    required
                  />
                  {/* <small>Format: +852XXXXXXXX</small> */}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Two Factor Authentication</label>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="If enabled, you will receive a security code for login!"
                    checked={check}
                    onChange={handleSet2FAcheck}
                  />
                </div>
              </div>
            </div>
            <div className="submit-section">
              {isSavingChanges ? (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ color: "#00D0F1" }}
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    type="submit"
                    // className="btn btn-primary submit-btn"
                    className="btn submit-btn"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </form>
          <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
            <Modal.Header closeButton>
              <Modal.Title>Successfully Updated</Modal.Title>
            </Modal.Header>
          </Modal>
        </div>
      </div>
      {/* ) : (
      <></>
        )} */}
    </>
  );
}
export default ProfileSetting;
