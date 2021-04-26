import { Grid } from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Spinner } from "react-bootstrap";
import Chip from '@material-ui/core/Chip';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Row } from "react-bootstrap";
import r1 from '../../../../assets/img/patients/patient.jpg';
import Countdown from 'react-countdown';

import { useParams } from "react-router-dom";

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



function CubeNFTs(props) {
    const classes = useStyles();
    const { dropId, cubeId } = useParams();
    // console.log("dropId", dropId);
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [dropData, setDropData] = useState({});

    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getCubeNFTs = () => {
        handleShowBackdrop();

        let Data = {
            tokenId: cubeId,
            check: dropId === "notdrop" ? dropId : "drop",
            dropId: dropId !== "notdrop" ? dropId : null,
        }
        console.log("Data", Data);
        axios.post("/token/SingleTokenId", Data).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                if (dropId !== "notdrop") {
                    setDropData(response.data.Dropdata);
                }
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
                        window.location.reload();
                    }
                }
                handleCloseBackdrop();
            })
    }

    useEffect(() => {
        getCubeNFTs();
        // getCollections();?

        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "active",
            myCubes: "",
            myDrops: "",
            settings: "",
            mySeason: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "",
            newRandomDrop: "",
        });
    }, []);

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">NFTs</li>
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
                                                >
                                                    <div class="wrapper">
                                                        <div class="cube-box">
                                                            {tokenList.map((j, jindex) => (
                                                                <img src={j[0].artwork} key={jindex} style={{ border: j[0].type === "Mastercraft" ? '4px solid #ff0000' : j[0].type === "Legendary" ? '4px solid #FFD700' : j[0].type === "Epic" ? '4px solid #9400D3' : j[0].type === "Rare" ? '4px solid #0000FF' : j[0].type === "Uncommon" ? '4px solid #008000' : j[0].type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                                            ))}
                                                            {new Array(6 - tokenList.length).fill(0).map((_, index) => (
                                                                < img src={r1} alt="" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardMedia>
                                            </CardActionArea>
                                        </Card>
                                    </div>

                                    {dropId !== "notdrop" ? (
                                        <div className="col-md-12 col-lg-6">
                                            <Chip clickable style={{ marginTop: '20px' }}
                                                color="" label="@UserName" />
                                            <h1>{cubeData.title} </h1>
                                            <h2>Minimum Bid : {dropData.MinimumBid / 10 ** 18} ETH </h2>
                                            <h2>Bid Delta : {dropData.bidDelta / 10 ** 18} ETH </h2>
                                            {new Date() < new Date(dropData.AuctionStartsAt) ? (
                                                <Typography variant="h5" gutterBottom color="textSecondary">
                                                    <strong>Auction Starts At:</strong>
                                                    <span style={{ color: "#00FF00" }} >
                                                        <Countdown daysInHours date={new Date(dropData.AuctionStartsAt)}>
                                                        </Countdown>
                                                    </span>
                                                </Typography>

                                            ) : new Date() > new Date(dropData.AuctionStartsAt) && new Date() < new Date(dropData.AuctionEndsAt) ? (
                                                <Typography variant="h5" gutterBottom color="textSecondary" component="p">
                                                    <strong>Auction Ends At: </strong>
                                                    <span style={{ color: "#FF0000" }}>
                                                        <Countdown daysInHours date={new Date(dropData.AuctionEndsAt)}>
                                                        </Countdown>
                                                    </span>
                                                </Typography>

                                            ) : (
                                                <Typography variant="h5" gutterBottom style={{ color: "#FF0000" }} component="p">
                                                    <strong>Auction Ended</strong>
                                                </Typography>
                                            )}
                                            <h3 className="text-muted">Music Artist</h3>

                                            <CardHeader
                                                avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                title={cubeData.MusicArtistName}
                                                subheader={cubeData.MusicArtistAbout}
                                            />
                                            <Row>
                                                <button className="btn-lg btn btn-dark btn-block" >Place a bid</button>{' '}

                                            </Row>
                                        </div>
                                    ) : (
                                        <div className="col-md-12 col-lg-6">
                                            <Chip clickable style={{ marginTop: '20px' }}
                                                color="" label="@UserName" />
                                            <h1>{cubeData.title} </h1>
                                            <h4>Reserve Price</h4>
                                            <h2>{cubeData.SalePrice / 10 ** 18} ETH </h2>
                                            <h3 className="text-muted">Music Artist</h3>
                                            <CardHeader
                                                avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                title={cubeData.MusicArtistName}
                                                subheader={cubeData.MusicArtistAbout}
                                            />
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                    </section >
                    <div className="form-group">

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
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                            // alignItems="flex-start"
                            >
                                {console.log("tokenList", tokenList)}
                                {tokenList.map((i, index) => (

                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Card style={{ height: "100%" }} variant="outlined">
                                            <CardHeader className="text-center"
                                                title={i[0].title}
                                            />
                                            <CardMedia
                                                style={{ height: "100%" }} variant="outlined" style={{ border: i[0].type === "Mastercraft" ? '4px solid #ff0000' : i[0].type === "Legendary" ? '4px solid #FFD700' : i[0].type === "Mastercraft" ? '4px solid ##ff0000' : i[0].type === "Epic" ? '4px solid #9400D3' : i[0].type === "Rare" ? '4px solid #0000FF' : i[0].type === "Uncommon" ? '4px solid #008000' : i[0].type === "Common" ? '4px solid #FFFFFF' : 'none' }}
                                                className={classes.media}
                                                image={i[0].artwork}

                                                title="NFT Image"
                                            />
                                            <CardContent>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Artwork Description: </strong>{i[0].description}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Token Rarity: </strong>{i[0].type}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Token Supply: </strong>{i[0].tokensupply}
                                                </Typography>
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Image Artist</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i[0].ImageArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                    title={i[0].ImageArtistName}
                                                    subheader={i[0].ImageArtistAbout}
                                                />
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Website URL: </strong>{i[0].ImageArtistWebsite}
                                                </Typography>
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Producer</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i[0].ProducerProfile} aria-label="Producer" className={classes.avatar} />}
                                                    title={i[0].ProducerName}
                                                    subheader={i[0].ProducerInspiration}
                                                />
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Executive Producer</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i[0].ExecutiveProducerProfile} aria-label="Executive Producer" className={classes.avatar} />}
                                                    title={i[0].ExecutiveProducerName}
                                                    subheader={i[0].ExecutiveProducerInspiration}
                                                />
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Fan</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i[0].FanProfile} aria-label="Fan" className={classes.avatar} />}
                                                    title={i[0].FanName}
                                                    subheader={i[0].FanInspiration}
                                                />

                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Other: </strong>{i[0].other}
                                                </Typography>
                                                {/* <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Collection: </strong>{i[0].collectiontitle}
                                                </Typography> */}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </div>
                </form>
            </div >
            {/* <Backdrop className={classes.backdrop} open={open} onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop> */}
        </div >

    );
}

export default CubeNFTs;
