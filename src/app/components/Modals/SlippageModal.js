import { Button, FormControl, FormHelperText, Input, InputAdornment, Typography } from "@material-ui/core";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function SlippageModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Transaction Settings <i className="fas fa-cog"></i> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Typography variant="h6" gutterBottom  >Slippage tolerance</Typography>
            </Modal.Body>
            <Modal.Body>

                <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                    <Input
                        step="0.0001"
                        type='number'
                        min={0} max={50}
                        id="standard-adornment-weight"
                        value={props.slippage}
                        onChange={(evt) => {
                            if (evt.target.value >= 0 && evt.target.value <= 50) {
                                props.setSlippage(evt.target.value)
                            }
                            else if (evt.target.value >= 50) {
                                props.setSlippage(50)
                            }
                            else {
                                props.setSlippage(0)
                            }

                        }}
                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                    <FormHelperText id="standard-weight-helper-text">Slippage</FormHelperText>
                </FormControl>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="contained" style={{ margin: '10px', backgroundColor: '#ed0b25', color: 'white' }} onClick={props.handleClose}>
                    Confirm
                </Button>
                <Button variant="contained" style={{ margin: '10px', backgroundColor: '#ed0b25', color: 'white' }} onClick={() => {
                    props.setSlippage(0.5)
                    props.handleClose()
                }}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default SlippageModal;
