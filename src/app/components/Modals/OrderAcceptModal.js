import {
    Card,
    CardContent
} from '@material-ui/core/';
import Typography from '@material-ui/core/Typography';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import ModalFormData from './ModalFormData/ModalFormData';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 16,
    }
}));
function OrderAcceptModal(props) {
    const classes = useStyles();
    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);

    return (
        <Modal show={props.showAcceptModal} onHide={props.handleCloseAcceptModal} size="xl">
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
                                            {jwtDecoded.roles[0] === "exporter" ? (
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <div className="form-group">
                                                        <label>Sale Price</label>
                                                        <div className="filter-widget">
                                                            <input
                                                                type="number"
                                                                required
                                                                value={props.tokens}
                                                                placeholder="eg. 22 ,0.00001 or .1"
                                                                className="form-control"
                                                                onChange={(e) => {
                                                                    props.setTokens(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Typography>
                                            ) : (
                                                    null
                                                )}
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

                <button className="btn btn-danger" onClick={props.handleCloseAcceptModal}>
                    Close
        </button>

                {props.isAccepting ? (
                    <Spinner
                        animation="border"
                        role="status"
                        className="bg-success-light"
                    >
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                        jwtDecoded.roles[0] === "exporter" ? (
                            props.tokens === '' || props.tokens === null || props.tokens === undefined ? (
                                <button className="btn btn-success" disabled>
                                    Accept Order
                                </button>
                            ) : (
                                    <button className="btn btn-success" onClick={() => props.acceptOrder(props.order._id)}>
                                        Accept Order
                                    </button>
                                )
                        ) : (
                                <button className="btn btn-success" onClick={() => props.acceptOrder(props.order._id)}>
                                    Accept Order
                                </button>
                            )
                    )}

            </Modal.Footer>
        </Modal>
    );
}

export default OrderAcceptModal;
