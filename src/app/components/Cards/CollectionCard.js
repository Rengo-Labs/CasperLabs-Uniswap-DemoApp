
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import img from '../../assets/img/img-01.jpg';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

function CollectionCard(props) {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.root}>
                {/* style={{ height: "100%" }} variant="outlined" */}
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={img}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" className="text-center" component="h2">
                            Collection
          </Typography>

                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

export default CollectionCard;
