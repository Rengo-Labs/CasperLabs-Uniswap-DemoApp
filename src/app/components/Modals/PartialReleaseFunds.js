import {
    Card,
    CardContent
} from '@material-ui/core/';
import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import NumberFormat from 'react-number-format';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import ModalFormData from './ModalFormData/ModalFormData';
function PartialReleaseFundsModal(props) {
    let [importerPercentage, setImporterPercentage] = useState();
    let [exporterPercentage, setExporterPercentage] = useState();

    return (
        <Modal show={props.showPartialReleaseFundsModal} onHide={props.handleClosePartialReleaseFundsModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Are you Sure You Want Partial Release Funds </Modal.Title>
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
                            <div className="row">

                                <div className="col-md-12 col-lg-12">

                                    <div className="form-group">
                                        <div className="form-group">
                                            <label>Enter Percentages</label>{" "}
                                        </div>
                                        {/* {inputList.map((x, i) => { */}
                                        {/* return ( */}
                                        <div className="row">

                                            <div className="col-md-12 col-lg-6">
                                                <div className="form-group">
                                                    <label>Enter % for Importer</label>{" "}
                                                </div>
                                                <div className="form-group">
                                                    <div className="form-group">
                                                        <NumberFormat
                                                            format="## %" mask="_"
                                                            value={importerPercentage}
                                                            required
                                                            placeholder="Enter percentage "
                                                            className="form-control"
                                                            onValueChange={(e) => {
                                                                console.log('e', e.value);
                                                                setImporterPercentage(e.value)
                                                                setExporterPercentage(100 - e.value)
                                                                // let newArr = [...inputList];
                                                                // newArr[i].category = e.target.value;
                                                                // setInputList(newArr);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-lg-6">
                                                <div className="form-group">
                                                    <div className="form-group">
                                                        <div className="form-group">
                                                            <label>Enter % for Exporter</label>{" "}
                                                        </div>
                                                        <div className="form-group">
                                                            <NumberFormat
                                                                format="## %" mask="_"
                                                                required
                                                                value={exporterPercentage}
                                                                placeholder="Enter Percentage"
                                                                className="form-control"
                                                                onValueChange={(e) => {
                                                                    console.log('e', e);
                                                                    setImporterPercentage(100 - e.value)
                                                                    setExporterPercentage(e.value)
                                                                    // let newArr = [...inputList];
                                                                    // newArr[i].category = e.target.value;
                                                                    // setInputList(newArr);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

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
                <button className="btn btn-danger" onClick={props.handleClosePartialReleaseFundsModal}>
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
                        <button className="btn btn-success" onClick={() => props.partialReleaseFunds(importerPercentage, exporterPercentage)}>
                            Partial Release Funds
                        </button>
                    )}
            </Modal.Footer>
        </Modal>
    );
}

export default PartialReleaseFundsModal;
