import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useParams } from "react-router-dom";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from "../../../assets/img/logo.png";
import patient from "../../../assets/img/patients/patient.jpg";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import UserCubeNFTs from "./UserProfile/UserCubeNFTs";
import UserCubes from "./UserProfile/UserCubes";
import UserExecutiveProducer from "./UserProfile/UserExecutiveProducer";
import UserFan from "./UserProfile/UserFan";
import UserImageArtist from "./UserProfile/UserImageArtist";
import UserMusicArtist from "./UserProfile/UserMusicArtist";
import UserNfts from "./UserProfile/UserNfts";
import UserProducer from "./UserProfile/UserProducer";
import UserProfileSidebar from "./UserProfile/UserProfileSidebar";


function UserProfileScreen(props) {
    const { userRole, userId, cubeId } = useParams();
    let [data, setData] = useState("");
    let [menuOpenedClass, setMenuOpenedClass] = useState();
    let [slideNavClass, setSlideNavClass] = useState();

    let handleSlideNav = (e) => {
        e.preventDefault();
        if (slideNavClass !== "" && menuOpenedClass !== "") {
            setMenuOpenedClass("");
            setSlideNavClass("");
        } else {
            setMenuOpenedClass("menu-opened");
            setSlideNavClass("slide-nav");
        }
    };
    let [activeTab, setActiveTab] = useState({
        nfts: "active",
        cubes: "",
        imageArtist: "",
        musicArtist: "",
        producer: "",
        executiveProducer: "",
        fan: "",
    });

    const [profileRowsPerPage, setProfileRowsPerPage] = React.useState(8);

    const [totalUserUserNftsData, setTotalUserUserNftsData] = React.useState(0);
    const [profilePage, setProfilePage] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };


    const handleChangeProfilePage = (event, newPage) => {
        console.log("newPage", newPage);
        setProfilePage(newPage);
        console.log("Start", newPage * profileRowsPerPage);
        console.log("End", newPage * profileRowsPerPage + profileRowsPerPage);
        getUserProfileData(newPage * profileRowsPerPage, newPage * profileRowsPerPage + profileRowsPerPage);
    };

    const handleChangeProfileRowsPerPage = (event) => {
        setProfileRowsPerPage(parseInt(event.target.value, 10));
        getUserProfileData(0, parseInt(event.target.value, 10));
        setProfilePage(0);
    };

    let getUserProfileData = (start, end) => {
        handleShowBackdrop();
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        // nft/getnft/{userId}/{start}/{end} 
        axios.get(`/token/getprofileusercubes/${userId}/${start}/${end}`).then(
            (response) => {
                console.log("response", response);
                setData(response.data.NFTdata);
                setTotalUserUserNftsData(response.data.Nftcount);
                handleCloseBackdrop();
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
                handleCloseBackdrop();
            })
    }
    useEffect(() => {
        console.log("userRole", userRole);
        if (userRole === "nfts") {
            setActiveTab({
                nfts: "active",
                cubes: "",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "cubes") {
            setActiveTab({
                nfts: "",
                cubes: "active",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "imageArtist") {
            setActiveTab({
                nfts: "",
                cubes: "",
                imageArtist: "active",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "musicArtist") {
            setActiveTab({
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "active",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "producer") {
            setActiveTab({
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "",
                producer: "active",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "executiveProducer") {
            setActiveTab({
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "active",
                fan: "",
            })
        } else if (userRole === "fan") {
            setActiveTab({
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "active",
            })
        }
        else if (userRole === "notdrop") {
            setActiveTab({
                nfts: "",
                cubes: "active",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        }

        getUserProfileData(0, profileRowsPerPage);
        // eslint-disable-next-line
    }, [userRole]);
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <div className={`main-wrapper ${slideNavClass}`}>
                        <div className={`admin-header ${menuOpenedClass}`}>
                            <div className="header-left">
                                <a
                                    href="/"
                                    className="logo"
                                    onClick={(e) => e.preventDefault()}
                                    style={{ color: 'rgb(167,0,0)' }}
                                >
                                    <img src={Logo} alt="Logo" width="100" height="100" />
                                </a>
                                <a
                                    href="/"
                                    className="logo logo-small"
                                    onClick={(e) => e.preventDefault()}
                                    style={{ color: 'rgb(167,0,0)' }}
                                >
                                    <img src={Logo} alt="Logo" width="100" height="100" />
                                </a>
                            </div>
                            <a
                                href="/"
                                className="mobile_btn"
                                id="mobile_btn"
                                onClick={handleSlideNav}
                            >
                                <i className="fa fa-bars"></i>
                            </a>
                            <ul className="nav user-menu">
                                <li className="nav-item dropdown has-arrow">
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "0",
                                                paddingTop: "15px",
                                            }}
                                        >
                                            <span className="admin-img">
                                                <img
                                                    className="avatar-sm rounded-circle"
                                                    src={patient}
                                                    width="50"
                                                    alt="Ryan Taylor"
                                                />
                                            </span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu alignRight="true" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
                                            <Dropdown.Item>
                                                <Link to="/dashboard" style={{ width: "100%" }}>
                                                    Dashboard
                  </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <Link
                                                    onClick={() => {
                                                        Cookies.remove("Authorization");
                                                        localStorage.removeItem("Address")
                                                        Cookies.remove("PNT");
                                                    }}
                                                    to="/"
                                                    style={{ width: "100%" }}
                                                >
                                                    Logout
                  </Link>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            </ul>
                        </div>

                        <UserProfileSidebar
                            userId={userId}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                        {open ? (
                            <div align="center" className="text-center">
                                <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ color: "#ff0000" }}
                                >
                                </Spinner>
                                <span style={{ color: "#ff0000" }} className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            activeTab.nfts === "active" ? (
                                <UserNfts userId={userId} />
                            ) : activeTab.cubes === "active" ? (
                                userRole === "notdrop" ? (
                                    <UserCubeNFTs cubeId={cubeId} data={data} />
                                ) : (
                                    <UserCubes userId={userId} data={data} />
                                )
                            ) : activeTab.imageArtist === "active" ? (
                                <UserImageArtist userId={userId} data={data} handleChangePage={handleChangeProfilePage} handleChangeRowsPerPage={handleChangeProfileRowsPerPage} page={profilePage} rowsPerPage={profileRowsPerPage} totalUserUserNftsData={totalUserUserNftsData} />
                            ) : activeTab.musicArtist === "active" ? (
                                <UserMusicArtist userId={userId} data={data} handleChangePage={handleChangeProfilePage} handleChangeRowsPerPage={handleChangeProfileRowsPerPage} page={profilePage} rowsPerPage={profileRowsPerPage} totalUserUserNftsData={totalUserUserNftsData} />
                            ) : activeTab.producer === "active" ? (
                                <UserProducer userId={userId} data={data} handleChangePage={handleChangeProfilePage} handleChangeRowsPerPage={handleChangeProfileRowsPerPage} page={profilePage} rowsPerPage={profileRowsPerPage} totalUserUserNftsData={totalUserUserNftsData} />
                            ) : activeTab.executiveProducer === "active" ? (
                                <UserExecutiveProducer userId={userId} data={data} handleChangePage={handleChangeProfilePage} handleChangeRowsPerPage={handleChangeProfileRowsPerPage} page={profilePage} rowsPerPage={profileRowsPerPage} totalUserUserNftsData={totalUserUserNftsData} />
                            ) : activeTab.fan === "active" ? (
                                <UserFan userId={userId} data={data} handleChangePage={handleChangeProfilePage} handleChangeRowsPerPage={handleChangeProfileRowsPerPage} page={profilePage} rowsPerPage={profileRowsPerPage} totalUserUserNftsData={totalUserUserNftsData} />
                            ) : (null)
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserProfileScreen;
