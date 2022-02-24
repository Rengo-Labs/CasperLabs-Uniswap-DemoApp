import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Alert } from 'reactstrap';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import TokenContent from "./TokenContent";


function TokenBModal(props) {
    return (
        <Modal centered show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Token </Modal.Title>
            </Modal.Header>
            {!props.isTokenList && props.activePublicKey !== 'null' && props.activePublicKey !== null && props.activePublicKey !== undefined ? (
                <div className="text-center" style={{ padding: '20px' }}>
                    <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#e84646" }}
                    >
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Modal.Body>
                    {
                        props.activePublicKey !== 'null' && props.activePublicKey !== null && props.activePublicKey !== undefined ? (
                            props.tokenList.map((i, index) => (
                                <div key={index}>
                                    <Card onClick={() => {
                                        props.setToken(i)
                                        props.setTokenAAmount(0)
                                        props.setTokenBAmount(0)
                                        props.handleClose()
                                    }} className='custom-card'>
                                        <TokenContent i={i} activePublicKey={props.activePublicKey}></TokenContent>
                                    </Card>
                                    <hr></hr>
                                </div>
                            ))
                        ) : (
                            <Card style={{ marginBottom: '10px' }}>
                                <CardContent >
                                    <Alert style={{
                                        marginBottom: '0px', flexGrow: 1,
                                        width: '100%',
                                    }} color="light">
                                        Connect to a wallet to view token list.
                                    </Alert>
                                </CardContent>
                            </Card>
                        )
                    }
                </Modal.Body>
            )}
        </Modal>

    );
}

export default TokenBModal;
