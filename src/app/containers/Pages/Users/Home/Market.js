
import { Avatar, CardHeader, Grid } from '@material-ui/core/';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 300,
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



function MarketPlace(props) {
    const classes = useStyles();
    const [userSaleData, setUserSaledata] = useState([]);
    const [cubeData, setCubeData] = useState([]);
    const [userAuctionData, setUserAuctiondata] = useState([]);
    const [cubeAuctionData, setCubeAuctionData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getCubes = (start, end) => {
        handleShowBackdrop();
        axios.get(`/marketplace/tokenIds/${start}/${end}`).then(
            (response) => {
                console.log("responseeeee", response);
                setCubeData(response.data.Saletokendata);
                setUserSaledata(response.data.Usersaledata)
                setCubeAuctionData(response.data.Auctiontokendata)
                setUserAuctiondata(response.data.Userauctiondata)
                handleCloseBackdrop();
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                handleCloseBackdrop();
            })
    }

    useEffect(() => {
        getCubes(0, 4);// eslint-disable-next-line
    }, []);

    return (
        <div className="container-fluid">
            {/* <!-- Page Header --> */}
            <div className="page-header">
                {/* <Container> */}

                <div className="card-body">
                    <h3><pre>Market Place <Link to="/marketPlace" style={{ float: 'right', color: "#ff0000" }}>View All </Link></pre></h3>
                    <hr></hr>
                    <div className="form-group" >
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
                        ) : cubeData.length === 0 && cubeAuctionData.length === 0 ? (
                            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }} >
                                <strong>Nothing to Display </strong>
                            </Typography>
                        ) : (
                            <>
                                {cubeData.length !== 0 ? (
                                    <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }} >
                                        <strong>On Sale </strong>
                                    </Typography>) : (
                                    null
                                )}

                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                // alignItems="flex-start"
                                >

                                    {cubeData.map((i, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Link to={"/marketPlace/Cubes/Nfts/notdrop/" + userSaleData[index].expiresAt + "/" + i._id + "/" + userSaleData[index]._id}>
                                                <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                                    {/* style={{ height: "100%" }} variant="outlined" */}
                                                    <CardActionArea>
                                                        <CardMedia
                                                            className={classes.media}
                                                            // image={img}
                                                            title=""
                                                        >
                                                            <div className="mainDiv">

                                                                <div className="square"></div>
                                                                <div className="square2"></div>
                                                                <div className="square3"></div>
                                                            </div>

                                                        </CardMedia>
                                                        <CardContent>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Cube Title: </strong>{i.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Cube Description: </strong>{i.description}
                                                            </Typography>

                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Sale Price: </strong>{i.SalePrice / 10 ** 18} ETH
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Music Artist</Typography>
                                                            <Link to={"/User/Profile/Detail/musicArtist/" + i.MusicArtistId + "/null"} style={{ color: '#000' }}>
                                                                <CardHeader
                                                                    avatar={<Avatar src={i.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                                    title={i.MusicArtistName}
                                                                    subheader={i.MusicArtistAbout}
                                                                />
                                                            </Link>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">
                                                                {new Date() < new Date(userSaleData[index].expiresAt) ? (
                                                                    <div style={{ color: "#FF0000" }}>
                                                                        {/* {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionEndsAt.toLoca))} */}
                                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                                            <strong>Sale Ends At:</strong>
                                                                        </Typography>
                                                                        <Countdown daysInHours date={new Date(userSaleData[index].expiresAt)}>
                                                                        </Countdown>
                                                                    </div>) : (
                                                                    <Typography variant="body2" style={{ color: "#FF0000" }} component="p">
                                                                        <strong>Sale Ended</strong>
                                                                    </Typography>
                                                                )}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <CardActions>

                                                    </CardActions>
                                                </Card>
                                            </Link>
                                        </Grid >
                                    ))}
                                </Grid>
                                {cubeAuctionData.length !== 0 ? (
                                    <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }} >
                                        <strong >On Auction </strong>
                                    </Typography>) : (
                                    null
                                )}

                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                // alignItems="flex-start"
                                >

                                    {cubeAuctionData.map((i, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Link to={"/marketPlace/Cubes/Nfts/userauction/" + i._id + "/" + userAuctionData[index]._id}>
                                                <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                                    <CardActionArea>
                                                        <CardMedia
                                                            className={classes.media}
                                                            // image={img}
                                                            title=""
                                                        >
                                                            <div className="mainDiv">

                                                                <div className="square"></div>
                                                                <div className="square2"></div>
                                                                <div className="square3"></div>
                                                            </div>

                                                        </CardMedia>
                                                        <CardContent>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Cube Title: </strong>{i.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Cube Description: </strong>{i.description}
                                                            </Typography>

                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Minimum Bid: </strong>{(userAuctionData[index].minimumBid) / 10 ** 18}  WETH
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Music Artist</Typography>
                                                            <Link to={"/User/Profile/Detail/musicArtist/" + i.MusicArtistId + "/null"} style={{ color: '#000' }}>
                                                                <CardHeader
                                                                    avatar={<Avatar src={i.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                                    title={i.MusicArtistName}
                                                                    subheader={i.MusicArtistAbout}
                                                                />
                                                            </Link>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">
                                                                {new Date() < new Date(userAuctionData[index].auctionStartsAt) ? (
                                                                    <div style={{ color: "#00FF00" }} >

                                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                                            <strong>Auction Starts At:</strong>
                                                                        </Typography>
                                                                        {/* {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionStartsAt))} */}
                                                                        <Countdown daysInHours date={new Date(userAuctionData[index].auctionStartsAt)}>
                                                                        </Countdown>
                                                                    </div>
                                                                ) : new Date() > new Date(userAuctionData[index].auctionStartsAt) && new Date() < new Date(userAuctionData[index].auctionEndsAt) ? (
                                                                    <div style={{ color: "#FF0000" }}>
                                                                        {/* {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionEndsAt.toLoca))} */}
                                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                                            <strong>Auction Ends At:</strong>
                                                                        </Typography>
                                                                        <Countdown daysInHours date={new Date(userAuctionData[index].auctionEndsAt)}>
                                                                        </Countdown>
                                                                    </div>) : (
                                                                    <Typography variant="body2" style={{ color: "#FF0000" }} component="p">
                                                                        <strong>Auction Ended</strong>
                                                                    </Typography>
                                                                )}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <CardActions>

                                                    </CardActions>
                                                </Card>
                                            </Link>
                                        </Grid >
                                    ))}
                                </Grid>
                            </>
                        )}
                    </div>
                </div >


            </div >
        </div >
    );
}

export default MarketPlace;
