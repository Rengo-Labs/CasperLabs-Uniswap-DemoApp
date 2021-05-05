import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Logo from "../../assets/img/logo.png";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Modal, Button, Spinner } from "react-bootstrap";
import Avatar from '@material-ui/core/Avatar';
import Axios from "axios";
import Web3 from "web3";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import NetworkErrorModal from "../Modals/NetworkErrorModal";


function HeaderHome(props) {
  let [menuOpenedClass, setMenuOpenedClass] = useState();
  let [dropdownOpen1, setDropdownOpen1] = useState(false);
  let [isLoading, setIsLoading] = useState(false);


  let [network, setNetwork] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const selectedStyling = {
    border: "2px solid 'rgb(167,0,0)'",
    padding: "10px 20px",
    borderRadius: "5px",
    color: '#FFF',
    backgroundColor: 'rgb(167,0,0)'
  };
  const defaultStyling = {
    // border: "2px solid rgb(167,0,0)",
    padding: "10px 20px",
    borderRadius: "5px",
    // color: '#FFF',
    // backgroundColor: "#000"
  };
  const selectedNavStyle = {
    search: props.selectedNav === "search" ? defaultStyling : defaultStyling,
    Market: props.selectedNav === "Market" ? selectedStyling : defaultStyling,
    Drops: props.selectedNav === "Drops" ? selectedStyling : defaultStyling,
    Home: props.selectedNav === "Home" ? selectedStyling : defaultStyling,
    Blog: props.selectedNav === "Blog" ? selectedStyling : defaultStyling,
    Community: props.selectedNav === "Community" ? selectedStyling : defaultStyling,
    create: props.selectedNav === "create" ? selectedStyling : defaultStyling,
  };

  let Login = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const network = await web3.eth.net.getNetworkType()
    console.log("Account test: ", accounts[0], network);
    if (network !== 'ropsten') {
      setNetwork(network);
    setIsLoading(false);

      handleShow();
    }
    else {
      let loginData = {
        // address: accounts[0],
        address: "0xf363D646C2767dB90Af945ebD6F71367166159A2",
        network: network,
        // roles: 'admin'
      }
      Axios.post("user/auth/login", loginData).then(
        (response) => {
          console.log("response", response);
          Cookies.set("Authorization", response.data.token, {
          });
          if (response.data.roles === "user") {
            localStorage.setItem("Address", accounts[0]);
          }
          setIsLoading(false);
          window.location.reload();

        },
        (error) => {
          if (process.env.NODE_ENV === "development") {
            console.log(error);
            console.log(error.response);
          }
          setIsLoading(false);
        })
    }

  }
  let LoginUser = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const network = await web3.eth.net.getNetworkType()
    console.log("Account test: ", accounts[0], network);
    if (network !== 'ropsten') {
      setNetwork(network);
      setIsLoading(false);
      handleShow();
    }
    else {
      let loginData = {
        address: accounts[0],
        // address: "0xf363D646C2767dB90Af945ebD6F71367166159A2",
        network: network,
        // roles: 'admin'
      }
      Axios.post("user/auth/login", loginData).then(
        (response) => {
          console.log("response", response);
          Cookies.set("Authorization", response.data.token, {
          });
          if (response.data.roles === "user") {
            localStorage.setItem("Address", accounts[0]);
          }
          setIsLoading(false);
          window.location.reload();

        },
        (error) => {
          if (process.env.NODE_ENV === "development") {
            console.log(error);
            console.log(error.response);
          }
          setIsLoading(false);
        })
    }

  }
  return (
    <header className={`header ${menuOpenedClass}`}>
      <nav
        className="navbar navbar-expand-lg header-nav"
        style={{ width: "100%" }}
      >
        <div className="navbar-header">
          <a
            id="mobile_btn"
            href="/"
            style={{ color: "rgb(167,0,0)" }}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpenedClass("menu-opened");
            }}
          >
            <span className="bar-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>

          <Link style={{ color: 'rgb(167,0,0)' }} to="/" className="navbar-brand logo">
            <img src={Logo} alt="Logo" width="130" />
            {/* Robot Drop */}
          </Link>

          {/* <Link style={{ color: 'rgb(167,0,0)' }} to="/kyc" className="navbar-brand">
            KYC
          </Link> */}
        </div>

        <div className="main-menu-wrapper">
          <div className="menu-header">
            {/* <a style={{ color: 'rgb(167,0,0)' }} href="/" className="menu-logo">
              <img src={Logo} alt="Logo" width="100" height="60" />
            </a> */}
            <a
              id="menu_close"
              className="menu-close"
              style={{ color: 'rgb(167,0,0)' }}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpenedClass("");
              }}
            >
              <i className="fas fa-times"></i>
              {" "}Close
            </a>
          </div>
          <ul
            className="main-nav "
            style={{
              marginTop: "4px",
            }}
          >
            <li className="login-link ">
              <a
                href="/"
                style={{ paddingLeft: "5px" }}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpenedClass("");
                }}
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </a>
            </li>
            <li className="login-link ">
              <Link to="/dashboard" style={{ color: 'rgb(167,0,0)' }} >

                {localStorage.getItem("Address") ? (
                  <a href={"https://ropsten.etherscan.io/address/" + localStorage.getItem("Address")} target="_blank" style={{ color: 'rgb(167,0,0)' }}>
                    <span style={{ cursor: 'pointer' }}>{localStorage.getItem("Address").substr(0, 10)}. . .</span>
                  </a>
                ) : (
                  <>
                    <span style={selectedNavStyle.Community} onClick={() => Login()}>
                      Admin Login
                </span>
                  </>
                )}
              </Link>
            </li>
            <li className="login-link ">
              <Link to="/dashboard" style={{ color: 'rgb(167,0,0)' }} >

                {localStorage.getItem("Address") ? (
                  <a href={"https://ropsten.etherscan.io/address/" + localStorage.getItem("Address")} target="_blank" style={{ color: 'rgb(167,0,0)' }}>
                    <span style={{ cursor: 'pointer' }}>{localStorage.getItem("Address").substr(0, 10)}. . .</span>
                  </a>
                ) : (
                  <>
                    <span style={selectedNavStyle.Community} onClick={() => LoginUser()}>
                      User Login
              </span>
                  </>
                )}
              </Link>
            </li>
            <li>
              <a href="/" style={{ color: 'rgb(167,0,0)' }} >
                <span style={selectedNavStyle.Home}>
                  Home
                  </span>
              </a>
            </li>
            <li>
              <Link to="/marketPlace" style={{ color: 'rgb(167,0,0)' }} >
                <span style={selectedNavStyle.Market}>
                  Market
                  </span>
              </Link>
            </li>
            <li>
              <Link to="/auctionDrops" style={{ color: 'rgb(167,0,0)' }} >
                <span style={selectedNavStyle.Drops}>
                  Drops
                  </span>
              </Link>
            </li>

          </ul>
        </div>
        <ul className="nav header-navbar-rht">
          <li >{isLoading ? (
            <div className="text-center">
              <Spinner
                animation="border"
                role="status"
                style={{ color: "ff0000" }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            localStorage.getItem("Address") ? (
              null
            ) : (
              <>
                <span style={{ cursor: 'pointer' }} onClick={() => Login()}>
                  Admin Login
              </span>
              </>
            )
          )}

          </li>
          <li >{isLoading ? (
            <div className="text-center">
              <Spinner
                animation="border"
                role="status"
                style={{ color: "ff0000" }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            localStorage.getItem("Address") ? (
              <a href={"https://ropsten.etherscan.io/address/" + localStorage.getItem("Address")} target="_blank" style={{ color: 'rgb(167,0,0)' }}>
                <span style={{ cursor: 'pointer' }}>{localStorage.getItem("Address").substr(0, 10)}. . .</span>
              </a>
            ) : (
              <>

                <span style={{ cursor: 'pointer' }} onClick={() => LoginUser()}>
                  User Login
            </span>
              </>
            )
          )}

          </li>
          <li >
            {localStorage.getItem("Address") ? (
              <Link to="/dashboard" style={{ color: 'rgb(167,0,0)' }} >
                Dashboard
              </Link>
            ) : (
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            )}
          </li>
        </ul>
        <NetworkErrorModal
          show={show}
          handleClose={handleClose}
          network={network}
        >
        </NetworkErrorModal>
      </nav>
    </header >
  );
}

export default HeaderHome;
