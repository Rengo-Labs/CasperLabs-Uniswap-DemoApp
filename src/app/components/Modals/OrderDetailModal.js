import {
    Card,
    CardContent
} from '@material-ui/core/';
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import ModalFormData from './ModalFormData/ModalFormData';

function OrderDetailModal(props) {
    // console.log("props", props, props.order);
    return (
        <Modal show={props.show} onHide={props.handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-danger" onClick={props.handleClose}>
                    Close
          </button>
            </Modal.Footer>
        </Modal>
    );
}

export default OrderDetailModal;
