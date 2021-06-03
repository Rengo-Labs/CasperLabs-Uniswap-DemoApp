import { Grid } from '@material-ui/core/';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';
import { useParams, useHistory, Link } from "react-router-dom";
import NewNFTCard from '../../../../components/Cards/NewNFTCards';
import TxHistory from '../../../../components/Cards/TxHistory';
import CubeComponent from '../../../../components/Cube/CubeComponent';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    badge: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    card: {
        minWidth: 250,
    },
    media1: {
        height: 300,
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

function UserCubeNFTs(props) {
    let jwt = Cookies.get("Authorization");
    let jwtDecoded;
    if (jwt) {
        console.log(jwtDecode(jwt));
        // setjwtDecoded(jwtDecode(jwt));
        jwtDecoded = jwtDecode(jwt);
    }
    console.log("jwtDecoded", jwtDecoded);
    const classes = useStyles();
    let history = useHistory();
    const { cubeId } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [openNFTData, setOpenNFTData] = React.useState(false);
    const [ownerAudio, setOwnerAudio] = useState(new Audio());
    const [nonOwnerAudio, setNonOwnerAudio] = useState(new Audio());

    const [isPlaying, setIsPlaying] = useState(false);

    const handleCloseNFTData = () => {
        setOpenNFTData(false);
    };
    const handleShowNFTData = () => {
        setOpenNFTData(true);
    };

    useEffect(() => {
        (async () => {
            ownerAudio.addEventListener('ended', () => ownerAudio.pause());
            nonOwnerAudio.addEventListener('ended', () => nonOwnerAudio.pause());
            return () => {
                ownerAudio.removeEventListener('ended', () => ownerAudio.pause());
                nonOwnerAudio.addEventListener('ended', () => nonOwnerAudio.pause());
            };
        })();// eslint-disable-next-line
    }, []);
    let getUserCubeNFTs = () => {
        handleShowNFTData();
        console.log("dropId", cubeId);
        let Data = {
            tokenId: cubeId,
            check: "notdrop",
        }

        console.log("Data", Data);
        axios.post("/token/SingleTokenId", Data).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                setOwnerAudio(new Audio(response.data.tokensdata.ownermusicfile))
                setNonOwnerAudio(new Audio(response.data.tokensdata.nonownermusicfile))
                axios.get(`/transaction/tokenTransaction/${response.data.tokensdata.tokenId}`).then((res) => {
                    console.log("res", res);
                    setTransactionHistory(res.data.transactions)
                    handleCloseNFTData();
                }, (error) => {
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
                    handleCloseNFTData();
                })
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
                handleCloseNFTData();
            })
    }

    useEffect(() => {
        getUserCubeNFTs();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="card">
                    <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                        <li className="breadcrumb-item" style={{ color: "#fff", cursor: 'pointer' }} onClick={() => history.goBack()}>
                            <i className="fas fa-arrow-left"></i> Back
                    </li>
                        <li className="breadcrumb-item active">Cube's NFTs</li>
                    </ul>
                    <div className="card-body">
                        <form >
                            <section className="section">
                                <div className="container-fluid">
                                    <div className="" style={{ paddingTop: "0px" }}>
                                        <div className="row">
                                            <div className="col-md-12 col-lg-6">
                                                <Card className={classes.root}>
                                                    <CardActionArea>
                                                        <CardMedia
                                                            className={classes.media1}
                                                            title=""
                                                            image=""
                                                            onClick={() => {
                                                                setIsPlaying(!isPlaying)

                                                                if (!isPlaying) {
                                                                    if (jwtDecoded !== undefined || jwtDecoded !== null) {
                                                                        if (jwtDecoded.userId === cubeData.userId) {
                                                                            console.log("Owner");
                                                                            ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                                            ownerAudio.play();
                                                                        }
                                                                        else {
                                                                            console.log("NON Owner");
                                                                            nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                            nonOwnerAudio.play();
                                                                        }
                                                                    } else {
                                                                        console.log("NON Owner");
                                                                        nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                        nonOwnerAudio.play();
                                                                    }
                                                                } else {
                                                                    if (jwtDecoded !== undefined || jwtDecoded !== null) {
                                                                        if (jwtDecoded.userId === cubeData.userId) {
                                                                            console.log("Owner Pause");
                                                                            ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                                            ownerAudio.pause();
                                                                        }
                                                                        else {
                                                                            console.log("Non Owner Pause");
                                                                            nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                            nonOwnerAudio.pause();
                                                                        }
                                                                    } else {
                                                                        console.log("Non Owner Pause");
                                                                        nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                        nonOwnerAudio.pause();
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <CubeComponent data={tokenList} />
                                                        </CardMedia>
                                                    </CardActionArea>
                                                </Card>
                                            </div>


                                            <div className="col-md-12 col-lg-6">
                                                {/* <Chip clickable style={{ marginTop: '20px' }}
                                                color="" label="@UserName" /> */}
                                                <h1>{cubeData.title} </h1>
                                                <h4>Reserve Price</h4>
                                                <h2>{cubeData.SalePrice / 10 ** 18} ETH </h2>
                                                <h3 className="text-muted">Music Artist</h3>
                                                <Link to={"/User/Profile/Detail/musicArtist/" + cubeData.MusicArtistId + "/null"} style={{ color: '#000' }}>
                                                    <CardHeader
                                                        avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                        title={cubeData.MusicArtistName}
                                                        subheader={cubeData.MusicArtistAbout}
                                                    />
                                                </Link>


                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </section >
                            <div className="form-group" style={{ marginTop: '20px', marginBottom: '20px' }}>

                                {openNFTData ? (
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
                                    <div className="row">
                                        <div className="col-md-12 col-lg-6" style={{ marginTop: "20px" }}>
                                            <Grid
                                                container
                                                spacing={2}
                                                direction="row"
                                                justify="flex-start"
                                            >
                                                {tokenList.map((i, index) => (
                                                    <NewNFTCard data={i[0]} key={index} />
                                                ))}

                                            </Grid>
                                        </div>
                                        <div className="col-md-12 col-lg-6" >
                                            <div className="form-group" style={{ marginTop: "20px" }}>
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography variant="h6" gutterBottom>Tx History</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {transactionHistory.length === 0 ? (
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>No Transaction History Found </strong>
                                                            </Typography>
                                                        ) : (null)}
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                            direction="row"
                                                            justify="flex-start"
                                                        >
                                                            {transactionHistory.slice(0).reverse().map((i, index) => (
                                                                <TxHistory data={i} key={index} />
                                                            ))}
                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>


                                            {/* </div> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div >
                </div >
            </div >
        </div >


    );
}

export default UserCubeNFTs;
