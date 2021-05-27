import React from "react";
import { Button, Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function NetworkErrorModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Wrong Network</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"> <i className="fas fa-times-circle fa-10x"></i></Modal.Body>
            <Modal.Body>Your wallet is connected to the <strong>{props.network} test Network</strong>. To use Robot Drop User must be Connected to <strong>Ropsten test Network</strong>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
    </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default NetworkErrorModal;
