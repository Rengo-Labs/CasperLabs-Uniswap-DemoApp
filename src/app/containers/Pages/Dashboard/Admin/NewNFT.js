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
import audio from '../../../../assets/mp3/music.mp3';
// import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ipfs from '../../../../components/IPFS/ipfs';

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
    // const  = ;

    // variable to play audio in loop
    const [audioTune, setAudioTune] = useState(new Audio(audio));
    const [playInLoop, setPlayInLoop] = useState(false);

    // load audio file on component load
    useEffect(() => {
        audioTune.load();
    }, [])

    // set the loop of audio tune
    useEffect(() => {
        audioTune.loop = playInLoop;
    }, [playInLoop])

    // play audio sound
    const playSound = () => {
        var playPromise = audioTune.play();
        console.log("audioTune", audioTune);

        // if (playPromise !== undefined) {
        //     playPromise
        //         .then(_ => {
        //             // Automatic playback started!
        //             // Show playing UI.
        //             console.log(audio);
        //             console.log("audio played auto");
        //         })
        //         .catch(error => {
        //             // Auto-play was prevented
        //             // Show paused UI.
        //             console.log("playback prevented", error);
        //         });
        // }
        audioTune.play();
    }

    // pause audio sound
    const pauseSound = () => {
        console.log("audioTune", audioTune);
        audioTune.pause();
    }

    // stop audio sound
    const stopSound = () => {
        console.log("audioTune", audioTune);
        audioTune.pause();
        audioTune.currentTime = 0;
    }
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [tokenList, setTokenList] = useState([]);
    let [isSaving, setIsSaving] = useState(false);
    let [name, setName] = useState("");
    let [website, setWebsite] = useState("");
    let [aboutTheArt, setAboutTheArt] = useState("");
    let [ipfsHash, setIpfsHash] = useState(null);
    let [description, setDescription] = useState("");
    let [inspirationForThePiece, setInspirationForThePiece] = useState();
    let [executiveInspirationForThePiece, setExecutiveInspirationForThePiece] = useState();
    let [fanInspirationForThePiece, setFanInspirationForThePiece] = useState();

    let [rarities, setRarities] = useState(["Mastercraft", "Legendary", "Epic", "Rare", "Uncommon", "Common"]);
    let [supplyType, setSupplyType] = useState("Single");
    // let [supplyType, setSupplyType] = useState("");

    let [imageArtistTypes, setImageArtistTypes] = useState(["Artist1", "Artist2", "Artist3", "Artist4", "Artist5"]);
    let [executiveProducerTypes, setExecutiveProducerTypes] = useState(["Executive Producer 1", "Executive Producer 2", "Executive Producer 3", "Executive Producer 4", "Executive Producer 5"]);
    let [fans, setFanTypes] = useState(["fan1", "fan2", "fan3", "fan4", "fan5"]);
    let [producerTypes, setProducerTypes] = useState(["Producer1", "Producer2", "Producer3", "Producer4", "Producer5"]);

    let [imageArtist, setImageArtist] = useState('');

    let [producer, setProducer] = useState('');
    let [fileData, setFileData] = useState('');
    let [tokenPrice, setTokenPrice] = useState("");
    let [tokenSupply, setTokenSupply] = useState(1);

    let [isUploadingIPFS, setIsUploadingIPFS] = useState(false);
    let [rarity, setRarity] = useState('');
    let [imageBlob, setImageBlob] = useState(r1);
    let [artistImageBlob, setArtistImageBlob] = useState(r1);
    let [producerImageBlob, setProducerImageBlob] = useState(r1);
    let [executiveProducerImageBlob, setExecutiveProducerImageBlob] = useState(r1);
    let [fanImageBlob, setFanImageBlob] = useState(r1);


    let [fan, setFan] = useState('');

    let [other, setOther] = useState('');
    let [image, setImage] = useState(r1);
    let [artistImage, setArtistImage] = useState(r1);
    let [producerImage, setProducerImage] = useState(r1);
    let [executiveProducerImage, setExecutiveProducerImage] = useState(r1);
    let [fanImage, setFanImage] = useState(r1);
    let [imageArtistType, setImageArtistType] = useState("New Image Artist");
    let [producerType, setProducerType] = useState("New Producer");
    let [executiveProducerType, setExecutiveProducerType] = useState("New Executive Producer");
    let [fanType, setFanType] = useState("New Fan");

    let [executiveProducer, setExecutiveProducer] = useState('');
    // let [image2, setImage2] = useState(r1);
    // let [image3, setImage3] = useState(r1);
    // let [image4, setImage4] = useState(r1);
    // let [image5, setImage5] = useState(r1);
    // let [image6, setImage6] = useState(r1);
    let [music, setMusic] = useState();

    let fileSelectHandler = (event, index) => {
        if (event.target.files[0] !== undefined) {
            setFileData(event.target.files[0]);
        }
    };
    let uploadMusicHandler = (event, index) => {
        console.log("event.target.files", event.target.files);
        console.log("event.target.value", event.target.value);
        if (event.target.files[0] !== undefined) {
            setMusic(event.target.files[0]);
            setAudioTune(event.target.value);
        }
    };

    useEffect(() => {
        props.setActiveTab({
            dashboard: "",
            newNFT: "active",
            orders: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "",
            newRandomDrop: "",
        });
    }, []);

    const handleSubmitEvent = (event) => {
        event.preventDefault();
        setIsSaving(true);

        let jwt = Cookies.get("Authorization");
        let jwtDecoded = jwtDecode(jwt);
        let exporter = jwtDecoded.id;
        let fileData = new FormData();
        // fileData.append("importerId", importer);
        fileData.append("exporterId", exporter);
        // console.log("JSON.stringify(tokenList)", tokenList);
        let catagoryArray = [];
        let descriptionArray = [];
        // for (let i = 0; i < tokenList.length; i++) {
        //     catagoryArray.push(tokenList[i].title);
        //     descriptionArray.push(tokenList[i].description);
        //     fileData.append(`file`, tokenList[i].fileData);
        // }
        console.log(descriptionArray);

        fileData.append(`description`, JSON.stringify(descriptionArray));
        fileData.append(`documentNames`, JSON.stringify(catagoryArray));
        fileData.append(`numberOfTokens`, tokenPrice * 10 ** 18);

        for (var pair of fileData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios.post("api/v1/exporter/addOrder", fileData).then(
        //     (response) => {
        //         setIsSaving(false);
        //         let variant = "success";
        //         enqueueSnackbar('Order Added Successfully.', { variant });
        //     },
        //     (error) => {
        //         if (process.env.NODE_ENV === "development") {
        //             console.log(error);
        //             console.log(error.response);
        //         }
        //         setIsSaving(false);
        //         let variant = "error";
        //         enqueueSnackbar('Unable to Add Order.', { variant });

        //     }
        // );
    };
    const handleRemoveClick = (index) => {
        const list = [...tokenList];
        list.splice(index, 1);
        setTokenList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setTokenList([...tokenList, {
            image: image,
            imageBlob: imageBlob,
            name: name,
            description: description,
            rarity: rarity,
            tokenPrice: tokenPrice,
            tokenSupply: tokenSupply,
            imageArtist: imageArtist,
            aboutTheArt: aboutTheArt,
            website: website,
            artistImage: artistImage,
            artistImageBlob: artistImageBlob,
            producer: producer,
            inspirationForThePiece: inspirationForThePiece,
            producerImage: producerImage,
            producerImageBlob, producerImageBlob,
            executiveProducer, executiveProducer,
            executiveInspirationForThePiece: executiveInspirationForThePiece,
            executiveProducerImage: executiveProducerImage,
            executiveProducerImageBlob: executiveProducerImageBlob
        }]);
        setFileData('');
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
                    return
                }
                console.log("HASH", result[0].hash);

                setIpfsHash(result[0].hash);

                setImage(imageNFT);
                setImageBlob(URL.createObjectURL(imageNFT))
                let variant = "success";
                enqueueSnackbar('Image Uploaded', { variant });
                setIsUploadingIPFS(false);
            })
        }
    }
    let onChangeSelfieHandler = (e) => {
        setArtistImage(e.target.files[0]);
        setArtistImageBlob(URL.createObjectURL(e.target.files[0]))
    }
    let onChangeProducerHandler = (e) => {
        setProducerImage(e.target.files[0]);
        setProducerImageBlob(URL.createObjectURL(e.target.files[0]))
    }
    let onChangeExecutiveProducerHandler = (e) => {
        setExecutiveProducerImage(e.target.files[0]);
        setExecutiveProducerImageBlob(URL.createObjectURL(e.target.files[0]))
    }
    let onChangeFanHandler = (e) => {
        setFanImage(e.target.files[0]);
        setFanImageBlob(URL.createObjectURL(e.target.files[0]))
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
                        <form onSubmit={handleSubmitEvent}>
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
                                                    <img src={imageBlob} alt="Selfie" />
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
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={onChangeFile}
                                                    />
                                                </div>
                                                <small className="form-text text-muted">
                                                    Allowed JPG, JPEG, PNG. Max size of 5MB
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
                                                setSupplyType("Variable Supply")
                                                setTokenSupply(0);
                                            }} checked={supplyType === 'Variable Supply'} control={<Radio color="secondary" />} label="Variable Supply" />

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
                                            <FormControlLabel style={{ color: 'black' }} value="New Image Artist" onChange={() => setImageArtistType("New Image Artist")} checked={imageArtistType === 'New Image Artist'} control={<Radio color="secondary" />} label="New Image Artist" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Image Artist" onChange={() => setImageArtistType("Existing Image Artist")} checked={imageArtistType === 'Existing Image Artist'} control={<Radio color="secondary" />} label="Existing Image Artist" />
                                        </RadioGroup>
                                    </FormControl>
                                    {imageArtistType === 'New Image Artist' ? (
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
                                                            <img src={artistImageBlob} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            <span>
                                                                <i className="fa fa-upload"></i>
                          Upload photo
                        </span>
                                                            <input
                                                                name="sampleFile"
                                                                type="file"
                                                                className="upload"
                                                                accept=".png,.jpg,.jpeg"
                                                                onChange={onChangeSelfieHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG. Max size of 5MB
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
                                                        option
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setImageArtist("");
                                                        else {
                                                            console.log(value);
                                                            setImageArtist(value)
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
                                            <FormControlLabel style={{ color: 'black' }} value="New Producer" onChange={() => setProducerType("New Producer")} checked={producerType === 'New Producer'} control={<Radio color="secondary" />} label="New Producer" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Producer" onChange={() => setProducerType("Existing Producer")} checked={producerType === 'Existing Producer'} control={<Radio color="secondary" />} label="Existing Producer" />
                                        </RadioGroup>
                                    </FormControl>
                                    {producerType === 'New Producer' ? (
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
                                                            <img src={producerImageBlob} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            <span>
                                                                <i className="fa fa-upload"></i>
                          Upload photo
                        </span>
                                                            <input
                                                                name="sampleFile"
                                                                type="file"
                                                                className="upload"
                                                                accept=".png,.jpg,.jpeg"
                                                                onChange={onChangeProducerHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG. Max size of 5MB
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
                                                        option
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setProducer("");
                                                        else {
                                                            console.log(value);
                                                            setProducer(value)
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
                                            <FormControlLabel style={{ color: 'black' }} value="New Executive Producer" onChange={() => setExecutiveProducerType("New Executive Producer")} checked={executiveProducerType === 'New Executive Producer'} control={<Radio color="secondary" />} label="New Executive Producer" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Executive Producer" onChange={() => setExecutiveProducerType("Existing Executive Producer")} checked={executiveProducerType === 'Existing Executive Producer'} control={<Radio color="secondary" />} label="Existing Executive Producer" />
                                        </RadioGroup>
                                    </FormControl>
                                    {executiveProducerType === 'New Executive Producer' ? (
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
                                                            <img src={executiveProducerImageBlob} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            <span>
                                                                <i className="fa fa-upload"></i>
                          Upload photo
                        </span>
                                                            <input
                                                                name="sampleFile"
                                                                type="file"
                                                                className="upload"
                                                                accept=".png,.jpg,.jpeg"
                                                                onChange={onChangeExecutiveProducerHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG. Max size of 5MB
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
                                                        option
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setExecutiveProducer("");
                                                        else {
                                                            console.log(value);
                                                            setExecutiveProducer(value)
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
                                            <FormControlLabel style={{ color: 'black' }} value="New Fan" onChange={() => setFanType("New Fan")} checked={fanType === 'New Fan'} control={<Radio color="secondary" />} label="New Fan" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Fan" onChange={() => setFanType("Existing Fan")} checked={fanType === 'Existing Fan'} control={<Radio color="secondary" />} label="Existing Fan" />
                                        </RadioGroup>
                                    </FormControl>

                                    {fanType === 'New Fan' ? (
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
                                                            <img src={fanImageBlob} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            <span>
                                                                <i className="fa fa-upload"></i>
                          Upload photo
                        </span>
                                                            <input
                                                                name="sampleFile"
                                                                type="file"
                                                                className="upload"
                                                                accept=".png,.jpg,.jpeg"
                                                                onChange={onChangeFanHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG. Max size of 5MB
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
                                                        option
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setFan("");
                                                        else {
                                                            console.log(value);
                                                            setFan(value)
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

                                </div>

                                {image === "" || imageBlob === "" || name === "" || description === "" || tokenSupply === "" || imageArtist === "" || aboutTheArt === "" || website === "" || artistImage === "" || artistImageBlob === "" || producer === "" || inspirationForThePiece === "" || producerImage === "" || producerImageBlob === "" || executiveProducer === "" || executiveInspirationForThePiece === "" || executiveProducerImage === "" || executiveProducerImageBlob === "" ? (
                                    <button
                                        className="btn"
                                        type="submit"
                                        disabled
                                    >
                                        <i className="fa fa-plus"></i> Add NFT to queue
                                    </button>
                                ) : (
                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() => handleAddClick()}
                                    >
                                        <i className="fa fa-plus"></i> Add NFT to queue
                                    </button>
                                )}
                            </div>
                        </form>

                    </div>
                    <div className="col-md-12 col-lg-6">
                        {/* <!-- Change Password Form --> */}
                        <form >
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
                                            <>
                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                    <Card >
                                                        <CardHeader className="text-center"
                                                            title={i.name}
                                                        />
                                                        <CardMedia
                                                            style={{ height: "100%" }} variant="outlined" style={{ border: i.rarity === "Mastercraft" ? '4px solid #ff0000' : i.rarity === "Legendary" ? '4px solid #FFD700' : i.rarity === "Mastercraft" ? '4px solid ##ff0000' : i.rarity === "Epic" ? '4px solid #9400D3' : i.rarity === "Rare" ? '4px solid #0000FF' : i.rarity === "Uncommon" ? '4px solid #008000' : i.rarity === "Common" ? '4px solid #FFFFFF' : 'none' }}
                                                            className={classes.media}
                                                            image={i.imageBlob}

                                                            title="NFT Image"
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Artwork Description: </strong>{i.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Token Rarity: </strong>{i.rarity}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Token Supply: </strong>{i.tokenSupply}
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Image Artist</Typography>
                                                            <CardHeader
                                                                avatar={<Avatar src={i.artistImageBlob} aria-label="Artist" className={classes.avatar} />}
                                                                title={i.imageArtist}
                                                                subheader={i.aboutTheArt}
                                                            />
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Website URL: </strong>{i.website}
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Producer</Typography>
                                                            <CardHeader
                                                                avatar={<Avatar src={i.producerImageBlob} aria-label="Producer" className={classes.avatar} />}
                                                                title={i.producer}
                                                                subheader={i.inspirationForThePiece}
                                                            />
                                                            <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">Executive Producer</Typography>
                                                            <CardHeader
                                                                avatar={<Avatar src={i.executiveProducerImageBlob} aria-label="Executive Producer" className={classes.avatar} />}
                                                                title={i.executiveProducer}
                                                                subheader={i.executiveInspirationForThePiece}
                                                            />

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
                                            </>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {
                    isSaving ? (
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
                        tokenList.length === 0 ? (
                            <div className="submit-section">
                                <button type="button" disabled className="btn submit-btn">
                                    Batch create NFTs
                        </button>
                            </div>
                        ) : (
                            <div className="submit-section">
                                <button type="submit" className="btn submit-btn">
                                    Batch create NFTs
                  </button>
                            </div>
                        )

                    )
                }
            </div >

        </div >

    );
}

export default NewNFT;
