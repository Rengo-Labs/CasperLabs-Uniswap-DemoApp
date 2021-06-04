import {
    Card,
    CardContent, Grid
} from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from 'axios';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Scrollbars } from 'react-custom-scrollbars';
import Web3 from 'web3';
import logo from "../../../../assets/img/img-04.jpg";
// import CardContent from '@material-ui/core/CardContent';
import CreateCubeContract from '../../../../components/blockchain/Abis/CreateCubeContract.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import NewCubeComponent from '../../../../components/Cube/NewCubeComponent';
import ipfs from '../../../../components/IPFS/ipfs';
import NetworkErrorModal from '../../../../components/Modals/NetworkErrorModal';
import SixNFTsErrorModal from '../../../../components/Modals/SixNFTsErrorModal';

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
    media: {
        height: 0,
        paddingTop: '100%', // 16:9
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



function NewCube(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [tokenList, setTokenList] = useState([]);
    const [selectedNFTList, setSelectedNFTList] = useState([])
    let [isSaving, setIsSaving] = useState(false);
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [aboutTheTrack, setAboutTheTrack] = useState("");
    let [salePrice, setSalePrice] = useState();
    let [artistTypes, setArtistTypes] = useState([]);
    let [artist, setArtist] = useState('');
    let [artistId, setArtistId] = useState('');
    let [musicOwner, setMusicOwner] = useState("");
    let [musicNonOwner, setMusicNonOwner] = useState("");
    let [artistImage, setArtistImage] = useState(logo);
    let [network, setNetwork] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
    let getProfileData = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios.get("/profile/createprofile").then(
            (response) => {
                console.log("response", response);
                setArtistTypes(response.data.Musicartist);
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
    let uploadMusicOwnerHandler = (e, index) => {

        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setMusicOwner(response.data.url);
                let variant = "success";
                enqueueSnackbar('Audio Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                let variant = "error";
                enqueueSnackbar('Unable to Upload Audio to S3 .', { variant });

            }
        );
    };
    let uploadMusicNonOwnerHandler = (e, index) => {
        console.log(e);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setMusicNonOwner(response.data.url);
                let variant = "success";
                enqueueSnackbar('Audio Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                let variant = "error";
                enqueueSnackbar('Unable to Upload Audio to S3 .', { variant });
            }
        );
    };
    useEffect(() => {
        getMyNFTs();
        getProfileData();
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            newCube: "active",
            myCubes: "",
            mySeason: "",
            myNFTs: "",
            orders: "",
            myDrops: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newCollection: "",
            newRandomDrop: "",
        });// eslint-disable-next-line
    }, []);
    let getMyNFTs = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios.get("/nft/createnft").then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.NFTdata);
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
        console.log("exporter", exporter);
        if (selectedNFTList.length === 0) {
            let variant = "error";
            enqueueSnackbar('Please Select Nfts first', { variant });
            setIsSaving(false);
        } if (selectedNFTList.length < 6) {
            let variant = "error";
            enqueueSnackbar('Total Nfts Cannot be Less than 6', { variant });
            setIsSaving(false);
        } else if (name === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Cube Name', { variant });
            setIsSaving(false);
        } else if (description === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Cube Description', { variant });
            setIsSaving(false);
        } else if (salePrice === "" || salePrice === null || salePrice === undefined) {
            let variant = "error";
            enqueueSnackbar('Please Enter Cube Price', { variant });
            setIsSaving(false);
        } else if (salePrice < 0) {
            let variant = "error";
            enqueueSnackbar('Sale Price Cannot be Negative', { variant });
            setIsSaving(false);
        } else if (musicOwner === "") {
            let variant = "error";
            enqueueSnackbar('Please upload Owner Music File', { variant });
            setIsSaving(false);
        } else if (musicNonOwner === "") {
            let variant = "error";
            enqueueSnackbar('Please upload Non Owner Music File', { variant });
            setIsSaving(false);
        } else if (artist === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Music Artist Name', { variant });
            setIsSaving(false);
        } else if (artistImage === logo) {
            let variant = "error";
            enqueueSnackbar('Please Uplaod Music Artist Image', { variant });
            setIsSaving(false);
        } else if (aboutTheTrack === "") {
            let variant = "error";
            enqueueSnackbar('Please Enter Music Artist About the Track', { variant });
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
                handleShowNetworkModal();
            }
            else {
                handleShowBackdrop();
                const address = Addresses.CreateCubeAddress;
                const abi = CreateCubeContract;

                let nftIds = [];
                for (let i = 0; i < selectedNFTList.length; i++) {
                    nftIds.push(selectedNFTList[i].nftId);
                }
                let uriData = {
                    title: name,
                    description: description,
                    nftids: nftIds,
                    ownermusicfile: musicOwner,
                    nonownermusicfile: musicNonOwner,
                    MusicArtistName: artist,
                    MusicArtistAbout: aboutTheTrack,
                    MusicArtistProfile: artistImage,
                    SalePrice: salePrice * 10 ** 18,
                }
                const reader = new window.FileReader();
                const blob = new Blob([JSON.stringify(uriData, null, 2)], { type: 'application/json' });
                console.log("blob", blob);
                reader.readAsArrayBuffer(blob);
                reader.onloadend = () => {
                    ipfs.add(Buffer(reader.result), async (err, result) => {
                        if (err) {
                            console.log(err);
                            handleCloseBackdrop();
                            setIsSaving(false);
                            return
                        }
                        console.log("HASH", result[0].hash);

                        var myContractInstance = await new web3.eth.Contract(abi, address);
                        console.log("myContractInstance", myContractInstance);
                        await myContractInstance.methods.createCube(result[0].hash).send({ from: accounts[0] }, (err, response) => {
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
                                let nftId = [];
                                handleCloseBackdrop();
                                for (let i = 0; i < selectedNFTList.length; i++) {
                                    nftId.push(selectedNFTList[i]._id);
                                }
                                let cubeData = {
                                    tokenId: ids,
                                    title: name,
                                    description: description,
                                    nftids: nftId,
                                    ownermusicfile: musicOwner,
                                    nonownermusicfile: musicNonOwner,
                                    MusicArtistName: artist,
                                    MusicArtistId: artistId,
                                    MusicArtistAbout: aboutTheTrack,
                                    MusicArtistProfile: artistImage,
                                    SalePrice: salePrice * 10 ** 18,
                                    address: accounts[0]
                                }

                                axios.defaults.headers.common[
                                    "Authorization"
                                ] = `Bearer ${Cookies.get("Authorization")}`;
                                axios.post("/token/TokenIds", cubeData).then(
                                    (response) => {

                                        console.log('response', response);
                                        setIsSaving(false);
                                        setSelectedNFTList([]);
                                        setName('');
                                        setDescription('');
                                        setMusicOwner('');
                                        setMusicNonOwner('');
                                        setArtist('');
                                        setAboutTheTrack('');
                                        setArtistImage(logo)
                                        setSalePrice();
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
                                let TrasactionData = {
                                    tokenId: ids,
                                    from: receipt.events.Transfer.returnValues.from,
                                    to: receipt.events.Transfer.returnValues.to,
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

                            })
                    })

                }
            }
        }
    };
    const handleRemoveClick = (index, newNFT) => {
        console.log("index", index);
        const list = [...selectedNFTList];
        list.splice(index, 1);
        setSelectedNFTList(list);
        setTokenList(tokenList => [...tokenList, newNFT])
    };
    const handleAddClick = (nft) => {
        console.log("selectedNFTList.length", selectedNFTList.length);
        if (selectedNFTList.length + 1 <= 6) {
            const list = [...tokenList];
            var index = list.findIndex(i => i._id === nft._id);
            list.splice(index, 1);
            setTokenList(list);
            setSelectedNFTList([...selectedNFTList, nft]);
        }
        else {
            handleShow();
        }

    };

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">New Cube</li>
            </ul>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <form>
                            <div className="form-group">
                                <label>Select Artworks </label>
                                <div className="filter-widget">
                                    <Autocomplete
                                        id="combo-dox-demo"
                                        required
                                        options={tokenList}
                                        getOptionLabel={(option) =>
                                            option.title + "," + option.type + ',' + option.tokensupplyalternative
                                        }
                                        onChange={(event, value) => {
                                            if (value !== null) {
                                                console.log(value);
                                                handleAddClick(value);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="NFTs"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            placeholder="Enter Name of Cube"
                                            className="form-control"
                                            onChange={(e) => {
                                                setName(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            type="text"
                                            required
                                            rows="4"
                                            value={description}
                                            placeholder="Enter Description of Cube"
                                            className="form-control"
                                            onChange={(e) => {
                                                setDescription(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Sale Price (ETH)</label>
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                required
                                                value={salePrice}
                                                className="form-control"
                                                onChange={(e) => {
                                                    if (e.target.value >= 0) {
                                                        setSalePrice(e.target.value);
                                                    }
                                                    else {
                                                        setSalePrice(0);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Upload Music for Owner</label>{" "}
                                    </div>
                                    <div className="form-group">
                                        <input
                                            required
                                            type="file"
                                            name="sampleFile"
                                            accept=".mp3"
                                            className="form-control"
                                            onChange={(e) => uploadMusicOwnerHandler(e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Upload Music for Non Owner</label>{" "}
                                    </div>
                                    <div className="form-group">
                                        <input
                                            required
                                            type="file"
                                            name="sampleFile"
                                            accept=".mp3"
                                            className="form-control"
                                            onChange={(e) => uploadMusicNonOwnerHandler(e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Select Artist</label>
                                        <div className="filter-widget">
                                            <Autocomplete
                                                id="combo-dox-demo"
                                                required
                                                options={artistTypes}
                                                getOptionLabel={(option) =>
                                                    option.Name
                                                }
                                                onChange={(event, value) => {
                                                    if (value == null) setArtist("");
                                                    else {
                                                        console.log(value);
                                                        setArtistId(value.userId)
                                                        setArtist(value.Name);
                                                        setAboutTheTrack(value.About);
                                                        setArtistImage(value.Profile)
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Artists"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-12 col-lg-6">
                        <div className="App">
                            <NewCubeComponent data={selectedNFTList} />
                        </div>
                        <form >
                            <Scrollbars style={{ height: 650 }}>
                                <div className="form-group">
                                    <div >
                                        <Grid
                                            container
                                            spacing={2}
                                            direction="row"
                                            justify="flex-start"
                                        >
                                            {selectedNFTList.map((i, index) => (
                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                    <Card style={{ height: "100%" }} variant="outlined">
                                                        <CardHeader className="text-center"
                                                            title={i.title}
                                                        />
                                                        <CardMedia
                                                            variant="outlined" style={{ border: i.type === "Mastercraft" ? '4px solid #ff0000' : i.type === "Legendary" ? '4px solid #FFD700' : i.type === "Epic" ? '4px solid #9400D3' : i.type === "Rare" ? '4px solid #0000FF' : i.type === "Uncommon" ? '4px solid #008000' : i.type === "Common" ? '4px solid #FFFFFF' : 'none' }}
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
                                                                <strong>Token Supply: </strong>{i.tokensupplyalternative}
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
                                                        </CardContent>

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
                                                </Grid>

                                            ))}
                                        </Grid>
                                    </div>
                                </div>
                            </Scrollbars>
                        </form>
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
                        <button type="button" onClick={(e) => handleSubmitEvent(e)} className="btn submit-btn">
                            Create Cube
                  </button>
                    </div>
                )}
            </div>
            <SixNFTsErrorModal show={show} handleClose={handleClose} />
            <NetworkErrorModal
                show={showNetworkModal}
                handleClose={handleCloseNetworkModal}
                network={network}
            >
            </NetworkErrorModal>
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >

    );
}

export default NewCube;
