import {
  Card,
  CardContent, CardHeader, Grid
} from '@material-ui/core/';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from "react";
import { Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';


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

function Market() {
  const [hide, setHide] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [imageData, setImageData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const [totalMarketPlace, getTotalMarketPlace] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  let getMarketPlace = (start, end) => {
      axios.get(`/marketplace/tokenIds/${start}/${end}`).then(
          (response) => {
              console.log("response", response);
              setTokenList(response.data.Dropdata);
              getTotalMarketPlace(response.data.Marketcount);
          },
          (error) => {
              if (process.env.NODE_ENV === "development") {
                  console.log(error);
                  console.log(error.response);
              }
          })
  }
  useEffect(() => {
      getMarketPlace(0, rowsPerPage);
  }, []);
  return (

      <>

          <div className="container-fluid">
              {/* <!-- Page Header --> */}
              <div className="page-header">
                  {/* <Container> */}

                  <div className="card-body">
                      <h3><pre>Market Place</pre></h3>
                      <hr></hr>
                      <div className="form-group" >
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
                                          <Link to={"myMarket/cubes/" + i._id}>
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
                                                              <strong>Cube Description: </strong>{i.description}
                                                          </Typography>
                                                          <Typography variant="body2" color="textSecondary" component="p">
                                                              <strong>Minimum Bid: </strong>{i.MinimumBid / 10 ** 18} ETH
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
                                              </Card>
                                          </Link>
                                      </Grid >
                                  ))}
                              </Grid>
                          )}
                      </div>
                  </div >
                  {/* </Container> */}

              </div>
          </div >

      </>
  );
}

export default Market;
