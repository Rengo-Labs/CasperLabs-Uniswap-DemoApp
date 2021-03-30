import {
    Card,
    CardContent, Grid
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import 'simplebar/dist/simplebar.min.css';
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import ModalFormData from './ModalFormData/ModalFormData';


const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 16,
    }
}));
function DisputeOrderModal(props) {
    const classes = useStyles();
    const [inputList, setInputList] = useState([]);
    let [category, setCategory] = useState('');
    let [disputeReason, setDisputeReason] = useState('');
    let [description, setDescription] = useState('');
    let [fileData, setFileData] = useState('');
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = (e) => {

        setInputList([...inputList, { category: category, description: description, fileData: fileData }]);
        setCategory('');
        e.target.value = null;
        setDescription('');
        setFileData('');
    };
    let fileSelectHandler = (event, index) => {
        if (event.target.files[0] !== undefined) {
            // let newArr = [...inputList];
            // newArr[index].fileData = event.target.files[0];
            setFileData(event.target.files[0]);
            // setInputList(newArr);
        }
    };
    return (
        <Modal show={props.showDisputeOrderModal} onHide={props.handleCloseDisputeOrderModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Are you Sure You Want to Proceed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>Dispute Order Modal</label>{" "}
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
                            <div className="card-body">
                                <div className="row">

                                    <div className="col-md-12 col-lg-6">
                                        {/* <!-- Change Password Form --> */}
                                        <form >
                                            {/* onSubmit={handleSubmitEvent}> */}
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <textarea
                                                        type="text"
                                                        required
                                                        rows="3"
                                                        value={disputeReason}
                                                        placeholder="Enter Reason of dispute"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            setDisputeReason(e.target.value)
                                                            // let newArr = [...inputList];
                                                            // newArr[i].description = e.target.value;
                                                            // setInputList(newArr);
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Upload Document</label>{" "}
                                                </div>
                                                {/* {inputList.map((x, i) => { */}
                                                {/* return ( */}
                                                <div className="form-group">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            required
                                                            value={category}
                                                            placeholder="Enter File Category"
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setCategory(e.target.value)
                                                                // let newArr = [...inputList];
                                                                // newArr[i].category = e.target.value;
                                                                // setInputList(newArr);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea
                                                            type="text"
                                                            required
                                                            rows="4"
                                                            value={description}
                                                            placeholder="Enter File Description"
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setDescription(e.target.value)
                                                                // let newArr = [...inputList];
                                                                // newArr[i].description = e.target.value;
                                                                // setInputList(newArr);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <input
                                                            required
                                                            type="file"
                                                            name="sampleFile"
                                                            accept=".jpg,.png,.jpeg,.jfif,.pdf,.docx"
                                                            className="form-control"
                                                            // ref={(link) => inputRefs.push(link)}
                                                            onChange={(e) => fileSelectHandler(e)}
                                                        />
                                                    </div>

                                                    {category === '' || description === '' || fileData === '' ? (
                                                        <button
                                                            className="btn"
                                                            type="submit"
                                                            disabled
                                                        >
                                                            <i className="fa fa-plus"></i> Add Document
                                                        </button>
                                                    ) : (
                                                            <button
                                                                className="btn"
                                                                type="submit"
                                                                onClick={handleAddClick}
                                                            >
                                                                <i className="fa fa-plus"></i> Add Document
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                    <div className="col-md-12 col-lg-6">
                                        {/* <!-- Change Password Form --> */}
                                        <form
                                        // onSubmit={handleSubmitEvent}
                                        >
                                            <div className="form-group">
                                                <div >
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        direction="row"
                                                        justify="flex-start"
                                                    // alignItems="flex-start"
                                                    >
                                                        {inputList.map((i, index) => (
                                                            <>

                                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                                    <Card style={{ height: "100%" }} variant="outlined">
                                                                        <CardContent>
                                                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                                                <strong>File Category:</strong>{i.category}
                                                                            </Typography>
                                                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                                                <strong>File Description:</strong>{i.description}
                                                                            </Typography>
                                                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                                                <strong>Document:</strong> {i.fileData.name}
                                                                            </Typography>
                                                                        </CardContent>
                                                                        <div >
                                                                            <CardActions>
                                                                                <Button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleRemoveClick(index);
                                                                                    }}
                                                                                    className="btn btn-sm bg-danger-light btn-block"

                                                                                >
                                                                                    Remove Document
    </Button>
                                                                            </CardActions>
                                                                        </div>
                                                                    </Card>
                                                                </Grid>
                                                            </>
                                                        ))}
                                                    </Grid>
                                                </div>
                                            </div>
                                        </form>
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
                <button className="btn btn-danger" onClick={props.handleCloseDisputeOrderModal}>
                    Close
          </button>

                {props.isDisputing ? (
                    <Spinner
                        animation="border"
                        role="status"
                        className="bg-success-light"
                    >
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                        inputList.length === 0 || disputeReason === '' ? (
                            <button className="btn btn-success" disabled>
                                Disputed order
                            </button>

                        ) : (
                                <button className="btn btn-success" onClick={() => props.disputeOrder(inputList, disputeReason)}>
                                    Disputed order
                                </button>
                            )
                    )}
            </Modal.Footer>
        </Modal>
    );
}

export default DisputeOrderModal;
