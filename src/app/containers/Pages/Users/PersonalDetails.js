import axios from 'axios';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { Link, Redirect } from "react-router-dom";



class PersonalDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            mobile: "",
            name: "",
            password: "",
            confirmPassword:"",
            country: '', msg: '', msgM: '', city: '', msgError: '',
            products: [],
            msgSuccess: '',
            pin: "",
            isLoading: false,
            isPinSent: false,
            isClicked: false,
            isPinVarified: false,
            isError: false,
            isSuccess: false,

        };
        this.mobile = React.createRef();
    }
    handlePinSubmitEvent = (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        const userData = {
            pin: this.state.pin,
            email: this.state.email
        }

        axios
            .post("/api/v1/auth/user/confirmphonenumber", userData)
            .then((response) => {
                console.log("response", response);
                if (response.status === 200)
                    this.setState({
                        msg: response.data,
                        msgError: "",
                        isLoading: false,
                        isError: false,
                        isSuccess: true,
                        isPinVarified: true
                    })
                // this.props.history.push('/login')

            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
                this.setState({
                    msg: error.message,
                    msgSuccess: '',
                    isLoading: false,
                    isError: true,
                    isSuccess: false

                })
            })
    }
    resendCode = (e) => {
        const userData = {
            mobile: this.state.mobile,
        }
        console.log("clicked");

        axios
            .post("/api/v1/auth/user/resendverificationcode", userData)
            .then((response) => {
                console.log("response", response);
                if (response.status === 200)
                    this.setState({
                        msg: response.data,
                        msgError: "",
                        isError: false,
                        isSuccess: true
                    })
            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
                this.setState({
                    msg: error.message,
                    msgSuccess: '',
                    isError: true,
                    isSuccess: false

                })
            })
    }
    saveAndContinue = (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        if(this.state.password!==this.state.confirmPassword)
        {
            this.setState({
                msgError: "Password does not match with Confirm Password",
                msgSuccess: '',
                isLoading: false
            })
        }
        else{
            const userData = {
                name: this.state.name,
                password: this.state.password,
                email: this.state.email.toLowerCase(),
            }
            console.log(userData);
    
            axios
                .post("/api/v1/auth/user/signup", userData)
                .then((response) => {
                    console.log("response", response);
                    if (response.status === 200)
                        this.setState({
                            msgSuccess: response.data,
                            msgError: "",
                            isPinSent: true,
                            isLoading: false
                        })
                })
                .catch(error => {
                    console.log(error)
                    console.log(error.response)
                    this.setState({
                        msgError: error.response.data,
                        msgSuccess: '',
                        isLoading: false
                    })
                })
        }
    }
    render() {
       const { values } = this.props
        if (this.state.isPinVarified) {
            return <Redirect to='/login' />
        }
        else if (this.state.isPinSent) {
            return (
                <>
                    <div className="login-header">
                        <h3>Enter Pin</h3>
                        <p className="small text-muted">
                            Enter pin you received in your Whatsapp to confirm Mobile Number
              </p>
                    </div>
                    {/*  */}
                    <form onSubmit={this.handlePinSubmitEvent} >
                        <div className="form-group form-focus  focused">
                            <input
                                required
                                type="text"
                                className="form-control floating"
                                value={this.state.pin}
                                onChange={(e) => {
                                    this.setState({
                                        pin: e.target.value
                                    })
                                }}
                            />
                            <label className="focus-label">Pin</label>
                        </div>
                        <div
                            className="text-center"
                            style={{ margin: "30px" }}
                        >
                            {this.state.isError ? (
                                <p style={{ color: "red" }}>{this.state.msg}</p>
                            ) : (
                                <></>
                            )}
                            {this.state.isSuccess ? (
                                <p style={{ color: "green" }}>{this.state.msg}</p>
                            ) : (
                                <></>
                            )}
                        </div>
                        {/* <div className="text-right">
                            <span onClick={()=>this.ResendCode} className="forgot-link">
                </span>
                        </div> */}
                        {this.state.isClicked ? (
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
                        <button
                            className="btn btn-block btn-lg login-btn"
                            type="button"
                            onClick={this.resendCode}
                        >
                            Resend Code
                            </button>


                    </form>
                </>
            )
        }
        else {
            return (
                <form onSubmit={this.saveAndContinue} >
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <div className="form-group form-focus focused">
                                <input
                                    type="text"
                                    className="form-control floating"
                                    // onChange={this.props.handleChange('name')}
                                    onChange={(e) => {
                                        this.setState({
                                            name: e.target.value
                                        })
                                    }}
                                    value={this.state.name}
                                    required
                                />
                                <label className="focus-label">User Name</label>
                            </div>
                        </div>

                        <div className="col-12 col-md-12">
                            <div className="form-group form-focus focused">
                                <input
                                    type="email"
                                    className="form-control floating"
                                    onChange={(e) => {
                                        this.setState({
                                            email: e.target.value
                                        })
                                    }}
                                    value={this.state.email}
                                    required
                                />
                                <label className="focus-label">Email</label>
                            </div>
                        </div>

                        <div className="col-12 col-md-12">
                            <div className="form-group form-focus focused">
                                <input
                                    type="password"
                                    className="form-control floating"
                                    value={this.state.password}
                                    onChange={(e) => {
                                        this.setState({
                                            password: e.target.value
                                        })
                                    }}
                                    minLength="4"
                                    required
                                />
                                <label className="focus-label">Password</label>
                            </div>
                        </div>

                        <div className="col-12 col-md-12">
                            <div className="form-group form-focus focused">
                                <input
                                    type="password"
                                    className="form-control floating"
                                    value={this.state.confirmPassword}
                                    onChange={(e) => {
                                        this.setState({
                                            confirmPassword: e.target.value
                                        })
                                    }}
                                    minLength="4"
                                    required
                                />
                                <label className="focus-label">Confirm Password</label>
                            </div>
                        </div>

                    </div>

                    <div
                        className="text-center"
                        style={{ marginTop: "15px", marginBottom: "15px" }}
                    >
                        <p style={{ color: 'green' }}>{this.state.msgSuccess}</p>
                        <p style={{ color: "#FF0000" }}>{this.state.msgError}</p>
                    </div>
                    <div className="text-right">
                        <Link to="/login" className="forgot-link" style={{ color: "#000" }}>
                            Already have an account?
                              </Link>
                    </div>
                    {/* <div>
                        <button className="btn login-btn" style={{ textAlign: "left" }} onClick={this.back}>Back</button>

                    </div> */}
                    <br />
                    <div>
                        {this.state.isLoading ? (
                            <div className="text-center">
                                <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ color: "rgb(167,0,0)" }}
                                >
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </div>
                        ) : (
                            <button className="btn btn-block btn-lg login-btn" type="submit">
                                Sign Up </button>
                        )}

                    </div>
                    <div>
                    </div>
                </form >
            )
        }

    }
}

export default PersonalDetails;