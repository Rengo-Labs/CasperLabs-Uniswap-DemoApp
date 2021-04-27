import axios from "axios";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link, Redirect } from "react-router-dom";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import Header from "../../../components/Headers/Header";


function ForgotPassword() {
  let [email, setEmail] = useState("");
  let [pin, setPin] = useState("");
  let [forgot, setForgot] = useState(false);
  let [pinEntered, setPinEntered] = useState(false);
  let [done, setDone] = useState(false);
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [msg, setMsg] = useState();

  let [isError, setIsError] = useState();
  let [isClicked, setIsClicked] = useState();
  let handleForgotPasswordSubmitEvent = (event) => {
    event.preventDefault();
    setIsClicked(true);
    setIsError(false);
    setMsg();
    axios
      .post("/api/v1/users/forgotPassword", {
        email: email.toLowerCase(),
      })
      .then(
        (response) => {
          setIsClicked(false);
          setForgot(true);
          // console.log(response);
        },
        (error) => {
          if (process.env.NODE_ENV === "development") {
            console.log(error);
          }

          setMsg("User not found");
          setIsClicked(false);
          setIsError(true);
        }
      );
  };

  let handlePinSubmitEvent = (event) => {
    event.preventDefault();
    setIsClicked(true);
    setIsError(false);
    setMsg();
    axios
      .post("/api/v1/users/verifyResetPasswordPin", {
        email: email.toLowerCase(),
        resetPasswordPin: pin,
      })
      .then(
        (response) => {
          setIsClicked(false);
          setPinEntered(true);
        },
        (error) => {
          if (process.env.NODE_ENV === "development") {
            console.log(error);
          }
          setMsg("Incorrect Pin Entered");
          setIsClicked(false);
          setIsError(true);
        }
      );
  };

  let handlePasswordSubmitEvent = (event) => {
    event.preventDefault();
    setIsClicked(true);
    setIsError(false);
    setMsg();
    if (confirmPassword === password) {
      axios
        .post("/api/v1/users/resetPassword", {
          email: email.toLowerCase(),
          newPassword: password,
        })
        .then(
          (response) => {
            setIsClicked(false);
            setForgot(true);
            setDone(true);
          },
          (error) => {
            if (process.env.NODE_ENV === "development") {
              console.log(error);
            }
            setMsg("Incorrect Pin Entered");
            setIsClicked(false);
            setIsError(true);
          }
        );
    } else {
      setMsg("Password and Confirm Password should be same.");
      setIsClicked(false);
      setIsError(true);
    }
  };

  return (
    // <!-- Page Content -->
    <div className="account-page" style={{ height: "inherit" }}>
      <div className="main-wrapper" style={{ height: "inherit" }}>
        <Header />
        <div className="content" style={{ padding: "0px" }}>
          <div
            className="container-fluid"
            style={{
              padding: "0px",
            }}
          >
            <div className="row">
              <div
                className="col-lg-12 login-screen"
                style={{ paddingBottom: "8%" }}
              >
                {/* <!-- Login Tab Content --> */}
                <div className="account-content">
                  <div className="row align-items-center justify-content-center">
                    <div
                      className="col-md-12 col-lg-4 login-right"
                      style={{
                        borderRadius: "12px",
                        position: "static",
                        marginTop: "170px",
                        marginRight: "10px",
                      }}
                    >

                      {!forgot ? (
                        <>
                          <div className="login-header">
                            <h3>Forgot Password?</h3>
                            <p className="small text-muted">
                              Enter your email to get a password reset link
                            </p>
                          </div>
                          <form onSubmit={handleForgotPasswordSubmitEvent}>
                            <div className="form-group form-focus  focused">
                              <input
                                required
                                type="email"
                                className="form-control floating"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                }}
                              />
                              <label className="focus-label">Email</label>
                            </div>
                            <div
                              className="text-center"
                              style={{ margin: "30px" }}
                            >
                              {isError ? (
                                <p style={{ color: "red" }}>{msg}</p>
                              ) : (
                                  <></>
                                )}
                            </div>
                            <div className="text-right">
                              <Link to="/login" className="forgot-link">
                                Remember your password
                              </Link>
                            </div>
                            {isClicked ? (
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
                                <button
                                  className="btn btn-block btn-lg login-btn"
                                  type="submit"
                                >
                                  Reset Password
                                </button>
                              )}
                          </form>
                        </>
                      ) : !pinEntered ? (
                        <>
                          <div className="login-header">
                            <h3>Enter Pin</h3>
                            <p className="small text-muted">
                              Enter pin you received in your email
                            </p>
                          </div>
                          <form onSubmit={handlePinSubmitEvent}>
                            <div className="form-group form-focus  focused">
                              <input
                                required
                                type="text"
                                className="form-control floating"
                                value={pin}
                                onChange={(e) => {
                                  setPin(e.target.value);
                                }}
                              />
                              <label className="focus-label">Pin</label>
                            </div>
                            <div
                              className="text-center"
                              style={{ margin: "30px" }}
                            >
                              {isError ? (
                                <p style={{ color: "red" }}>{msg}</p>
                              ) : (
                                  <></>
                                )}
                            </div>
                            <div className="text-right">
                              <Link to="/login" className="forgot-link">
                                Remember your password
                              </Link>
                            </div>
                            {isClicked ? (
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
                                <button
                                  className="btn btn-block btn-lg login-btn"
                                  type="submit"
                                >
                                  Submit
                                </button>
                              )}
                          </form>
                        </>
                      ) : (
                            <>
                              <div className="login-header">
                                <h3>Reset Password</h3>
                              </div>
                              <form onSubmit={handlePasswordSubmitEvent}>
                                <div className="form-group form-focus focused">
                                  <input
                                    required
                                    type="password"
                                    className="form-control floating"
                                    onChange={(e) => setPassword(e.target.value)}
                                  />
                                  <label className="focus-label">
                                    New Password
                              </label>
                                </div>
                                <div className="form-group form-focus  focused">
                                  <input
                                    required
                                    type="password"
                                    className="form-control floating"
                                    onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                    }
                                  />
                                  <label className="focus-label">
                                    Confirm Password
                              </label>
                                </div>
                                <div
                                  className="text-center"
                                  style={{ margin: "30px" }}
                                >
                                  {isError ? (
                                    <p style={{ color: "red" }}>{msg}</p>
                                  ) : (
                                      <></>
                                    )}
                                </div>
                                <div className="submit-section">
                                  {isClicked ? (
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
                                      <button
                                        type="submit"
                                        className="btn btn-block btn-lg login-btn"
                                      >
                                        Save Changes
                                      </button>
                                    )}
                                </div>
                              </form>
                            </>
                          )}
                      {done ? <Redirect to="/login" /> : <></>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer position="absolute" />
      </div>
    </div>
  );
}

export default ForgotPassword;
