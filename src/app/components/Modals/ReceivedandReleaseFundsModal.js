import {
    Card,
    CardContent
} from '@material-ui/core/';
import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import ModalFormData from './ModalFormData/ModalFormData';

function ReceivedandReleaseFundsModal(props) {
    
    return (
        <Modal show={props.showReceivedAndReleaseModal} onHide={props.handleCloseReceivedAndReleaseModal} size="xl" >
            <Modal.Header closeButton>
                <Modal.Title>Receive and Release Funds Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>Receive and Release Funds</label>{" "}
                    {props.order !== '' && props.order !== undefined && props.order !== {} ? (
                        <form>
                            <div className="form-group">
                                <div className="card-body">
                                    <div >
                                        <Card style={{ height: "100%" }} variant="outlined">
                                            <CardContent>
                                                <ModalFormData order={props.order} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (null)}
                </div>
                {props.isError ? (
                    <div className="form-group">
                        <p style={{ color: "#FF0000" }}>{props.errorMsg}</p>
                    </div>
                ) : (
                        <></>
                    )}
                {props.isSuccess ? (
                    <div className="form-group">
                        <p style={{ color: "#28a745" }}>{props.errorMsg}</p>
                    </div>
                ) : (
                        <></>
                    )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-danger" onClick={props.handleCloseReceivedAndReleaseModal}>
                    Close
          </button>

                {props.isReceivedAndReleaseOrder ? (
                    <Spinner
                        animation="border"
                        role="status"
                        className="bg-success-light"
                    >
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                        <button className="btn btn-success" onClick={props.receiveAndReleaseFunds}>
                            Receive And Release Funds
                        </button>
                    )}
            </Modal.Footer>
        </Modal>
    );
}

export default ReceivedandReleaseFundsModal;
