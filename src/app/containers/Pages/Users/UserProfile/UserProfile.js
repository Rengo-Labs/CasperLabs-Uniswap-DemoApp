// eslint-disable-next-line
import CardActionArea from '@material-ui/core/CardActionArea';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid } from '@material-ui/core/';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Cookies from "js-cookie";
import axios from 'axios';
function UserProfile(props) {
    let [totalFans, setTotalFans] = useState(0);
    let [totalMusicArtists, setTotalMusicArtists] = useState(0);
    let [totalImageArtists, setTotalImageArtists] = useState(0);
    let [totalProducers, setTotalProducers] = useState(0);
    let [totalExecutiveProducers, setTotalExecutiveProducers] = useState(0);
    let [totalCubes, setTotalCubes] = useState(0);
    let [totalNFTs, setTotalNFTs] = useState(0);


    let [userData, setUserData] = useState([]);
    const [totalProducerNftsData, setTotalProducerNftsData] = useState(0);

    // let getCounts = () => {
    //   axios
    //     .get("/api/v1/admin/getCounts")
    //     .then((response) => {
    //       console.log(response);
    //       setApproved(response.data.approved);
    //       setPending(response.data.pending);
    //       setDisputed(response.data.UnderDisputed)
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       console.log(error.response);
    //     });
    // };
    let getUserData = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        // nft/getnft/{userId}/{start}/{end} 
        axios.get(`/profile/getuserprofile/${props.userId}`).then(
            (response) => {
                console.log("response", response);
                setUserData(response.data.UserData);
                setTotalFans(response.data.FanNFTcount);
                setTotalImageArtists(response.data.ImageArtistNFTcount);
                setTotalMusicArtists(response.data.MusicArtistCubecount);
                setTotalProducers(response.data.ProducerNFTcount);
                setTotalExecutiveProducers(response.data.ExecutiveProducerNFTcount)
                setTotalCubes(response.data.Cubescount);
                setTotalNFTs(response.data.NFTscount)
                // setTotalProducerNftsData(response.data.NFTcount);

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
        getUserData();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid">

                    {/* <!-- Page Header --> */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-6">
                                <h3 className="page-title">User Profile</h3>
                                <div className="card">
                                    <div className="card-body">
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item active" style={{ color: "rgb(167, 0, 0)" }}>User Name : {userData.username}</li>
                                        </ul>
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item active" style={{ color: "rgb(167, 0, 0)" }}> User Email : {userData.email}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /Page Header --> */}

                    <div className="container-fluid">
                        <div className="row">
                            <li className="menu-title" style={{ color: "rgb(167, 0, 0)" }}>
                                <span>Main</span>
                            </li>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/nfts/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-warning border-warning">
                                                        <i className="fas fa-th"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalNFTs}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Total Nfts</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-warning w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/cubes/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-secondary border-secondary">
                                                        <i className="fas fa-cubes"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalCubes}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Total Cubes</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-secondary w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>

                        </div>
                        <div className="row">
                            <li className="menu-title" style={{ color: "rgb(167, 0, 0)" }}>
                                <span>Role</span>
                            </li>
                        </div>
                        <div className="row">

                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/imageArtist/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-danger border-danger">
                                                        <i className="far fa-images"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalImageArtists}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Image Artist</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-danger w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/musicArtist/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-success border-success">
                                                        <i className="fas fa-music"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalMusicArtists}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Music Artist</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-success w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/producer/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-info border-info">
                                                        <i className="fas fa-user-tie"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalProducers}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Producer</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-info w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/executiveProducer/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-warning border-warning">
                                                        <i className="fas fa-user-secret"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalExecutiveProducers}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Executive Producer</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-warning w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-3">
                                <Link to={`/User/Profile/Detail/fan/${props.userId}/null`}>
                                    <div className="card">
                                        <CardActionArea>
                                            <div className="card-body">
                                                <div className="dash-widget-header">
                                                    <span className="dash-widget-icon text-secondary border-secondary">
                                                        <i className="fas fa-user-alt"></i>
                                                    </span>
                                                    <div className="dash-count">
                                                        <h3>{totalFans}</h3>
                                                    </div>
                                                </div>
                                                <div className="dash-widget-info">
                                                    <h6 className="text-muted">Fan</h6>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-secondary w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardActionArea>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;
