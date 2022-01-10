import { Typography } from "@material-ui/core";
import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function SlippageModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Settings </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"> <i className="fas fa-cog fa-10x"></i></Modal.Body>
            <Modal.Body>
                <Row>

                    <Col>
                        <Typography variant="h6" gutterBottom  >Slippage in %</Typography>
                    </Col>
                    <Col className="text-right">
                        <input type='number' step="0.0001" min={0} max={100} className='form-control' style={{ marginBottom: '20px' }} value={props.slippage} onChange={(evt) => {
                            if (evt.target.value >= 0) {
                                props.setSlippage(evt.target.value)
                            }
                            else {
                                props.setSlippage(0)
                            }

                        }} />
                    </Col>
                </Row>



            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>

    );
}

export default SlippageModal;
