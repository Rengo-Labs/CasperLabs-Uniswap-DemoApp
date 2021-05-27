import { Typography } from "@material-ui/core";
import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function ConfirmBuyCubeModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Confirm Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"> <i className="fas fa-exclamation-circle fa-10x"></i></Modal.Body>
            <Modal.Body>
                <h3>Are You Sue you want to Buy</h3>
                <Row>

                    <Col>
                        <Typography variant="h6" gutterBottom  >Your Balance:</Typography>
                    </Col>
                    <Col className="text-right">
                        <Typography variant="h6" gutterBottom color="textSecondary" >{props.balance / 10 ** 18}</Typography>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Typography variant="h6" gutterBottom  >sale Price (ETH):</Typography>
                    </Col>
                    <Col className="text-right">
                        <Typography variant="h6" gutterBottom color="textSecondary" >{props.salePrice / 10 ** 18}</Typography>
                    </Col>
                </Row>
                <Row>

                    <Col>
                        <Typography variant="h6" gutterBottom  >You will Pay:</Typography>
                    </Col>
                    <Col className="text-right">
                        <Typography variant="h6" gutterBottom color="textSecondary" >{props.salePrice/ 10 ** 18}</Typography>
                    </Col>
                </Row>



            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
    </Button>
                <Button variant="primary" onClick={props.ConfirmBuyCube}>
                    Yes, Proceed!
    </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default ConfirmBuyCubeModal;
