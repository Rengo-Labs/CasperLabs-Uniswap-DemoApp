// UserDetails.jsx
import React, { Component, createRef } from 'react';
import { Form, Ref } from 'semantic-ui-react';
import logo from "../../../assets/img/img-04.jpg";

class UserDetails extends Component {

    importer = createRef()
    exporter = createRef()

    state = {
        count: 0,
        selfiePhoto: '',
        selfiePhotoBlob: logo,
        businessCertificatePhoto: '',
        businessCertificatePhotoBlob: logo,
        msg: ''
    }
    saveAndContinue = (e) => {
        e.preventDefault();
        if (this.state.count === 0) {
            this.setState({
                msg: "Select role to proceed."
            })
            return;
        }
        // else if (this.state.selfiePhoto === "") {
        //     this.setState({ msg: 'Please Select Selfie Photo' });
        //     return;
        // }
        // else if (this.state.businessCertificatePhoto === "") {
        //     this.setState({ msg: 'Please Select Your Business Certificate Photo' });
        //     return;
        // } 
        else {
            e.preventDefault()
            // this.props.handleStepOne({
            //     selfiePhoto: this.state.selfiePhoto,
            //     businessCertificatePhoto: this.state.businessCertificatePhoto
            // })
            this.props.nextStep()

        }
    }


    onChangeCheckbox = (evt) => {

        console.log("evt.target.id", evt.target.id);
        this.setState({
            count: 1
        })
        this.props.addRole(evt.target.id);
    }
    onChangeSelfieHandler = (event) => {
        if (event.target.files[0] !== undefined) {
            this.setState({
                selfiePhoto: event.target.files[0],
                selfiePhotoBlob: URL.createObjectURL(event.target.files[0])
            })
        }
    };
    onChangeBusinessCertificateHandler = (event) => {
        if (event.target.files[0] !== undefined) {
            this.setState({
                businessCertificatePhoto: event.target.files[0],
                businessCertificatePhotoBlob: URL.createObjectURL(event.target.files[0])
            })
        }
    };
    componentDidMount = () => {
        const { role, selfiePhoto, businessCertificatePhoto } = this.props;
        if (role === 'importer')
            this.importer.current.lastChild.firstChild.checked = true;
        else if (role === 'exporter')
            this.exporter.current.lastChild.firstChild.checked = true;
        if (selfiePhoto !== '' && businessCertificatePhoto !== '') {
            this.setState({
                selfiePhotoBlob: URL.createObjectURL(selfiePhoto),
                businessCertificatePhotoBlob: URL.createObjectURL(businessCertificatePhoto),
                selfiePhoto: selfiePhoto,
                businessCertificatePhoto: businessCertificatePhoto,
                count: 1
            })
        }
        else{

        }
    }
    render() {
        return (
            <Form >
                <Form.Group grouped>
                    <label>What's your profession</label>
                    <Ref innerRef={this.importer}>
                        <Form.Field id="importer" label='Importer' name="role" control='input' type='radio' onClick={(evt) => this.onChangeCheckbox(evt)} />
                    </Ref>
                    <Ref innerRef={this.exporter}>
                        <Form.Field id="exporter" label='Exporter' name="role" control='input' type='radio' onClick={(evt) => this.onChangeCheckbox(evt)} />
                    </Ref>
                </Form.Group>
                {/* <div className="row">
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
                                        <img src={this.state.selfiePhotoBlob} alt="Selfie" />
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
                                            onChange={this.onChangeSelfieHandler}
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
                                        <img src={this.state.businessCertificatePhotoBlob} alt="Business Certificate" />
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
                                            onChange={this.onChangeBusinessCertificateHandler}
                                        />
                                    </div>
                                    <small className="form-text text-muted">
                                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <br />
                <div className="text-center">
                    <p style={{ color: "red" }}>{this.state.msg}</p>
                </div>
                <div className="text-center">
                    <button
                        onClick={this.saveAndContinue}
                        className="btn btn-lg login-btn"
                    >Save And Continue </button>
                </div>
            </Form >
        )
    }
}

export default UserDetails;