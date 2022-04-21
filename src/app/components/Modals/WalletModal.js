import { Avatar, Card, CardHeader } from "@material-ui/core";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Casper from '../../assets/img/cspr.png';
import Torus from '../../assets/img/torus.png';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";



function WalletModal(props) {
    console.log('props', props);
    return (
        <Modal centered show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Wallet </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Card onClick={() => {
                    props.torusLogin()
                    props.setSelectedWallet('Torus')
                    localStorage.setItem('selectedWallet','Torus')
                }} className='custom-card'>
                    <CardHeader
                        avatar={<Avatar src={Torus} aria-label="Torus Wallet" />}
                        title='Torus Wallet'
                        subheader="Connect to Torus Waller"
                    />
                </Card>
                <hr></hr> */}
                <Card onClick={() => {
                    props.casperLogin()
                    localStorage.setItem('selectedWallet', 'Casper')
                    props.setSelectedWallet('Casper')
                }} className='custom-card'>
                    <CardHeader
                        avatar={<Avatar src={Casper} aria-label="Casper Signer" />}
                        title='Casper Signer'
                        subheader="Connect to Casper Signer"
                    />
                </Card>
            </Modal.Body>
        </Modal>

    );
}

export default WalletModal;
