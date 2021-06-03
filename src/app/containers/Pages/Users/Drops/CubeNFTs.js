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
import { Alert } from 'reactstrap';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Button, Row, Spinner } from "react-bootstrap";
import Countdown from 'react-countdown';
import { Link, useHistory, useParams } from "react-router-dom";
import Web3 from 'web3';
import CreateAuctionContract from '../../../../components/blockchain/Abis/CreateAuctionContract.json';
import WethContract from '../../../../components/blockchain/Abis/WethContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import BiddingHistory from '../../../../components/Cards/BiddingHistory';
import NewNFTCard from '../../../../components/Cards/NewNFTCards';
import TxHistory from '../../../../components/Cards/TxHistory';
import CubeComponent from '../../../../components/Cube/CubeComponent';
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

function CubeNFTs(props) {
    let history = useHistory();
    let jwt = Cookies.get("Authorization");
    let jwtDecoded
    if (jwt) {
        jwtDecoded = jwtDecode(jwt);
    }
    const [ownerAudio, setOwnerAudio] = useState(new Audio());
    const [nonOwnerAudio, setNonOwnerAudio] = useState(new Audio());
    const [isClaiming, setIsClaiming] = useState(false);
    const [isClaimingWeth] = useState(false);
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
        })();// eslint-disable-next-line
    }, []);

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const { dropId, cubeId } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [dropData, setDropData] = useState({});
    const [bidByUser, setBidByUser] = useState(0);
    const [highestBid, setHighestBid] = useState(0);
    const [bid, setBid] = useState(null);
    const [balance, setBalance] = useState();
    const [hide, setHide] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [network, setNetwork] = useState("");
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [bidHistory, setBidHistory] = useState([]);
    const [openWeth, setOpenWeth] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
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
    // eslint-disable-next-line
    // let claimFunds = async (e) => {
    //     e.preventDefault();

    //     setIsClaiming(true);
    //     await loadWeb3();
    //     const web3 = window.web3
    //     const accounts = await web3.eth.getAccounts();
    //     const network = await web3.eth.net.getNetworkType()
    //     if (network !== 'ropsten') {
    //         setNetwork(network);
    //         setIsClaiming(false);
    //         handleShowNetwork();
    //     }
    //     else {
    //         handleShowBackdrop();
    //         const address = Addresses.AuctionAddress;
    //         const abi = CreateAuctionContract;
    //         var myContractInstance = await new web3.eth.Contract(abi, address);
    //         console.log("myContractInstance", myContractInstance);
    //         console.log("dropData.dropId, cubeData.tokenId", dropData.dropId, cubeData.tokenId);
    //         let receipt = await myContractInstance.methods.claimFunds(dropData.dropId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
    //             console.log('get transaction', err, response);
    //             if (err !== null) {
    //                 console.log("err", err);
    //                 let variant = "error";
    //                 enqueueSnackbar('User Canceled Transaction', { variant });
    //                 handleCloseBackdrop();
    //                 setIsClaiming(false);
    //             }
    //         })
    //         console.log("receipt", receipt);
    //         let ClaimData = {
    //             dropId: dropId,
    //             tokenId: cubeId,
    //             address: accounts[0],
    //             claimFunds: true,
    //             claimNft: true,
    //             withdraw: true,
    //         }
    //         axios.put("dropcubehistory/claimhistory", ClaimData).then(
    //             (response) => {
    //                 console.log('response', response);
    //                 setIsClaiming(false);
    //                 handleCloseBackdrop();
    //                 getCubeNFTs();
    //                 let variant = "success";
    //                 enqueueSnackbar('Cube transferred Successfully.', { variant });
    //             },
    //             (error) => {
    //                 if (process.env.NODE_ENV === "development") {
    //                     console.log(error);
    //                     console.log(error.response);
    //                 }
    //                 setIsClaiming(false);
    //                 handleCloseBackdrop();

    //                 let variant = "error";
    //                 enqueueSnackbar('Unable to transfer Cube.', { variant });
    //             }
    //         );
    //     }
    // }

    let claimCube = async (e) => {
        if (cubeData.adminclaimfunds) {
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
                let receipt = await myContractInstance.methods.claimNFT(dropData.dropId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
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
                    dropId: dropId,
                    tokenId: cubeId,
                    owneraddress: accounts[0],
                }
                console.log("BuyData", BuyData);

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${Cookies.get("Authorization")}`;
                axios.post("token/buytoken", BuyData).then(
                    (response) => {
                        console.log('response', response);
                        setIsClaiming(false);
                        handleCloseBackdrop();
                        getCubeNFTs();
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
                    dropId: dropId,
                    tokenId: cubeId,
                    address: accounts[0],
                    claimFunds: true,
                    claimNft: true,
                    withdraw: true,
                }

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${Cookies.get("Authorization")}`;
                axios.put("dropcubehistory/claimhistory", ClaimData).then(
                    (response) => {
                        console.log('response', response);
                        setIsClaiming(false);
                        handleCloseBackdrop();
                        history.push("/auctionDrops/DropCubes/" + cubeId)
                        getCubeNFTs();
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

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${Cookies.get("Authorization")}`;

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
            enqueueSnackbar('Please wait for admin to claim Funds first.', { variant });
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
            console.log("dropData.dropId, cubeData.tokenId", dropData.dropId, cubeData.tokenId);
            let receipt = await myContractInstance.methods.withdraw(dropData.dropId, cubeData.tokenId).send({ from: accounts[0] }, (err, response) => {
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
                dropId: dropId,
                tokenId: cubeId,
                address: accounts[0],
                claimFunds: true,
                claimNft: true,
                withdraw: true,
            }

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${Cookies.get("Authorization")}`;
            axios.put("dropcubehistory/claimhistory", ClaimData).then(
                (response) => {
                    console.log('response', response);
                    setIsClaiming(false);
                    handleCloseBackdrop();
                    let variant = "success";
                    enqueueSnackbar('Funds withdrawn Successfully', { variant });
                    getCubeNFTs();
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
        if (bid < (highestBid - bidByUser + dropData.bidData) / 10 ** 18) {
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
                    await myWethContractInstance.methods.approve(address, (bid * 10 ** 18).toString()).send({ from: accounts[0] }, (err, response) => {
                        console.log('get transaction', err, response);
                        if (err !== null) {
                            console.log("err", err);
                            let variant = "error";
                            enqueueSnackbar('User Canceled Transaction', { variant });
                            handleCloseBackdrop();
                            setIsClaiming(false);
                            setIsSaving(true);
                        }
                    })

                    var myContractInstance = await new web3.eth.Contract(abi, address);
                    console.log("myContractInstance", myContractInstance);
                    console.log("accounts[0]", accounts[0]);
                    console.log("dropData.dropId, cubeData.tokenId", dropData.dropId, cubeData.tokenId);
                    let receipt = await myContractInstance.methods.bid(dropData.dropId, cubeData.tokenId, (bid * 10 ** 18).toString()).send({ from: accounts[0] }, (err, response) => {
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
                        dropId: dropId,
                        tokenId: cubeId,
                        Bid: bid * 10 ** 18,
                        address: accounts[0],
                    }
                    console.log("BidData", BidData);

                    axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
                        "Authorization"
                    )}`;
                    axios.post("dropcubehistory/createhistory", BidData).then(
                        (response) => {

                            console.log('response', response);
                            setIsSaving(false);
                            handleCloseBackdrop();
                            getCubeNFTs();
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

                // .on('receipt', (receipt) => {
                //     console.log("receipt", receipt);
                //     console.log("receipt.events.Transfer.returnValues.tokenId", receipt.events.Transfer.returnValues.tokenId);
                //     handleCloseBackdrop();

                // })
            }
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
                // console.log("jwtDecoded.userId", jwtDecoded.userId);
                for (let i = 0; i < res.data.Dropcubeshistorydata.length; i++) {
                    console.log("res.data.Dropcubeshistorydata", res.data.Dropcubeshistorydata[i].userId);
                }
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

        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${Cookies.get("Authorization")}`;
        axios.post("/token/SingleTokenId", Data).then(
            async (response) => {
                console.log("response", response);
                setTokenList(response.data.nftdata);
                setCubeData(response.data.tokensdata);
                setOwnerAudio(new Audio(response.data.tokensdata.ownermusicfile))
                setNonOwnerAudio(new Audio(response.data.tokensdata.nonownermusicfile))
                if (dropId !== "notdrop") {
                    setDropData(response.data.Dropdata);
                    // (dropData.MinimumBid + dropData.bidDelta) / 10 ** 18

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
                    if (highestBid === '0' || highestBid === 0) {
                        console.log();
                        setBid(response.data.Dropdata.MinimumBid / 10 ** 18)
                    } else {
                        setBid((highestBid - bidByUser + response.data.Dropdata.bidDelta) / 10 ** 18)
                    }
                }


                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${Cookies.get("Authorization")}`;
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
        // /transaction/tokenTransaction/{tokenId}
        // for Getiing Transaction History of CUbe
    }
    useEffect(() => {
        (async () => {
            // history.push("/auctionDrops/DropCubes/" + cubeId)

            getCubeNFTs();
            await loadWeb3();
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);
            const wethAddress = Addresses.WethAddress;
            const wethAbi = WethContract;
            var myWethContractInstance = await new web3.eth.Contract(wethAbi, wethAddress);
            let wethReceipt = await myWethContractInstance.methods.balanceOf(accounts[0]).call();
            console.log("balance", (wethReceipt / 10 ** 18).toString(),);
            setBalance(balance);
        })();// eslint-disable-next-line
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
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    setIsPlaying(!isPlaying)

                                                                    if (!isPlaying) {
                                                                        if (jwtDecoded !== undefined && jwtDecoded !== null) {
                                                                            if (jwtDecoded.userId === cubeData.userId) {
                                                                                console.log("Owner");
                                                                                setHide(true)
                                                                                ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                                                ownerAudio.play();
                                                                            }
                                                                            else {
                                                                                console.log("NON Owner");
                                                                                setHide(true)
                                                                                nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                                nonOwnerAudio.play();
                                                                                setTimeout(() => {
                                                                                    setHide(false)
                                                                                    nonOwnerAudio.pause()
                                                                                }, 10000);
                                                                            }
                                                                        } else {
                                                                            console.log("NON Owner");
                                                                            setTimeout(() => {
                                                                                setHide(false)
                                                                                nonOwnerAudio.pause()
                                                                            }, 10000);
                                                                            nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                            nonOwnerAudio.play();
                                                                            setHide(true)
                                                                        }
                                                                    } else {
                                                                        if (jwtDecoded !== undefined && jwtDecoded !== null) {
                                                                            if (jwtDecoded.userId === cubeData.userId) {
                                                                                console.log("Owner Pause");
                                                                                ownerAudio.setAttribute('crossorigin', 'anonymous');
                                                                                ownerAudio.pause();
                                                                                setHide(false)
                                                                            }
                                                                            else {
                                                                                console.log("Non Owner Pause");
                                                                                nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                                nonOwnerAudio.pause();
                                                                                setHide(false)
                                                                            }
                                                                        } else {
                                                                            console.log("Non Owner Pause");
                                                                            nonOwnerAudio.setAttribute('crossorigin', 'anonymous');
                                                                            nonOwnerAudio.pause();
                                                                            setHide(false)
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {hide ? (
                                                                    <CubeComponent data={tokenList} />
                                                                ) : (
                                                                    <div className="mainDiv">
                                                                        <span >
                                                                            <div className="square"></div>
                                                                            <div className="square2"></div>
                                                                            <div className="square3"></div>
                                                                        </span>

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
                                                        {new Date() > new Date(dropData.AuctionEndsAt) ? (
                                                            jwt ? (
                                                                <>
                                                                    {cubeData.userId === jwtDecoded.userId ? (
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
                                                                            null
                                                                        )
                                                                    ) : (
                                                                        bidHistory.length !== 0 ? (bidHistory[bidHistory.length - 1].userId === jwtDecoded.userId ? (
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
                                                        <Typography variant="h5" gutterBottom>Current Bid : {(dropData.MinimumBid) / 10 ** 18} WETH </Typography>
                                                        {/* <Typography variant="h5" gutterBottom>Current Bid : {(highestBid - bidByUser) / 10 ** 18} WETH </Typography> */}
                                                        <Typography variant="h5" gutterBottom>Bid Delta : {dropData.bidDelta / 10 ** 18} WETH </Typography>
                                                        <Typography variant="h5" gutterBottom>your bid : {(bidByUser) / 10 ** 18} WETH </Typography>
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
                                                        <Row>
                                                            {new Date() < new Date(dropData.AuctionStartsAt) ? (
                                                                <>
                                                                    <label> Enter Bid: (WETH)</label>
                                                                    <input type='number' step="0.0001" diabled min={(highestBid - bidByUser) / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} value={bid} onChange={(evt) => {

                                                                    }} />
                                                                    <br></br>
                                                                    <Button variant="primary" block disabled>Place a bid</Button>
                                                                </>

                                                            ) : new Date() > new Date(dropData.AuctionStartsAt) && new Date() < new Date(dropData.AuctionEndsAt) ? (
                                                                <>
                                                                    <label> Enter Bid:(WETH) </label>
                                                                    {(highestBid - bidByUser) / 10 ** 18 > balance / 10 ** 18 ? (
                                                                        <>
                                                                            <input type='number' step="0.0001" disabled className='form-control' style={{ marginBottom: '20px' }} value={bid} />
                                                                            <br></br>
                                                                            <Button variant="primary" block disabled>Insufficient Balance</Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {highestBid !== '0' ? (<input type='number' step={dropData.bidDelta / 10 ** 18} min={(highestBid - bidByUser + dropData.bidDelta) / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} defaultValue={bid} onChange={(evt) => {
                                                                                if (evt.target.value >= 0) {
                                                                                    if (evt.target.value < (highestBid - bidByUser + dropData.bidDelta) / 10 ** 18) {
                                                                                        setBid((highestBid - bidByUser + dropData.bidDelta) / 10 ** 18)
                                                                                    } else
                                                                                        if (evt.target.value > balance / 10 ** 18) {
                                                                                            setBid(balance / 10 ** 18)
                                                                                        }
                                                                                        else {
                                                                                            setBid(evt.target.value)
                                                                                        }
                                                                                }
                                                                                else {
                                                                                    setBid((highestBid - bidByUser + dropData.bidDelta) / 10 ** 18)
                                                                                }

                                                                            }} />
                                                                            ) : (
                                                                                <input type='number' step={dropData.bidDelta / 10 ** 18} min={(dropData.MinimumBid) / 10 ** 18} max={balance / 10 ** 18} className='form-control' style={{ marginBottom: '20px' }} defaultValue={bid} onChange={(evt) => {
                                                                                    if (evt.target.value >= 0) {
                                                                                        if (evt.target.value < (dropData.MinimumBid) / 10 ** 18) {
                                                                                            setBid((dropData.MinimumBid) / 10 ** 18)
                                                                                        } else
                                                                                            if (evt.target.value > balance / 10 ** 18) {
                                                                                                setBid(balance / 10 ** 18)
                                                                                            }
                                                                                            else {
                                                                                                setBid(evt.target.value)
                                                                                            }
                                                                                    }
                                                                                    else {
                                                                                        setBid((dropData.MinimumBid) / 10 ** 18)
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
                                                                    )}

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
                                                        <Link to={"/User/Profile/Detail/musicArtist/" + cubeData.MusicArtistId + "/null"} style={{ color: '#000' }}>
                                                            <CardHeader
                                                                avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                                title={cubeData.MusicArtistName}
                                                                subheader={cubeData.MusicArtistAbout}
                                                            />
                                                        </Link>
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

                                            >
                                                {hide ? (
                                                    tokenList.map((i, index) => (
                                                        <NewNFTCard data={i[0]} key={index}></NewNFTCard>
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

                                                        >
                                                            {transactionHistory.slice(0).reverse().map((i, index) => (
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
                        )}
                    </div >
                </div >

            </div >
            <LoginErrorModal show={open} handleClose={handleClose} />
            <ConfirmBidModal bid={bid} balance={balance} minimumBid={dropData.MinimumBid} bidDelta={dropData.bidDelta} show={openBidModal} handleClose={handleCloseBidModal} ConfirmBidding={ConfirmBidding} />
            <WethModal isConfirmingWeth={isConfirmingWeth} weth={weth} balance={balance} setWeth={setWeth} show={openWeth} handleClose={handleCloseWeth} confirmGetWeth={confirmGetWeth} />
            <NetworkErrorModal
                show={openNetwork}
                handleClose={handleCloseNetwork}
                network={network}
            />
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default CubeNFTs;
