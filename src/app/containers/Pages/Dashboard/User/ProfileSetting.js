import React, { useState, useEffect } from "react";

import axios from "axios";
import { Spinner, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import r1 from '../../../../assets/img/patients/patient.jpg';
import { useSnackbar } from 'notistack';
import ipfs from '../../../../components/IPFS/ipfs';
import { Container } from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function ProfileSetting(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let [artist, setArtist] = useState('');
  let [description, setDescription] = useState("");
  let [aboutTheTrack, setAboutTheTrack] = useState("");
  let [name, setName] = useState("");
  let [website, setWebsite] = useState("");
  let [aboutTheArt, setAboutTheArt] = useState("");
  let [ipfsHash, setIpfsHash] = useState(null);
  let [inspirationForThePiece, setInspirationForThePiece] = useState("");
  let [executiveInspirationForThePiece, setExecutiveInspirationForThePiece] = useState("");
  let [fanInspirationForThePiece, setFanInspirationForThePiece] = useState("");

  let [rarities, setRarities] = useState(["Mastercraft", "Legendary", "Epic", "Rare", "Uncommon", "Common"]);
  let [supplyType, setSupplyType] = useState("Single");
  let [imageArtistTypes, setImageArtistTypes] = useState([]);
  let [executiveProducerTypes, setExecutiveProducerTypes] = useState([]);
  let [fans, setFanTypes] = useState([]);
  let [producerTypes, setProducerTypes] = useState([]);

  let [imageArtist, setImageArtist] = useState('');
  let [collectionTypes, setCollectionTypes] = useState([]);
  let [collectionType, setCollectionType] = useState("New");
  let [collection, setCollection] = useState('');

  let [producer, setProducer] = useState('');
  let [tokenSupply, setTokenSupply] = useState("1");
  let [isUploadingIPFS, setIsUploadingIPFS] = useState(false);
  let [isUploadingExecutiveProducer, setIsUploadingExecutiveProducer] = useState(false);
  let [isUploadingProducer, setIsUploadingProducer] = useState(false);
  let [isUploadingFan, setIsUploadingFan] = useState(false);
  let [isUploadingImageArtist, setIsUploadingImageArtist] = useState(false);
  let [rarity, setRarity] = useState('');
  let [fan, setFan] = useState('');
  let [other, setOther] = useState('');
  let [image, setImage] = useState(r1);
  let [artistImage, setArtistImage] = useState(r1);
  let [producerImage, setProducerImage] = useState(r1);
  let [executiveProducerImage, setExecutiveProducerImage] = useState(r1);
  let [fanImage, setFanImage] = useState(r1);
  let [imageArtistType, setImageArtistType] = useState("New");
  let [producerType, setProducerType] = useState("New");
  let [executiveProducerType, setExecutiveProducerType] = useState("New");
  let [fanType, setFanType] = useState("New");
  let [collectionId, setCollectionId] = useState('');

  let [executiveProducer, setExecutiveProducer] = useState('');
  // let [artistImage, setArtistImage] = useState(logo);

  let [isUploadingArtist, setIsUploadingArtist] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log("newValue", newValue);
    setValue(newValue);
  };

  let [isImageSelected, setIsImageSelected] = useState(false);
  let [imageData, setImageData] = useState();
  let [mobileInput, setMobileInput] = useState();
  let [isSavingChanges, setIsSavingChanges] = useState(false);
  let [isFieldsChanged, setIsFieldChanged] = useState(false);
  let [check, setCheck] = useState(false);
  let handleSet2FAcheck = (e) => {
    setCheck(!check);
    setIsFieldChanged(true);
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  let [fileType, setFileType] = useState();
  let [fileName, setFileName] = useState();
  let onChangePictureHandler = (event) => {
    if (event.target.files[0] !== undefined) {
      let fileParts = event.target.files[0].name.split(".");
      setFileName(`${props.userData._id}${Date.now()}`);
      setFileType(fileParts[1]);
      setImageData(event.target.files[0]);
      setIsImageSelected(true);
    }
  };
  useEffect(() => {
    if (props.userData) {
      if (props.userData._2FA) {
        setCheck(props.userData._2FA);
      }
    }
    props.setActiveTab({
      dashboard: "",
      totalUserAccount: "",
      pendingUserAccount: "",
      earningsList: "",
      tradeListOrders: "",
      referralEarnings: "",
      disputedOrders: "",
      resolvedDisputedOrders: "",
      settings: "active",
      changePassword: "",
    });// eslint-disable-next-line
  }, []);
  let onSubmitHandleEvent = (event) => {
    setIsSavingChanges(true);
    event.preventDefault();

    if (isImageSelected) {
      axios
        .post("/api/v1/users/sign_s3", {
          fileName: fileName,
          fileType: fileType,
        })
        .then((response) => {
          var returnData = response.data.data.returnData;
          var signedRequest = returnData.signedRequest;
          var url = returnData.url;
          delete axios.defaults.headers.common["Authorization"];
          // Put the fileType in the headers for the upload
          var options = {
            headers: {
              "Content-Type": fileType,
            },
          };
          axios
            .put(signedRequest, imageData, options)
            .then((result) => {
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${Cookies.get("Authorization")}`;
              axios
                .post(`/api/v1/users/upload/image/${props.userData._id}`, {
                  url: url,
                })
                .then((response) => {
                  if (!isFieldsChanged) {
                    setIsSavingChanges(false);
                    handleShowSuccessModal();
                    props.handleDataUpdated();
                  }
                })
                .catch((error) => {
                  setIsSavingChanges(false);
                  if (process.env.NODE_ENV === "development") {
                    console.log(error);
                  }
                });
            })
            .catch((error) => {
              if (process.env.NODE_ENV === "development") {
                alert("ERROR " + JSON.stringify(error));
                console.log(error);
              }
              setIsSavingChanges(false);
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${Cookies.get("Authorization")}`;
              // setMsg("Couldn't Upload File, try again");
              // handleShowSuccessModal();
            });
        })
        .catch((error) => {
          if (process.env.NODE_ENV === "development") {
            alert(JSON.stringify(error));
          }
          setIsSavingChanges(false);
          // setMsg("Couldn't Get Signed URL ");
          // handleShowSuccessModal();
        });
    }
    if (isFieldsChanged) {
      let data = {
        mobile: mobileInput,
        _2FA: check,
      };
      axios
        .put(`/api/v1/users/${props.userData._id}`, data, {})
        .then((response) => {
          setIsSavingChanges(false);
          handleShowSuccessModal();
          props.handleDataUpdated();
        })
        .catch((error) => {
          setIsSavingChanges(false);
          if (process.env.NODE_ENV === "development") {
            console.log(error);
          }
        });
    }
  };

  let onChangeFile = (e) => {
    setIsUploadingIPFS(true);
    const reader = new window.FileReader();
    let imageNFT = e.target.files[0]
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = () => {
      // setBuffer(Buffer(reader.result));
      ipfs.add(Buffer(reader.result), async (err, result) => {
        if (err) {
          console.log(err);
          setIsUploadingIPFS(false);
          let variant = "error";
          enqueueSnackbar('Unable to Upload Image to IPFS ', { variant });
          return
        }
        console.log("HASH", result[0].hash);

        setIpfsHash(result[0].hash);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to IPFS Successfully', { variant });
        // 
      })
    }
    // setIsUploadingIPFS(true);
    let fileData = new FormData();
    fileData.append("image", imageNFT);
    axios.post("upload/uploadtos3", fileData).then(
      (response) => {
        console.log("response", response);
        setImage(response.data.url);
        setIsUploadingIPFS(false);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploadingIPFS(false);
        let variant = "error";
        enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

      }
    );

  }
  let onChangeSelfieHandler = (e) => {
    setIsUploadingImageArtist(true);
    let fileData = new FormData();
    fileData.append("image", e.target.files[0]);
    axios.post("upload/uploadtos3", fileData).then(
      (response) => {
        console.log("response", response);
        setArtistImage(response.data.url);
        setIsUploadingImageArtist(false);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploadingImageArtist(false);
        let variant = "error";
        enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

      }
    );
  }
  let onChangeProducerHandler = (e) => {
    setIsUploadingProducer(true);
    let fileData = new FormData();
    fileData.append("image", e.target.files[0]);
    axios.post("upload/uploadtos3", fileData).then(
      (response) => {
        console.log("response", response);
        setProducerImage(response.data.url);
        setIsUploadingProducer(false);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploadingProducer(false);
        let variant = "error";
        enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

      }
    );
  }
  let onChangeExecutiveProducerHandler = (e) => {
    setIsUploadingExecutiveProducer(true);
    let fileData = new FormData();
    fileData.append("image", e.target.files[0]);
    axios.post("upload/uploadtos3", fileData).then(
      (response) => {
        console.log("response", response);
        setExecutiveProducerImage(response.data.url);
        setIsUploadingExecutiveProducer(false);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploadingExecutiveProducer(false);
        let variant = "error";
        enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

      }
    );
  }
  let onChangeFanHandler = (e) => {
    setIsUploadingFan(true);
    let fileData = new FormData();
    fileData.append("image", e.target.files[0]);
    axios.post("upload/uploadtos3", fileData).then(
      (response) => {
        console.log("response", response);
        setFanImage(response.data.url);
        setIsUploadingFan(false);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploadingFan(false);
        let variant = "error";
        enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

      }
    );
  }
  let onChangeArtistHandler = (e) => {
    setIsUploadingArtist(true);
    let fileData = new FormData();
    fileData.append("image", e.target.files[0]);
    axios.post("upload/uploadtos3", fileData).then(
      (response) => {
        console.log("response", response);
        setArtistImage(response.data.url);
        setIsUploadingArtist(false);
        let variant = "success";
        enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploadingArtist(false);
        let variant = "error";
        enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

      }
    );
  }

  return (
    <>
      {/* {props.userData.name !== undefined ? ( */}
      <div className="card">
        <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
          <li className="breadcrumb-item">
            <a href="/">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Profile Settings</li>
        </ul>
        <div className="card-body">
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Image Aritst" />
              <Tab label="Music Aritst" />
              <Tab label="Producer" />
              <Tab label="Executive Producer" />
              <Tab label="Fan" />
            </Tabs>
          </Paper>
          {value === 0 ? (
            <Container>
              <form style={{ margin: "20px" }}>

                <div className="form-group">
                  <input
                    type="text"
                    required
                    value={imageArtist}
                    placeholder="Enter Image Artist Name"
                    className="form-control"
                    onChange={(e) => {
                      setImageArtist(e.target.value)
                    }}
                  />
                </div>
                <div className="form-group">
                  {/* <label>About the Track</label> */}
                  <textarea
                    type="text"
                    required
                    rows="4"
                    value={aboutTheArt}
                    placeholder="About the Art"
                    className="form-control"
                    onChange={(e) => {
                      setAboutTheArt(e.target.value)
                    }}
                  />
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
                        <img src={artistImage} alt="Selfie" />
                      </div>
                    </div>
                    <div className="upload-img">
                      <div
                        className="change-photo-btn"
                        style={{ backgroundColor: "rgb(167,0,0)" }}
                      >
                        {isUploadingImageArtist ? (
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
                          onChange={onChangeSelfieHandler}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    required
                    value={website}
                    placeholder="Enter Website URL"
                    className="form-control"
                    onChange={(e) => {
                      setWebsite(e.target.value)
                    }}
                  />
                </div>
                <div className="submit-section">
                  {isSavingChanges ? (
                    <div className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#00D0F1" }}
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        type="submit"
                        // className="btn btn-primary submit-btn"
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  )}
                </div>
              </form>
            </Container>
          ) : value === 1 ? (
            <Container>
              <form style={{ margin: "20px" }}>

                <div className="form-group">
                  {/* <label>Artist Name</label> */}
                  <input
                    type="text"
                    required
                    value={artist}
                    placeholder="Enter Music Artist Name"
                    className="form-control"
                    onChange={(e) => {
                      setArtist(e.target.value)
                    }}
                  />
                </div>
                <label className="focus-label">Artist Profile Photo</label>
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
                        <img src={artistImage} alt="Selfie" />
                      </div>
                    </div>
                    <div className="upload-img">
                      <div
                        className="change-photo-btn"
                        style={{ backgroundColor: "rgb(167,0,0)" }}
                      >
                        {isUploadingArtist ? (
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
                          onChange={onChangeArtistHandler}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {/* <label>About the Track</label> */}
                  <textarea
                    type="text"
                    required
                    rows="4"
                    value={aboutTheTrack}
                    placeholder="About the Track"
                    className="form-control"
                    onChange={(e) => {
                      setAboutTheTrack(e.target.value)
                    }}
                  />
                </div>
                <div className="submit-section">
                  {isSavingChanges ? (
                    <div className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#00D0F1" }}
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        type="submit"
                        // className="btn btn-primary submit-btn"
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  )}
                </div>
              </form>
            </Container>
          ) : value === 2 ? (
            <Container>
              <form style={{ margin: "20px" }}>

                <div className="form-group">
                  {/* <label>Producer</label> */}
                  <input
                    type="text"
                    required
                    value={producer}
                    placeholder="Enter Producer Name"
                    className="form-control"
                    onChange={(e) => {
                      setProducer(e.target.value)
                    }}
                  />
                </div>
                <label className="focus-label">Producer Profile Photo</label>
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
                        <img src={producerImage} alt="Selfie" />
                      </div>
                    </div>
                    <div className="upload-img">
                      <div
                        className="change-photo-btn"
                        style={{ backgroundColor: "rgb(167,0,0)" }}
                      >
                        {isUploadingProducer ? (
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
                          onChange={onChangeProducerHandler}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {/* <label>Inspiration For the Piece</label> */}
                  <textarea
                    type="text"
                    required
                    rows="4"
                    value={inspirationForThePiece}
                    placeholder="Inspiration For the Piece"
                    className="form-control"
                    onChange={(e) => {
                      setInspirationForThePiece(e.target.value)
                    }}
                  />
                </div>
                <div className="submit-section">
                  {isSavingChanges ? (
                    <div className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#00D0F1" }}
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        type="submit"
                        // className="btn btn-primary submit-btn"
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  )}
                </div>
              </form>
            </Container>
          ) : value === 3 ? (
            <Container>
              <form style={{ margin: "20px" }}>

                <div className="form-group">
                  {/* <label>Producer</label> */}
                  <input
                    type="text"
                    required
                    value={executiveProducer}
                    placeholder="Enter Executive Producer Name"
                    className="form-control"
                    onChange={(e) => {
                      setExecutiveProducer(e.target.value)
                    }}
                  />
                </div>
                <label className="focus-label">Executive Producer Profile Photo</label>
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
                        <img src={executiveProducerImage} alt="Selfie" />
                      </div>
                    </div>
                    <div className="upload-img">
                      <div
                        className="change-photo-btn"
                        style={{ backgroundColor: "rgb(167,0,0)" }}
                      >
                        {isUploadingExecutiveProducer ? (
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
                          onChange={onChangeExecutiveProducerHandler}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {/* <label>Inspiration For the Piece</label> */}
                  <textarea
                    type="text"
                    required
                    rows="4"
                    value={executiveInspirationForThePiece}
                    placeholder="Inspiration For the Piece"
                    className="form-control"
                    onChange={(e) => {
                      setExecutiveInspirationForThePiece(e.target.value)
                    }}
                  />
                </div>
                <div className="submit-section">
                  {isSavingChanges ? (
                    <div className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#00D0F1" }}
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        type="submit"
                        // className="btn btn-primary submit-btn"
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  )}
                </div>
              </form>
            </Container>
          ) : value === 4 ? (
            <Container>
              <form style={{ margin: "20px" }}>

                <div className="form-group">
                  {/* <label>Producer</label> */}
                  <input
                    type="text"
                    required
                    value={fan}
                    placeholder="Enter Fan Name"
                    className="form-control"
                    onChange={(e) => {
                      setFan(e.target.value)
                    }}
                  />
                </div>
                <label className="focus-label">Fan Profile Photo</label>
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
                        <img src={fanImage} alt="Selfie" />
                      </div>
                    </div>
                    <div className="upload-img">
                      <div
                        className="change-photo-btn"
                        style={{ backgroundColor: "rgb(167,0,0)" }}
                      >{isUploadingFan ? (
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
                          onChange={onChangeFanHandler}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {/* <label>Inspiration For the Piece</label> */}
                  <textarea
                    type="text"
                    required
                    rows="4"
                    value={fanInspirationForThePiece}
                    placeholder="Inspiration For the Piece"
                    className="form-control"
                    onChange={(e) => {
                      setFanInspirationForThePiece(e.target.value)
                    }}
                  />
                </div>
                <div className="submit-section">
                  {isSavingChanges ? (
                    <div className="text-center">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "#00D0F1" }}
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        type="submit"
                        // className="btn btn-primary submit-btn"
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  )}
                </div>
              </form>
            </Container>
          ) : (
            null
          )
          }
          {/* // <!-- Profile Settings Form --> */}

          <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
            <Modal.Header closeButton>
              <Modal.Title>Successfully Updated</Modal.Title>
            </Modal.Header>
          </Modal>
        </div >
      </div >
      {/* ) : (
      <></>
        )} */}
    </>
  );
}
export default ProfileSetting;
