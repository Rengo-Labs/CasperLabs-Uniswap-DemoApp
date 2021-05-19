import { Grid } from '@material-ui/core/';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Button, Row, Spinner } from "react-bootstrap";
import Countdown from 'react-countdown';
import { useHistory, useParams } from "react-router-dom";
import Web3 from 'web3';
import r1 from '../../../../assets/img/patients/patient.jpg';
import CreateAuctionContract from '../../../../components/blockchain/Abis/CreateAuctionContract.json';
import WethContract from '../../../../components/blockchain/Abis/WethContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import HeaderHome from '../../../../components/Headers/Header';
import ConfirmBidModal from '../../../../components/Modals/ConfirmBidModal';
import LoginErrorModal from '../../../../components/Modals/LoginErrorModal';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';
import WethModal from '../../../../components/Modals/WethModal';
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

function AuctionCubeNFTs(props) {
    let history = useHistory();
    let jwt = Cookies.get("Authorization");
    let jwtDecoded
    if (jwt) {
        jwtDecoded = jwtDecode(jwt);
    }
    const [ownerAudio, setOwnerAudio] = useState(new Audio());
    const [nonOwnerAudio, setNonOwnerAudio] = useState(new Audio());
    const [isClaiming, setIsClaiming] = useState(false);
    const [isClaimingWeth, setIsClaimingWeth] = useState(false);
    const [weth, setWeth] = useState(0);
    const [enableWethButton, setEnableWethButton] = useState(false);
    const [isConfirmingWeth, setIsConfirmingWeth] = useState(false);

    useEffect(() => {

        (async () => {
            ownerAudio.addEventListener('ended', () => ownerAudio.pause());
            nonOwnerAudio.addEventListener('ended', () => nonOwnerAudio.pause());
            return () => {
                ownerAudio.removeEventListener('ended', () => ownerAudio.pause());
                nonOwnerAudio.addEventListener('ended', () => nonOwnerAudio.pause());
            };
        })();

    }, []);

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const { dropId, cubeId, auctionId } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [auctionData, setAuctionData] = useState({});
    const [minBid, setMinBid] = useState(0);

    const [bidByUser, setBidByUser] = useState(0);
    const [highestBid, setHighestBid] = useState(0);
    const [bid, setBid] = useState();
    const [balance, setBalance] = useState();
    const [hide, setHide] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [network, setNetwork] = useState("");
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [bidHistory, setBidHistory] = useState([]);
    const [isRemoving, setIsRemoving] = useState(false);
    // if(bidHistory.length!==0)
    // console.log("bidHistory.findIndex(i => i.userId === jwtDecoded.userId)",);
    const [openWeth, setOpenWeth] = useState(false);
    const handleCloseWeth = () => {
        setOpenWeth(false);
    };
    const handleShowWeth = () => {
        setOpenWeth(true);
    };

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleShow = () => {
        setOpen(true);
    };
    const [openNetwork, setOpenNetwork] = useState(false);
    const handleCloseNetwork = () => {
        setOpenNetwork(false);
    };
    const handleShowNetwork = () => {
        setOpenNetwork(true);
    };
    const [openBidModal, setOpenBidModal] = useState(false);
    const handleCloseBidModal = () => {
        setOpenBidModal(false);
    };
    const handleShowBidModal = () => {
        setOpenBidModal(true);
    };
    const [openSpinner, setOpenSpinner] = useState(false);
    const handleCloseSpinner = () => {
        setOpenSpinner(false);
    };
    const handleShowSpinner = () => {
        setOpenSpinner(true);
    };
    const [openBackdrop, setOpenBackdrop] = useState(false);
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
            console.log("dropData.auctionId, cubeData.tokenId", auctionData.auctionId, cubeData.tokenId);
            let receipt = await myContractInstance.methods.claimFunds(auctionData.auctionId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
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
                auctionId: auctionId,
                tokenId: cubeId,
            }
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${Cookies.get("Authorization")}`;
            axios.post("/userclaimfunds/claimfunds", Data).then(
                (response) => {
                    console.log('response', response);
                    setIsClaiming(false);
                    handleCloseBackdrop();
                    getAuctionCubeNFTs();
                    let variant = "success";
                    enqueueSnackbar('Funds transferred Successfully.', { variant });
                },
                (error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log(error);
                        console.log(error.response);
                    }
                    setIsClaiming(false);
                    handleCloseBackdrop();

                    let variant = "error";
                    enqueueSnackbar('Unable to transfer Funds.', { variant });
                }
            );
        }
    }
    let removeFromAuction = () => {
        setIsRemoving(true);
        let saleData = {
            auctionId: auctionId,
            tokenId: cubeId
        }
        console.log("saleData", saleData);
        axios.post("auction/deleteauction", saleData).then(
            (response) => {
                console.log('response', response);
                setIsRemoving(false);
                
                // getAuctionCubeNFTs();
                let variant = "success";
                enqueueSnackbar('Removed from Sale Successfully.', { variant });
                history.push("/")
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsRemoving(false);
                let variant = "error";
                enqueueSnackbar('Unable to Remove from Sale.', { variant });
            }
        );
    }

    let claimCube = async (e) => {
        if (cubeData.userclaimfunds) {
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
                console.log("dropData.auctionId, cubeData.tokenId", auctionData.auctionId, cubeData.tokenId);
                let receipt = await myContractInstance.methods.claimNFT(auctionData.auctionId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
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
                let BuyData = {
                    auctionId: auctionId,
                    tokenId: cubeId,
                }
                console.log("BidData", BuyData);
                axios.post("token/buytoken", BuyData).then(
                    (response) => {
                        console.log('response', response);
                        setIsClaiming(false);
                        handleCloseBackdrop();
                        getAuctionCubeNFTs();
                        let variant = "success";
                        enqueueSnackbar('Cube transferred Successfully.', { variant });
                    },
                    (error) => {
                        if (process.env.NODE_ENV === "development") {
                            console.log(error);
                            console.log(error.response);
                        }
                        setIsClaiming(false);
                        handleCloseBackdrop();

                        let variant = "error";
                        enqueueSnackbar('Unable to transfer Cube.', { variant });
                    }
                );
                let ClaimData = {
                    auctionId: auctionId,
                    tokenId: cubeId,
                    address: accounts[0],
                    claimFunds: true,
                    claimNft: true,
                    withdraw: true,
                }
                axios.put("usercubehistory/claimhistory", ClaimData).then(
                    (response) => {
                        console.log('response', response);
                        setIsClaiming(false);
                        handleCloseBackdrop();
                        getAuctionCubeNFTs();
                    },
                    (error) => {
                        if (process.env.NODE_ENV === "development") {
                            console.log(error);
                            console.log(error.response);
                        }
                        setIsClaiming(false);
                        handleCloseBackdrop();

                        let variant = "error";
                        enqueueSnackbar('Unable to transfer Cube.', { variant });
                    }
                );
                let TrasactionData = {
                    tokenId: cubeData.tokenId,
                    from: cubeData.address,
                    to: accounts[0],
                    transaction: receipt.transactionHash
                }

                axios.post("/transaction/tokenTransaction ", TrasactionData).then(
                    (response) => {
                        console.log('response', response);
                        setIsSaving(false);
                    },
                    (error) => {
                        if (process.env.NODE_ENV === "development") {
                            console.log(error);
                            console.log(error.response);
                        }
                        setIsSaving(false);
                    }
                );
            }
        } else {
            setIsClaiming(false);
            handleCloseBackdrop();

            let variant = "info";
            enqueueSnackbar('Please wait for Owner to claim Funds first.', { variant });
        }
    }
    let withdraw = async (e) => {
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
            console.log("dropData.auctionId, cubeData.tokenId", auctionData.auctionId, cubeData.tokenId);
            let receipt = await myContractInstance.methods.withdraw(auctionData.auctionId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
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
            let ClaimData = {
                auctionId: auctionId,
                tokenId: cubeId,
                address: accounts[0],
                claimFunds: true,
                claimNft: true,
                withdraw: true,
            }
            axios.put("usercubehistory/claimhistory", ClaimData).then(
                (response) => {
                    console.log('response', response);
                    setIsClaiming(false);
                    handleCloseBackdrop();
                    let variant = "success";
                    enqueueSnackbar('Funds withdrawn Successfully', { variant });
                    getAuctionCubeNFTs();
                },
                (error) => {
                    if (process.env.NODE_ENV === "development") {
                        console.log(error);
                        console.log(error.response);
                    }
                    let variant = "success";
                    enqueueSnackbar('Unable to withdraw funds', { variant });
                    setIsClaiming(false);
                    handleCloseBackdrop();
                }
            );
        }
    }
    let ConfirmBidding = async () => {
        handleCloseBidModal();
        setIsSaving(true);
        console.log("bid", bid);
        if (bid < (highestBid - bidByUser + auctionData.bidData) / 10 ** 18) {
            let variant = "error";
            enqueueSnackbar('Bid Must be Greater than Minimum Bid', { variant });
            handleCloseBackdrop();
            setIsSaving(false);
        }
        else {
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
                const wethAddress = Addresses.WethAddress;
                const wethAbi = WethContract;
                // const address = Addresses.AuctionAddress;
                var myWethContractInstance = await new web3.eth.Contract(wethAbi, wethAddress);
                let wethReceipt = await myWethContractInstance.methods.balanceOf(accounts[0]).call();
                console.log("wethReceipt", wethReceipt);

                if (wethReceipt < (bid * 10 ** 18)) {
                    let variant = "error";
                    enqueueSnackbar('You have insufficient Weth', { variant });
                    setEnableWethButton(true);
                    setIsSaving(false);

                    handleCloseBackdrop();
                }
                else {
                    setEnableWethButton(false);
                    const address = Addresses.AuctionAddress;
                    const abi = CreateAuctionContract;
                    let wethReceipt = await myWethContractInstance.methods.approve(address, (bid * 10 ** 18).toString()).send({ from: accounts[0] }, (err, response) => {
                        console.log('get transaction', err, response);
                        if (err !== null) {
                            console.log("err", err);
                            let variant = "error";
                            enqueueSnackbar('User Canceled Transaction', { variant });
                            handleCloseBackdrop();
                            setIsClaiming(false);
                        }
                    })

                    var myContractInstance = await new web3.eth.Contract(abi, address);
                    console.log("myContractInstance", myContractInstance);
                    console.log("accounts[0]", accounts[0]);
                    console.log("dropData.auctionId, cubeData.tokenId", auctionData.auctionId, cubeData.tokenId);
                    let receipt = await myContractInstance.methods.bid(auctionData.auctionId, cubeData.tokenId, (bid * 10 ** 18).toString()).send({ from: accounts[0] }, (err, response) => {
                        console.log('get transaction', err, response);
                        if (err !== null) {
                            console.log("err", err);
                            let variant = "error";
                            enqueueSnackbar('User Canceled Transaction', { variant });
                            handleCloseBackdrop();
                            setIsSaving(false);
                        }
                    })
                    console.log("receipt", receipt);
                    let BidData = {
                        auctionId: auctionId,
                        tokenId: cubeId,
                        Bid: bid * 10 ** 18,
                        address: accounts[0],
                    }
                    console.log("BidData", BidData);
                    axios.post("usercubehistory/createhistory", BidData).then(
                        (response) => {

                            console.log('response', response);
                            setIsSaving(false);
                            handleCloseBackdrop();
                            getAuctionCubeNFTs();
                            let variant = "success";
                            enqueueSnackbar('Bid Created Successfully.', { variant });
                        },
                        (error) => {
                            if (process.env.NODE_ENV === "development") {
                                console.log(error);
                                console.log(error.response);
                            }
                            setIsSaving(false);
                            handleCloseBackdrop();

                            let variant = "error";
                            enqueueSnackbar('Unable to Create Bid.', { variant });
                        }
                    );
                }
            }
        }
    }
    let getAuctionCubeNFTs = () => {
        handleShowSpinner();

        let Data = {
            tokenId: cubeId,
            check: "userauction",
            auctionId: auctionId
        }
        console.log("Data", Data);
        let bidData = {
            auctionId: auctionId,
            tokenId: cubeId,
        }
        axios.post(`/usercubehistory/history`, bidData).then((res) => {
            console.log("res", res);
            if (res.data.success) {
                setBidHistory(res.data.UsercubeshistoryData)
                // console.log("jwtDecoded.userId", jwtDecoded.userId);
                // for (let i = 0; i < res.data.Dropcubeshistorydata.length; i++) {
                //     console.log("res.data.Dropcubeshistorydata", res.data.Dropcubeshistorydata[i].userId);
                // }
                // let index = res.data.Dropcubeshistorydata.findIndex(i => i.userId === jwtDecoded.userId);
                // console.log(index, "index");
            }
            handleCloseSpinner();
        }, (error) => {
            if (process.env.NODE_ENV === "development") {
                console.log(error);
                console.log(error.response);

            }
            handleCloseSpinner();
        })
        axios.post("/token/SingleTokenId", Data).then(
            async (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                // setOwnerAudio(response.data.tokensdata.ownermusicfile)
                setOwnerAudio(new Audio(response.data.tokensdata.ownermusicfile))
                setNonOwnerAudio(new Audio(response.data.tokensdata.nonownermusicfile))
                setAuctionData(response.data.UserAuctiondata);

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
                let bidByUser = await myContractInstance.methods.getBidByUser(accounts[0], response.data.tokensdata.tokenId).call();
                console.log("bidByUser", bidByUser);
                setBidByUser(bidByUser);
                if (highestBid === '0') {
                    setBid(response.data.UserAuctiondata.minimumBid / 10 ** 18);
                } else {
                    setBid((highestBid - bidByUser + response.data.UserAuctiondata.bidDelta) / 10 ** 18)
                }
                // setBid((response.data.UserAuctiondata.minimumBid) / 10 ** 18)

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
                            localStorage.removeItem("Address")
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
    }
    useEffect(() => {
        (async () => {
            getAuctionCubeNFTs();
            await loadWeb3();
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);

            console.log("balance", (balance / 10 ** 18).toString());
            setBalance(balance);
        })();

    }, []);
    let getWeth = () => {
        // console.log("GET");
        handleShowWeth();
    }
    let confirmGetWeth = async () => {
        await loadWeb3();
        handleShowBackdrop();
        setIsConfirmingWeth(true);
        const web3 = window.web3
        const wethAddress = Addresses.WethAddress;
        const wethAbi = WethContract;
        const address = Addresses.AuctionAddress;
        const accounts = await web3.eth.getAccounts();
        var myWethContractInstance = await new web3.eth.Contract(wethAbi, wethAddress);
        let wethReceipt = await myWethContractInstance.methods.deposit().send({ from: accounts[0], value: weth * 10 ** 18 }, (err, response) => {
            console.log('get transaction', err, response);
            if (err !== null) {
                console.log("err", err);
                let variant = "error";
                enqueueSnackbar('User Canceled Transaction', { variant });
                handleCloseBackdrop();
                setIsConfirmingWeth(false)
            }
        })
        handleCloseBackdrop();
        handleCloseWeth();

        setIsConfirmingWeth(false)
        console.log("wethReceipt", wethReceipt);
        let variant = "Success";
        enqueueSnackbar('Successfully transferred Weth to your account', { variant });
    }
    return (
        <div className="main-wrapper">
            <div className="home-section home-full-height">
                <HeaderHome selectedNav={"Market"} />
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
                                                                        {jwt ? (
                                                                            cubeData.userId === jwtDecoded.userId ? (
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
                                                                            )) : (<Typography variant="body2" color="textSecondary" component="p">
                                                                                <strong>LOGIN TO GET ACCESS </strong>
                                                                            </Typography>)}

                                                                    </div>
                                                                )}
                                                            </CardMedia>
                                                        </CardActionArea>
                                                    </Card>
                                                </div>

                                                {dropId !== "notdrop" ? (
                                                    <div className="col-md-12 col-lg-6">
                                                        {/* {console.log()} */}
                                                        {enableWethButton ? (
                                                            isClaimingWeth ? (
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
                                                                <Button variant="primary" onClick={(e) => getWeth(e)} style={{ float: "right" }} >Get More Weth</Button>
                                                            )) : (null)}
                                                        {new Date() > new Date(auctionData.auctionEndsAt) ? (
                                                            jwt ? (
                                                                <>
                                                                    {cubeData.userId === jwtDecoded.userId && bidHistory.length === 0 ? (
                                                                        isRemoving ? (
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
                                                                            <Button variant="primary" style={{ float: 'right' }} onClick={removeFromAuction}>Remove from Sale</Button>
                                                                        )
                                                                    ) : (null)}
                                                                </>
                                                            ) : (null)
                                                        ) : (
                                                            null
                                                        )}
                                                        {new Date() > new Date(auctionData.auctionEndsAt) ? (
                                                            jwt ? (
                                                                <>

                                                                    {cubeData.userId === jwtDecoded.userId && bidHistory.length != 0 ? (
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
                                                                            cubeData.userclaimfunds ? (
                                                                                <Button variant="primary" disabled style={{ float: "right" }} >Claim Funds</Button>
                                                                            ) : (
                                                                                <Button variant="primary" onClick={(e) => claimFunds(e)} style={{ float: "right" }} >Claim Funds</Button>
                                                                            )

                                                                        )
                                                                    ) : (
                                                                        bidHistory.length != 0 ? (bidHistory[bidHistory.length - 1].userId === jwtDecoded.userId ? (
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
                                                                                bidHistory[bidHistory.length - 1].claimNft ? (
                                                                                    <Button variant="primary" disabled style={{ float: "right" }} >Claim Cube</Button>
                                                                                ) : (
                                                                                    <Button variant="primary" onClick={(e) => claimCube(e)} style={{ float: "right" }} >Claim Cube</Button>

                                                                                )
                                                                            )
                                                                        ) : (

                                                                            bidHistory.findIndex(i => i.userId === jwtDecoded.userId) !== -1 ? (
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
                                                                                    bidHistory[bidHistory.findIndex(i => i.userId === jwtDecoded.userId)].withdraw ? (
                                                                                        <Button variant="primary" disabled style={{ float: "right" }}  >Withdraw your bid</Button>
                                                                                    ) : (
                                                                                        <Button variant="primary" onClick={(e) => withdraw(e)} style={{ float: "right" }}  >Withdraw your bid</Button>)

                                                                                )
                                                                            ) : (null)
                                                                        )) : (null))}
                                                                </>
                                                            ) : (null)
                                                        ) : (
                                                            null
                                                        )}
                                                        <Typography variant="h4" gutterBottom>{cubeData.title}</Typography>
                                                        {highestBid !== '0' ? (
                                                            <Typography variant="h5" gutterBottom>Highest Bid : {(highestBid) / 10 ** 18} WETH </Typography>
                                                        ) : (null)}
                                                        <Typography variant="h5" gutterBottom>Current Bid : {(auctionData.minimumBid) / 10 ** 18} WETH </Typography>
                                                        {/* <Typography variant="h5" gutterBottom>Current Bid : {(highestBid - bidByUser) / 10 ** 18} WETH </Typography> */}
                                                        <Typography variant="h5" gutterBottom>Bid Delta : {auctionData.bidDelta / 10 ** 18} WETH </Typography>
                                                        <Typography variant="h5" gutterBottom>your bid : {(bidByUser) / 10 ** 18} WETH </Typography>
                                                        {new Date() < new Date(auctionData.auctionStartsAt) ? (
                                                            <Typography variant="h5" gutterBottom color="textSecondary">
                                                                <strong>Auction Starts At:</strong>
                                                                <span style={{ color: "#00FF00" }} >
                                                                    <Countdown daysInHours date={new Date(auctionData.auctionStartsAt)}>
                                                                    </Countdown>
                                                                </span>
                                                            </Typography>

                                                        ) : new Date() > new Date(auctionData.auctionStartsAt) && new Date() < new Date(auctionData.auctionEndsAt) ? (
                                                            <Typography variant="h5" gutterBottom color="textSecondary" component="p">
                                                                <strong>Auction Ends At: </strong>
                                                                <span style={{ color: "#FF0000" }}>
                                                                    <Countdown daysInHours date={new Date(auctionData.auctionEndsAt)}>
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
                                                            {new Date() < new Date(auctionData.auctionStartsAt) ? (
                                                                <>
                                                                    <label> Enter Bid: (WETH)</label>
                                                                    <input type='number' step="0.0001" diabled min={(auctionData.minimumBid) / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={bid} onChange={(evt) => {

                                                                    }} />
                                                                    <br></br>
                                                                    <Button variant="primary" block disabled>Place a bid</Button>
                                                                </>

                                                            ) : new Date() > new Date(auctionData.auctionStartsAt) && new Date() < new Date(auctionData.auctionEndsAt) ? (
                                                                <>
                                                                    <label> Enter Bid:(WETH) </label>
                                                                    {jwt ?
                                                                        (cubeData.userId === jwtDecoded.userId ?
                                                                            (
                                                                                <>
                                                                                    <input type='number' step="0.0001" disabled className='form-control' style={{ marginBottom: '20px' }} value={bid} />
                                                                                    <br></br>
                                                                                    <Button variant="primary" block disabled>You Cannot bid on your own Cube</Button>
                                                                                </>
                                                                            ) : (auctionData.minimumBid) / 10 ** 18 > balance / 10 ** 18 ? (
                                                                                <>
                                                                                    <input type='number' step="0.0001" disabled className='form-control' style={{ marginBottom: '20px' }} value={bid} />
                                                                                    <br></br>
                                                                                    <Button variant="primary" block disabled>Insufficient Balance</Button>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {highestBid !== '0' ? (
                                                                                        <input type='number' step={auctionData.bidDelta / 10 ** 18} min={(highestBid - bidByUser + auctionData.bidDelta) / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={bid} onChange={(evt) => {
                                                                                            if (evt.target.value >= 0) {
                                                                                                if (evt.target.value < (highestBid - bidByUser + auctionData.bidDelta) / 10 ** 18) {
                                                                                                    setBid((highestBid - bidByUser + auctionData.bidDelta) / 10 ** 18)
                                                                                                } else
                                                                                                    if (evt.target.value > balance / 10 ** 18) {
                                                                                                        setBid(balance / 10 ** 18)
                                                                                                    }
                                                                                                    else {
                                                                                                        setBid(evt.target.value)
                                                                                                    }
                                                                                            }
                                                                                            else {
                                                                                                setBid((highestBid - bidByUser + auctionData.bidDelta) / 10 ** 18)
                                                                                            }

                                                                                        }} />
                                                                                    ) : (
                                                                                        <input type='number' step={auctionData.bidDelta / 10 ** 18} min={(auctionData.minimumBid) / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={bid} onChange={(evt) => {
                                                                                            if (evt.target.value >= 0) {
                                                                                                if (evt.target.value < (auctionData.minimumBid) / 10 ** 18) {
                                                                                                    setBid((auctionData.minimumBid) / 10 ** 18)
                                                                                                } else
                                                                                                    if (evt.target.value > balance / 10 ** 18) {
                                                                                                        setBid(balance / 10 ** 18)
                                                                                                    }
                                                                                                    else {
                                                                                                        setBid(evt.target.value)
                                                                                                    }
                                                                                            }
                                                                                            else {
                                                                                                setBid((auctionData.minimumBid) / 10 ** 18)
                                                                                            }

                                                                                        }} />
                                                                                    )}

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
                                                                            )) : (
                                                                            null
                                                                        )}
                                                                    {/* {}` */}

                                                                </>

                                                            ) : (
                                                                <Button variant="primary" block disabled >Auction Ended</Button>
                                                            )}


                                                        </Row>
                                                    </div>
                                                ) : (
                                                    <div className="col-md-12 col-lg-6">
                                                        {/* <Chip clickable style={{ marginTop: '20px' }}
                                                            color="" label="@UserName" />
                                                        <h1> </h1> */}
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
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                            direction="row"
                                                            justify="flex-start"
                                                        // alignItems="flex-start"
                                                        >
                                                            {transactionHistory.slice(0).reverse().map((i, index) => (
                                                                <Grid item xs={12} sm={12} md={12} key={index}>
                                                                    <Card className={classes.root}>
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
                                                                </Grid>

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
                                                                <Grid item xs={12} sm={12} md={12} key={index}>
                                                                    <Card className={classes.root} >
                                                                        <CardActionArea style={{ margin: '5px' }}>
                                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                                <strong>Address : </strong>{i.address}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                                <strong>Bid : </strong><span style={{ cursor: 'pointer', color: 'rgb(167,0,0)' }}>{i.Bid / 10 ** 18} WETH</span>
                                                                            </Typography>
                                                                        </CardActionArea>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
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
            <ConfirmBidModal bid={bid} balance={balance} minimumBid={auctionData.minimumBid} bidDelta={auctionData.bidDelta} show={openBidModal} handleClose={handleCloseBidModal} ConfirmBidding={ConfirmBidding} />
            <WethModal isConfirmingWeth={isConfirmingWeth} weth={weth} balance={balance} setWeth={setWeth} show={openWeth} handleClose={handleCloseWeth} confirmGetWeth={confirmGetWeth} />
            <NetworkErrorModal
                show={openNetwork}
                handleClose={handleCloseNetwork}
                network={network}
            />
            <Backdrop className={classes.backdrop} open={openBackdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default AuctionCubeNFTs;
