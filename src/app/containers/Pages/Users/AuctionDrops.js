import { CardHeader, Grid } from '@material-ui/core/';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";




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

function AuctionDrops() {
    const classes = useStyles();
    const [tokenList, setTokenList] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(12);
    const [totalDrops, setTotalDrops] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getMyDrops = (start, end) => {
        handleShowBackdrop();
        axios.get(`/drop/drops/${start}/${end}`).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.Dropdata);
                setTotalDrops(response.data.Dropscount);
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
        getMyDrops(0, rowsPerPage);// eslint-disable-next-line
    }, []);
    const handleChangePage = (event, newPage) => {
        console.log("newPage", newPage);
        setPage(newPage);
        console.log("Start", newPage * rowsPerPage);
        console.log("End", newPage * rowsPerPage + rowsPerPage);
        getMyDrops(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        getMyDrops(0, parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <>
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome selectedNav={"Drops"} />
                    <div className="card-body">
                        <div className="form-group" style={{ minHeight: '500px', marginTop: '120px' }}>

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
                                // alignItems="flex-start"
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
                                                                <strong>Minimum Bid: </strong>{(i.MinimumBid) / 10 ** 18}  WETH
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">
                                                                {new Date() < new Date(i.AuctionStartsAt) ? (
                                                                    <div style={{ color: "#00FF00" }} >

                                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                                            <strong>Auction Starts At:</strong>
                                                                        </Typography>
                                                                        {/* {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionStartsAt))} */}
                                                                        <Countdown daysInHours date={new Date(i.AuctionStartsAt)}>
                                                                        </Countdown>
                                                                    </div>
                                                                ) : new Date() > new Date(i.AuctionStartsAt) && new Date() < new Date(i.AuctionEndsAt) ? (
                                                                    <div style={{ color: "#FF0000" }}>
                                                                        {/* {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionEndsAt.toLoca))} */}
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
                    <TablePagination
                        rowsPerPageOptions={[12, 24, 48]}
                        component="div"
                        count={totalDrops}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>

                <Footer position={"relative"} />
            </div>
        </>
    );
}

export default AuctionDrops;
