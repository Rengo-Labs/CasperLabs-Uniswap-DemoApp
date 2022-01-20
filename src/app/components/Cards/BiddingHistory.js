
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from "react";
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

function BiddingHistory(props) {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={12} md={12} >
            <Card className={classes.root} >
                <CardActionArea style={{ margin: '5px' }}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Address : </strong>{props.data.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Bid : </strong><span style={{ cursor: 'pointer', color: '#ed0b25' }}>{props.data.Bid / 10 ** 18} WETH</span>
                    </Typography>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

export default BiddingHistory;
