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
import { Button, Row, Spinner } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { useParams, Link } from "react-router-dom";
import Web3 from 'web3';
import CreateAuctionContract from '../../../../components/blockchain/Abis/CreateAuctionContract.json';
import CreateCubeContract from '../../../../components/blockchain/Abis/CreateCubeContract.json';
import MarketPlaceContract from '../../../../components/blockchain/Abis/MarketPlaceContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import BiddingHistory from '../../../../components/Cards/BiddingHistory';
import NewNFTCard from '../../../../components/Cards/NewNFTCards';
import TxHistory from '../../../../components/Cards/TxHistory';
import CubeComponent from '../../../../components/Cube/CubeComponent';
import AuctionCubeModal from '../../../../components/Modals/AuctionCubeModal';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';
import SaleCubeModal from '../../../../components/Modals/SaleCubeModal';

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
    const { dropId, cubeId, } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [dropData, setDropData] = useState({});
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [isClaiming, setIsClaiming] = useState(false);
    const [network, setNetwork] = useState("");
    const [open, setOpen] = React.useState(false);
    const [openNFTData, setOpenNFTData] = React.useState(false);
    const [isPuttingOnSale, setIsPuttingOnSale] = useState(false);
    const [isPuttingOnAuction, setIsPuttingOnAuction] = useState(false);
    const [isClaimFunds, setIsClaimFunds] = useState(null);
    const [ownerAudio, setOwnerAudio] = useState(new Audio());
    const [isConfirmingSale] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);
    const handleClose = () => {
        setOpenModal(false);
    };
    const handleShow = () => {
        setOpenModal(true);
    };
    const [openAuctionModal, setOpenAuctionModal] = useState(false);
    const handleCloseAuction = () => {
        setOpenAuctionModal(false);
    };
    const handleShowAuction = () => {
        setOpenAuctionModal(true);
    };
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    const handleCloseNFTData = () => {
        setOpenNFTData(false);
    };
    const handleShowNFTData = () => {
        setOpenNFTData(true);
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
        handleShowNFTData();
        console.log("dropId", dropId);
        // let Data = {
        //     tokenId: cubeId,
        //     check: "notdrop"
        // }
        let Data = {
            tokenId: cubeId,
            check: dropId === "notdrop" ? dropId : "drop",
            dropId: dropId !== "notdrop" ? dropId : null,
        }
        if (dropId !== "notdrop") {
            let bidData = {
                dropId: dropId,
                tokenId: cubeId,
            }
            
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${Cookies.get("Authorization")}`;
            axios.post(`/dropcubehistory/history`, bidData).then((res) => {
                console.log("res", res);
                if (res.data.success) {
                    setBidHistory(res.data.Dropcubeshistorydata)
                    for (let i = 0; i < res.data.Dropcubeshistorydata.length; i++) {
                        console.log("res.data.Dropcubeshistorydata", res.data.Dropcubeshistorydata[i].userId);
                    }
                }
            }, (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);

                }
                // handleCloseSpinner();
            })
        }
        console.log("Data", Data);
        
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${Cookies.get("Authorization")}`;
        axios.post("/token/SingleTokenId", Data).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                setOwnerAudio(new Audio(response.data.tokensdata.ownermusicfile))
                if (dropId !== "notdrop") {
                    setDropData(response.data.Dropdata);
                }
                axios.get(`/transaction/tokenTransaction/${response.data.tokensdata.tokenId}`).then((res) => {
                    console.log("res", res);
                    setTransactionHistory(res.data.transactions)
                    handleCloseNFTData();
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
                    handleCloseNFTData();
                })
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
                handleCloseNFTData();
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

        setIsClaiming(true);
        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const network = await web3.eth.net.getNetworkType()
        if (network !== 'ropsten') {
            setNetwork(network);
            setIsClaiming(false);
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
                enqueueSnackbar('Cube transferred Successfully.', { variant });
            }, (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);

                }
                setIsClaiming(false);
                handleCloseBackdrop();
                let variant = "error";
                enqueueSnackbar('Unable to transfer Cube.', { variant });
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

        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${Cookies.get("Authorization")}`;
        axios.post(`/adminclaimfunds/getclaimfunds`, Data).then((res) => {
            console.log("res", res);
            if (res.data.success)
                setIsClaimFunds(res.data.Adminclaimfundsresult)
        }, (error) => {
            if (process.env.NODE_ENV === "development") {
                console.log(error);
                console.log(error.response);

            }
        })
    }
    let putOnSale = async (price, time, timeStamp) => {
        handleShowBackdrop();
        handleClose();
        console.log("price", price);
        setIsPuttingOnSale(true);
        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const network = await web3.eth.net.getNetworkType()
        if (network !== 'ropsten') {
            setNetwork(network);
            setIsPuttingOnSale(false);
            handleShowNetwork();
        }
        else {
            const address = Addresses.MarketPlaceAddress;
            const abi = MarketPlaceContract;
            const CubeAddress = Addresses.CreateCubeAddress;
            const cubeAbi = CreateCubeContract;

            var myCubeContractInstance = await new web3.eth.Contract(cubeAbi, CubeAddress);
            let receipt = await myCubeContractInstance.methods.approve(address, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
                console.log('get transaction', err, response);
                if (err !== null) {
                    console.log("err", err);
                    let variant = "error";
                    enqueueSnackbar('User Canceled Transaction', { variant });
                    handleCloseBackdrop();
                    setIsPuttingOnSale(false);
                }
            })
            console.log("receipt", receipt);
            var myContractInstance = await new web3.eth.Contract(abi, address);
            console.log("myContractInstance", myContractInstance);
            console.log("cubeData.tokenId", cubeData.tokenId);
            await myContractInstance.methods.createOrder(CubeAddress, cubeData.tokenId, (price * 10 ** 18).toString(), timeStamp.toString()).send({ from: accounts[0] }, (err, response) => {
                console.log('get transaction', err, response);
                if (err !== null) {
                    console.log("err", err);
                    let variant = "error";
                    enqueueSnackbar('User Canceled Transaction', { variant });
                    handleCloseBackdrop();
                    setIsPuttingOnSale(false);
                }
            })
            let SaleData = {
                tokenId: cubeId,
                salePrice: price * 10 ** 18,
                expiresAt: time,
            }
            
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${Cookies.get("Authorization")}`;
            axios.post(`auction/createsale`, SaleData).then((res) => {
                console.log("res", res);
                handleCloseBackdrop();
                setIsPuttingOnSale(false);
                let variant = "success";
                enqueueSnackbar('Successfully Allowed Exchange to Sale.', { variant });
                getCubeNFTs();
            }, (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                let variant = "error";
                enqueueSnackbar('Unable to Allow Exchange to Sale.', { variant });
                handleCloseBackdrop();
                setIsPuttingOnSale(false);
            })
        }
    }
    let putOnAuction = async (minimumBid, bidDelta, startTime, endTime, startTimeStamp, endTimeStamp) => {
        handleCloseAuction();
        handleShowBackdrop();

        setIsPuttingOnAuction(true);
        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const network = await web3.eth.net.getNetworkType()
        if (network !== 'ropsten') {
            setNetwork(network);
            setIsPuttingOnAuction(false);
            handleShowNetwork();
        }
        else {
            const address = Addresses.AuctionAddress;
            const abi = CreateAuctionContract;
            let tokenId = [];
            tokenId.push(cubeData.tokenId);
            var myContractInstance = await new web3.eth.Contract(abi, address);
            console.log("myContractInstance", myContractInstance);
            console.log("minimumBid * 10 ** 18", startTimeStamp.toString(), endTimeStamp.toString());
            var receipt = await myContractInstance.methods.newAuction(startTimeStamp.toString(), endTimeStamp.toString(), (minimumBid * 10 ** 18).toString(), tokenId).send({ from: accounts[0] }, (err, response) => {
                console.log('get transaction', err, response);
                if (err !== null) {
                    console.log("err", err);
                    let variant = "error";
                    enqueueSnackbar('User Canceled Transaction', { variant });
                    handleCloseBackdrop();
                    setIsPuttingOnAuction(false);
                    return;
                }

            })

            console.log("receipt", receipt);
            console.log("receipt.events.Transfer.returnValues.tokenId", receipt.events.New_Auction.returnValues.dropId);
            let auctionId = receipt.events.New_Auction.returnValues.dropId;
            let AuctionData = {
                auctionId: auctionId,
                tokenId: cubeData._id,
                auctionStartsAt: startTime,
                auctionEndsAt: endTime,
                minimumBid: minimumBid * 10 ** 18,
                bidDelta: bidDelta * 10 ** 18,
            }
            console.log("AuctionData", AuctionData);
            
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${Cookies.get("Authorization")}`;
            axios.post("/auction/createauction", AuctionData).then(
                (response) => {
                    console.log('response', response);
                    handleCloseBackdrop();
                    setIsPuttingOnAuction(false);
                    let variant = "success";
                    enqueueSnackbar('Auction Created Successfully.', { variant });
                    getCubeNFTs();
                },
                (error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log(error);
                        console.log(error.response);
                    }
                    handleCloseBackdrop();

                    setIsPuttingOnAuction(false);
                    let variant = "error";
                    enqueueSnackbar('Unable to Put on Auction.', { variant });
                }
            );

        }
    }

    useEffect(() => {
        getCubeNFTs();
        // getClaimFunds();

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
                                            <h2>Minimum Bid : {(dropData.MinimumBid + dropData.bidDelta) / 10 ** 18} WETH </h2>
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
                                            <Link to={"/User/Profile/Detail/musicArtist/" + cubeData.MusicArtistId + "/null"} style={{ color: '#000' }}>
                                                <CardHeader
                                                    avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                    title={cubeData.MusicArtistName}
                                                    subheader={cubeData.MusicArtistAbout}
                                                />
                                            </Link>
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
                                            <Link to={"/User/Profile/Detail/musicArtist/" + cubeData.MusicArtistId + "/null"} style={{ color: '#000' }}>
                                                <CardHeader
                                                    avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                    title={cubeData.MusicArtistName}
                                                    subheader={cubeData.MusicArtistAbout}
                                                />
                                            </Link>
                                            <h4>Choose Action</h4>
                                            {cubeData.salestatus || cubeData.check === "auction" ? (
                                                <>
                                                    <Row>
                                                        <button className="btn-lg btn btn-block" disabled>Allow Exchange to Sale</button>
                                                    </Row>
                                                    <h4 style={{ marginTop: '10px', marginBottom: '10px' }} align="center" className="text-center">Or</h4>
                                                    <Row>
                                                        <button className="btn-lg btn btn-block" disabled>Put on Auction</button>
                                                    </Row>
                                                </>
                                            ) : (
                                                <>
                                                    <Row>
                                                        {isPuttingOnSale ? (
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
                                                            <button className="btn-lg btn btn-block" onClick={(e) => {
                                                                e.preventDefault();
                                                                handleShow()
                                                            }}>Allow Exchange to Sale</button>
                                                        )}
                                                    </Row>
                                                    <h4 style={{ marginTop: '10px', marginBottom: '10px' }} align="center" className="text-center">Or</h4>
                                                    <Row>
                                                        {isPuttingOnAuction ? (
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
                                                            <button className="btn-lg btn btn-block" onClick={(e) => {
                                                                e.preventDefault();
                                                                handleShowAuction()
                                                            }}>Put on Auction</button>
                                                        )}


                                                    </Row>
                                                </>
                                            )}


                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                    </section >
                    <div className="form-group" style={{ marginTop: '20px', marginBottom: '20px' }}>

                        {openNFTData ? (
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
                            <div className="row">
                                <div className="col-md-12 col-lg-6" style={{ marginTop: "20px" }}>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                    >
                                        {tokenList.map((i, index) => (
                                            <NewNFTCard data={i[0]} key={index} />
                                        ))}

                                    </Grid>
                                </div>
                                <div className="col-md-12 col-lg-6" >
                                    <div className="form-group" style={{ marginTop: "20px" }}>
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
                                                    {transactionHistory.slice(0).reverse().map((i, index) => (
                                                        <TxHistory data={i} key={index} />
                                                    ))}
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>

                                    {cubeData.check === "auction" ? (
                                        <div className="form-group" style={{ marginTop: "20px" }}>
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

                                    ) : (null)}
                                    {/* </div> */}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div >
            <NetworkErrorModal
                show={openNetwork}
                handleClose={handleCloseNetwork}
                network={network}
            />
            <SaleCubeModal isConfirmingSale={isConfirmingSale} show={openModal} handleClose={handleClose} putOnSale={putOnSale} />
            <AuctionCubeModal isConfirmingSale={isConfirmingSale} show={openAuctionModal} handleClose={handleCloseAuction} putOnAuction={putOnAuction} />
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default CubeNFTs;
