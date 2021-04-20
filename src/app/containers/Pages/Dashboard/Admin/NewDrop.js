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
    const [startTimeStamp, setStartTimeStamp] = useState(startTime.getTime());
    const [endTimeStamp, setEndTimeStamp] = useState(endTime.getTime());
    const [inputList, setInputList] = useState([]);
    const [imageData, setImageData] = useState([]);
    const [error, setError] = useState("");
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [image, setImage] = useState(r1);

    let [isUploading, setIsUploading] = useState();
    // { id: 0, name: "Robot", price: "20" }, { id: 1, name: "Robot Cube", price: "2" }, { id: 2, name: "Cube", price: "15" }
    let [isSaving, setIsSaving] = useState(false);
    let [minimumBid, setMinimumBid] = useState();
    let [bidDelta, setBidDelta] = useState();


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
            // const address = Addresses.CreateCubeAddress;
            // const abi = CreateCubeContract;

            // let tokenId = [];
            // for (let i = 0; i < types.length; i++) {
            //     tokenId.push(types[i].tokenId);
            // }

            // var myContractInstance = await new web3.eth.Contract(abi, address);
            // console.log("myContractInstance", myContractInstance);
            // await myContractInstance.methods.Create_cube(startTime, endTime, minimumBid, tokenId).send({ from: accounts[0] }, (err, response) => {
            //     console.log('get transaction', err, response);
            //     if (err !== null) {
            //         console.log("err", err);
            //         let variant = "error";
            //         enqueueSnackbar('User Canceled Transaction', { variant });
            //         handleCloseBackdrop();
            //         setIsSaving(false);
            //     }
            // })
            //     .on('receipt', (receipt) => {
            //         console.log("receipt", receipt);
            //         console.log("receipt.events.Transfer.returnValues.tokenId", receipt.events.Transfer.returnValues.tokenId);
            //         let ids = receipt.events.Transfer.returnValues.tokenId;
            let tokensId = [];
            handleCloseBackdrop();
            for (let i = 0; i < types.length; i++) {
                tokensId.push(types[i]._id);
            }


            if (tokensId.length === 0) {
                let variant = "error";
                enqueueSnackbar('Please Select Cubes to create drop', { variant });
                setIsSaving(false);

            } else if (name === "") {
                let variant = "error";
                enqueueSnackbar("Name of the Drop Cannot be Empty.", { variant });
                setIsSaving(false);
            } else if (description === "") {
                let variant = "error";
                enqueueSnackbar("Description of the Drop Cannot be Empty.", { variant });
                setIsSaving(false);
            } else if (image === r1) {
                let variant = "error";
                enqueueSnackbar("Please Select title image for Drop to continue.", { variant });
                setIsSaving(false);
            } else if (new Date(startTime) === new Date(endTime)) {
                let variant = "error";
                enqueueSnackbar("Auction cannot be Start and End on same time.", { variant });
                setIsSaving(false);
            } else if (new Date(startTime) > new Date(endTime)) {
                let variant = "error";
                enqueueSnackbar("Auction End time must be greater than Start time.", { variant });
                setIsSaving(false);
            }
            else if (minimumBid === undefined || minimumBid === null) {
                // console.log(startTime, endTime);
                let variant = "error";
                enqueueSnackbar("Please Enter minimum bid.", { variant });
                setIsSaving(false);
            }
            else if (bidDelta === undefined || bidDelta === null) {
                let variant = "error";
                enqueueSnackbar("Please Enter Bid Delta.", { variant });
                setIsSaving(false);
            }
            else {
                let DropData = {
                    tokenId: tokensId,
                    AuctionStartsAt: startTime,
                    AuctionEndsAt: endTime,
                    MinimumBid: minimumBid,
                    bidDelta: bidDelta,
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
                        setDescription("");
                        setMinimumBid();
                        setBidDelta();
                        setImage(r1);
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
                // })
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
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
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
                                                setStartTimeStamp(e.getTime());
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
                                                setEndTimeStamp(e.getTime());
                                                setEndTime(e)
                                            }}
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
                                    <label>Bid Delta</label>
                                    <div className="form-group">
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                placeholder=""
                                                required
                                                value={bidDelta}
                                                placeholder=""
                                                className="form-control"
                                                onChange={(e) => {
                                                    setBidDelta(e.target.value);
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
