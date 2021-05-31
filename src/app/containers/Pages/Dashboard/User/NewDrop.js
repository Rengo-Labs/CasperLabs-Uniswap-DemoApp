import { Avatar, CardHeader, Grid } from '@material-ui/core/';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import Cookies from "js-cookie";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Scrollbars } from 'react-custom-scrollbars';
import DateTimePicker from 'react-datetime-picker';
import Web3 from 'web3';
import r1 from '../../../../assets/img/patients/patient.jpg';
import CreateAuctionContract from '../../../../components/blockchain/Abis/CreateAuctionContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import CubeComponent1 from '../../../../components/Cube/CubeComponent1';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';


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
    const [startTimeStamp, setStartTimeStamp] = useState(startTime.getTime() / 1000);
    const [endTimeStamp, setEndTimeStamp] = useState(endTime.getTime() / 1000);
    const [inputList, setInputList] = useState([]);
    const [imageData, setImageData] = useState([]);
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [image, setImage] = useState(r1);
    let [isUploading, setIsUploading] = useState();
    let [isSaving, setIsSaving] = useState(false);
    let [minimumBid, setMinimumBid] = useState();
    let [bidDelta, setBidDelta] = useState();
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
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios.get("/token/TokenIdsnotonauction").then(
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
                if (error.response.data !== undefined) {
                    if (error.response.data === "Unauthorized access (invalid token) !!") {
                        Cookies.remove("Authorization");
                        localStorage.removeItem("Address")
                        window.location.reload();
                    }
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
            mySeason: "",
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
        });// eslint-disable-next-line
    }, []);
    const handleRemoveClick = (index, newCube) => {
        console.log("index", index);
        console.log("inputList", types);

        const list = [...types];
        console.log("list", list);
        list.splice(index, 1);
        setInputList(inputList => [...inputList, newCube])
        setTypes(list);
    };
    const handleAddClick = (value) => {

        setTypes([...types, value]);
        var index = inputList.findIndex(i => i._id === value._id);
        setTypesImages([...typesImages, imageData[index]])
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
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
            const address = Addresses.AuctionAddress;
            const abi = CreateAuctionContract;
            let tokensId = [];
            for (let i = 0; i < types.length; i++) {
                tokensId.push(types[i]._id);
            }
            if (tokensId.length === 0) {
                let variant = "error";
                enqueueSnackbar('Please Select Cubes to create drop', { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (name === "") {
                let variant = "error";
                enqueueSnackbar("Name of the Drop Cannot be Empty.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (description === "") {
                let variant = "error";
                enqueueSnackbar("Description of the Drop Cannot be Empty.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (image === r1) {
                let variant = "error";
                enqueueSnackbar("Please Select title image for Drop to continue.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (new Date(startTime) === new Date(endTime)) {
                let variant = "error";
                enqueueSnackbar("Auction cannot be Start and End on same time.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (new Date(startTime) > new Date(endTime)) {
                let variant = "error";
                enqueueSnackbar("Auction End time must be greater than Start time.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (minimumBid === undefined || minimumBid === null) {
                let variant = "error";
                enqueueSnackbar("Please Enter minimum bid.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else if (bidDelta === undefined || bidDelta === null) {
                let variant = "error";
                enqueueSnackbar("Please Enter Bid Delta.", { variant });
                setIsSaving(false);
                handleCloseBackdrop();
            } else {
                let tokenId = [];
                for (let i = 0; i < types.length; i++) {
                    tokenId.push(types[i].tokenId);
                }
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
                        setIsSaving(false);
                        return;
                    }
                })
                console.log("receipt", receipt);
                console.log("receipt.events.Transfer.returnValues.tokenId", receipt.events.New_Auction.returnValues.dropId);
                let dropId = receipt.events.New_Auction.returnValues.dropId;
                let DropData = {
                    tokenId: tokensId,
                    dropId: dropId,
                    AuctionStartsAt: startTime,
                    AuctionEndsAt: endTime,
                    MinimumBid: minimumBid * 10 ** 18,
                    bidDelta: bidDelta * 10 ** 18,
                    title: name,
                    description: description,
                    image: image
                }
                console.log("cubeData", DropData);
                axios.post("/drop/createdrop", DropData).then(
                    (response) => {
                        console.log('response', response);
                        setIsSaving(false);
                        setStartTime(new Date());
                        setEndTime(new Date());
                        setName("");
                        setMinimumBid();
                        setDescription("");
                        setTypes([]);
                        setTypesImages([])
                        setMinimumBid(0);
                        setBidDelta(0);
                        setImage(r1);
                        handleCloseBackdrop();
                        let variant = "success";
                        enqueueSnackbar('Drop Created Successfully.', { variant });
                    },
                    (error) => {
                        if (process.env.NODE_ENV === "development") {
                            console.log(error);
                            console.log(error.response);
                        }
                        handleCloseBackdrop();

                        setIsSaving(false);
                        let variant = "error";
                        enqueueSnackbar('Unable to Create Drop.', { variant });
                    }
                );
            }
        }
    };
    let onChangeFile = (e) => {
        setIsUploading(true);
        let imageNFT = e.target.files[0]
        let fileData = new FormData();
        fileData.append("image", imageNFT);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setImage(response.data.url);
                setIsUploading(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploading(false);
                let variant = "error";
                enqueueSnackbar('Unable to Upload Image to S3 .', { variant });
            }
        );
    }
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
                                        getOptionLabel={(option) =>
                                            option.title + ',' + option.SalePrice / 10 ** 18
                                        }
                                        onChange={(event, value) => {
                                            if (value !== null) {
                                                console.log(value, event);
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
                                    <label>Drop Name</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            placeholder="Enter Name of Drop"
                                            className="form-control"
                                            onChange={(e) => {
                                                setName(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Drop Description</label>
                                        <textarea
                                            type="text"
                                            required
                                            rows="4"
                                            value={description}
                                            placeholder="Enter Description of Drop"
                                            className="form-control"
                                            onChange={(e) => {
                                                setDescription(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Select Title Image</label>
                                        <div className="filter-widget">
                                            <div className="form-group">
                                                <div className="change-avatar">
                                                    <div className="profile-img">
                                                        <div
                                                            style={{
                                                                background: "#E9ECEF",
                                                                width: "100px",
                                                                height: "100px",
                                                            }}
                                                        >
                                                            <img src={image} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            {isUploading ? (
                                                                <div className="text-center">
                                                                    <Spinner
                                                                        animation="border"
                                                                        role="status"
                                                                        style={{ color: "#fff" }}
                                                                    >
                                                                    </Spinner>
                                                                </div>
                                                            ) : (
                                                                <span><i className="fa fa-upload"></i>Upload photo</span>
                                                            )}

                                                            <input
                                                                name="sampleFile"
                                                                type="file"
                                                                className="upload"
                                                                accept=".png,.jpg,.jpeg,.gif"
                                                                onChange={onChangeFile}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">Allowed JPG, JPEG, PNG, GIF. Max size of 5MB</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Auction Starts At</label>
                                    <div className="form-group">
                                        <DateTimePicker
                                            className="form-control"
                                            onChange={(e) => {
                                                console.log(e);
                                                console.log("e.getTime()", Math.round(e.getTime() / 1000));
                                                setStartTimeStamp(Math.round(e.getTime() / 1000));
                                                setStartTime(e)
                                            }}
                                            value={startTime}
                                        />
                                    </div>
                                    <label>Auction Ends At</label>
                                    <div className="form-group">
                                        <DateTimePicker
                                            className="form-control"
                                            onChange={(e) => {
                                                console.log(e);
                                                console.log("e.getTime()", Math.round(e.getTime() / 1000));
                                                setEndTimeStamp(Math.round(e.getTime() / 1000));
                                                setEndTime(e)
                                            }}
                                            value={endTime}
                                        />
                                    </div>
                                    <label>Minimum Bid (WETH)</label>
                                    <div className="form-group">
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                required
                                                value={minimumBid}
                                                className="form-control"
                                                onChange={(e) => {
                                                    if (e.target.value > 0) {
                                                        setMinimumBid(e.target.value);
                                                    } else {
                                                        setMinimumBid(0);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <label>Bid Delta (WETH)</label>
                                    <div className="form-group">
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={bidDelta}
                                                className="form-control"
                                                onChange={(e) => {
                                                    if (e.target.value > 0) {
                                                        setBidDelta(e.target.value);
                                                    } else {
                                                        setBidDelta(0);
                                                    }
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
                            <Scrollbars style={{ height: 900 }}>
                                <div className="form-group">
                                    <div >
                                        <Grid
                                            container
                                            spacing={3}
                                            direction="row"
                                            justify="flex-start"
                                        >
                                            {types.map((i, index) => (
                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                    <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                className={classes.media}
                                                                // image={img}
                                                                title=""
                                                            >
                                                                <CubeComponent1 data={typesImages} index={index}/>
                                                            </CardMedia>
                                                            <CardContent>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Cube Title: </strong>{i.title}
                                                                </Typography>

                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Cube Description: </strong>{i.description}
                                                                </Typography>

                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Sale Price: </strong>{i.SalePrice / 10 ** 18} ETH
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
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleRemoveClick(index, i);
                                                                }}
                                                                className="btn btn-sm bg-danger-light btn-block"
                                                            >
                                                                Remove NFT
    </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid >
                                            ))}
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
                            style={{ color: "#ff0000" }}
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
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>

    );
}

export default NewDrop;
