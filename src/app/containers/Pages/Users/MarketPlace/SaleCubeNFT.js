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
import MarketPlaceContract from '../../../../components/blockchain/Abis/MarketPlaceContract.json';
import WethContract from '../../../../components/blockchain/Abis/WethContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import HeaderHome from '../../../../components/Headers/Header';
import ConfirmBuyCubeModal from '../../../../components/Modals/ConfirmBuyCubeModal';
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

function SaleCubeNFTs(props) {
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
    const { expiresAt, cubeId, auctionId } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [cubeData, setCubeData] = useState({});
    const [dropData, setDropData] = useState({});
    const [minBid, setMinBid] = useState(0);
    const [bid, setBid] = useState();
    const [balance, setBalance] = useState();
    const [hide, setHide] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [network, setNetwork] = useState("");
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [bidHistory, setBidHistory] = useState([]);
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
    const [openBuyCubeModal, setOpenBuyCubeModal] = useState(false);
    const handleCloseBuyCubeModal = () => {
        setOpenBuyCubeModal(false);
    };
    const handleShowBuyCubeModal = () => {
        setOpenBuyCubeModal(true);
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
    let BuyCube = async (e) => {
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
                handleShowBuyCubeModal()
            }

            console.log("HELLO");

        } else {
            handleShow();
        }
    }
    let removeFromSale = () => {
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
                // getSaleCubeNFTs();
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

    let ConfirmBuyCube = async () => {
        handleCloseBuyCubeModal();
        setIsSaving(true);
        console.log("bid", bid);
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
            const address = Addresses.MarketPlaceAddress;
            const abi = MarketPlaceContract;
            var myWethContractInstance = await new web3.eth.Contract(wethAbi, wethAddress);
            let wethReceipt = await myWethContractInstance.methods.balanceOf(accounts[0]).call();
            if (wethReceipt < (cubeData.SalePrice)) {
                let variant = "error";
                enqueueSnackbar('You have insufficient Weth', { variant });
                setEnableWethButton(true);
                setIsSaving(false);

                handleCloseBackdrop();
            }
            else {
                setEnableWethButton(false);
                let wethReceipt = await myWethContractInstance.methods.approve(address, (cubeData.SalePrice).toString()).send({ from: accounts[0] }, (err, response) => {
                    console.log('get transaction', err, response);
                    if (err !== null) {
                        console.log("err", err);
                        let variant = "error";
                        enqueueSnackbar('User Canceled Transaction', { variant });
                        handleCloseBackdrop();
                        setIsClaiming(false);
                    }
                })


                const CubeAddress = Addresses.CreateCubeAddress;
                var myContractInstance = await new web3.eth.Contract(abi, address);
                console.log("myContractInstance", myContractInstance);
                console.log("cubeData.tokenId", cubeData.tokenId);
                let receipt1 = await myContractInstance.methods.executeOrder(CubeAddress, cubeData.tokenId, (cubeData.SalePrice).toString()).send({ from: accounts[0] }, (err, response) => {
                    console.log('get transaction', err, response);
                    if (err !== null) {
                        console.log("err", err);
                        let variant = "error";
                        enqueueSnackbar('User Canceled Transaction', { variant });
                        handleCloseBackdrop();
                        setIsClaiming(false);
                    }
                })
                // console.log("receipt", receipt);
                let BuyData = {
                    auctionId: auctionId,
                    tokenId: cubeId
                }
                console.log("BidData", BuyData);
                axios.post("token/buyuserToken", BuyData).then(
                    (response) => {

                        console.log('response', response);
                        setIsSaving(false);
                        handleCloseBackdrop();
                        getSaleCubeNFTs();
                        let variant = "success";
                        enqueueSnackbar('Cube Bought Successfully.', { variant });
                    },
                    (error) => {
                        if (process.env.NODE_ENV === "development") {
                            console.log(error);
                            console.log(error.response);
                        }
                        setIsSaving(false);
                        handleCloseBackdrop();

                        let variant = "error";
                        enqueueSnackbar('Unable to Buy Cube.', { variant });
                    }
                );
                let TrasactionData = {
                    tokenId: cubeData.tokenId,
                    from: cubeData.address,
                    to: accounts[0],
                    transaction: receipt1.transactionHash
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
        }

    }
    let getSaleCubeNFTs = () => {
        handleShowSpinner();

        let Data = {
            tokenId: cubeId,
            check: "notdrop"
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
            getSaleCubeNFTs();
            await loadWeb3();
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);
            // let TrasactionData = {
            //     tokenId: 2,
            //     from: "0xf363D646C2767dB90Af945ebD6F71367166159A2",
            //     to: accounts[0],
            //     transaction: "0xbe29d7a2ad4ee12732c5a9d38b0b539e514e01b9686d5af3be4d08d769ccfa17"
            // }

            // axios.post("/transaction/tokenTransaction ", TrasactionData).then(
            //     (response) => {
            //         console.log('response', response);
            //         setIsSaving(false);
            //     },
            //     (error) => {
            //         if (process.env.NODE_ENV === "development") {
            //             console.log(error);
            //             console.log(error.response);
            //         }
            //         setIsSaving(false);
            //     }
            // );
            // const address = Addresses.AuctionAddress;
            // const abi = CreateAuctionContract;
            // var myContractInstance = await new web3.eth.Contract(abi, address);
            // let receipt = await myContractInstance.methods.getHighestBid(cubeData.tokenId).call();
            // console.log("receipt",receipt);
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
    console.log("expiresAt", expiresAt);
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
                                                    {new Date() > new Date(expiresAt) ? (
                                                        jwt ? (
                                                            <>
                                                                {cubeData.userId === jwtDecoded.userId ? (
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
                                                                        <Button variant="primary" style={{ float: 'right' }} onClick={removeFromSale}>Remove from Sale</Button>
                                                                    )
                                                                ) : (null)}
                                                            </>
                                                        ) : (null)
                                                    ) : (
                                                        null
                                                    )}
                                                    <Typography variant="h4" gutterBottom>{cubeData.title}</Typography>
                                                    <Typography variant="h5" gutterBottom>Price : {(cubeData.SalePrice) / 10 ** 18} ETH </Typography>
                                                    {/* <Typography variant="h5" gutterBottom color="textSecondary" > */}
                                                    {new Date() < new Date(expiresAt) ? (
                                                        <Typography variant="h5" gutterBottom color="textSecondary">
                                                            <strong>Sale Ends At:</strong>
                                                            <span style={{ color: "#FF0000" }} >
                                                                <Countdown daysInHours date={new Date(expiresAt)}>
                                                                </Countdown>
                                                            </span>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body2" style={{ color: "#FF0000" }} component="p">
                                                            <strong>Sale Ended</strong>
                                                        </Typography>
                                                    )}
                                                    {/* </Typography> */}
                                                    <h3 className="text-muted">Music Artist</h3>
                                                    <CardHeader
                                                        avatar={<Avatar src={cubeData.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                        title={cubeData.MusicArtistName}
                                                        subheader={cubeData.MusicArtistAbout}
                                                    />

                                                    <Row>

                                                        {(cubeData.SalePrice) / 10 ** 18 > balance / 10 ** 18 ? (
                                                            <>
                                                                <Button variant="primary" block disabled>Insufficient Balance</Button>
                                                            </>
                                                        ) : (
                                                            <>
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
                                                                    jwt ? (
                                                                        cubeData.userId === jwtDecoded.userId ? (
                                                                            <Button variant="primary" block disabled>You cannot buy your own Cube</Button>
                                                                        ) : (
                                                                            new Date() < new Date(expiresAt) ? (
                                                                                <Button variant="primary" block onClick={(e) => BuyCube(e)}>Buy Cube</Button>
                                                                            ) : (
                                                                                <Button variant="primary" block disabled>Sale Ended</Button>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <Button variant="primary" block disabled>Buy Cube</Button>
                                                                    )
                                                                )}

                                                            </>
                                                        )}

                                                    </Row>
                                                </div>


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
                                                {/* <Accordion>
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
                                                </Accordion> */}
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
            <ConfirmBuyCubeModal balance={balance} salePrice={cubeData.SalePrice} show={openBuyCubeModal} handleClose={handleCloseBuyCubeModal} ConfirmBuyCube={ConfirmBuyCube} />
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

export default SaleCubeNFTs;
