import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import windowSize from "react-window-size";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
// import loginBanner from "../../../assets/img/importExport.jpg";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import Header from "../../../components/Headers/Header";
import { Form, Ref } from 'semantic-ui-react';

function LoginScreen(props) {
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();// eslint-disable-next-line
  let [data, setData] = useState("");
  let [isLoading, setIsLoading] = useState(false);// eslint-disable-next-line
  let [isError, setIsError] = useState(false);
  let [isSuccess, setIsSuccess] = useState(false);
  let [mobile, setMobile] = useState("");
  // let [isClicked,setIsClicked]=(false);


  let [role, setRole] = useState('');
  let [msg, setMsg] = useState("");
  // eslint-disable-next-line
  let [twoFACheck, setTwoFACheck] = useState(false);
  let [isMobileVarified, setIsMobileVarified] = useState(false);
  let onChangeCheckbox = (evt) => {
    console.log(evt.target.id);
    setRole(evt.target.id);
  }

  let handleSubmitEvent = (event) => {
    setMsg("");
    setIsError(false);
    setIsLoading(true);
    event.preventDefault();
    axios
      .post("/api/v1/auth/user/login", {
        email: email.toLowerCase(),
        password: password,
        roles: role
      })
      .then((response) => {
        console.log("response", response);
        if (response.data === "Confirm Mobile Number First!") {
          resendCode();
          setIsMobileVarified(true);
          setIsLoading(false);
        } else if (response.data === "pending") {
          setMsg("Admin Aproval Required.");
          setIsLoading(false);
        } else if (response.data === "rejected") {
          setMsg("Admin Rejected your Account.");
          setIsLoading(false);
        }

        else {
          if (response.data.role === "participant") {
            setMsg("Individual users must login using Mobile Application.");
          } else {
            Cookies.set("Authorization", response.data.token, {
            });
            setData(response.data.token);

            setIsLoading(false);
            // window.location.reload();
          }
        }
      })
      .catch((error) => {
        if (error.response !== undefined) {
          if (error.response.status === 400) {
            setMsg("Incorrect email or password entered");
          } else if (error.response.status === 501) {
            setMsg("Cannot send 2FA email, try again.");
          } else {
            setMsg("Unknown Error Occured, try again.");
          }
        } else {
          setMsg("Unknown Error Occured, try again.");
        }

        // setMsg(error.message);
        // console.log(error);
        // console.log(error.message);

        setIsError(true);
        setIsLoading(false);
      });
  };
  // eslint-disable-next-line
  let [pinEmail, setPinEmail] = useState();
  let [otp, setOtp] = useState();
  let [pin, setPin] = useState("");
  let [isSendingPin, setIsSendingPin] = useState(false);
  let [pinError, setPinError] = useState("");

  let handleOtpSubmitEvent = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      pin: otp,
      email: email
    }

    axios
      .post("/api/v1/auth/user/confirmphonenumber", userData)
      .then((response) => {
        console.log("response", response);
        if (response.status === 200)
          setMsg(response.data)
        // setmsgError("")
        setIsLoading(false);
        setIsError(false);
        setIsSuccess(true);
        setIsMobileVarified(false)
        // this.props.history.push('/login')

      })
      .catch(error => {
        console.log(error)
        console.log(error.response)
        setMsg(error.data)

        setIsLoading(false);
        setIsError(true);
        setIsSuccess(false);
        setIsMobileVarified(true)
      })
  }
  let resendCode = (e) => {
    const userData = {
      mobile: mobile,
    }
    console.log("clicked");

    axios
      .post("/api/v1/auth/user/resendverificationcode", userData)
      .then((response) => {
        console.log("response", response);
        if (response.status === 200)
          setIsError(false);
        setIsSuccess(true);
        setMsg(response.data);
      })
      .catch(error => {
        console.log(error)
        console.log(error.response);
        setMsg(error.data)
        setIsError(true);
        setIsSuccess(false);
      })
  }
  let handlePinSubmitEvent = (e) => {
    e.preventDefault();
    setPinError("");
    setIsSendingPin(true);
    // setIsClicked(true);
    let data = {
      email: pinEmail,
      pin: pin,
    };
    axios
      .post("/api/v1/auth/user/2FAlogin", data)
      .then((response) => {
        // console.log("zohaib: ", response.data);
        if (response.data.role === "participant") {
          setMsg("Individual users must login using Mobile Application.");
        } else {
          Cookies.set("Authorization", response.data.token, {
            sameSite: "Strict",
            secure: true,
          });
          setData(response.data.token);
          setIsLoading(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response !== undefined) {
          if (error.response.status === 400) {
            setPinError("Try login again");
          } else if (error.response.status === 401) {
            setPinError("Incorrect Pin Entered");
          } else {
            setPinError("Unknown Error Occured, try again.");
          }
        } else {
          setPinError("Unknown Error Occured, try again.");
        }
        console.log(error);
        console.log(error.response);
        // setPinError(error.response.data);
        setIsSendingPin(false);
      });
  };
  return (

    <div
      className="account-page"
    // style={{ height: "inherit" }}
    >
      <div
        className="main-wrapper"
      // style={{ height: "inherit" }}
      >
        <div
          className="home-section home-full-height"
        // style={{ height: "inherit" }}
        >
          <Header />

          <div
            className="content"
            // style={{ paddingTop: "12%" }}
            // style={{ paddingTop: "150px" }}
            style={{ paddingTop: "180px", height: "100vh" }}
            position="absolute"

          >
            <div className="container-fluid">
              <div
                className="row"
                style={{ height: `${props.windowHeight}`, marginRight: "px" }}
              >
                <div className="col-md-8 offset-md-2">
                  {/* <!-- Login Tab Content --> */}
                  <div className="account-content">
                    <div className="row align-items-center justify-content-center">
                      <div
                        className="col-md-8 col-lg-7 login-left"
                        style={{ textAlign: "center" }}
                      >
                        {/* <img
                          src={loginBanner}
                          className="img-fluid"
                          alt="Doccure Login"
                          style={{ height: "400px", paddingTop: "20px" }}
                        /> */}
                      </div>
                      <div className="col-md-11 col-lg-5 login-right">
                        {twoFACheck ? (
                          <>
                            <div className="login-header">
                              <h3>Enter Pin</h3>
                              <p className="small text-muted">
                                Enter pin you received in your email
                              </p>
                            </div>
                            <form onSubmit={handlePinSubmitEvent}>
                              <div className="form-group form-focus focused">
                                <input
                                  name="pin"
                                  required
                                  type="text"
                                  className="form-control floating"
                                  defaultValue={pin}
                                  onChange={(e) => {
                                    setPin(e.target.value);
                                  }}
                                />
                                <label className="focus-label">Pin</label>
                              </div>
                              <div className="text-center">
                                <p style={{ color: "red" }}>{pinError}</p>
                              </div>

                              {isLoading ? (
                                <div className="text-center">
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ color: "00d0f1" }}
                                  >
                                    <span className="sr-only">Loading...</span>
                                  </Spinner>
                                </div>
                              ) : (
                                <button
                                  // className="btn btn-primary btn-block btn-lg login-btn"
                                  className="btn btn-block btn-lg login-btn"
                                  type="submit"
                                >
                                  Submit
                                </button>
                              )}
                            </form>
                          </>
                        ) : isMobileVarified ? (
                          <>
                            <div className="login-header">
                              <h3>Enter Pin</h3>
                              <p className="small text-muted">
                                Enter pin you received in your Whatsapp to confirm Mobile Number
              </p>
                            </div>
                            {/*  */}
                            <form onSubmit={handleOtpSubmitEvent} >
                              <div className="form-group form-focus  focused">
                                <input
                                  required
                                  type="text"
                                  className="form-control floating"
                                  value={otp}
                                  onChange={(e) => {
                                    setOtp(e.target.value)
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
                                {isSuccess ? (
                                  <p style={{ color: "green" }}>{msg}</p>
                                ) : (
                                  <></>
                                )}
                              </div>
                              {/* <div className="text-right">
                            <span onClick={()=>this.ResendCode} className="forgot-link">
                </span>
                        </div> */}
                              {isLoading ? (
                                <div className="text-center">
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ color: "#00d0f1" }}
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
                              <button
                                className="btn btn-block btn-lg login-btn"
                                type="button"
                                onClick={resendCode}
                              >
                                Resend Code
                            </button>


                            </form>
                          </>
                        ) : (
                          <>
                            <div className="login-header">
                              <h3 style={{ textAlign: "center" }}>Sign In</h3>
                            </div>
                            <form onSubmit={handleSubmitEvent}>
                              <div className="form-group form-focus focused">
                                <input
                                  type="email"
                                  required
                                  className="form-control floating"
                                  defaultValue={email}
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                  }}
                                />
                                <label className="focus-label">Email</label>
                              </div>
                              <div className="form-group form-focus focused">
                                <input
                                  type="password"
                                  required
                                  className="form-control floating"
                                  defaultValue={password}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="focus-label">Password</label>
                              </div>
                              <Form >
                                <Form.Group grouped>
                                  <label>Select Your Role</label>
                                  {/* <Ref innerRef={this.importer}> */}
                                  <Form.Field id="importer" label='Importer' name="role" control='input' type='radio' onClick={(evt) => onChangeCheckbox(evt)} />
                                  {/* </Ref> */}
                                  {/* <Ref innerRef={this.exporter}> */}
                                  <Form.Field id="exporter" label='Exporter' name="role" control='input' type='radio' onClick={(evt) => onChangeCheckbox(evt)} />
                                  {/* </Ref> */}
                                </Form.Group>
                              </Form>
                              <div className="text-center">
                                <p style={{ color: "red" }}>{msg}</p>
                              </div>
                              <div className="text-right">
                                <Link
                                  to="/forgotPassword"
                                  className="forgot-link"
                                  style={{ color: "#000" }}
                                >
                                  Forgot Password ?
                                </Link>
                              </div>

                              {isLoading ? (
                                <div className="text-center">
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ color: "#00d0f1" }}
                                  >
                                    <span className="sr-only">Loading...</span>
                                  </Spinner>
                                </div>
                              ) : (
                                <button
                                  // className="btn btn-primary btn-block btn-lg login-btn"
                                  className="btn btn-block btn-lg login-btn"
                                  type="submit"
                                >
                                  Sign In
                                </button>
                              )}

                              {/* Incorrect Email or Password. */}

                              <div className="text-center dont-have">
                                Don’t have an account?{" "}
                                <Link to="/register">Register</Link>
                              </div>
                            </form>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <!-- /Login Tab Content --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer position={""} />
      </div>
    </div>
  );
}

export default windowSize(LoginScreen);
