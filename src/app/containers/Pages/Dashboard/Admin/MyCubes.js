import { Avatar, CardHeader, Grid, TablePagination } from '@material-ui/core/';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import r1 from '../../../../assets/img/patients/patient.jpg';
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



function MyCubes(props) {
    const classes = useStyles();
    const [cubeCount, setCubeCount] = useState(0);
    const [tokenList, setTokenList] = useState([]);
    const [imageData, setImageData] = useState([]);

    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [page, setPage] = React.useState(0);

    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getMyCubes = (start, end) => {
        handleShowBackdrop();
        axios.get(`/token/TokenIds/${start}/${end}`).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.tokensdata);
                setImageData(response.data.nftsdata);
                setCubeCount(response.data.tokencount);
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
        getMyCubes(0, rowsPerPage);
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "",
            mySeason: "",
            myCubes: "active",
            myDrops: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "",
            newRandomDrop: "",
        });// eslint-disable-next-line
    }, []);
    const handleChangePage = (event, newPage) => {
        console.log("newPage", newPage);
        setPage(newPage);
        console.log("Start", newPage * rowsPerPage);
        console.log("End", newPage * rowsPerPage + rowsPerPage);
        getMyCubes(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        getMyCubes(0, parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">My Cubes</li>
            </ul>
            <div className="card-body">
                <form >
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
                        ) : tokenList.length === 0 ? (
                            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }} >
                                <strong>Nothing to Display </strong>
                            </Typography>
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
                                        <Link to={"/dashboard/myCubes/Nfts/notdrop/" + i._id}>
                                            <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                                {/* style={{ height: "100%" }} variant="outlined" */}
                                                <CardActionArea>

                                                    <CardMedia
                                                        className={classes.media}
                                                        // image={img}
                                                        title=""
                                                    >


                                                        <div className="wrapper">
                                                            <div className="cube-box">
                                                                {imageData[index].map((j, jindex) => (
                                                                        <img src={j.artwork} style={{ border: j.type === "Mastercraft" ? '4px solid #ff0000' : j.type === "Legendary" ? '4px solid #FFD700' : j.type === "Epic" ? '4px solid #9400D3' : j.type === "Rare" ? '4px solid #0000FF' : j.type === "Uncommon" ? '4px solid #008000' : j.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                                                ))}
                                                                {new Array(6 - imageData[index].length).fill(0).map((_, index) => (
                                                                    < img src={r1} alt="" />
                                                                ))}
                                                            </div>
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
                                                        <CardHeader
                                                            avatar={<Avatar src={i.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                            title={i.MusicArtistName}
                                                            subheader={i.MusicArtistAbout}
                                                        />
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
                </form>
            </div >
            <TablePagination
                rowsPerPageOptions={[4, 8, 12, 24]}
                component="div"
                count={cubeCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div >

    );
}

export default MyCubes;
