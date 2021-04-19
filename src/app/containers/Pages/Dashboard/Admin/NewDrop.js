import { Avatar, CardHeader, Grid } from '@material-ui/core/';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import Cookies from "js-cookie";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateCubeContract from '../../../../components/blockchain/Abis/CreateCubeContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';

import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Scrollbars } from 'react-custom-scrollbars';
import DateTimePicker from 'react-datetime-picker';
import Web3 from 'web3';
import r1 from '../../../../assets/img/patients/patient.jpg';
import ipfs from '../../../../components/IPFS/ipfs';



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 300,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    badge: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    card: {
        minWidth: 250,
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



function NewDrop(props) {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [inputList, setInputList] = useState([]);
    const [imageData, setImageData] = useState([]);


    // { id: 0, name: "Robot", price: "20" }, { id: 1, name: "Robot Cube", price: "2" }, { id: 2, name: "Cube", price: "15" }
    let [isSaving, setIsSaving] = useState(false);
    let [minimumBid, setMinimumBid] = useState();

    let [type, setType] = useState();
    let [types, setTypes] = useState([]);
    const [typesImages, setTypesImages] = useState([]);
    const [network, setNetwork] = useState("");

    const [showNetworkModal, setShowNetworkModal] = useState(false);
    const handleCloseNetworkModal = () => setShowNetworkModal(false);
    const handleShowNetworkModal = () => setShowNetworkModal(true);

    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };

    let getMyCubes = () => {
        axios.get("/token/TokenIds").then(
            (response) => {
                console.log("response", response);
                setInputList(response.data.tokensdata);
                setImageData(response.data.nftsdata);
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
            })
    }
    useEffect(() => {
        getMyCubes();
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            newDrop: "active",
            newSupefNFT: "",
            myCubes: "",
            myDrops: "",
            myNFTs: "",
            newCollection: "",
            orders: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newRandomDrop: ""
        });
    }, []);
    const handleRemoveClick = (index) => {
        console.log("index", index);
        console.log("inputList", types);

        const list = [...types];
        console.log("list", list);
        list.splice(index, 1);

        setTypes(list);
    };
    const handleAddClick = (value) => {

        setTypes([...types, value]);
        var index = inputList.findIndex(i => i._id === value._id);
        setTypesImages([...typesImages, imageData[index]])
        setType("");
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

    const handleSubmitEvent = async (e) => {
        e.preventDefault();

        setIsSaving(true);

        let jwt = Cookies.get("Authorization");
        let jwtDecoded = jwtDecode(jwt);
        let exporter = jwtDecoded.id;

        await loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const network = await web3.eth.net.getNetworkType()
        if (network !== 'ropsten') {
            setNetwork(network);
            setIsSaving(false);
            handleShowNetworkModal();
        }
        else {
            handleShowBackdrop();
            const address = Addresses.CreateCubeAddress;
            const abi = CreateCubeContract;

            let tokenId = [];
            for (let i = 0; i < types.length; i++) {
                tokenId.push(types[i].tokenId);
            }
            // let uriData = {
            //     title: name,
            //     description: description,
            //     nftids: nftIds,
            //     ownermusicfile: musicOwner,
            //     nonownermusicfile: musicNonOwner,
            //     MusicArtistName: artist,
            //     MusicArtistAbout: aboutTheTrack,
            //     MusicArtistProfile: artistImage,
            //     SalePrice: salePrice,
            // }

            var myContractInstance = await new web3.eth.Contract(abi, address);
            console.log("myContractInstance", myContractInstance);
            await myContractInstance.methods.Create_cube(startTime, endTime, minimumBid, tokenId).send({ from: accounts[0] }, (err, response) => {
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
                    let ids = receipt.events.Transfer.returnValues.tokenId;
                    let tokensId = [];
                    handleCloseBackdrop();
                    for (let i = 0; i < types.length; i++) {
                        tokensId.push(types[i]._id);
                    }
                    let DropData = {
                        tokenId: tokensId,
                        AuctionStartsAt: startTime,
                        AuctionEndsAt: endTime,
                        MinimumBid: minimumBid
                    }
                    console.log("cubeData", DropData);
                    axios.post("/drop/createdrop",DropData).then(
                        (response) => {
                            console.log('response', response);
                            setIsSaving(false);

                            let variant = "success";
                            enqueueSnackbar('Cube Created Successfully.', { variant });
                        },
                        (error) => {
                            if (process.env.NODE_ENV === "development") {
                                console.log(error);
                                console.log(error.response);
                            }
                            setIsSaving(false);
                            let variant = "error";
                            enqueueSnackbar('Unable to Create Cube.', { variant });
                        }
                    );
                })
        }

    };
    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">New Drop</li>
            </ul>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <form onSubmit={handleSubmitEvent}>
                            <div className="form-group">

                                <label>Select Cubes</label>
                                <div className="filter-widget">
                                    <Autocomplete
                                        id="combo-dox-demo"
                                        required
                                        options={inputList}
                                        // value={type}
                                        // disabled={isDisabledImporter}
                                        getOptionLabel={(option) =>
                                            option.title + ',' + option.SalePrice
                                        }
                                        onChange={(event, value) => {
                                            if (value == null)
                                                setType("");
                                            else {
                                                console.log(value, event);
                                                setType(value.name)
                                                handleAddClick(value);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Cubes"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Auction Starts At</label>
                                    <div className="form-group">
                                        <DateTimePicker
                                            className="form-control"
                                            onChange={setStartTime}
                                            value={startTime}
                                        />
                                    </div>
                                    <label>Auction Ends At</label>
                                    <div className="form-group">
                                        <DateTimePicker
                                            className="form-control"
                                            onChange={setEndTime}
                                            value={endTime}
                                        />
                                    </div>
                                    <label>Minimum Bid</label>
                                    <div className="form-group">
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                placeholder="Enter Total Supply"
                                                required
                                                value={minimumBid}
                                                placeholder=""
                                                className="form-control"
                                                onChange={(e) => {
                                                    setMinimumBid(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-12 col-lg-6">
                        {types.length > 0 ? (
                            <Scrollbars style={{ height: 650 }}>
                                {/* <!-- Change Password Form --> */}
                                <div className="form-group">
                                    <div >
                                        <Grid
                                            container
                                            spacing={3}
                                            direction="row"
                                            justify="flex-start"
                                        // alignItems="flex-start"
                                        >
                                            {types.map((i, index) => (
                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                    <Card className={classes.root}>
                                                        {/* style={{ height: "100%" }} variant="outlined" */}
                                                        <CardActionArea>

                                                            <CardMedia
                                                                className={classes.media}
                                                                // image={img}
                                                                title=""
                                                            >
                                                                <div class="wrapper">
                                                                    <div class="cube-box">
                                                                        {typesImages[index].map((j, jindex) => (
                                                                            <>
                                                                                {/* {console.log(j)} */}
                                                                                <img src={j.artwork} style={{ border: j.type === "Mastercraft" ? '4px solid #ff0000' : j.type === "Legendary" ? '4px solid #FFD700' : j.type === "Epic" ? '4px solid #9400D3' : j.type === "Rare" ? '4px solid #0000FF' : j.type === "Uncommon" ? '4px solid #008000' : j.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                                                            </>
                                                                        ))}
                                                                        {new Array(6 - typesImages.length).fill(0).map((_, index) => (
                                                                            < img src={r1} alt="" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </CardMedia>
                                                            <CardContent>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Cube Description: </strong>{i.description}
                                                                </Typography>

                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Sale Price: </strong>{i.SalePrice}
                                                                </Typography>
                                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Music Artist</Typography>
                                                                <CardHeader
                                                                    avatar={<Avatar src={i.MusicArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                                    title={i.MusicArtistName}
                                                                    subheader={i.MusicArtistAbout}
                                                                />
                                                            </CardContent>
                                                        </CardActionArea>
                                                        <CardActions>

                                                        </CardActions>
                                                    </Card>
                                                </Grid >
                                            ))}
                                            {/* {types.map((data, index) =>
                                                <NewNFTCards key={index} index={index} data={data} handleRemoveClick={handleRemoveClick}></NewNFTCards>
                                            )} */}
                                        </Grid>
                                    </div>
                                </div>
                            </Scrollbars>
                        ) : (null)}
                    </div>

                </div>
                {isSaving ? (
                    <div className="text-center">
                        <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#00d0f1" }}
                        >
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className="submit-section">
                        <button type="button" onClick={handleSubmitEvent} className="btn submit-btn">
                            Create Drop
                  </button>
                    </div>
                )}
            </div>
            <NetworkErrorModal
                show={showNetworkModal}
                handleClose={handleCloseNetworkModal}
                network={network}
            >
            </NetworkErrorModal>
            <Backdrop className={classes.backdrop} open={open} onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>

    );
}

export default NewDrop;
