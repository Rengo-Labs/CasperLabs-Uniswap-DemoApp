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
import logo from "../../../assets/img/img-04.jpg";


function KYCScreen(props) {
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();// eslint-disable-next-line
    let [data, setData] = useState("");
    let [isLoading, setIsLoading] = useState(false);// eslint-disable-next-line
    let [isError, setIsError] = useState(false);
    let [msg, setMsg] = useState("");
    // eslint-disable-next-line
    let [twoFACheck, setTwoFACheck] = useState(false);

    let handleSubmitEvent = (event) => {
        setMsg("");
        setIsError(false);
        setIsLoading(true);
        event.preventDefault();
        axios
            .post("/api/v1/auth/user/login", {
                email: email.toLowerCase(),
                password: password,
            })
            .then((response) => {
                console.log("response", response);
                if (response.data === "pending") {
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
                        window.location.reload();
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
    let [pin, setPin] = useState("");
    let [isSendingPin, setIsSendingPin] = useState(false);
    let [pinError, setPinError] = useState("");
    let handlePinSubmitEvent = (e) => {
        e.preventDefault();
        setPinError("");
        setIsSendingPin(true);
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
                        style={{ paddingTop: "180px", height: "150vh" }}
                        position="absolute"

                    >
                        <div className="container-fluid">
                            <div
                                className="row"
                                style={{ height: `${props.windowHeight}`, marginRight: "px" }}
                            >
                                <div className="col-md-8 offset-md-2">
                                    <div className="account-content">
                                        <div className="row align-items-center justify-content-center">
                                            {/* <div
                                                className="col-md-8 col-lg-7 login-left"
                                                style={{ textAlign: "center" }}
                                            >
                                                <img
                                                    src={loginBanner}
                                                    className="img-fluid"
                                                    alt="Doccure Login"
                                                    style={{ height: "400px", paddingTop: "20px" }}
                                                />
                                            </div> */}
                                            <div className="col-md-11 col-lg-11 login-right">
                                                <div className="login-header">
                                                    <h3 style={{ textAlign: "center" }}>KYC Information</h3>
                                                </div>
                                                <form onSubmit={handleSubmitEvent}>
                                                    <div className="row">
                                                        <div className="col-12 col-md-6">
                                                            <label className="focus-label">Selfie Photo</label>
                                                            <div className="form-group">
                                                                <div className="change-avatar">
                                                                    <div className="profile-img">
                                                                        <div
                                                                            style={{
                                                                                background: "#E9ECEF",
                                                                                width: "100px",
                                                                                height: "100px",
                                                                            }}
                                                                        >
                                                                            <img src={logo} alt="Selfie" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="upload-img">
                                                                        <div
                                                                            className="change-photo-btn"
                                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                                        >
                                                                            <span>
                                                                                <i className="fa fa-upload"></i>
                          Upload photo
                        </span>
                                                                            <input
                                                                                name="sampleFile"
                                                                                type="file"
                                                                                className="upload"
                                                                                accept=".png,.jpg,.jpeg,.gif"
                                                                            // onChange={this.onChangeSelfieHandler}
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
                                                            <label className="focus-label">Business Certificate Photo</label>
                                                            <div className="form-group">
                                                                <div className="change-avatar">
                                                                    <div className="profile-img">
                                                                        <div
                                                                            style={{
                                                                                background: "#E9ECEF",
                                                                                width: "100px",
                                                                                height: "100px",
                                                                            }}
                                                                        >
                                                                            <img src={logo} alt="Business Certificate" />
                                                                        </div>
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
                                                                            // onChange={this.onChangeBusinessCertificateHandler}
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
                                                            <label className="focus-label">Passport Picture</label>
                                                            <div className="form-group">
                                                                <div className="change-avatar">
                                                                    <div className="profile-img">
                                                                        <div
                                                                            style={{
                                                                                background: "#E9ECEF",
                                                                                width: "100px",
                                                                                height: "100px",
                                                                            }}
                                                                        >
                                                                            <img src={logo} alt="Passport" />
                                                                        </div>
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
                                                                            // onChange={this.onChangePassportHandler}
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
                                                            <label className="focus-label">Passport Picture with Selfie</label>
                                                            <div className="form-group">
                                                                <div className="change-avatar">
                                                                    <div className="profile-img">
                                                                        <div
                                                                            style={{
                                                                                background: "#E9ECEF",
                                                                                width: "100px",
                                                                                height: "100px",
                                                                            }}
                                                                        >
                                                                            <img src={logo} alt="Selfie with Passport" />
                                                                        </div>
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
                                                                            // onChange={this.onChangePassportSelfieHandler}
                                                                            />
                                                                        </div>
                                                                        <small className="form-text text-muted">
                                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-12">
                                                            <label className="focus-label">
                                                                <span>Upload other pictures</span>
                                                                <small className="form-text text-muted">
                                                                    e.g.  Products, Factories and Inventories
                                                                </small>
                                                            </label>
                                                            <div className="form-group">
                                                                <div className="change-avatar">
                                                                    <div className="upload-img">
                                                                        <div
                                                                            className="change-photo-btn"
                                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                                        >
                                                                            <span>
                                                                                <i className="fa fa-upload"></i>
                          Upload Photos
                        </span>
                                                                            <input
                                                                                name="sampleFile"
                                                                                type="file"
                                                                                multiple
                                                                                className="upload"
                                                                                accept=".png,.jpg,.jpeg,.gif"
                                                                            // onChange={this.onChangePictureHandler}
                                                                            />
                                                                        </div>
                                                                        <small className="form-text text-muted">
                                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                                                    </div>

                                                                    <div className="col-3 col-md-3 text-muted" style={{ marginBottom: '20px' }}>
                                                                        {/* {this.state.products.length}  */}
                                                                        0 Photos Selected
                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="form-group form-focus focused">
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
                                                    </div> */}
                                                    <div className="text-center">
                                                        <p style={{ color: "red" }}>{msg}</p>
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
                                                            className="btn btn-block btn-lg login-btn"
                                                            type="submit"
                                                        >
                                                            Submit
                                                        </button>
                                                    )}

                                                </form>

                                            </div>
                                        </div>
                                    </div>
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

export default windowSize(KYCScreen);
