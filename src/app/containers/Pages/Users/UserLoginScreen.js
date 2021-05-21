import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import windowSize from "react-window-size";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import loginBanner from "../../../assets/img/Login.png";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import Header from "../../../components/Headers/Header";
import { Form, Ref } from 'semantic-ui-react';

function UserLoginScreen(props) {
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();// eslint-disable-next-line
  let [data, setData] = useState("");
  let [isLoading, setIsLoading] = useState(false);// eslint-disable-next-line
  let [isError, setIsError] = useState(false);
  let [msg, setMsg] = useState("");
  let [isMobileVarified, setIsMobileVarified] = useState(false);

  let handleSubmitEvent = (event) => {
    setMsg("");
    setIsError(false);
    setIsLoading(true);
    event.preventDefault();
    axios
      .post("user/auth/adminlogin", {
        username: email.toLowerCase(),
        password: password,
      })
      .then((response) => {
        console.log("response", response);

        Cookies.set("Authorization", response.data.token, {
        });
        setData(response.data.token);

        setIsLoading(false);
        window.location.reload();

      })
      .catch((error) => {
        if (error.response !== undefined) {
          if (error.response.status === 400) {
            setMsg("Incorrect Email or password entered");
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
                        <img
                          src={loginBanner}
                          className="img-fluid"
                          alt="Doccure Login"
                          style={{ height: "400px", paddingTop: "20px" }}
                        />
                      </div>
                      <div className="col-md-11 col-lg-5 login-right">

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
                                // defaultValue={email}
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
                                // defaultValue={password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <label className="focus-label">Password</label>
                            </div>
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
                                  style={{ color: "#ff0000" }}
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

export default windowSize(UserLoginScreen);
