
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import r1 from '../../assets/img/r1.jpg';
import r2 from '../../assets/img/r2.jpg';
import r3 from '../../assets/img/r3.jpg';
import r4 from '../../assets/img/r4.jpg';
import r5 from '../../assets/img/r5.jpg';
import r6 from '../../assets/img/r6.jpg';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";



const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 300,
    },
});

function NFTCard(props) {
    const classes = useStyles();
    const [hide, setHide] = useState(false);
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.root}>
                {/* style={{ height: "100%" }} variant="outlined" */}
                <CardActionArea>

                    <CardMedia
                        className={classes.media}
                        // image={img}
                        title=""
                    >
                        {hide ? (
                            <div class="wrapper">
                                <div class="cube-box">
                                    <img src={r1} alt="" />
                                    <img src={r2} alt="" />
                                    <img src={r3} alt="" />
                                    <img src={r4} alt="" />
                                    <img src={r5} alt="" />
                                    <img src={r6} alt="" />
                                </div>
                            </div>
                        ) : (
                            <div class="mainDiv">
                                <div className="square" onClick={() => {
                                    setHide(true);
                                    setTimeout(() => setHide(false), 10000);
                                }}></div>
                                <div className="square2" onClick={() => {
                                    setHide(true);
                                    setTimeout(() => setHide(false), 10000);
                                }}></div>
                                <div className="square3" onClick={() => {
                                    setHide(true);
                                    setTimeout(() => setHide(false), 10000);
                                }}></div>
                            </div>
                        )}


                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h6" style={{ fontSize: '13px' }} >
                            Name : Robot
          </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            price:0.0 ETH
          </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {/* <Button size="small" color="primary">
                        Share
        </Button>
                    <Button size="small" color="primary">
                        Learn More
        </Button> */}
                </CardActions>
            </Card>
        </Grid >
    );
}

export default NFTCard;
