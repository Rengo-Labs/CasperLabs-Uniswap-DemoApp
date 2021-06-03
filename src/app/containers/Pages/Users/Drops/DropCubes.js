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
import Cookies from "js-cookie";
import Countdown from 'react-countdown';
import { Link, useParams } from 'react-router-dom';
import HeaderHome from '../../../../components/Headers/Header';

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



function DropCubes(props) {
    const { dropId } = useParams();
    const classes = useStyles();
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState([]);


    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getDropCubes = () => {
        handleShowBackdrop();
        let DropId = {
            dropId: dropId,
        }

        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${Cookies.get("Authorization")}`;
        axios.post("/drop/drops", DropId).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.Dropdata);
                setCubeData(response.data.Tokensdata);
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
        getDropCubes();// eslint-disable-next-line
    }, []);

    return (
        <div className="main-wrapper">
            <div className="home-section home-full-height">
                <HeaderHome selectedNav={"Drops"} />
                <div className="card">

                    <div className="card-body" style={{ marginTop: '110px' }}>
                        <div className="form-group">
                            <Typography variant="body2" color="textSecondary" component="p">
                                <strong>Drop Name: </strong>{tokenList.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                <strong>Drop Description: </strong>{tokenList.description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                <strong>Minimum Bid: </strong>{(tokenList.MinimumBid) / 10 ** 18} WETH
                            </Typography>
                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-left">
                                {new Date() < new Date(tokenList.AuctionStartsAt) ? (
                                    <Typography variant="h5" gutterBottom color="textSecondary">
                                        <strong>Auction Starts At:</strong>
                                        <span style={{ color: "#00FF00" }} >
                                            <Countdown daysInHours date={new Date(tokenList.AuctionStartsAt)}>
                                            </Countdown>
                                        </span>
                                    </Typography>

                                ) : new Date() > new Date(tokenList.AuctionStartsAt) && new Date() < new Date(tokenList.AuctionEndsAt) ? (
                                    <Typography variant="h5" gutterBottom color="textSecondary" component="p">
                                        <strong>Auction Ends At: </strong>
                                        <span style={{ color: "#FF0000" }}>
                                            <Countdown daysInHours date={new Date(tokenList.AuctionEndsAt)}>
                                            </Countdown>
                                        </span>
                                    </Typography>

                                ) : (
                                    <Typography variant="h5" gutterBottom style={{ color: "#FF0000" }} component="p">
                                        <strong>Auction Ended</strong>
                                    </Typography>
                                )}
                            </Typography>
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
                                    {cubeData.map((i, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Link to={"/auctionDrops/DropCubes/Nfts/" + dropId + "/" + i._id}>
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
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <CardActions>

                                                    </CardActions>
                                                </Card>
                                            </Link>
                                        </Grid >
                                    ))}
                                </Grid>
                            )}
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}

export default DropCubes;
