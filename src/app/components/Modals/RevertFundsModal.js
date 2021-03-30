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

function RevertFundsModal(props) {

    return (
        <Modal show={props.showRevertFundsModal} onHide={props.handleCloseRevertFundsModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Are you Sure You Want Revert Funds to Importer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    {/* <label>Dispute Order Modal</label>{" "} */}
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
                <button className="btn btn-danger" onClick={props.handleCloseRevertFundsModal}>
                    Close
          </button>

                {props.isSaving ? (
                    <Spinner
                        animation="border"
                        role="status"
                        className="bg-success-light"
                    >
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                        <button className="btn btn-success" onClick={props.revertFunds}>
                            Revert Funds to Importer
                        </button>
                    )}
            </Modal.Footer>
        </Modal>
    );
}

export default RevertFundsModal;
