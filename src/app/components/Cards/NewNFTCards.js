
import { Grid } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

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

function NewNFTCard(props) {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={6} >
            <Card style={{ height: "100%" }} variant="outlined">
                <CardHeader className="text-center"
                    title={props.data.title}
                />
                <CardMedia
                    variant="outlined" style={{ border: props.data.type === "Mastercraft" ? '4px solid #e84646' : props.data.type === "Legendary" ? '4px solid #FFD700' : props.data.type === "Epic" ? '4px solid #9400D3' : props.data.type === "Rare" ? '4px solid #0000FF' : props.data.type === "Uncommon" ? '4px solid #008000' : props.data.type === "Common" ? '4px solid #FFFFFF' : 'none' }}
                    className={classes.media}
                    image={props.data.artwork}
                    title="NFT Image"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Artwork Description: </strong>{props.data.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Token Rarity: </strong>{props.data.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Token Supply: </strong>{props.data.tokensupplyalternative}
                    </Typography>
                    <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Image Artist</Typography>
                    <Link to={"/User/Profile/Detail/imageArtist/" + props.data.ImageArtistId + "/null"} style={{ color: '#000' }}>
                        <CardHeader
                            avatar={<Avatar src={props.data.ImageArtistProfile} aria-label="Artist" className={classes.avatar} />}
                            title={props.data.ImageArtistName}
                            subheader={props.data.ImageArtistAbout}
                        />
                    </Link>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Website URL: </strong>{props.data.ImageArtistWebsite}
                    </Typography>
                    <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Producer</Typography>
                    <Link to={"/User/Profile/Detail/producer/" + props.data.ProducerId + "/null"} style={{ color: '#000' }}>
                        <CardHeader
                            avatar={<Avatar src={props.data.ProducerProfile} aria-label="Producer" className={classes.avatar} />}
                            title={props.data.ProducerName}
                            subheader={props.data.ProducerInspiration}
                        />
                    </Link>
                    <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Executive Producer</Typography>
                    <Link to={"/User/Profile/Detail/executiveProducer/" + props.data.ExecutiveProducerId + "/null"} style={{ color: '#000' }}>
                        <CardHeader
                            avatar={<Avatar src={props.data.ExecutiveProducerProfile} aria-label="Executive Producer" className={classes.avatar} />}
                            title={props.data.ExecutiveProducerName}
                            subheader={props.data.ExecutiveProducerInspiration}
                        />
                    </Link>
                    <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Fan</Typography>
                    <Link to={"/User/Profile/Detail/fan/" + props.data.FanId + "/null"} style={{ color: '#000' }}>
                        <CardHeader
                            avatar={<Avatar src={props.data.FanProfile} aria-label="Fan" className={classes.avatar} />}
                            title={props.data.FanName}
                            subheader={props.data.FanInspiration}
                        />
                    </Link>

                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Other: </strong>{props.data.other}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default NewNFTCard;
//User/Profile/Detail/userId