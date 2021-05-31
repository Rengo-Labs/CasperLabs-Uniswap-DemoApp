import { Grid } from '@material-ui/core/';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import Cookies from "js-cookie";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Button, Spinner } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { useParams } from "react-router-dom";
import Web3 from 'web3';
import CreateAuctionContract from '../../../../components/blockchain/Abis/CreateAuctionContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import BiddingHistory from '../../../../components/Cards/BiddingHistory';
import NFTCard from '../../../../components/Cards/NFTCard';
import TxHistory from '../../../../components/Cards/TxHistory';
import CubeComponent from '../../../../components/Cube/CubeComponent';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';

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
}));



function CubeNFTs(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { dropId, cubeId } = useParams();
    // console.log("dropId", dropId);
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [dropData, setDropData] = useState({});
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [highestBid, setHighestBid] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [isClaiming, setIsClaiming] = useState(false);
    const [network, setNetwork] = useState("");
    const [open, setOpen] = React.useState(false);
    const [isClaimFunds, setIsClaimFunds] = useState(null);
    const [ownerAudio, setOwnerAudio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    const [openNetwork, setOpenNetwork] = useState(false);
    const handleCloseNetwork = () => {
        setOpenNetwork(false);
    };
    const handleShowNetwork = () => {
        setOpenNetwork(true);
    };
    useEffect(() => {
        (async () => {
            ownerAudio.addEventListener('ended', () => ownerAudio.pause());
            return () => {
                ownerAudio.removeEventListener('ended', () => ownerAudio.pause());
            };
        })();// eslint-disable-next-line
    }, []);

    let getCubeNFTs = () => {
        handleShowBackdrop();

        let Data = {
            tokenId: cubeId,
            check: dropId === "notdrop" ? dropId : "drop",
            dropId: dropId !== "notdrop" ? dropId : null,
        }
        console.log("Data", Data);
        axios.post("/token/SingleTokenId", Data).then(
            async (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                setOwnerAudio(new Audio(response.data.tokensdata.ownermusicfile))
                // ownerAudio.setAttribute('crossorigin', 'anonymous');
                // ownerAudio.play();
                if (dropId !== "notdrop") {
                    setDropData(response.data.Dropdata);
                    await loadWeb3();
                    const web3 = window.web3
                    const accounts = await web3.eth.getAccounts();
                    const address = Addresses.AuctionAddress;
                    const abi = CreateAuctionContract;
                    var myContractInstance = await new web3.eth.Contract(abi, address);
                    console.log("cubeId", response.data.tokensdata.tokenId);
                    console.log("accounts[0]", accounts[0]);
                    let highestBid = await myContractInstance.methods.getHighestBid(response.data.tokensdata.tokenId).call();
                    console.log("highestBid", highestBid);
                    setHighestBid(highestBid);
                }
                axios.get(`/transaction/tokenTransaction/${response.data.tokensdata.tokenId}`).then((res) => {
                    console.log("res", res);
                    setTransactionHistory(res.data.transactions)
                    handleCloseBackdrop();
                }, (error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log(error);
                        console.log(error.response);

                    }
                    if (error.response.data !== undefined) {
                        if (error.response.data === "Unauthorized access (invalid token) !!") {
                            Cookies.remove("Authorization");
                            localStorage.removeItem("Address")
                            window.location.reload();
                        }
                    }
                    handleCloseBackdrop();
                })
                let bidData = {
                    dropId: dropId,
                    tokenId: cubeId,
                }
                axios.post(`/dropcubehistory/history`, bidData).then((res) => {
                    console.log("res", res);
                    if (res.data.success)
                        setBidHistory(res.data.Dropcubeshistorydata)

                    handleCloseBackdrop();
                }, (error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log(error);
                        console.log(error.response);

                    }
                    handleCloseBackdrop();
                })
                // handleCloseBackdrop();
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                if (error.response.data !== undefined) {
                    if (error.response.data === "Unauthorized access (invalid token) !!") {
                        Cookies.remove("Authorization");
                        localStorage.removeItem("Address")
                        window.location.reload();
                    }
                }
                handleCloseBackdrop();
            })
    }
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
    let claimFunds = async (e) => {
        e.preventDefault();
        handleShowBackdrop();

        setIsClaiming(true);
        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const network = await web3.eth.net.getNetworkType()
        if (network !== 'ropsten') {
            setNetwork(network);
            setIsClaiming(false);
            handleCloseBackdrop();
            handleShowNetwork();
        }
        else {
            handleShowBackdrop();
            const address = Addresses.AuctionAddress;
            const abi = CreateAuctionContract;
            var myContractInstance = await new web3.eth.Contract(abi, address);
            console.log("myContractInstance", myContractInstance);
            console.log("dropData.dropId, cubeData.tokenId", dropData.dropId, cubeData.tokenId);
            let receipt = await myContractInstance.methods.claimFunds(dropData.dropId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
                console.log('get transaction', err, response);
                if (err !== null) {
                    console.log("err", err);
                    let variant = "error";
                    enqueueSnackbar('User Canceled Transaction', { variant });
                    handleCloseBackdrop();
                    setIsClaiming(false);
                }
            })
            console.log("receipt", receipt);
            let Data = {
                address: accounts[0],
                dropId: dropId,
                tokenId: cubeId,
            }
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${Cookies.get("Authorization")}`;
            axios.post(`/adminclaimfunds/claimfunds`, Data).then((res) => {
                console.log("res", res);
                setIsClaiming(false);
                handleCloseBackdrop();
                getCubeNFTs();
                getClaimFunds()
                let variant = "success";
                enqueueSnackbar('Funds transferred Successfully.', { variant });
            }, (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);

                }
                setIsClaiming(false);
                handleCloseBackdrop();
                let variant = "error";
                enqueueSnackbar('Unable to transfer Funds.', { variant });
            })
        }
    }
    let getClaimFunds = async () => {

        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        let Data = {
            address: accounts[0],
            dropId: dropId,
            tokenId: cubeId,
        }

        axios.post(`/adminclaimfunds/getclaimfunds`, Data).then((res) => {
            console.log("res", res);
            if (res.data.success)
                setIsClaimFunds(res.data.Adminclaimfundsresult)

            // handleCloseBackdrop();
        }, (error) => {
            if (process.env.NODE_ENV === "development") {
                console.log(error);
                console.log(error.response);

            }
            // handleCloseBackdrop();
        })
    }
    useEffect(() => {
        getCubeNFTs();
        getClaimFunds();

        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "active",
            myCubes: "",
            myDrops: "",
            settings: "",
            mySeason: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "",
            newRandomDrop: "",
        });// eslint-disable-next-line
    }, []);

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">NFTs</li>
            </ul>
            <div className="card-body">
                <form >
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
                                                    onClick={() => {
                                                        setIsPlaying(!isPlaying)
                                                        if (!isPlaying) {
                                                            ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                            ownerAudio.play();
                                                        } else {
                                                            ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                            ownerAudio.pause();
                                                        }
                                                    }}
                                                >
                                                    <CubeComponent data={tokenList} />
                                                </CardMedia>
                                            </CardActionArea>
                                        </Card>
                                    </div>

                                    {dropId !== "notdrop" ? (
                                        <div className="col-md-12 col-lg-6">
                                            {/* <Chip clickable style={{ marginTop: '20px' }}
                                                color="" label="@UserName" /> */}
                                            {new Date() > new Date(dropData.AuctionEndsAt) ? (
                                                isClaiming ? (
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
                                                    isClaimFunds === null ? (
                                                        <Button variant="primary" onClick={(e) => claimFunds(e)} style={{ float: "right" }} >Claim Funds</Button>
                                                    ) : (<Button variant="primary" disabled style={{ float: "right" }} >Claim Funds</Button>)

                                                )) : (null)}
                                            <h1>{cubeData.title} </h1>
                                            <h2>Minimum Bid : {(dropData.MinimumBid) / 10 ** 18} WETH </h2>
                                            <h2>Highest Bid : {(highestBid) / 10 ** 18} WETH </h2>

                                            <h2>Bid Delta : {dropData.bidDelta / 10 ** 18} WETH </h2>
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
                                            {/* <Row>
                                                <button className="btn-lg btn btn-dark btn-block" >Place a bid</button>{' '}

                                            </Row> */}
                                        </div>
                                    ) : (
                                        <div className="col-md-12 col-lg-6">
                                            {/* <Chip clickable style={{ marginTop: '20px' }}
                                                color="" label="@UserName" /> */}
                                            <h1>{cubeData.title} </h1>
                                            <h4>Reserve Price</h4>
                                            <h2>{cubeData.SalePrice / 10 ** 18} ETH </h2>
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
                    <div className="form-group" style={{ marginTop: '20px', marginBottom: '20ox' }}>

                        <div className="row">
                            <div className="col-md-12 col-lg-6">
                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                // alignItems="flex-start"
                                >
                                    {console.log("tokenList", tokenList)}

                                    {tokenList.map((i, index) => (
                                        <NFTCard data={i[0]} key={index}></NFTCard>
                                    ))}

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
                                            <Grid
                                                container
                                                spacing={2}
                                                direction="row"
                                                justify="flex-start"

                                            >
                                                {transactionHistory.map((i, index) => (
                                                    <TxHistory data={i} key={index} />
                                                ))}
                                            </Grid>
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
                                            {bidHistory.length === 0 ? (
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <strong>No Bidding History Found </strong>
                                                </Typography>
                                            ) : (null)}
                                            <Grid
                                                container
                                                spacing={2}
                                                direction="row"
                                                justify="flex-start"
                                            >
                                                {bidHistory.slice(0).reverse().map((i, index) => (
                                                    <BiddingHistory data={i} key={index} />
                                                ))}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>

                        </div>

                    </div>
                </form>
            </div >
            <NetworkErrorModal
                show={openNetwork}
                handleClose={handleCloseNetwork}
                network={network}
            />
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default CubeNFTs;
