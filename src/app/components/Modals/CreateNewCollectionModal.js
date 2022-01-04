import axios from "axios";
import { useSnackbar } from 'notistack';
import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import r1 from '../../assets/img/patients/patient.jpg';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function CreateNewCollectionModal(props) {
    const { enqueueSnackbar } = useSnackbar();
    let [collectionTitle, setCollectionTitle] = useState();
    let [collectionImage, setCollectionImage] = useState(r1);
    let [isUploadingCollectionImage, setIsUploadingCollectionImage] = useState(false);
    let onChangeImageHandler = (e) => {
        setIsUploadingCollectionImage(true);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
          (response) => {
            console.log("response", response);
            setCollectionImage(response.data.url);
            setIsUploadingCollectionImage(false);
            let variant = "success";
            enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
          },
          (error) => {
            if (process.env.NODE_ENV === "development") {
              console.log(error);
              console.log(error.response);
            }
            setIsUploadingCollectionImage(false);
            let variant = "error";
            enqueueSnackbar('Unable to Upload Image to S3 .', { variant });
    
          }
        );
      }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Collection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="form-group">

                        <label>Collection Title</label>
                        <div className="form-group">
                            <div className="filter-widget">
                                <input
                                    type="text"
                                    required
                                    defaultValue={collectionTitle}
                                    placeholder=""
                                    className="form-control"
                                    onChange={(e) => {
                                        setCollectionTitle(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <label className="focus-label">Image Artist Photo</label>
                        <div className="form-group">
                            <div className="change-avatar">
                                <div className="profile-img">
                                    <div
                                        style={{
                                            background: "#E9ECEF",
                                            width: "100px",
                                            height: "100px",
                                        }}
                                    >
                                        <img src={collectionImage} alt="Selfie" />
                                    </div>
                                </div>
                                <div className="upload-img">
                                    <div
                                        className="change-photo-btn"
                                        style={{ backgroundColor: "#ed0b25" }}
                                    >
                                        {isUploadingCollectionImage ? (
                                            <div className="text-center">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                    style={{ color: "#fff" }}
                                                >
                                                </Spinner>
                                            </div>
                                        ) : (
                                            <span><i className="fa fa-upload"></i>Upload photo</span>
                                        )}
                                        <input
                                            name="sampleFile"
                                            type="file"
                                            className="upload"
                                            accept=".png,.jpg,.jpeg,.gif"
                                            onChange={onChangeImageHandler}
                                        />
                                    </div>
                                    <small className="form-text text-muted">
                                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
    </Button>
                {props.isCreating ? (
                    <div align="center" className="text-center">
                        <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#e84646" }}
                        >

                        </Spinner>
                        <span style={{ color: "#e84646" }} className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <Button variant="primary" onClick={() => props.createCollections(collectionTitle, collectionImage)}>
                        Create
                    </Button>
                )}

            </Modal.Footer>
        </Modal>

    );
}

export default CreateNewCollectionModal;
