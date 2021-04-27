import React, { useState, useEffect } from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/css/style.css";
import { Spinner, Modal } from "react-bootstrap";
import axios from "axios";

function ChangePassword(props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  let [oldPassword, setOldPassword] = useState();
  let [newPassword, setNewPassword] = useState();
  let [confirmNewPassword, setConfirmNewPassword] = useState();
  let [isSaving, setIsSaving] = useState(false);
  let [isError, setIsError] = useState(false);
  let [errorMsg, setErrorMsg] = useState();

  let handleSubmitEvent = (e) => {
    e.preventDefault();
    setIsError(false);
    setIsSaving(true);
    let data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    if (newPassword === confirmNewPassword) {
      axios
        .post(`/api/v1/users/${props.userData._id}/changePassword`, data)
        .then(
          (response) => {
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setIsSaving(false);
            handleShowSuccessModal();
          },
          (error) => {
            // console.log(error);
            if (error.response.status === 404) {
              setErrorMsg("User not found, try later.");
            } else if (error.response.status === 401) {
              setErrorMsg("Invalid Credentials.");
            } else {
              setErrorMsg("Unknown error occurred, try again.");
            }
            setIsSaving(false);
            setIsError(true);
          }
        );
    } else {
      setErrorMsg("Confirm password not same as new password");
      setIsError(true);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    props.setActiveTab({
      dashboard: "",
      approvalRequests: "",
      reviewModeration: "",
      approvedcompanies: "",
      contractDetails: "",
      settings: "",
      profileSetting: "",
      kyc: "",
      requestAccountApproval: "",
      changePassword: "active",
    });// eslint-disable-next-line
  }, []);
  return (
    <div className="card">
      <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Change Password</li>
      </ul>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12 col-lg-6">
            {/* <!-- Change Password Form --> */}
            <form onSubmit={handleSubmitEvent}>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  defaultValue={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  defaultValue={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  defaultValue={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                  }}
                />
              </div>
              {isError ? (
                <div className="form-group">
                  <p style={{ color: "#FF0000" }}>{errorMsg}</p>
                </div>
              ) : (
                <></>
              )}
              {isSaving ? (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ color: "#ff0000" }}
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <div className="submit-section">
                  <button type="submit" className="btn submit-btn">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
            {/* <!-- /Change Password Form --> */}
          </div>
        </div>
      </div>
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Successfully Updated</Modal.Title>
        </Modal.Header>
      </Modal>
    </div>
  );
}

export default ChangePassword;
