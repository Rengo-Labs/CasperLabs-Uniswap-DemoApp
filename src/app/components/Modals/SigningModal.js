import { Typography } from "@material-ui/core";
import React from "react";
import { Alert, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Spinner from "../Spinner/Spinner";

function SigningModal(props) {
    return (
        <Modal show={props.show}>
            <Modal.Header>
                <Modal.Title>Sign transaction </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: 'center' }}>
                <div className="row align-items-center justify-content-center">
                    <Spinner style={{ textAlign: 'center' }} />
                </div>
                <Typography variant="h6" style={{ margin: '30px' }} gutterBottom className="neonText" >Pending...</Typography>
            </Modal.Body>
            <Modal.Body>
                <Alert color="light">
                    Waiting for your transaction to be picked up and included in the blockchain
                </Alert>
            </Modal.Body>

        </Modal>

    );
}

export default SigningModal;
