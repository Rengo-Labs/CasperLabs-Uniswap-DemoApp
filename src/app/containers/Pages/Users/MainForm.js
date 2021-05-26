import React, { Component } from 'react';
import PersonalDetails from './PersonalDetails';

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
        userName: '',
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
    handleStepTwo = ({ userName, country, address, factoryName
    }) => {
        this.setState({
            country, userName, address, factoryName
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

    render() {
        const { step } = this.state;
        const { role, name, mobile, email, userName, country, address, factoryName, selfiePhoto, businessCertificatePhoto, passportPhoto, selfiePassportPhoto, productPhotos } = this.state;
        const values = { role, name, mobile, email, userName, country, factoryName, address, selfiePhoto, businessCertificatePhoto, passportPhoto, selfiePassportPhoto, productPhotos };
        switch (step) {

            case 1:
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