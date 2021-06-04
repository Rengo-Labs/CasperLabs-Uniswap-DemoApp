import {
    Card,
    CardContent, CardHeader, Grid
} from '@material-ui/core/';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9
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

function Drops() {
    const [tokenList, setTokenList] = useState([]);
    const [rowsPerPage] = useState(4);
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    let getMyDrops = (start, end) => {
        setOpen(true)
        axios.get(`/drop/drops/${start}/${end}`).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.Dropdata);
                setOpen(false)
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setOpen(false)
            })
    }
    useEffect(() => {
        getMyDrops(0, rowsPerPage);// eslint-disable-next-line
    }, []);
    return (
        <>
            <div className="container-fluid">
                <div className="page-header">
                    <div className="card-body">
                        <h3><pre>Drops<Link to="/auctionDrops" style={{ float: 'right', color: "#ff0000" }}>View All </Link></pre></h3>
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
                            ) : tokenList.length === 0 ? (
                                <Card variant="outlined" style={{ padding: "40px", marginTop: '20px', marginBottom: '20px' }}>
                                    <Typography variant="body2" className="text-center" color="textSecondary" component="p"  >
                                        <strong>No items to display </strong>
                                    </Typography>
                                </Card>
                            ) : (
                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                >
                                    {tokenList.map((i, index) => (

                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Link to={"/auctionDrops/DropCubes/" + i._id}>
                                                <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                                    <CardActionArea>
                                                        <CardHeader className="text-center"
                                                            title={i.title}
                                                        />
                                                        <CardMedia
                                                            className={classes.media}
                                                            image={i.image}
                                                            title=""
                                                        >
                                                        </CardMedia>
                                                        <CardContent>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Drop Description: </strong>{i.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Minimum Bid: </strong>{(i.MinimumBid) / 10 ** 18} WETH
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">
                                                                {new Date() < new Date(i.AuctionStartsAt) ? (
                                                                    <div style={{ color: "#00FF00" }} >

                                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                                            <strong>Auction Starts At:</strong>
                                                                        </Typography>
                                                                        <Countdown daysInHours date={new Date(i.AuctionStartsAt)}>
                                                                        </Countdown>
                                                                    </div>
                                                                ) : new Date() > new Date(i.AuctionStartsAt) && new Date() < new Date(i.AuctionEndsAt) ? (
                                                                    <div style={{ color: "#FF0000" }}>
                                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                                            <strong>Auction Ends At:</strong>
                                                                        </Typography>
                                                                        <Countdown daysInHours date={new Date(i.AuctionEndsAt)}>
                                                                        </Countdown>
                                                                    </div>) : (
                                                                    <Typography variant="body2" style={{ color: "#FF0000" }} component="p">
                                                                        <strong>Auction Ended</strong>
                                                                    </Typography>
                                                                )}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Link>
                                        </Grid >
                                    ))}
                                </Grid>
                            )}
                        </div>
                    </div >
                </div>
            </div >
        </>
    );
}

export default Drops;
