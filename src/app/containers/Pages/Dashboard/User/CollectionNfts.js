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
import { Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
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



function CollectionNfts(props) {
    const classes = useStyles();
    const { collectionId } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getCollectionNfts = () => {
        handleShowBackdrop();

        axios.get("/collection/collections/" + collectionId).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.Nftsdata);
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
        getCollectionNfts();
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "",
            myCubes: "",
            myDrops: "",
            settings: "",
            mySeason: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "active",
            newRandomDrop: "",
        });// eslint-disable-next-line
    }, []);

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/dashboard/newCollection">Collections</Link>
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
                                                title={i[0].title}
                                            />
                                            <CardMedia
                                                variant="outlined" style={{ border: i[0].type === "Mastercraft" ? '4px solid #ff0000' : i[0].type === "Legendary" ? '4px solid #FFD700' : i[0].type === "Epic" ? '4px solid #9400D3' : i[0].type === "Rare" ? '4px solid #0000FF' : i[0].type === "Uncommon" ? '4px solid #008000' : i[0].type === "Common" ? '4px solid #FFFFFF' : 'none' }}
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
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </div>
                </form>
            </div >
        </div >

    );
}

export default CollectionNfts;
