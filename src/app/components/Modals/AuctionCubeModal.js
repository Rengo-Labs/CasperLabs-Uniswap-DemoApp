import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function AuctionCubeModal(props) {// eslint-disable-next-line
    const [time, setTime] = useState(new Date());// eslint-disable-next-line
    const [timeStamp, setTimeStamp] = useState(time.getTime() / 1000);// eslint-disable-next-line
    const [price, setPrice] = useState();
    let [minimumBid, setMinimumBid] = useState();
    let [bidDelta, setBidDelta] = useState();

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [startTimeStamp, setStartTimeStamp] = useState(startTime.getTime() / 1000);
    const [endTimeStamp, setEndTimeStamp] = useState(endTime.getTime() / 1000);
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Put on Auction</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"> <i className="fas fa-exclamation-circle fa-10x"></i></Modal.Body>
            <Modal.Body>
                <div className="container">
                    <div className="form-group">
                        <label>Auction Starts At</label>
                        <div className="form-group">
                            <DateTimePicker
                                className="form-control"
                                onChange={(e) => {
                                    console.log(e);
                                    console.log("e.getTime()", Math.round(e.getTime() / 1000));
                                    setStartTimeStamp(Math.round(e.getTime() / 1000));

                                    setStartTime(e)
                                }}
                                value={startTime}
                            />
                        </div>
                        <label>Auction Ends At</label>
                        <div className="form-group">
                            <DateTimePicker
                                className="form-control"
                                onChange={(e) => {
                                    console.log(e);
                                    console.log("e.getTime()", Math.round(e.getTime() / 1000));
                                    setEndTimeStamp(Math.round(e.getTime() / 1000));
                                    setEndTime(e)
                                }}
                                value={endTime}
                            />
                        </div>
                        <label>Minimum Bid (WETH)</label>
                        <div className="form-group">
                            <div className="filter-widget">
                                <input
                                    type="number"
                                    required
                                    value={minimumBid}
                                    className="form-control"
                                    onChange={(e) => {
                                        if (e.target.value < 0) {
                                            setMinimumBid(0);
                                        } else {
                                            setMinimumBid(e.target.value);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <label>Bid Delta (WETH)</label>
                        <div className="form-group">
                            <div className="filter-widget">
                                <input
                                    type="number"
                                    placeholder=""
                                    required
                                    value={bidDelta}
                                    className="form-control"
                                    onChange={(e) => {
                                        if (e.target.value < 0) {
                                            setBidDelta(0);
                                        } else {
                                            setBidDelta(e.target.value);
                                        }
                                    }}
                                />
                            </div>
                        </div>
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
                    <Button variant="primary" onClick={() => props.putOnAuction(minimumBid, bidDelta, startTime, endTime, startTimeStamp, endTimeStamp)}>
                        Yes, Proceed!
                    </Button>
                )}

            </Modal.Footer>
        </Modal>

    );
}

export default AuctionCubeModal;
