import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function UploadDocumentModal(props) {
  return (
    <Modal show={props.showUploadModal} onHide={props.handleCloseUploadModal} >
      <Modal.Header closeButton>
        <Modal.Title>Upload More Documents For Agreement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={props.uploadDocument}>
          <div className="form-group">
            <div className="form-group">
              <label>Upload Document</label>{" "}
            </div>
            {props.inputList.map((x, i) => {
              return (
                <div className="form-group">
                  <div className="form-group">
                    <input
                      type="text"
                      required
                      value={x.category}
                      placeholder="Enter File Category"
                      className="form-control"
                      onChange={(e) => {
                        let newArr = [...props.inputList];
                        newArr[i].category = e.target.value;
                        props.setInputList(newArr);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      type="text"
                      required
                      rows="4"
                      value={x.description}
                      placeholder="Enter File Description"
                      className="form-control"
                      onChange={(e) => {
                        let newArr = [...props.inputList];
                        newArr[i].description = e.target.value;
                        props.setInputList(newArr);
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
                      onChange={(e) => props.fileSelectHandler(e, i)}
                    />
                  </div>
                  {props.inputList.length !== 1 && (
                    <button
                      className="btn mr10"
                      type="submit"
                      onClick={() => props.handleRemoveClick(i)}
                    >
                      Remove
                    </button>
                  )}{" "}
                  {props.inputList.length - 1 === i && (
                    <button
                      className="btn"
                      type="submit"
                      onClick={props.handleAddClick}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  )}
                </div>
              );
            })}
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
            {props.isUploading ? (
              <div className="submit-section">
                <Spinner
                  animation="border"
                  role="status"
                  className="bg-success-light"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            ) : (
                <div className="submit-section">
                  <button type="submit" className="btn submit-btn">
                    Upload Documents
                </button>
                </div>
              )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={props.handleCloseUploadModal}>
          Close
          </button>

      </Modal.Footer>
    </Modal>
  );
}

export default UploadDocumentModal;
