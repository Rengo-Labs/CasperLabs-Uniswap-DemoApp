import { Button, FormControl, FormHelperText, Input, InputAdornment, Typography } from "@material-ui/core";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function AllowanceModal(props) {
    return (
        <Modal centered show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Allowance Settings <i className="fas fa-cog"></i> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Typography variant="h6" gutterBottom  >Increase Allowance</Typography>
            </Modal.Body>
            <Modal.Body>

                <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                    <Input
                        step="0.0001"
                        type='number'
                        min={0}
                        disabled
                        id="standard-adornment-weight"
                        value={props.approvalAmount / 10 ** 9}
                        onChange={(evt) => {
                            console.log("props.approvalAmount", props.approvalAmount);
                            props.setAllowance(props.approvalAmount / 10 ** 9)
                        }}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                    <FormHelperText id="standard-weight-helper-text">Allowance</FormHelperText>
                </FormControl>

            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn-block btn-outline-primary btn-lg"
                    style={{
                        borderRadius: '15px', fontSize: '15px', fontWeight: '600',
                        padding: "10px",
                    }} onClick={() => props.increaseAndDecreaseAllowanceMakeDeploy(props.tokenAddress, props.approvalAmount / 10 ** 9, props.tokenApproved, true)}>
                    Increase Allowance
                </button>
                {/* <button
                    type="button"
                    className="btn-block btn-outline-primary btn-lg"
                    style={{
                        borderRadius: '15px', fontSize: '15px', fontWeight: '600',
                        padding: "10px",
                    }} onClick={() => props.increaseAndDecreaseAllowanceMakeDeploy(props.tokenAddress, props.approvalAmount, props.tokenApproved, false)}>
                    Decrease Allowance
                </button> */}
            </Modal.Footer>
        </Modal>

    );
}

export default AllowanceModal;
