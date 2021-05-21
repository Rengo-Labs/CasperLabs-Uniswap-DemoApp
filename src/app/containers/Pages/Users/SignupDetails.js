// PersonalDetails.jsx
import React, { Component } from 'react';

import { Form } from 'semantic-ui-react';

import logo from "../../../assets/img/img-04.jpg";


class SignupDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', msg: '', msgM: '', userName: '', password: '', confirmPassword: '', passportPhoto: '', selfiePassportPhoto: '', passportPhotoBlob: logo, selfiePassportPhotoBlob: logo };
        this.mobile = React.createRef();
    }
    componentDidMount = () => {
        const { values } = this.props;

        // if (values.passportPhoto !== '' && values.selfiePassportPhoto !== '') {
        this.setState({
            // selfiePassportPhotoBlob: URL.createObjectURL(values.selfiePassportPhoto),
            // passportPhotoBlob: URL.createObjectURL(values.passportPhoto),
            // selfiePassportPhoto: values.selfiePassportPhoto,
            // passportPhoto: values.passportPhoto,
            email: values.email,
            userName: values.userName,
            address: values.address,
            factoryName: values.factoryName,
        })
        // }
    }
    saveAndContinue = (e) => {
        e.preventDefault();
        if (this.state.userName === "") {
            this.setState({ msg: 'Please Enter User Name' });
            return;
        }
        else if (this.state.email === "") {
            this.setState({ msg: 'Please Enter your Email' });
            return;
        }
        else if (this.state.password === "") {
            this.setState({ msg: 'Please Enter Password' });
            return;
        }
        else if (this.state.password !== this.state.confirmPassword) {
            this.setState({ msg: 'Password does not match with Confirm Password' });
            return;
        }
        // else if (this.state.passportPhoto === "") {
        //     this.setState({ msg: 'Please Select Passport Photo' });
        //     return;
        // } else if (this.state.selfiePassportPhoto === "") {
        //     this.setState({ msg: 'Please Select a Selfie with Passport Photo' });
        //     return;
        // }
        else {
            this.props.handleStepTwo({
                userName: this.state.userName,
                email: this.state.email,
                address: this.state.address,
                factoryName: this.state.factoryName,
                // passportPhoto: this.state.passportPhoto,
                // selfiePassportPhoto: this.state.selfiePassportPhoto
            })
            this.props.nextStep();
        }
    }

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        const { values } = this.props
        const { email } = this.state;

        return (
            <Form >
                <div className="row">
                    <div className="col-12 col-md-12">
                        <div className="form-group form-focus focused">
                            <input
                                // placeholder='City'
                                onChange={(e) => {
                                    this.setState({ userName: e.target.value })
                                }}
                                defaultValue={values.userName}
                                className="form-control floating"
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
                                // defaultValue={values.password}
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
                                value={this.state.password}
                                onChange={(e) => {
                                    this.setState({
                                        confirmPassword: e.target.value
                                    })
                                }}
                                // defaultValue={values.password}
                                minLength="4"
                                required
                            />
                            <label className="focus-label">Password</label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <p style={{ color: "#FF0000" }}>{this.state.msg}</p>
                </div>
                {/* <div>
                    <button className="btn login-btn" style={{ textAlign: "left" }} onClick={this.back}>Back</button>
                </div> */}
                <br />
                <div className="text-center">
                    <button className="btn btn-lg login-btn" onClick={this.saveAndContinue}>
                        Sign Up</button>
                </div>
            </Form>
        )
    }
}

export default SignupDetails;