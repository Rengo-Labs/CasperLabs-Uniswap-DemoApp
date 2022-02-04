import { Avatar, Card, CardHeader } from "@material-ui/core";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";



function TokenAModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Token </Modal.Title>
            </Modal.Header>
            {/* <Modal.Body style={{ padding: '0px' }}>
                <Typography style={{ textAlign: 'center' }} variant="h6" gutterBottom  >Token List</Typography>
            </Modal.Body> */}
            <Modal.Body>
                {props.tokenList.map((i, index) => (
                    <div key={index}>
                        <Card onClick={() => {
                            // console.log("props.token", props.token);
                            // console.log("props.tokenList", props.tokenList);
                            // if (props.token) {
                            //     props.setTokenList(props.tokenList.splice(0, 0, props.token))
                            // }
                            // console.log("props.tokenList.splice(i, 1)", props.tokenList.splice(i, 2));
                            // props.setTokenList(props.tokenList.splice(i, 1))
                            props.setToken(i)
                            props.setTokenAAmount(0)
                            props.setTokenBAmount(0)
                            props.handleClose()
                        }} className='custom-card'>
                            <CardHeader
                                avatar={<Avatar src={i.logoURI} aria-label="Artist" />}
                                title={i.name}
                                subheader={i.symbol}
                            />
                        </Card>
                        <hr></hr>
                    </div >
                ))}
            </Modal.Body>
        </Modal>

    );
}

export default TokenAModal;
