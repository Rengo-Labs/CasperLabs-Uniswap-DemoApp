import React, { Component } from 'react';
import PersonalDetails from './PersonalDetails';
import SignupDetails from './SignupDetails';
import UserDetails from './UserDetails';

class MainForm extends Component {
    state = {
        step: 1,
        role: ["importer","exporter"],
        name: '',
        email: '',
        mobile: '',
        selfiePhoto: '',
        businessCertificatePhoto: '',
        passportPhoto: '',
        selfiePassportPhoto: '',
        productPhotos: '',
        factoryName: '',
        // password: '',
        city: '',
        country: '',
        address: '',

    }
    nextStep = () => {
        const { step } = this.state
        this.setState({
            step: step + 1
        })
    }

    prevStep = () => {
        const { step } = this.state
        this.setState({
            step: step - 1
        })
    }

    handleChange = input => event => {
        this.setState({ [input]: event.target.value })
    }
    handleStepTwo = ({ city, country, address, factoryName
        // passportPhoto, selfiePassportPhoto 
    }) => {
        this.setState({
            country, city, address, factoryName
            // passportPhoto, selfiePassportPhoto
        });
    }
    handleStepOne = ({ selfiePhoto, businessCertificatePhoto }) => {
        this.setState({ selfiePhoto, businessCertificatePhoto });
    }
    addRole = (role) => {
        this.setState({
            role
        })
    }

    componentDidMount = () => {
    }

    render() {
        const { step } = this.state;
        const { role, name, mobile, email, city, country, address, factoryName, selfiePhoto, businessCertificatePhoto, passportPhoto, selfiePassportPhoto, productPhotos } = this.state;
        const values = { role, name, mobile, email, city, country, factoryName, address, selfiePhoto, businessCertificatePhoto, passportPhoto, selfiePassportPhoto, productPhotos };
        switch (step) {
            // case 1:
            //     return <UserDetails
            //         nextStep={this.nextStep}
            //         addRole={this.addRole}
            //         handleStepOne={this.handleStepOne}
            //         selfiePhoto={selfiePhoto}
            //         businessCertificatePhoto={businessCertificatePhoto}
            //         // removeRole={this.removeRole}
            //         role={role}
            //     />
            case 1:
                return <SignupDetails
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleStepTwo={this.handleStepTwo}
                    values={values}
                />
            case 2:
                return <PersonalDetails
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            default:
        }
    }
}

export default MainForm;