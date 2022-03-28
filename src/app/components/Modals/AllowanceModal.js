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
                <Typography variant="h6" gutterBottom  >Increase/Decrease Allowance</Typography>
            </Modal.Body>
            <Modal.Body>

                <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                    <Input
                        step="0.0001"
                        type='number'
                        min={0}
                        id="standard-adornment-weight"
                        value={props.allowance}
                        onChange={(evt) => {
                            console.log("evt.target.value", evt.target.value);
                            console.log("props.approvalAmount", props.approvalAmount);
                            if (evt.target.value >= 0) {
                                props.setAllowance(evt.target.value)
                            }
                            else {
                                props.setAllowance(0)
                            }
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
                <Button variant="contained" style={{ margin: '10px', backgroundColor: '#ed0b25', color: 'white' }} onClick={() => props.increaseAndDecreaseAllowanceMakeDeploy(props.tokenAddress,props.tokenAmount, props.tokenApproved, true)}>
                    Increase Allowance
                </Button>
                <Button variant="contained" style={{ margin: '10px', backgroundColor: '#ed0b25', color: 'white' }} onClick={() => props.increaseAndDecreaseAllowanceMakeDeploy(props.tokenAddress, props.tokenAmount, props.tokenApproved, false)}>
                    Decrease Allowance
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default AllowanceModal;
