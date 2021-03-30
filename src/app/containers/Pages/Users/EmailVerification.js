import React, { useState, useEffect } from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/css/style.css";
import Header from "../../../components/Headers/Header";
import success from "../../../assets/img/success.png";
import failure from "../../../assets/img/failure.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function EmailVerification(props) {
  const { email, token } = useParams();
  const classes = useStyles();

  let [isConfirming, setIsConfirming] = useState(false);
  let [isSuccess, setIsSuccess] = useState("");
  let handleEmailVerification = () => {
    setIsSuccess("");
    setIsConfirming(true);
    axios
      .get(`/api/v1/users/emailverification/${email}/${token}`)
      .then((response) => {
        setIsSuccess(true);
        setIsConfirming(false);
      })
      .catch((error) => {
        setIsConfirming(false);
        setIsSuccess(false);
        console.log(error);
      });
  };

  useEffect(() => {
    handleEmailVerification();// eslint-disable-next-line
  },[]);
  return (
    <div className="main-wrapper">
      <div
        style={{ paddingTop: "10px" }}
        className="home-section home-full-height"
      >
        <Header setlocal={props.setlocal} selectedNav={"home"} />
        {isConfirming ? (
          <>
            <Backdrop className={classes.backdrop} open={isConfirming}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        ) : null}
        {isSuccess === true ? (
          <div className="container" style={{ marginTop: "10%" }}>
            <div className="row">
              <div className="col-12 text-center booking-success">
                <p>Your Email Verification is successfull</p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-center">
                <img src={success} alt='success'/>
              </div>
            </div>
          </div>
        ) : null}
        {isSuccess === false ? (
          <div className="container" style={{ marginTop: "10%" }}>
            <div className="row">
              <div className="col-12 text-center booking-failure">
                <p>Invalid Email Verification URL</p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-center email-verification-failure">
                <img src={failure} alt='falure' />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EmailVerification;
