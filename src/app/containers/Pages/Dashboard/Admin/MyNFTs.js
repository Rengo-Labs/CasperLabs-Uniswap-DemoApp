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
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Spinner } from "react-bootstrap";

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



function MyNFTs(props) {
    const classes = useStyles();

    const [tokenList, setTokenList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getMyNFTs = () => {
        handleShowBackdrop();
        axios.get("/nft/createnft").then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.NFTdata);
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
        getMyNFTs();
        // getCollections();?

        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "active",
            myCubes:"",
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
                <li className="breadcrumb-item active">My NFTs</li>
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

                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Card style={{ height: "100%" }} variant="outlined">
                                            <CardHeader className="text-center"
                                                title={i.title}
                                            />
                                            <CardMedia
                                                style={{ height: "100%" }} variant="outlined" style={{ border: i.type === "Mastercraft" ? '4px solid #ff0000' : i.type === "Legendary" ? '4px solid #FFD700' : i.type === "Mastercraft" ? '4px solid ##ff0000' : i.type === "Epic" ? '4px solid #9400D3' : i.type === "Rare" ? '4px solid #0000FF' : i.type === "Uncommon" ? '4px solid #008000' : i.type === "Common" ? '4px solid #FFFFFF' : 'none' }}
                                                className={classes.media}
                                                image={i.artwork}

                                                title="NFT Image"
                                            />
                                            <CardContent>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Artwork Description: </strong>{i.description}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Token Rarity: </strong>{i.type}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Token Supply: </strong>{i.tokensupply}
                                                </Typography>
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Image Artist</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i.ImageArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                    title={i.ImageArtistName}
                                                    subheader={i.ImageArtistAbout}
                                                />
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Website URL: </strong>{i.ImageArtistWebsite}
                                                </Typography>
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Producer</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i.ProducerProfile} aria-label="Producer" className={classes.avatar} />}
                                                    title={i.ProducerName}
                                                    subheader={i.ProducerInspiration}
                                                />
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Executive Producer</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i.ExecutiveProducerProfile} aria-label="Executive Producer" className={classes.avatar} />}
                                                    title={i.ExecutiveProducerName}
                                                    subheader={i.ExecutiveProducerInspiration}
                                                />
                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Fan</Typography>
                                                <CardHeader
                                                    avatar={<Avatar src={i.FanProfile} aria-label="Fan" className={classes.avatar} />}
                                                    title={i.FanName}
                                                    subheader={i.FanInspiration}
                                                />

                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Other: </strong>{i.other}
                                                </Typography>
                                                {/* <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>Collection: </strong>{i.collectiontitle}
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

export default MyNFTs;
