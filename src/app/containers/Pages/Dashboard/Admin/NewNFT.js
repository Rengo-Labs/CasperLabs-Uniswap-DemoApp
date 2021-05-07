import { Grid } from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Web3 from 'web3';
import { Scrollbars } from 'react-custom-scrollbars';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import r1 from '../../../../assets/img/patients/patient.jpg';
// import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ipfs from '../../../../components/IPFS/ipfs';
import CreateNFTContract from '../../../../components/blockchain/Abis/CreateNFTContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import axios from 'axios';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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



function NewNFT(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    let [network, setNetwork] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };

    const [tokenList, setTokenList] = useState([]);
    let [isSaving, setIsSaving] = useState(false);
    let [name, setName] = useState("");
    let [website, setWebsite] = useState("");
    let [aboutTheArt, setAboutTheArt] = useState("");
    let [ipfsHash, setIpfsHash] = useState(null);
    let [description, setDescription] = useState("");
    let [inspirationForThePiece, setInspirationForThePiece] = useState("");
    let [executiveInspirationForThePiece, setExecutiveInspirationForThePiece] = useState("");
    let [fanInspirationForThePiece, setFanInspirationForThePiece] = useState("");

    let [rarities, setRarities] = useState(["Mastercraft", "Legendary", "Epic", "Rare", "Uncommon", "Common"]);
    let [supplyType, setSupplyType] = useState("Single");
    let [imageArtistTypes, setImageArtistTypes] = useState([]);
    let [executiveProducerTypes, setExecutiveProducerTypes] = useState([]);
    let [fans, setFanTypes] = useState([]);
    let [producerTypes, setProducerTypes] = useState([]);

    let [imageArtist, setImageArtist] = useState('');
    let [collectionTypes, setCollectionTypes] = useState([]);
    let [collectionType, setCollectionType] = useState("New");
    let [collection, setCollection] = useState('');

    let [producer, setProducer] = useState('');
    let [tokenSupply, setTokenSupply] = useState("1");
    let [isUploadingIPFS, setIsUploadingIPFS] = useState(false);
    let [isUploadingExecutiveProducer, setIsUploadingExecutiveProducer] = useState(false);
    let [isUploadingProducer, setIsUploadingProducer] = useState(false);
    let [isUploadingFan, setIsUploadingFan] = useState(false);
    let [isUploadingImageArtist, setIsUploadingImageArtist] = useState(false);
    let [rarity, setRarity] = useState('');
    let [fan, setFan] = useState('');
    let [other, setOther] = useState('');
    let [image, setImage] = useState(r1);
    let [artistImage, setArtistImage] = useState(r1);
    let [producerImage, setProducerImage] = useState(r1);
    let [executiveProducerImage, setExecutiveProducerImage] = useState(r1);
    let [fanImage, setFanImage] = useState(r1);
    let [imageArtistType, setImageArtistType] = useState("New");
    let [producerType, setProducerType] = useState("New");
    let [executiveProducerType, setExecutiveProducerType] = useState("New");
    let [fanType, setFanType] = useState("New");
    let [collectionId, setCollectionId] = useState('');

    let [executiveProducer, setExecutiveProducer] = useState('');



    let getProfileData = () => {
        axios.get("/profile/createprofile").then(
            (response) => {
                console.log("response", response);
                setImageArtistTypes(response.data.Imageartist);
                setProducerTypes(response.data.Producer);
                setFanTypes(response.data.Fan);
                setExecutiveProducerTypes(response.data.ExecutiveProducer);
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
    let getCollections = () => {
        axios.get("/collection/collections").then(
            (response) => {
                console.log("response", response);
                setCollectionTypes(response.data.Collectiondata)
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
        getProfileData();
        getCollections();

        props.setActiveTab({
            dashboard: "",
            newNFT: "active",
            orders: "",
            settings: "",
            myNFTs: "",
            mySeason: "",
            myDrops: "",
            myCubes: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "",
            newRandomDrop: "",
        });
    }, []);
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
    const handleSubmitEvent = async (event) => {
        event.preventDefault();
        setIsSaving(true);

        if (tokenList.length === 0) {

            let variant = "error";
            enqueueSnackbar('Add Nfts to Queue before Creation.', { variant });
            setIsSaving(false);
        }
        else {


            let jwt = Cookies.get("Authorization");
            let jwtDecoded = jwtDecode(jwt);
            let exporter = jwtDecoded.id;
            let fileData = new FormData();

            await loadWeb3();
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const network = await web3.eth.net.getNetworkType()
            if (network !== 'ropsten') {
                setNetwork(network);
                setIsSaving(false);
                handleShow();
            }
            else {
                handleShowBackdrop();
                const address = Addresses.CreateNftAddress;
                const abi = CreateNFTContract;
                let totalImages = tokenList.length;
                let AmountofNFTs = [];
                let IPFsHashes = [];
                for (let i = 0; i < tokenList.length; i++) {
                    AmountofNFTs.push(tokenList[i].tokensupply);
                    IPFsHashes.push(tokenList[i].ipfsHash);
                }
                console.log("AmountofNFTs", AmountofNFTs);
                console.log("IPFsHashes", IPFsHashes);

                var myContractInstance = await new web3.eth.Contract(abi, address);
                console.log("myContractInstance", myContractInstance);
                await myContractInstance.methods.new_batch(totalImages, AmountofNFTs, IPFsHashes).send({ from: accounts[0] }, (err, response) => {
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
                        console.log("receipt", receipt.events.TransferBatch.returnValues.ids);
                        let ids = receipt.events.TransferBatch.returnValues.ids;
                        for (let i = 0; i < tokenList.length; i++) {
                            tokenList[i].nftId = ids[i];
                        }

                        let Data = {
                            nftdata: tokenList
                        }
                        console.log("Data", Data);
                        axios.post("/nft/createnft", Data).then(
                            (response) => {
                                console.log("response", response);
                                let variant = "success";
                                enqueueSnackbar('Nfts Created Successfully.', { variant });
                                setTokenList([]);
                                setIpfsHash("");
                                setImage(r1);
                                setName("");
                                setDescription("");
                                setRarity("");
                                setTokenSupply(1);
                                setImageArtist("");
                                setAboutTheArt("");
                                setWebsite("");
                                setArtistImage(r1);
                                setProducer("");
                                setInspirationForThePiece("");
                                setProducerImage(r1);
                                setExecutiveProducer("");
                                setExecutiveInspirationForThePiece("");
                                setExecutiveProducerImage(r1);
                                setFan("");
                                setFanInspirationForThePiece("");
                                setFanImage(r1);
                                setOther("");
                                setCollection("");
                                setCollectionType("New");
                                setImageArtistType("New");
                                setProducerType("New");
                                setExecutiveProducerType("New");
                                setFanType("New");
                                setSupplyType("Single");
                                setCollectionId("");
                                handleCloseBackdrop();
                                setIsSaving(false);
                            },
                            (error) => {
                                if (process.env.NODE_ENV === "development") {
                                    console.log(error);
                                    console.log(error.response);
                                }

                                let variant = "error";
                                enqueueSnackbar('Unable to Create Nfts.', { variant });

                                handleCloseBackdrop();
                                setIsSaving(false);
                            })
                    })
            }
        }
    };
    const handleRemoveClick = (index) => {
        const list = [...tokenList];
        list.splice(index, 1);
        setTokenList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        if (image === r1) {
            let variant = "error";
            enqueueSnackbar('Please Upload Artwork Photo', { variant });
        } else if (name === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Artwork Name', { variant });
        } else if (description === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Artwork Description', { variant });
        } else if (rarity === "") {
            let variant = "error";
            enqueueSnackbar('Please Select Artwork Rarity', { variant });
        } else if (tokenSupply === "" || tokenSupply === undefined || tokenSupply === null) {
            let variant = "error";
            enqueueSnackbar('Token Supply cannot be Empty', { variant });
        } else if (tokenSupply < 0) {
            let variant = "error";
            enqueueSnackbar('Token Supply cannot be Negative', { variant });
        } else if (tokenSupply < 0) {
            let variant = "error";
            enqueueSnackbar('Token Supply cannot be Negative', { variant });
        } else if (imageArtist === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Image Artist Name', { variant });
        } else if (aboutTheArt === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter About the Art', { variant });
        } else if (artistImage === r1) {
            let variant = "error";
            enqueueSnackbar('Please Select Image Artist Image', { variant });
        } else if (website === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Website of Image Artist', { variant });
        } else if (producer === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Producer Name', { variant });
        } else if (producerImage === r1) {
            let variant = "error";
            enqueueSnackbar('Please Select Producer Image', { variant });
        } else if (inspirationForThePiece === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Producer Inspiration For The Piece', { variant });
        } else if (executiveProducer === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Executive Producer Name', { variant });
        } else if (executiveProducerImage === r1) {
            let variant = "error";
            enqueueSnackbar('Please Select Executive Producer Image', { variant });
        } else if (executiveInspirationForThePiece === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Executive Producer Inspiration For The Piece', { variant });
        } else if (fan === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Fan Name', { variant });
        } else if (fanImage === r1) {
            let variant = "error";
            enqueueSnackbar('Please Select Fan Image', { variant });
        } else if (fanInspirationForThePiece === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Fan Inspiration For The Piece', { variant });
        } else if (other === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter other Input field', { variant });
        } else if (collection === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Collection Name', { variant });
        }
        else {
            setTokenList([...tokenList, {
                ipfsHash: ipfsHash,
                artwork: image,
                title: name,
                description: description,
                type: rarity,
                tokensupply: tokenSupply,
                ImageArtistName: imageArtist,
                ImageArtistAbout: aboutTheArt,
                ImageArtistWebsite: website,
                ImageArtistProfile: artistImage,
                ProducerName: producer,
                ProducerInspiration: inspirationForThePiece,
                ProducerProfile: producerImage,
                ExecutiveProducerName: executiveProducer,
                ExecutiveProducerInspiration: executiveInspirationForThePiece,
                ExecutiveProducerProfile: executiveProducerImage,
                FanName: fan,
                FanInspiration: fanInspirationForThePiece,
                FanProfile: fanImage,
                other: other,
                collectiontitle: collection,
                collectiontype: collectionType,
                imageartisttype: imageArtistType,
                producertype: producerType,
                executiveproducertype: executiveProducerType,
                fantype: fanType,
                supplytype: supplyType,
                collectionId: collectionId,
            }]);
            setIpfsHash("");
            setImage(r1);
            setName("");
            setDescription("");
            setRarity("");
            setTokenSupply(1);
            setImageArtist("");
            setAboutTheArt("");
            setWebsite("");
            setArtistImage(r1);
            setProducer("");
            setInspirationForThePiece("");
            setProducerImage(r1);
            setExecutiveProducer("");
            setExecutiveInspirationForThePiece("");
            setExecutiveProducerImage(r1);
            setFan("");
            setFanInspirationForThePiece("");
            setFanImage(r1);
            setOther("");
            setCollection("");
            setCollectionType("New");
            setImageArtistType("New");
            setProducerType("New");
            setExecutiveProducerType("New");
            setFanType("New");
            setSupplyType("Single");
            setCollectionId("");
        }
    };

    let onChangeFile = (e) => {
        setIsUploadingIPFS(true);
        const reader = new window.FileReader();
        let imageNFT = e.target.files[0]
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = () => {
            // setBuffer(Buffer(reader.result));
            ipfs.add(Buffer(reader.result), async (err, result) => {
                if (err) {
                    console.log(err);
                    setIsUploadingIPFS(false);
                    let variant = "error";
                    enqueueSnackbar('Unable to Upload Image to IPFS ', { variant });
                    return
                }
                console.log("HASH", result[0].hash);

                setIpfsHash(result[0].hash);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to IPFS Successfully', { variant });
                // 
            })
        }
        // setIsUploadingIPFS(true);
        let fileData = new FormData();
        fileData.append("image", imageNFT);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setImage(response.data.url);
                setIsUploadingIPFS(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploadingIPFS(false);
                let variant = "error";
                enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

            }
        );

    }
    let onChangeSelfieHandler = (e) => {
        setIsUploadingImageArtist(true);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setArtistImage(response.data.url);
                setIsUploadingImageArtist(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploadingImageArtist(false);
                let variant = "error";
                enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

            }
        );
    }
    let onChangeProducerHandler = (e) => {
        setIsUploadingProducer(true);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setProducerImage(response.data.url);
                setIsUploadingProducer(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploadingProducer(false);
                let variant = "error";
                enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

            }
        );
    }
    let onChangeExecutiveProducerHandler = (e) => {
        setIsUploadingExecutiveProducer(true);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setExecutiveProducerImage(response.data.url);
                setIsUploadingExecutiveProducer(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploadingExecutiveProducer(false);
                let variant = "error";
                enqueueSnackbar('Unable to Upload Image to S3 .', { variant });

            }
        );
    }
    let onChangeFanHandler = (e) => {
        setIsUploadingFan(true);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setFanImage(response.data.url);
                setIsUploadingFan(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploadingFan(false);
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
                <li className="breadcrumb-item active">New NFT</li>
            </ul>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <form>
                            <div className="form-group">
                                <label>Select Artwork</label>
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
                                                    {isUploadingIPFS ? (
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


                                <div className="form-group">
                                    <label>Artwork</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            placeholder="Enter Name of NFT"
                                            className="form-control"
                                            onChange={(e) => {
                                                setName(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        {/* <label>About the Art</label> */}
                                        <textarea
                                            type="text"
                                            required
                                            rows="4"
                                            value={description}
                                            placeholder="Enter Description of NFT"
                                            className="form-control"
                                            onChange={(e) => {
                                                setDescription(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <label>Select Rarity</label>
                                    <div className="filter-widget">
                                        <Autocomplete
                                            id="combo-dox-demo"
                                            required
                                            options={rarities}
                                            // disabled={isDisabledImporter}
                                            getOptionLabel={(option) =>
                                                option
                                            }
                                            onChange={(event, value) => {
                                                if (value == null) setRarity("");
                                                else {
                                                    console.log(value);
                                                    setRarity(value)
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Rarity"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </div>
                                    <FormControl component="fieldset">
                                        <lable component="legend">Select Supply Type</lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="Single" onChange={() => {
                                                setSupplyType("Single");
                                                setTokenSupply(1);
                                            }} checked={supplyType === 'Single'} control={<Radio color="secondary" />} label="Single" />
                                            <FormControlLabel style={{ color: 'black' }} value="Variable Supply" onChange={() => {
                                                setSupplyType("Variable")
                                                setTokenSupply(0);
                                            }} checked={supplyType === 'Variable'} control={<Radio color="secondary" />} label="Variable Supply" />

                                        </RadioGroup>
                                    </FormControl>
                                    {supplyType === 'Single' ? (
                                        <div className="form-group">
                                            <label>Token Supply</label>
                                            <div className="filter-widget">
                                                <input
                                                    type="number"
                                                    required
                                                    value={tokenSupply}
                                                    placeholder=""
                                                    className="form-control"
                                                    disabled
                                                // onChange={(e) => {
                                                //     setTokenSupply(e.target.value);
                                                // }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <label>Token Supply</label>
                                            <div className="filter-widget">
                                                <input
                                                    type="number"
                                                    placeholder="Enter Token price(USD)"
                                                    required
                                                    value={tokenSupply}
                                                    placeholder=""
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setTokenSupply(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add Image Artist </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Image Artist" onChange={() => setImageArtistType("New")} checked={imageArtistType === 'New'} control={<Radio color="secondary" />} label="New Image Artist" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Image Artist" onChange={() => setImageArtistType("Existing")} checked={imageArtistType === 'Existing'} control={<Radio color="secondary" />} label="Existing Image Artist" />
                                        </RadioGroup>
                                    </FormControl>
                                    {imageArtistType === 'New' ? (
                                        <>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    required
                                                    value={imageArtist}
                                                    placeholder="Enter Image Artist Name"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setImageArtist(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                {/* <label>About the Track</label> */}
                                                <textarea
                                                    type="text"
                                                    required
                                                    rows="4"
                                                    value={aboutTheArt}
                                                    placeholder="About the Art"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setAboutTheArt(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <label className="focus-label">Image Artist Photo</label>
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
                                                            <img src={artistImage} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            {isUploadingImageArtist ? (
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
                                                                onChange={onChangeSelfieHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    required
                                                    value={website}
                                                    placeholder="Enter Website URL"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setWebsite(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-group">

                                            <label>Select Artist</label>
                                            <div className="filter-widget">
                                                <Autocomplete
                                                    id="combo-dox-demo"
                                                    required
                                                    options={imageArtistTypes}
                                                    // disabled={isDisabledImporter}
                                                    getOptionLabel={(option) =>
                                                        option.Name
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) {
                                                            setImageArtist("");
                                                            setWebsite("");
                                                            setAboutTheArt("");
                                                            setArtistImage("");
                                                        }
                                                        else {
                                                            console.log(value);
                                                            setImageArtist(value.Name);
                                                            setWebsite(value.Website);
                                                            setAboutTheArt(value.About);
                                                            setArtistImage(value.Profile);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Image Artists"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    )}
                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add Producer </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Producer" onChange={() => setProducerType("New")} checked={producerType === 'New'} control={<Radio color="secondary" />} label="New Producer" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Producer" onChange={() => setProducerType("Existing")} checked={producerType === 'Existing'} control={<Radio color="secondary" />} label="Existing Producer" />
                                        </RadioGroup>
                                    </FormControl>
                                    {producerType === 'New' ? (
                                        <>
                                            <div className="form-group">
                                                {/* <label>Producer</label> */}
                                                <input
                                                    type="text"
                                                    required
                                                    value={producer}
                                                    placeholder="Enter Producer Name"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setProducer(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <label className="focus-label">Producer Profile Photo</label>
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
                                                            <img src={producerImage} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            {isUploadingProducer ? (
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
                                                                onChange={onChangeProducerHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                {/* <label>Inspiration For the Piece</label> */}
                                                <textarea
                                                    type="text"
                                                    required
                                                    rows="4"
                                                    value={inspirationForThePiece}
                                                    placeholder="Inspiration For the Piece"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setInspirationForThePiece(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-group">

                                            <label>Select Producer</label>
                                            <div className="filter-widget">
                                                <Autocomplete
                                                    id="combo-dox-demo"
                                                    required
                                                    options={producerTypes}
                                                    // disabled={isDisabledImporter}
                                                    getOptionLabel={(option) =>
                                                        option.Name
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) {
                                                            setProducer("");
                                                            setInspirationForThePiece("");
                                                            setProducerImage("");
                                                        }
                                                        else {
                                                            console.log(value);
                                                            setProducer(value.Name);
                                                            setInspirationForThePiece(value.Inspiration);
                                                            setProducerImage(value.Profile);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Producers"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    )}

                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add Executive Producer </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Executive Producer" onChange={() => setExecutiveProducerType("New")} checked={executiveProducerType === 'New'} control={<Radio color="secondary" />} label="New Executive Producer" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Executive Producer" onChange={() => setExecutiveProducerType("Existing")} checked={executiveProducerType === 'Existing'} control={<Radio color="secondary" />} label="Existing Executive Producer" />
                                        </RadioGroup>
                                    </FormControl>
                                    {executiveProducerType === 'New' ? (
                                        <>
                                            <div className="form-group">
                                                {/* <label>Producer</label> */}
                                                <input
                                                    type="text"
                                                    required
                                                    value={executiveProducer}
                                                    placeholder="Enter Executive Producer Name"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setExecutiveProducer(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <label className="focus-label">Executive Producer Profile Photo</label>
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
                                                            <img src={executiveProducerImage} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            {isUploadingExecutiveProducer ? (
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
                                                                onChange={onChangeExecutiveProducerHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                {/* <label>Inspiration For the Piece</label> */}
                                                <textarea
                                                    type="text"
                                                    required
                                                    rows="4"
                                                    value={executiveInspirationForThePiece}
                                                    placeholder="Inspiration For the Piece"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setExecutiveInspirationForThePiece(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-group">

                                            <label>Select Executive Producer</label>
                                            <div className="filter-widget">
                                                <Autocomplete
                                                    id="combo-dox-demo"
                                                    required
                                                    options={executiveProducerTypes}
                                                    // disabled={isDisabledImporter}
                                                    getOptionLabel={(option) =>
                                                        option.Name
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setExecutiveProducer("");
                                                        else {
                                                            console.log(value);
                                                            setExecutiveProducer(value.Name);
                                                            setExecutiveInspirationForThePiece(value.Inspiration);
                                                            setExecutiveProducerImage(value.Profile);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Executive Producers"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    )}
                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add Fan </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Fan" onChange={() => setFanType("New")} checked={fanType === 'New'} control={<Radio color="secondary" />} label="New Fan" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Fan" onChange={() => setFanType("Existing")} checked={fanType === 'Existing'} control={<Radio color="secondary" />} label="Existing Fan" />
                                        </RadioGroup>
                                    </FormControl>

                                    {fanType === 'New' ? (
                                        <>
                                            <div className="form-group">
                                                {/* <label>Producer</label> */}
                                                <input
                                                    type="text"
                                                    required
                                                    value={fan}
                                                    placeholder="Enter Fan Name"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setFan(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <label className="focus-label">Fan Profile Photo</label>
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
                                                            <img src={fanImage} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >{isUploadingFan ? (
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
                                                                onChange={onChangeFanHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG, GIF. Max size of 5MB
                      </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                {/* <label>Inspiration For the Piece</label> */}
                                                <textarea
                                                    type="text"
                                                    required
                                                    rows="4"
                                                    value={fanInspirationForThePiece}
                                                    placeholder="Inspiration For the Piece"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setFanInspirationForThePiece(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-group">

                                            <label>Select Fan</label>
                                            <div className="filter-widget">
                                                <Autocomplete
                                                    id="combo-dox-demo"
                                                    required
                                                    options={fans}
                                                    // disabled={isDisabledImporter}
                                                    getOptionLabel={(option) =>
                                                        option.Name
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setFan("");
                                                        else {
                                                            console.log(value);
                                                            setFan(value.Name);
                                                            setFanImage(value.Profile);
                                                            setFanInspirationForThePiece(value.Inspiration);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Fans"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    )}
                                    <div className="form-group">
                                        <label>Other</label>
                                        <input
                                            type="text"
                                            required
                                            value={other}
                                            placeholder="Enter other"
                                            className="form-control"
                                            onChange={(e) => {
                                                setOther(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add in Collection </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Collection" onChange={() => setCollectionType("New")} checked={collectionType === 'New'} control={<Radio color="secondary" />} label="New Collection" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Collection" onChange={() => setCollectionType("Existing")} checked={collectionType === 'Existing'} control={<Radio color="secondary" />} label="Existing Collection" />
                                        </RadioGroup>
                                    </FormControl>
                                    {collectionType === 'New' ? (
                                        <div className="form-group">
                                            <label>New Collection</label>
                                            <input
                                                type="text"
                                                required
                                                value={collection}
                                                placeholder="Enter Collection Name"
                                                className="form-control"
                                                onChange={(e) => {
                                                    setCollection(e.target.value)
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="form-group">

                                            <label>Select Collection</label>
                                            <div className="filter-widget">
                                                <Autocomplete
                                                    id="combo-dox-demo"
                                                    required
                                                    options={collectionTypes}
                                                    // disabled={isDisabledImporter}
                                                    getOptionLabel={(option) =>
                                                        option.collectiontitle
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setCollection("");
                                                        else {
                                                            console.log(value);
                                                            setCollection(value.collectiontitle)
                                                            setCollectionId(value._id)
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Collections"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    )}



                                </div>

                                {/* {image === "" || name === "" || description === "" || tokenSupply === "" || imageArtist === "" || aboutTheArt === "" || website === "" || artistImage === "" || producer === "" || inspirationForThePiece === "" || producerImage === "" || executiveProducer === "" || executiveInspirationForThePiece === "" || executiveProducerImage === "" || fan === "" || fanInspirationForThePiece === "" || fanImage === "" || other === "" || collection === "" ? (
                                    <button
                                        className="btn"
                                        type="submit"
                                        disabled
                                    >
                                        <i className="fa fa-plus"></i> Add NFT to queue
                                    </button>
                                ) : ( */}
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={() => handleAddClick()}
                                >
                                    <i className="fa fa-plus"></i> Add NFT to queue
                                    </button>
                                {/* )} */}
                            </div>
                        </form>

                    </div>
                    <div className="col-md-12 col-lg-6">
                        {/* <!-- Change Password Form --> */}
                        <form >
                        <Scrollbars style={{ height: 1500 }}>
                        
                            <div className="form-group">
                                <div >
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                    // alignItems="flex-start"
                                    >
                                        {tokenList.map((i, index) => (

                                            <Grid item xs={12} sm={6} md={6} key={index}>
                                                <Card >
                                                    <CardHeader className="text-center"
                                                        title={i.title}
                                                    />
                                                    <CardMedia
                                                        style={{ height: "100%" }} variant="outlined" style={{ border: i.type === "Mastercraft" ? '4px solid #ff0000' : i.type === "Legendary" ? '4px solid #FFD700' : i.type === "Mastercraft" ? '4px solid ##ff0000' : i.type === "Epic" ? '4px solid #9400D3' : i.type === "Rare" ? '4px solid #0000FF' : i.type === "Uncommon" ? '4px solid #008000' : i.type === "Common" ? '4px solid #FFFFFF' : 'none' }}
                                                        className={classes.media}
                                                        image={i.artwork}

                                                        title="NFT Image"
                                                    />
                                                    <CardContent>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            <strong>Artwork Description: </strong>{i.description}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            <strong>Token Rarity: </strong>{i.type}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            <strong>Token Supply: </strong>{i.tokensupply}
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Image Artist</Typography>
                                                        <CardHeader
                                                            avatar={<Avatar src={i.ImageArtistProfile} aria-label="Artist" className={classes.avatar} />}
                                                            title={i.ImageArtistName}
                                                            subheader={i.ImageArtistAbout}
                                                        />
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            <strong>Website URL: </strong>{i.ImageArtistWebsite}
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Producer</Typography>
                                                        <CardHeader
                                                            avatar={<Avatar src={i.ProducerProfile} aria-label="Producer" className={classes.avatar} />}
                                                            title={i.ProducerName}
                                                            subheader={i.ProducerInspiration}
                                                        />
                                                        <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Executive Producer</Typography>
                                                        <CardHeader
                                                            avatar={<Avatar src={i.ExecutiveProducerProfile} aria-label="Executive Producer" className={classes.avatar} />}
                                                            title={i.ExecutiveProducerName}
                                                            subheader={i.ExecutiveProducerInspiration}
                                                        />
                                                        <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Fan</Typography>
                                                        <CardHeader
                                                            avatar={<Avatar src={i.FanProfile} aria-label="Fan" className={classes.avatar} />}
                                                            title={i.FanName}
                                                            subheader={i.FanInspiration}
                                                        />

                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            <strong>Other: </strong>{i.other}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            <strong>Collection: </strong>{i.collectiontitle}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>

                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRemoveClick(index);
                                                            }}
                                                            className="btn btn-sm bg-danger-light btn-block"

                                                        >
                                                            Remove NFT
    </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>

                                        ))}
                                    </Grid>
                                </div>
                            </div>
                            </Scrollbars>
                        </form>
                    </div>
                </div>
                {
                    isSaving ? (
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
                        // tokenList.length === 0 ? (
                        //     <div className="submit-section">
                        //         <button type="button" disabled className="btn submit-btn">
                        //             Batch create NFTs
                        // </button>
                        //     </div>
                        // ) : (
                        <div className="submit-section">
                            <button type="button" onClick={(e) => handleSubmitEvent(e)} className="btn submit-btn">
                                Batch create NFTs
                  </button>
                        </div>
                        // )

                    )
                }
            </div >
            <NetworkErrorModal
                show={show}
                handleClose={handleClose}
                network={network}
            >
            </NetworkErrorModal>
            <Backdrop className={classes.backdrop} open={open} onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default NewNFT;
