import React, { useState } from "react";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Button from '@material-ui/core/Button';

function AcceptRejectImporterDocumentModal(props) {
    const handleClose = () => setShow(false);
    let [show, setShow] = useState(false);
    let [reason, setReason] = useState('');
    let [documentId, setDocumentId] = useState('');
    // const download = (e, fileName, fileUrl) => {
    //     console.log(e.target.href);
    //     console.log(fileUrl.split('.').pop())
    //     fetch(e.target.href, {
    //         method: "GET",
    //         headers: {}
    //     })
    //         .then(response => {
    //             response.arrayBuffer().then(function (buffer) {
    //                 const url = window.URL.createObjectURL(new Blob([buffer]));

    //                 const link = document.createElement("a");
    //                 link.href = url;
    //                 link.setAttribute("download", fileName + "." + fileUrl.split('.').pop()); //or any other extension
    //                 document.body.appendChild(link);
    //                 link.click();
    //             });
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // };

    return (
        <>
            <Modal show={props.showAcceptRejectModal} onHide={props.handleCloseAcceptRejectModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Accept/Reject Documents For Agreement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Accept/Reject Document</label>{" "}
                        {props.order !== '' && props.order !== undefined && props.order !== {} ? (
                            <form>
                                <div className="form-group">
                                    {props.order.documentsByExporter.map((i, index) => (
                                        <div key={i._id}>
                                            <Row className="align-items-center" >
                                                <Col>
                                                    {i.status === 'Pending' ? (<p><strong>Status:<pr style={{ color: '#ffa500' }}>{i.status}</pr></strong></p>) : (null)}
                                                    <p><strong>Name :</strong>{i.name}
                                                        <a
                                                            href={"https://imex-backend.herokuapp.com/" + i.url}
                                                            download
                                                            target='_blank'
                                                            rel="noopener noreferrer"
                                                        // onClick={e => download(e, i.name, i.url)}
                                                        >
                                                            <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                        </a>
                                                    </p>
                                                    <p style={{ wordWrap: 'break-word' }}><strong>Description: </strong>{i.description}</p>
                                                    {i.rejectionreason !== undefined ? (
                                                        <p><strong>Reason of Rejection: </strong>{i.rejectionreason}</p>
                                                    ) : (null)}
                                                </Col>
                                                <Col >
                                                    {props.isRejectingDocument ? (
                                                        <div className="submit-section" style={{ float: 'right' }}>
                                                            <Spinner
                                                                animation="border"
                                                                role="status"
                                                                className="bg-danger-light"
                                                            //   style={{ color: "#00d0f1" }}
                                                            >
                                                                <span className="sr-only">Loading...</span>
                                                            </Spinner>
                                                        </div>
                                                    ) : props.isAcceptingDocument ? (
                                                        <div className="submit-section" style={{ float: 'right' }}>
                                                            <Spinner
                                                                animation="border"
                                                                role="status"
                                                                className="bg-success-light"
                                                            >
                                                                <span className="sr-only">Loading...</span>
                                                            </Spinner>
                                                        </div>
                                                    ) : i.status === 'Pending' ? (
                                                        <div className="actions" style={{ float: 'right' }}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    // props.rejectDocument(i._id)
                                                                    setShow(true);
                                                                    setDocumentId(i._id);
                                                                    setShow(true);
                                                                }}
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                Reject
                              </Button>
                                                            {' '}
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.acceptDocument(i._id)
                                                                }}
                                                                className="btn btn-sm bg-success-light"
                                                            >
                                                                Accept
                              </Button>
                                                        </div>
                                                    ) : i.status === 'Accepted' ? (
                                                        <Button disabled className="btn bg-success-light not-allowed" style={{ float: 'right' }}>
                                                            Accepted
                                                        </Button>
                                                    ) : (
                                                                        <Button disabled className="btn bg-danger-light not-allowed" style={{ float: 'right' }}>
                                                                            Rejected
                                                                        </Button>
                                                                    )}
                                                </Col>
                                            </Row>
                                            <hr></hr>
                                        </div>
                                    ))
                                    }
                                </div >
                            </form>
                        ) : (null)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={props.handleCloseAcceptRejectModal}>
                        Close
        </button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Reject Document Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Reason of Rejection
                    <div className="form-group">
                        <textarea
                            type="text"
                            required
                            rows="5"
                            value={reason}
                            placeholder="Type here"
                            className="form-control"
                            onChange={(e) => {
                                setReason(e.target.value)
                            }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {reason === '' ? (
                        <button className="btn btn-success" disabled>
                            Reject
                        </button>
                    ) : (
                            <button className="btn btn-success" onClick={() => {
                                props.rejectDocument(documentId, reason)
                                setShow(false);
                            }}>
                                Reject
                            </button>
                        )}
                    <button className="btn btn-danger" onClick={handleClose}>
                        Close
      </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AcceptRejectImporterDocumentModal;
