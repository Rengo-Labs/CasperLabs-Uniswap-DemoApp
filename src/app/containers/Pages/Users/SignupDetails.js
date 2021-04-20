// PersonalDetails.jsx
import React, { Component } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import 'react-intl-tel-input/dist/main.css';
import { Form } from 'semantic-ui-react';

import logo from "../../../assets/img/img-04.jpg";


class SignupDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { country: '', msg: '', msgM: '', city: '',address:'',factoryName:'', passportPhoto: '', selfiePassportPhoto: '', passportPhotoBlob: logo, selfiePassportPhotoBlob: logo };
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
                country: values.country,
                city: values.city,
                address:values.address,
                factoryName:values.factoryName,
            })
        // }
    }
    selectCountry(val) {
        this.setState({ country: val });
    }
    // onChangePassportHandler = (event) => {
    //     if (event.target.files[0] !== undefined) {
    //         this.setState({
    //             passportPhoto: event.target.files[0],
    //             passportPhotoBlob: URL.createObjectURL(event.target.files[0])
    //         })
    //     }
    // };
    // onChangePassportSelfieHandler = (event) => {
    //     if (event.target.files[0] !== undefined) {
    //         this.setState({
    //             selfiePassportPhoto: event.target.files[0],
    //             selfiePassportPhotoBlob: URL.createObjectURL(event.target.files[0])
    //         })
    //     }
    // }

    saveAndContinue = (e) => {
        e.preventDefault();
        if (this.state.city === "") {
            this.setState({ msg: 'Please Enter City' });
            return;
        }
        else if (this.state.country === "") {
            this.setState({ msg: 'Please Select Country' });
            return;
        }
        else if (this.state.address === "") {
            this.setState({ msg: 'Please Enter Address' });
            return;
        }
        else if (this.state.factoryName === "") {
            this.setState({ msg: 'Please Enter Business Name' });
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
                city: this.state.city,
                country: this.state.country,
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
        const { country } = this.state;

        return (
            <Form >
                <div className="row">
                    {/* <div className="col-12 col-md-6">
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
                                        <img src={this.state.passportPhotoBlob} alt="Passport" />
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
                                            onChange={this.onChangePassportHandler}
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
                                        <img src={this.state.selfiePassportPhotoBlob} alt="Selfie with Passport" />
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
                                            onChange={this.onChangePassportSelfieHandler}
                                        />
                                    </div>
                                    <small className="form-text text-muted">
                                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="col-12 col-md-12">
                        <div className="form-group form-focus focused">

                            <input
                                // placeholder='City'
                                onChange={(e) => {
                                    this.setState({ city: e.target.value })
                                }}
                                defaultValue={values.city}
                                className="form-control floating"
                                required
                            />
                            <label className="focus-label">City</label>

                        </div>
                    </div>
                    <div className="col-12 col-md-12">
                        <div className="form-group ">
                            <CountryDropdown
                                value={country}
                                onChange={(val) => {
                                    this.selectCountry(val);
                                }}
                                className="form-control floating"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-12">
                        <div className="form-group form-focus focused">
                            <input
                                type="text"
                                className="form-control floating"
                                onChange={(e) => {
                                    this.setState({ address: e.target.value })
                                }}
                                defaultValue={values.address}
                                required
                            />
                            <label className="focus-label">Address</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-12">
                        <div className="form-group form-focus focused">
                            <input
                                type="text"
                                className="form-control floating"
                                onChange={(e) => {
                                    this.setState({ factoryName: e.target.value })
                                }}
                                defaultValue={values.factoryName}
                                required
                            />
                            <label className="focus-label">Business Name</label>
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
                        Save And Continue</button>
                </div>
            </Form>
        )
    }
}

export default SignupDetails;