
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from "react";
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
        maxWidth: 300,
    },
    media: {
        height: 300,
    },
});

function NewNFTCards(props) {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        title=""
                    >
                        <div className="wrapper">
                            <div className="cube-box">
                                <img src={r1} alt="" />
                                <img src={r2} alt="" />
                                <img src={r3} alt="" />
                                <img src={r4} alt="" />
                                <img src={r5} alt="" />
                                <img src={r6} alt="" />
                            </div>
                        </div>



                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h6" style={{ fontSize: '13px' }} >
                            Name : {props.data.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            price:{props.data.price} ETH
          </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            props.handleRemoveClick(props.data.index);
                        }}
                        className="btn btn-sm bg-danger-light btn-block"

                    >
                        Remove NFT
    </Button>
                </CardActions>
            </Card>
        </Grid >
    );
}

export default NewNFTCards;
