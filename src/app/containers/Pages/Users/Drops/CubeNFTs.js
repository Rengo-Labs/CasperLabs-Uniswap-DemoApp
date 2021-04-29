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
import Cookies from "js-cookie";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Spinner } from "react-bootstrap";
import Chip from '@material-ui/core/Chip';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Row } from "react-bootstrap";
import r1 from '../../../../assets/img/patients/patient.jpg';
import Countdown from 'react-countdown';
import { useSnackbar } from 'notistack';
import { useParams } from "react-router-dom";
import HeaderHome from '../../../../components/Headers/Header';
import LoginErrorModal from '../../../../components/Modals/LoginErrorModal';
import ConfirmBidModal from '../../../../components/Modals/ConfirmBidModal';
import Web3 from 'web3';
import { Minimize } from '@material-ui/icons';
import jwtDecode from "jwt-decode";
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';
import { Button } from 'react-bootstrap';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CreateAuctionContract from '../../../../components/blockchain/Abis/CreateAuctionContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
// import { Howl } from 'howler';
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
    media1: {
        height: 300,
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
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },

}));


// const useAudio = url => {

//   , []);

// return [playing, toggle];
// };

function CubeNFTs(props) {

    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);
    const [ownerAudio, setOwnerAudio] = useState(new Audio());
    const [nonOwnerAudio, setNonOwnerAudio] = useState(new Audio());
    // new Audio(url)
    console.log("audio", ownerAudio);

    useEffect(() => {
        ownerAudio.addEventListener('ended', () => ownerAudio.pause());
        nonOwnerAudio.addEventListener('ended', () => nonOwnerAudio.pause());
        return () => {
            ownerAudio.removeEventListener('ended', () => ownerAudio.pause());
            nonOwnerAudio.addEventListener('ended', () => nonOwnerAudio.pause());
        };
    }, []);



    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const { dropId, cubeId } = useParams();
    // console.log("dropId", dropId);
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [dropData, setDropData] = useState({});
    const [bid, setBid] = useState();
    const [balance, setBalance] = useState();
    const [hide, setHide] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [network, setNetwork] = useState("");
    const [transactionHistory, setTransactionHistory] = useState([]);

    //MUSIC 
    // let ownerAudio;
    // const [ownerAudio, setOwnerAudio] = useState("");
    // const [NonOwnerAudio, setNonOwnerAudio] = useState("");
    const soundPlay = () => {

        console.log(cubeData.ownermusicfile);
        if (cubeData.userId === jwtDecoded.userId) {
            // const sound = new Howl({
            //     src: cubeData.ownermusicfile,
            //     html5: true
            // });
            var sound = new Audio(cubeData.ownermusicfile)
            sound.play();
        }
        else {
            // const sound = new Howl({
            //     src: cubeData.nonownermusicfile,
            //     html5: true
            // });

            var sound = new Audio(cubeData.nonownermusicfile)
            sound.play();
        }
    }

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleShow = () => {
        setOpen(true);
    };

    const [openNetwork, setOpenNetwork] = React.useState(false);
    const handleCloseNetwork = () => {
        setOpenNetwork(false);
    };
    const handleShowNetwork = () => {
        setOpenNetwork(true);
    };

    const [openBidModal, setOpenBidModal] = React.useState(false);
    const handleCloseBidModal = () => {
        setOpenBidModal(false);
    };
    const handleShowBidModal = () => {
        setOpenBidModal(true);
    };

    const [openSpinner, setOpenSpinner] = React.useState(false);
    const handleCloseSpinner = () => {
        setOpenSpinner(false);
    };
    const handleShowSpinner = () => {
        setOpenSpinner(true);
    };

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleShowBackdrop = () => {
        setOpenBackdrop(true);
    };
    let loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    let Bid = async (e) => {
        e.preventDefault();

        let jwt = Cookies.get("Authorization");
        if (jwt) {
            //   console.log(jwtDecode(jwt));
            await loadWeb3();
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);
            console.log("balance", (balance / 10 ** 18).toString());

            const network = await web3.eth.net.getNetworkType()
            if (network !== 'ropsten') {
                setNetwork(network);
                handleShowNetwork();
            }
            else {
                handleShowBidModal()
            }

            console.log("HELLO");

        } else {
            handleShow();
        }
    }
    let ConfirmBidding = async () => {
        setIsSaving(true);
        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const network = await web3.eth.net.getNetworkType()
        if (network !== 'ropsten') {
            setNetwork(network);
            setIsSaving(false);
            handleShowNetwork();
        }
        else {
            handleShowBackdrop();
            const address = Addresses.AuctionAddress;
            const abi = CreateAuctionContract;
            var myContractInstance = await new web3.eth.Contract(abi, address);
            console.log("myContractInstance", myContractInstance);
            console.log("dropData.dropId, cubeData.tokenId", dropData.dropId, cubeData.tokenId);
            await myContractInstance.methods.bid(dropData.dropId, cubeData.tokenId).send({ from: accounts[0], value: (bid * 10 ** 18).toString() }, (err, response) => {
                console.log('get transaction', err, response);
                if (err !== null) {
                    console.log("err", err);
                    let variant = "error";
                    enqueueSnackbar('User Canceled Transaction', { variant });
                    handleCloseBackdrop();
                    setIsSaving(false);
                }
            })
                .on('receipt', (receipt) => {
                    console.log("receipt", receipt);
                    console.log("receipt.events.Transfer.returnValues.tokenId", receipt.events.Transfer.returnValues.tokenId);
                    handleCloseBackdrop();
                    let BidData = {
                        dropId: dropId,
                        tokenId: cubeId,
                        Bid: bid
                    }
                    console.log("BidData", BidData);
                    axios.post("dropcubehistory/createhistory", BidData).then(
                        (response) => {

                            console.log('response', response);
                            setIsSaving(false);

                            let variant = "success";
                            enqueueSnackbar('Bid Created Successfully.', { variant });
                        },
                        (error) => {
                            if (process.env.NODE_ENV === "development") {
                                console.log(error);
                                console.log(error.response);
                            }
                            setIsSaving(false);
                            let variant = "error";
                            enqueueSnackbar('Unable to Create Bid.', { variant });
                        }
                    );
                })
        }
    }
    let getCubeNFTs = () => {
        handleShowSpinner();

        let Data = {
            tokenId: cubeId,
            check: dropId === "notdrop" ? dropId : "drop",
            dropId: dropId !== "notdrop" ? dropId : null,
        }
        console.log("Data", Data);
        axios.post("/token/SingleTokenId", Data).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                // setOwnerAudio(response.data.tokensdata.ownermusicfile)
                setOwnerAudio(new Audio(response.data.tokensdata.ownermusicfile))
                setNonOwnerAudio(new Audio(response.data.tokensdata.nonownermusicfile))
                if (dropId !== "notdrop") {
                    setDropData(response.data.Dropdata);
                    setBid(response.data.Dropdata.MinimumBid / 10 ** 18)
                }
                axios.get(`/transaction/tokenTransaction/${response.data.tokensdata.tokenId}`).then((res) => {
                    console.log("res", res);
                    if (res.data.success)
                        setTransactionHistory(res.data.transactions)
                    handleCloseSpinner();
                }, (error) => {
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
                    handleCloseSpinner();
                })

            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                handleCloseSpinner();
            })
        // /transaction/tokenTransaction/{tokenId}
        // for Getiing Transaction History of CUbe
    }

    useEffect(async () => {
        getCubeNFTs();
        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log("balance", (balance / 10 ** 18).toString());
        setBalance(balance);
    }, []);
    // const [playing, toggle] = useAudio(ownerAudio);
    return (
        <div className="main-wrapper">
            <div className="home-section home-full-height">
                <HeaderHome selectedNav={"Drops"} />

                <div className="card">
                    <div className="card-body" style={{ marginTop: '110px' }}>
                        {openSpinner ? (
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
                            <form >
                                {/* <button onClick={(e) => {
                                e.preventDefault()
                                toggle()
                            }}>{playing ? "Pause" : "Play"}</button> */}
                                <section className="section">
                                    <div className="container-fluid">
                                        <div className="" style={{ paddingTop: "0px" }}>
                                            <div className="row">
                                                <div className="col-md-12 col-lg-6">
                                                    <Card className={classes.root}>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                className={classes.media1}
                                                                title=""
                                                                image=""
                                                            >
                                                                {hide ? (
                                                                    <div class="wrapper">
                                                                        <div class="cube-box">
                                                                            {tokenList.map((j, jindex) => (
                                                                                <img src={j[0].artwork} key={jindex} style={{ border: j[0].type === "Mastercraft" ? '4px solid #ff0000' : j[0].type === "Legendary" ? '4px solid #FFD700' : j[0].type === "Epic" ? '4px solid #9400D3' : j[0].type === "Rare" ? '4px solid #0000FF' : j[0].type === "Uncommon" ? '4px solid #008000' : j[0].type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                                                            ))}
                                                                            {new Array(6 - tokenList.length).fill(0).map((_, index) => (
                                                                                < img src={r1} alt="" />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div class="mainDiv">
                                                                        {cubeData.userId === jwtDecoded.userId ? (
                                                                            <span onClick={(e) => {
                                                                                e.preventDefault()
                                                                                setHide(true);
                                                                                // ownerAudio.crossOrigin = 'anonymous';
                                                                                ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                                                ownerAudio.play()
                                                                            }}>
                                                                                <div className="square"></div>
                                                                                <div className="square2"></div>
                                                                                <div className="square3"></div>
                                                                            </span>

                                                                        ) : (
                                                                            <span onClick={(e) => {
                                                                                e.preventDefault()
                                                                                setHide(true);
                                                                                // nonOwnerAudio.crossOrigin = 'anonymous';
                                                                                nonOwnerAudio.setAttribute('crossorigin', 'anonymous'); 
                                                                                nonOwnerAudio.play()
                                                                                setTimeout(() => {
                                                                                    setHide(false)
                                                                                    nonOwnerAudio.pause()
                                                                                }, 10000);
                                                                            }}>
                                                                                <div className="square"></div>
                                                                                <div className="square2"></div>
                                                                                <div className="square3"></div>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </CardMedia>
                                                        </CardActionArea>
                                                    </Card>
                                                </div>

                                                {dropId !== "notdrop" ? (
                                                    <div className="col-md-12 col-lg-6">
                                                        <Typography variant="h4" gutterBottom>{cubeData.title}</Typography>
                                                        <Typography variant="h5" gutterBottom>Minimum Bid : {dropData.MinimumBid / 10 ** 18} ETH </Typography>
                                                        <Typography variant="h5" gutterBottom>Bid Delta : {dropData.bidDelta / 10 ** 18} ETH </Typography>
                                                        {new Date() < new Date(dropData.AuctionStartsAt) ? (
                                                            <Typography variant="h5" gutterBottom color="textSecondary">
                                                                <strong>Auction Starts At:</strong>
                                                                <span style={{ color: "#00FF00" }} >
                                                                    <Countdown daysInHours date={new Date(dropData.AuctionStartsAt)}>
                                                                    </Countdown>
                                                                </span>
                                                            </Typography>

                                                        ) : new Date() > new Date(dropData.AuctionStartsAt) && new Date() < new Date(dropData.AuctionEndsAt) ? (
                                                            <Typography variant="h5" gutterBottom color="textSecondary" component="p">
                                                                <strong>Auction Ends At: </strong>
                                                                <span style={{ color: "#FF0000" }}>
                                                                    <Countdown daysInHours date={new Date(dropData.AuctionEndsAt)}>
                                                                    </Countdown>
                                                                </span>
                                                            </Typography>

                                                        ) : (
                                                            <Typography variant="h5" gutterBottom style={{ color: "#FF0000" }} component="p">
                                                                <strong>Auction Ended</strong>
                                                            </Typography>
                                                        )}
                                                        <h3 className="text-muted">Music Artist</h3>

                                                        <CardHeader
                                                            avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                            title={cubeData.MusicArtistName}
                                                            subheader={cubeData.MusicArtistAbout}
                                                        />
                                                        <Row>
                                                            {new Date() < new Date(dropData.AuctionStartsAt) ? (
                                                                <>
                                                                    <label> Enter Bid: </label>
                                                                    <input type='number' step="0.0001" diabled min={dropData.MinimumBid / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={bid} onChange={(evt) => {
                                                                        if (evt.target.value >= 0) {
                                                                            if (evt.target.value < dropData.MinimumBid / 10 ** 18) {
                                                                                setBid(dropData.MinimumBid / 10 ** 18)
                                                                            }
                                                                            if (evt.target.value > balance / 10 ** 18) {
                                                                                setBid(balance / 10 ** 18)
                                                                            }
                                                                            else {
                                                                                setBid(evt.target.value)
                                                                            }
                                                                        }
                                                                        else {
                                                                            setBid(dropData.MinimumBid / 10 ** 18)
                                                                        }
                                                                    }} />
                                                                    <br></br>
                                                                    <Button variant="primary" block disabled>Place a bid</Button>
                                                                </>

                                                            ) : new Date() > new Date(dropData.AuctionStartsAt) && new Date() < new Date(dropData.AuctionEndsAt) ? (
                                                                <>
                                                                    <label> Enter Bid: </label>
                                                                    {dropData.MinimumBid / 10 ** 18 > balance / 10 ** 18 ? (
                                                                        <>
                                                                            <input type='number' step="0.0001" disabled className='form-control' style={{ marginBottom: '20px' }} value={bid} />
                                                                            <br></br>
                                                                            <Button variant="primary" block disabled>Insufficient Balance</Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <input type='number' step="0.0001" min={dropData.MinimumBid / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={bid} onChange={(evt) => {
                                                                                if (evt.target.value >= 0) {
                                                                                    if (evt.target.value < dropData.MinimumBid / 10 ** 18) {
                                                                                        setBid(dropData.MinimumBid / 10 ** 18)
                                                                                    } else
                                                                                        if (evt.target.value > balance / 10 ** 18) {
                                                                                            setBid(balance / 10 ** 18)
                                                                                        }
                                                                                        else {
                                                                                            setBid(evt.target.value)
                                                                                        }
                                                                                }
                                                                                else {
                                                                                    setBid(dropData.MinimumBid / 10 ** 18)
                                                                                }

                                                                            }} />
                                                                            <br></br>
                                                                            {isSaving ? (

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
                                                                                <Button variant="primary" block onClick={(e) => Bid(e)}>place a Bid</Button>
                                                                            )}

                                                                        </>
                                                                    )}

                                                                </>

                                                            ) : (
                                                                <Button variant="primary" block disabled >Auction Ended</Button>
                                                            )}


                                                        </Row>
                                                    </div>
                                                ) : (
                                                    <div className="col-md-12 col-lg-6">
                                                        <Chip clickable style={{ marginTop: '20px' }}
                                                            color="" label="@UserName" />
                                                        <h1> </h1>
                                                        <Typography variant="h4" gutterBottom>{cubeData.title}</Typography>
                                                        <Typography variant="h5" gutterBottom>Reserve Price</Typography>
                                                        <Typography variant="h5" gutterBottom>{cubeData.SalePrice / 10 ** 18} ETH </Typography>
                                                        <h3 className="text-muted">Music Artist</h3>
                                                        <CardHeader
                                                            avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                            title={cubeData.MusicArtistName}
                                                            subheader={cubeData.MusicArtistAbout}
                                                        />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>

                                </section >
                                <div className="form-group">
                                    <br></br>

                                    <div className="row">
                                        <div className="col-md-12 col-lg-6">
                                            <Grid
                                                container
                                                spacing={2}
                                                direction="row"
                                                justify="flex-start"
                                            // alignItems="flex-start"
                                            >
                                                {/* {console.log("tokenList", tokenList)} */}
                                                {hide ? (
                                                    tokenList.map((i, index) => (

                                                        <Grid item xs={12} sm={6} md={6} key={index}>
                                                            <Card style={{ height: "100%" }} variant="outlined">
                                                                <CardHeader className="text-center"
                                                                    title={i[0].title}
                                                                />
                                                                <CardMedia
                                                                    style={{ height: "100%" }} variant="outlined" style={{ border: i[0].type === "Mastercraft" ? '4px solid #ff0000' : i[0].type === "Legendary" ? '4px solid #FFD700' : i[0].type === "Mastercraft" ? '4px solid ##ff0000' : i[0].type === "Epic" ? '4px solid #9400D3' : i[0].type === "Rare" ? '4px solid #0000FF' : i[0].type === "Uncommon" ? '4px solid #008000' : i[0].type === "Common" ? '4px solid #FFFFFF' : 'none' }}
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
                                                    ))) : (
                                                    null
                                                )}

                                            </Grid>
                                        </div>
                                        <div className="col-md-12 col-lg-6">
                                            <div className="form-group">
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >

                                                        <Typography variant="h6" gutterBottom>Tx History</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {transactionHistory.length === 0 ? (
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>No Transaction History Found </strong>
                                                            </Typography>
                                                        ) : (null)}
                                                        {transactionHistory.map((i, index) => (
                                                            <Card className={classes.root} key={index}>
                                                                <CardActionArea style={{ margin: '5px' }}>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>From : </strong>{i.from}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>To : </strong>{i.to}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>Hash : </strong>
                                                                        <a href={"https://ropsten.etherscan.io/tx/" + i.transaction} target="_blank" style={{ color: 'rgb(167,0,0)' }}>
                                                                            <span style={{ cursor: 'pointer' }}>{i.transaction.substr(0, 20)}. . .</span>
                                                                        </a>
                                                                    </Typography>
                                                                </CardActionArea>
                                                            </Card>
                                                        ))}
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel2a-content"
                                                        id="panel2a-header"
                                                    >
                                                        <Typography variant="h6" gutterBottom>Bidding History</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {transactionHistory.length === 0 ? (
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>No Bidding History Found </strong>
                                                            </Typography>
                                                        ) : (null)}
                                                        {transactionHistory.map((i, index) => (
                                                            <Card className={classes.root} key={index}>
                                                                <CardActionArea style={{ margin: '5px' }}>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>From : </strong>{i.from}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>To : </strong>{i.to}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>Hash : </strong>
                                                                        <a href={"https://ropsten.etherscan.io/tx/" + i.transaction} target="_blank" style={{ color: 'rgb(167,0,0)' }}>
                                                                            <span style={{ cursor: 'pointer' }}>{i.transaction.substr(0, 20)}. . .</span>
                                                                        </a>
                                                                    </Typography>
                                                                </CardActionArea>
                                                            </Card>
                                                        ))}
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        )}
                    </div >
                </div >

            </div >
            <LoginErrorModal show={open} handleClose={handleClose} />
            <ConfirmBidModal bid={bid} balance={balance} minimumBid={dropData.MinimumBid} bidDelta={dropData.bidDelta} show={openBidModal} handleClose={handleCloseBidModal} ConfirmBidding={ConfirmBidding} />
            <NetworkErrorModal
                show={openNetwork}
                handleClose={handleCloseNetwork}
                network={network}
            />
            <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default CubeNFTs;