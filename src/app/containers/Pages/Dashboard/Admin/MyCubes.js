import { Avatar, CardHeader, Grid } from '@material-ui/core/';
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
    const [hide, setHide] = useState(false);
    const [tokenList, setTokenList] = useState([]);
    const [imageData, setImageData] = useState([]);

    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getMyCubes = () => {
        handleShowBackdrop();
        axios.get("/token/TokenIds").then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.tokensdata);
                setImageData(response.data.nftsdata);
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
        getMyCubes();
        // getCollections();?

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
        });
    }, []);

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
                        ) : (
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                            // alignItems="flex-start"
                            >
                                {tokenList.map((i, index) => (

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                            {/* style={{ height: "100%" }} variant="outlined" */}
                                            <CardActionArea>

                                                <CardMedia
                                                    className={classes.media}
                                                    // image={img}
                                                    title=""
                                                >


                                                    <div class="wrapper">
                                                        <div class="cube-box">
                                                            {imageData[index].map((j, jindex) => (
                                                                <>
                                                                    {console.log(j)}
                                                                    <img src={j.artwork} style={{ border: j.type === "Mastercraft" ? '4px solid #ff0000' : j.type === "Legendary" ? '4px solid #FFD700' : j.type === "Epic" ? '4px solid #9400D3' : j.type === "Rare" ? '4px solid #0000FF' : j.type === "Uncommon" ? '4px solid #008000' : j.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                                                </>
                                                            ))}
                                                            {new Array(6 - imageData[index].length).fill(0).map((_, index) => (
                                                                < img src={r1} alt="" />
                                                            ))}
                                                        </div>
                                                    </div>



                                                </CardMedia>
                                                <CardContent>
                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                        <strong>Cube Description: </strong>{i.description}
                                                    </Typography>

                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                        <strong>Sale Price: </strong>{i.SalePrice}
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
                                    </Grid >
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

export default MyCubes;
{/* <Grid item xs={12} sm={6} md={3} key={index}>
<Card style={{ height: "100%" }} variant="outlined">
    <CardHeader className="text-center"
        title={i.title}
    />

    <CardMedia
        className={classes.media}
        // image={img}
        title=""
    >

        <div class="wrapper">
            <div class="cube-box">
                {imageData.map((i, index) => (
                    <img src={i[0].artwork} style={{ border: i.type === "Mastercraft" ? '4px solid #ff0000' : i.type === "Legendary" ? '4px solid #FFD700' : i.type === "Epic" ? '4px solid #9400D3' : i.type === "Rare" ? '4px solid #0000FF' : i.type === "Uncommon" ? '4px solid #008000' : i.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                ))}
                {new Array(6 - imageData.length).fill(0).map((_, index) => (
                    < img src={r1} alt="" />
                ))}
            </div>
        </div>



    </CardMedia>
    <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            <strong>Cube Description: </strong>{i.description}
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
            <strong>Sale Price: </strong>{i.SalePricegi}
        </Typography>
        <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Music Artist</Typography>
        <CardHeader
            avatar={<Avatar src={i.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
            title={i.MusicArtistName}
            subheader={i.MusicArtistAbout}
        />

    </CardContent>
</Card>
</Grid> */}