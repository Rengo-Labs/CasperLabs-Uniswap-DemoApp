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
import { Container } from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function ProfileSetting(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let [musicArtist, setMusicArtist] = useState('');
  let [aboutTheTrack, setAboutTheTrack] = useState("");
  let [website, setWebsite] = useState("");
  let [aboutTheArt, setAboutTheArt] = useState("");
  let [inspirationForThePiece, setInspirationForThePiece] = useState("");
  let [executiveInspirationForThePiece, setExecutiveInspirationForThePiece] = useState("");
  let [fanInspirationForThePiece, setFanInspirationForThePiece] = useState("");
  let [imageArtist, setImageArtist] = useState('');
  let [producer, setProducer] = useState('');
  let [isUploadingExecutiveProducer, setIsUploadingExecutiveProducer] = useState(false);
  let [isUploadingProducer, setIsUploadingProducer] = useState(false);
  let [isUploadingFan, setIsUploadingFan] = useState(false);
  let [isUploadingImageArtist, setIsUploadingImageArtist] = useState(false);

  let [fan, setFan] = useState('');
  let [artistImage, setArtistImage] = useState(r1);
  let [producerImage, setProducerImage] = useState(r1);
  let [executiveProducerImage, setExecutiveProducerImage] = useState(r1);
  let [fanImage, setFanImage] = useState(r1);
  let [isImageArtist, setIsImageArtist] = useState(null);
  let [isMusicArtist, setIsMusicArtist] = useState(null);
  let [isProducer, setIsProducer] = useState(null);
  let [isExecutiveProducer, setIsExecutiveProducer] = useState(null);
  let [isFan, setIsFan] = useState(null);


  let [executiveProducer, setExecutiveProducer] = useState('');
  let [musicArtistImage, setMusicArtistImage] = useState(r1);

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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  let [fileType, setFileType] = useState();
  let [fileName, setFileName] = useState();

  let enableImageArtist = (e) => {
    setIsSavingChanges(true)
    if (artistImage === r1) {
      let variant = "error";
      enqueueSnackbar('Please Upload Image Artist Image', { variant });
      setIsSavingChanges(false);
    } else {
      e.preventDefault();
      let ImageArtistData = {
        Name: imageArtist,
        Profile: artistImage,
        role: "Image Artist",
        Website: website,
        About: aboutTheArt
      }
      axios.post(`/profile/createprofile`, ImageArtistData)
        .then((response) => {
          console.log("response", response);
          getUserRoles();
          setIsSavingChanges(false);
          let variant = "success";
          enqueueSnackbar('Image Artist Role has been Assigned to you Successfully', { variant });
        })
        .catch((error) => {
          console.log("error", error);
          setIsSavingChanges(false);
          let variant = "error";
          enqueueSnackbar('Unable to Assign role of Image Artist to you', { variant });

        })
    }
  }
  let enableMusicArtist = (e) => {
    setIsSavingChanges(true);
    e.preventDefault();
    if (musicArtistImage === r1) {
      let variant = "error";
      enqueueSnackbar('Please Upload Music Artist Image', { variant });
      setIsSavingChanges(false);
    } else {
      let MusicArtistData = {
        Name: musicArtist,
        Profile: musicArtistImage,
        role: "Music Artist",
        About: aboutTheTrack
      }
      axios.post(`/profile/createprofile`, MusicArtistData)
        .then((response) => {
          console.log("response", response);
          getUserRoles();
          setIsSavingChanges(false);
          let variant = "success";
          enqueueSnackbar('Music Artist Role has been Assigned to you Successfully', { variant });
        })
        .catch((error) => {
          console.log("error", error);
          setIsSavingChanges(false);
          let variant = "error";
          enqueueSnackbar('Unable to Assign role of Music Artist to you', { variant });

        })
    }
  }
  let enableProducer = (e) => {
    setIsSavingChanges(true);
    e.preventDefault();
    if (producerImage === r1) {
      let variant = "error";
      enqueueSnackbar('Please Upload Producer Image', { variant });
      setIsSavingChanges(false);
    } else {
      let ProducerData = {
        Name: producer,
        Profile: producerImage,
        role: "Producer",
        Inspiration: inspirationForThePiece
      }
      axios.post(`/profile/createprofile`, ProducerData)
        .then((response) => {
          console.log("response", response);
          getUserRoles();
          setIsSavingChanges(false);
          let variant = "success";
          enqueueSnackbar('Producer Role has been Assigned to you Successfully', { variant });
        })
        .catch((error) => {
          console.log("error", error);
          setIsSavingChanges(false);
          let variant = "error";
          enqueueSnackbar('Unable to Assign role of Producer to you', { variant });

        })
    }
  }
  let enableExecutiveProducer = (e) => {
    setIsSavingChanges(true);
    if (executiveProducerImage === r1) {
      let variant = "error";
      enqueueSnackbar('Please Upload Executive Producer Image', { variant });
      setIsSavingChanges(false);
    } else {
      e.preventDefault();
      let ExecutiveProducerData = {
        Name: executiveProducer,
        Profile: executiveProducerImage,
        role: "Executive Producer",
        Inspiration: executiveInspirationForThePiece,
      }
      axios.post(`/profile/createprofile`, ExecutiveProducerData)
        .then((response) => {
          console.log("response", response);
          getUserRoles();
          setIsSavingChanges(false);
          let variant = "success";
          enqueueSnackbar('Executive Producer Role has been Assigned to you Successfully', { variant });
        })
        .catch((error) => {
          console.log("error", error);
          setIsSavingChanges(false);
          let variant = "error";
          enqueueSnackbar('Unable to Assign role of Executive Producer to you', { variant });
        })
    }
  }
  let enableFan = (e) => {
    setIsSavingChanges(true);
    e.preventDefault();
    if (fanImage === r1) {
      let variant = "error";
      enqueueSnackbar('Please Upload Fan Image', { variant });
      setIsSavingChanges(false);
    } else {
      let FanData = {
        Name: fan,
        Profile: fanImage,
        role: "Fan",
        Inspiration: fanInspirationForThePiece,
      }
      axios.post(`/profile/createprofile`, FanData)
        .then((response) => {
          console.log("response", response);
          getUserRoles();
          setIsSavingChanges(false);
          let variant = "success";
          enqueueSnackbar('Fan Role has been Assigned to you Successfully', { variant });
        })
        .catch((error) => {
          console.log("error", error);
          setIsSavingChanges(false);
          let variant = "error";
          enqueueSnackbar('Unable to Assign role of Fan to you', { variant });
        })
    }
  }
  let getUserRoles = () => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${Cookies.get("Authorization")}`;
    axios.get("/profile/getuserprofile").then(
      (response) => {
        console.log("response", response);
        setIsImageArtist(response.data.Imageartist);
        setIsMusicArtist(response.data.Musicartist);
        setIsProducer(response.data.Producer);
        setIsExecutiveProducer(response.data.ExecutiveProducer);
        setIsFan(response.data.Fan);
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        if (error.response.data !== undefined) {
          if (error.response.data === "Unauthorized access (invalid token) !!") {
            Cookies.remove("Authorization");
            localStorage.removeItem("Address")
            window.location.reload();
          }
        }
      })
  }
  useEffect(() => {
    getUserRoles();
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
        setMusicArtistImage(response.data.url);
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
              {isImageArtist === null ? (
                <form onSubmit={(e) => enableImageArtist(e)} style={{ margin: "20px" }}>
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
                          style={{ color: "#ff0000" }}
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
              ) : (
                <form style={{ margin: "20px" }}>
                  <label className="focus-label">Artist Name</label>
                  <div className="form-group">
                    <input
                      type="text"
                      value={isImageArtist.Name}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <label className="focus-label">About the Art</label>
                  <div className="form-group">
                    <textarea
                      type="text"
                      rows="4"
                      value={isImageArtist.About}
                      className="form-control"
                      disabled
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
                          <img src={isImageArtist.Profile} alt="Selfie" />
                        </div>
                      </div>
                      <div className="upload-img">
                        <div
                          className="change-photo-btn"
                          style={{ backgroundColor: "rgb(167,0,0)" }}
                        >
                          <span><i className="fa fa-upload"></i>Upload photo</span>
                          <input
                            name="sampleFile"
                            type="file"
                            className="upload"
                            accept=".png,.jpg,.jpeg,.gif"
                            disabled
                          />
                        </div>
                        <small className="form-text text-muted">
                          Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="focus-label">Website URL</label>
                    <input
                      type="text"
                      value={isImageArtist.Website}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="submit-section">
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  </div>
                </form>
              )}

            </Container>
          ) : value === 1 ? (
            <Container>
              {isMusicArtist === null ? (
                <form onSubmit={(e) => enableMusicArtist(e)} style={{ margin: "20px" }}>
                  <div className="form-group">
                    {/* <label>Artist Name</label> */}
                    <input
                      type="text"
                      required
                      value={musicArtist}
                      placeholder="Enter Music Artist Name"
                      className="form-control"
                      onChange={(e) => {
                        setMusicArtist(e.target.value)
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
                          <img src={musicArtistImage} alt="Selfie" />
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
                          style={{ color: "#ff0000" }}
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
              ) : (
                <form style={{ margin: "20px" }}>
                  <div className="form-group">
                    <label>Artist Name</label>
                    <input
                      type="text"
                      value={isMusicArtist.Name}
                      className="form-control"
                      disabled
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
                          <img src={isMusicArtist.Profile} alt="Selfie" />
                        </div>
                      </div>
                      <div className="upload-img">
                        <div
                          className="change-photo-btn"
                          style={{ backgroundColor: "rgb(167,0,0)" }}
                        >
                          <span disabled><i className="fa fa-upload"></i>Upload photo</span>
                          <input
                            name="sampleFile"
                            type="file"
                            className="upload"
                            accept=".png,.jpg,.jpeg,.gif"
                            disabled
                          />
                        </div>
                        <small className="form-text text-muted">
                          Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>About the Track</label>
                    <textarea
                      type="text"
                      rows="4"
                      value={isMusicArtist.About}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="submit-section">
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  </div>
                </form>
              )}
            </Container>
          ) : value === 2 ? (
            <Container>
              {isProducer === null ? (
                <form onSubmit={(e) => enableProducer(e)} style={{ margin: "20px" }}>
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
                          style={{ color: "#ff0000" }}
                        >
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn submit-btn"
                        >
                          Save Changes
                   </button>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <form style={{ margin: "20px" }}>
                  <div className="form-group">
                    <label>Producer</label>
                    <input
                      type="text"
                      value={isProducer.Name}
                      className="form-control"
                      disabled
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
                          <img src={isProducer.Profile} alt="Selfie" />
                        </div>
                      </div>
                      <div className="upload-img">
                        <div
                          className="change-photo-btn"
                          style={{ backgroundColor: "rgb(167,0,0)" }}
                        >
                          <span disabled><i className="fa fa-upload"></i>Upload photo</span>
                          <input
                            name="sampleFile"
                            type="file"
                            className="upload"
                            accept=".png,.jpg,.jpeg,.gif"
                            disabled
                          />
                        </div>
                        <small className="form-text text-muted">
                          Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Inspiration For the Piece</label>
                    <textarea
                      type="text"
                      rows="4"
                      value={isProducer.Inspiration}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="submit-section">
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled
                        className="btn submit-btn"
                      >
                        Save Changes
                  </button>
                    </div>
                  </div>
                </form>
              )}

            </Container>
          ) : value === 3 ? (
            <Container>
              {isExecutiveProducer === null ? (
                <form onSubmit={(e) => enableExecutiveProducer(e)} style={{ margin: "20px" }}>
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
                          style={{ color: "#ff0000" }}
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
              ) : (
                <form style={{ margin: "20px" }}>
                  <div className="form-group">
                    <label>Executive Producer</label>
                    <input
                      type="text"
                      value={isExecutiveProducer.Name}
                      disabled
                      className="form-control"
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
                          <span disabled><i className="fa fa-upload"></i>Upload photo</span>
                          <input
                            name="sampleFile"
                            type="file"
                            className="upload"
                            accept=".png,.jpg,.jpeg,.gif"
                            disabled
                          />
                        </div>
                        <small className="form-text text-muted">
                          Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                  </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Inspiration For the Piece</label>
                    <textarea
                      type="text"
                      rows="4"
                      value={isExecutiveProducer.Inspiration}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="submit-section">

                    <div className="text-center">
                      <button
                        type="submit"
                        disabled
                        className="btn submit-btn"
                      >
                        Save Changes
              </button>
                    </div>
                  </div>
                </form>
              )}
            </Container>
          ) : value === 4 ? (
            <Container>
              {isFan === null ? (
                <form onSubmit={(e) => enableFan(e)} style={{ margin: "20px" }}>
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
                          style={{ color: "#ff0000" }}
                        >
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn submit-btn"
                        >
                          Save Changes
                  </button>
                      </div>
                    )}
                  </div>
                </form>

              ) : (
                <form onSubmit={(e) => enableFan(e)} style={{ margin: "20px" }}>
                  <div className="form-group">
                    <label>Fan Name</label>
                    <input
                      type="text"
                      value={isFan.Name}
                      disabled
                      className="form-control"
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
                        >
                          <span><i className="fa fa-upload"></i>Upload photo</span>
                          <input
                            name="sampleFile"
                            type="file"
                            className="upload"
                            accept=".png,.jpg,.jpeg,.gif"
                            disabled
                          />
                        </div>
                        <small className="form-text text-muted">
                          Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                  </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Inspiration For the Piece</label>
                    <textarea
                      type="text"
                      rows="4"
                      value={isFan.Inspiration}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="submit-section">
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled
                        className="btn submit-btn"
                      >
                        Save Changes
              </button>
                    </div>
                  </div>
                </form>

              )}
            </Container>
          ) : (
            null
          )}

          <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
            <Modal.Header closeButton>
              <Modal.Title>Successfully Updated</Modal.Title>
            </Modal.Header>
          </Modal>
        </div >
      </div >
    </>
  );
}
export default ProfileSetting;
