import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
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
import UserProfile from "./UserProfile/UserProfile";
import UserProfileSidebar from "./UserProfile/UserProfileSidebar";


function UserProfileScreen(props) {
    const { userRole, userId, cubeId } = useParams();
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
        profile: "active",
        nfts: "",
        cubes: "",
        imageArtist: "",
        musicArtist: "",
        producer: "",
        executiveProducer: "",
        fan: "",
    });
    useEffect(() => {
        console.log("userRole", userRole);

        if (userRole === "profile") {
            setActiveTab({
                profile: "active",
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "nfts") {
            setActiveTab({
                profile: "",
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
                profile: "",
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
                profile: "",
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
                profile: "",
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
                profile: "",
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
                profile: "",
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
                profile: "",
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "active",
            })
        }
        else if (userRole === "notdrop" && activeTab.cubes === "active") {
            setActiveTab({
                profile: "",
                nfts: "",
                cubes: "active",
                imageArtist: "",
                musicArtist: "",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        } else if (userRole === "notdrop" && activeTab.musicArtist === "active") {
            setActiveTab({
                profile: "",
                nfts: "",
                cubes: "",
                imageArtist: "",
                musicArtist: "active",
                producer: "",
                executiveProducer: "",
                fan: "",
            })
        }

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
                        {activeTab.profile === "active" ? (
                            <UserProfile userId={userId} />
                        ) : activeTab.nfts === "active" ? (
                            <UserNfts userId={userId} />
                        ) : activeTab.cubes === "active" ? (
                            userRole === "notdrop" ? (
                                <UserCubeNFTs cubeId={cubeId} />
                            ) : (
                                <UserCubes userId={userId} />
                            )
                        ) : activeTab.imageArtist === "active" ? (
                            <UserImageArtist userId={userId} />
                        ) : activeTab.musicArtist === "active" ? (
                            userRole === "notdrop" ? (
                                <UserCubeNFTs cubeId={cubeId} />
                            ) : (
                                <UserMusicArtist userId={userId} />
                            )
                        ) : activeTab.producer === "active" ? (
                            <UserProducer userId={userId} />
                        ) : activeTab.executiveProducer === "active" ? (
                            <UserExecutiveProducer userId={userId} />
                        ) : activeTab.fan === "active" ? (
                            <UserFan userId={userId} />
                        ) : (null)
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserProfileScreen;
