import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function SaleCubeModal(props) {
    const [time, setTime] = useState(new Date());
    const [timeStamp, setTimeStamp] = useState(time.getTime() / 1000);
    const [price, setPrice] = useState();
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Put on Sale</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"> <i className="fas fa-exclamation-circle fa-10x"></i></Modal.Body>
            <Modal.Body>
                <div className="container">
                    <div className="form-group">
                        <Row>
                            <Typography variant="h6" gutterBottom  >Sale Price (ETH)</Typography>
                            <input type='number' step="0.0001" min={0} className='form-control' style={{ marginBottom: '20px' }} value={price} onChange={(evt) => {
                                if (evt.target.value >= 0) {
                                    console.log("evt.target.value",evt.target.value);
                                    setPrice(evt.target.value)
                                }
                                else {
                                    setPrice(0)
                                }

                            }} />
                        </Row>
                        <Row>
                            <Typography variant="h6" gutterBottom  >Expires in:</Typography>
                            <DateTimePicker
                                className="form-control"
                                onChange={(e) => {
                                    console.log(e);
                                    console.log("e.getTime()", Math.round(e.getTime() / 1000));
                                    setTimeStamp(Math.round(e.getTime() / 1000));
                                    setTime(e)
                                }}
                                value={time}
                            />
                        </Row>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
    </Button>
                {props.isConfirmingSale ? (
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
                    <Button variant="primary" onClick={() => props.putOnSale(price,time,timeStamp)}>
                        Yes, Proceed!
                    </Button>
                )}

            </Modal.Footer>
        </Modal>

    );
}

export default SaleCubeModal;
