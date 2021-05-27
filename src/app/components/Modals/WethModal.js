import { Typography } from "@material-ui/core";
import React from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function WethModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Get Weth</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"> <i className="fas fa-exclamation-circle fa-10x"></i></Modal.Body>
            <Modal.Body>
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
                        <Typography variant="h6" gutterBottom  >Enter Amount to convert</Typography>
                    </Col>
                    <Col className="text-right">
                        <input type='number' step="0.0001" min={0} max={props.balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={props.weth} onChange={(evt) => {
                            if (evt.target.value >= 0) {
                                if (evt.target.value > props.balance / 10 ** 18) {
                                    props.setWeth(props.balance / 10 ** 18)
                                }
                                else {
                                    props.setWeth(evt.target.value)
                                }
                            }
                            else {
                                props.setWeth(0)
                            }

                        }} />
                    </Col>
                </Row>



            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
    </Button>
                {props.isConfirmingWeth ? (
                    <div align="center" className="text-center">
                        <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#ff0000" }}
                        >

                        </Spinner>
                        <span style={{ color: "#ff0000" }} className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <Button variant="primary" onClick={() => props.confirmGetWeth()}>
                        Yes, Proceed!
                    </Button>
                )}

            </Modal.Footer>
        </Modal>

    );
}

export default WethModal;
