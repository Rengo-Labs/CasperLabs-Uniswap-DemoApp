import {
    Card,
    CardContent, Grid
} from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';
// import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import logo from "../../../../assets/img/img-04.jpg";
import r1 from '../../../../assets/img/patients/patient.jpg';
import audio from '../../../../assets/mp3/music.mp3';
import robot1 from '../../../../assets/img/r1.jpg';
import robot2 from '../../../../assets/img/r2.jpg';
import robot3 from '../../../../assets/img/r3.jpg';
import robot4 from '../../../../assets/img/r4.jpg';
import robot5 from '../../../../assets/img/r5.jpg';
import robot6 from '../../../../assets/img/r6.jpg';
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
    const [tokenList, setTokenList] = useState([
        { id: 0, image: robot1, imageBlob: robot1, name: "name", description: "description", tokenPrice: "20", tokenSupply: "30", imageArtist: "imageArtist", aboutTheArt: "aboutTheArt", website: "website", artistImage: robot6, artistImageBlob: robot6 },
        { id: 1, image: robot2, imageBlob: robot2, name: "name1", description: "description1", tokenPrice: "20", tokenSupply: "11", imageArtist: "imageArtist1", aboutTheArt: "aboutTheArt1", website: "website1", artistImage: robot5, artistImageBlob: robot5 },
        { id: 2, image: robot3, imageBlob: robot3, name: "name2", description: "description2", tokenPrice: "55", tokenSupply: "33", imageArtist: "imageArtist2", aboutTheArt: "aboutTheArt2", website: "website2", artistImage: robot4, artistImageBlob: robot4 },
        { id: 3, image: robot4, imageBlob: robot4, name: "name3", description: "description3", tokenPrice: "23", tokenSupply: "31", imageArtist: "imageArtist3", aboutTheArt: "aboutTheArt3", website: "website3", artistImage: robot3, artistImageBlob: robot3 },
        { id: 4, image: robot5, imageBlob: robot5, name: "name4", description: "description4", tokenPrice: "40", tokenSupply: "60", imageArtist: "imageArtist4", aboutTheArt: "aboutTheArt4", website: "website4", artistImage: robot2, artistImageBlob: robot2 },
        { id: 5, image: robot6, imageBlob: robot6, name: "name5", description: "description5", tokenPrice: "33", tokenSupply: "3", imageArtist: "imageArtist5", aboutTheArt: "aboutTheArt5", website: "website5", artistImage: robot1, artistImageBlob: robot1 },
    ]);
    const [selectedNFTList, setSelectedNFTList] = useState([])
    let [isSaving, setIsSaving] = useState(false);
    let [name, setName] = useState();
    let [description, setDescription] = useState();
    let [aboutTheTrack, setAboutTheTrack] = useState();
    let [inspirationForThePiece, setInspirationForThePiece] = useState();
    let [rarities, setRarities] = useState(["Mastercraft", "Legendary", "Epic", "Rare", "Uncommon", "Common"]);
    let [supplies, setSupplies] = useState(["Fixed Supply", "Variable Supply", "Mintable"]);
    let [supply, setSupply] = useState("");
    let [collectionTypes, setCollectionTypes] = useState(["Common", "Rare", "Epic", "Lgendary", "Uncommon"]);
    let [artistTypes, setArtistTypes] = useState(["Common", "Rare", "Epic", "Lgendary", "Uncommon"]);
    let [producerTypes, setProducerTypes] = useState(["Common", "Rare", "Epic", "Lgendary", "Uncommon"]);
    let [executiveProducerTypes, setExecutiveProducerTypes] = useState(["Common", "Rare", "Epic", "Lgendary", "Uncommon"]);
    let [fans, setFanTypes] = useState(["Common", "Rare", "Epic", "Lgendary", "Uncommon"]);

    let [collectionType, setCollectionType] = useState("New Collection");
    let [collection, setCollection] = useState('');
    let [artistType, setArtistType] = useState("New Artist");
    let [artist, setArtist] = useState('');
    let [imageArtistType, setImageArtistType] = useState("New Image Artist");
    let [imageArtist, setImageArtist] = useState('');
    let [producerType, setProducerType] = useState("New Producer");
    let [executiveProducerType, setExecutiveProducerType] = useState("New Executive Producer");
    let [fanType, setFanType] = useState("New Fan");

    let [producer, setProducer] = useState('');
    let [executiveProducer, setExecutiveProducer] = useState('');
    let [fan, setFan] = useState('');

    let [other, setOther] = useState('');
    let [rarity, setRarity] = useState();
    let [nftName, setNFTName] = useState();
    let [music, setMusic] = useState();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    let uploadMusicHandler = (event, index) => {
        console.log("event.target.files", event.target.files);
        console.log("event.target.value", event.target.value);
        if (event.target.files[0] !== undefined) {
            setMusic(event.target.files[0]);
            // setAudioTune(event.target.value);
        }
    };

    useEffect(() => {
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            newSupefNFT: "active",
            orders: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
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
        // fileData.append(`numberOfTokens`, tokenSupply * 10 ** 18);

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
    const handleRemoveClick = (index, newNFT) => {
        console.log("index", index);
        const list = [...selectedNFTList];
        list.splice(index, 1);
        setSelectedNFTList(list);
        setTokenList(tokenList => [...tokenList, newNFT])
    };

    // handle click event of the Add button
    const handleAddClick = (nft) => {
        console.log("selectedNFTList.length", selectedNFTList.length);
        if (selectedNFTList.length + 1 <= 6) {
            const list = [...tokenList];
            var index = list.findIndex(i => i.id === nft.id);
            list.splice(index, 1);
            setTokenList(list);
            setSelectedNFTList([...selectedNFTList, { id: nft.id, image: nft.image, imageBlob: nft.imageBlob, name: nft.name, description: nft.description, tokenPrice: nft.tokenPrice, tokenSupply: nft.tokenSupply, imageArtist: nft.imageArtist, aboutTheArt: nft.aboutTheArt, website: nft.website, artistImage: nft.artistImage, artistImageBlob: nft.artistImageBlob }]);
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
                <li className="breadcrumb-item active">New Super NFT</li>
            </ul>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <form onSubmit={handleSubmitEvent}>
                            <div className="form-group">
                                <label>Select Artworks </label>
                                <div className="filter-widget">
                                    <Autocomplete
                                        id="combo-dox-demo"
                                        required
                                        options={tokenList}
                                        // value={nftName}
                                        // disabled={isDisabledImporter}
                                        getOptionLabel={(option) =>
                                            option.name
                                        }
                                        onChange={(event, value) => {
                                            if (value == null)
                                                setNFTName("");
                                            else {
                                                console.log(value);
                                                setNFTName(value.name)
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


                                <div className="form-group">
                                    <label>Artwork</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            placeholder="Enter Name of Super NFT"
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
                                            placeholder="Enter Description of Super NFT"
                                            className="form-control"
                                            onChange={(e) => {
                                                setDescription(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Upload Music</label>{" "}
                                    </div>
                                    <div className="form-group">
                                        <input
                                            required
                                            type="file"
                                            name="sampleFile"
                                            accept=".mp3"
                                            className="form-control"
                                            onChange={(e) => uploadMusicHandler(e)}

                                        />
                                    </div>
                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add Music Artist </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Artist" onChange={() => setArtistType("New Artist")} checked={artistType === 'New Artist'} control={<Radio color="secondary" />} label="New Artist" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Artist" onChange={() => setArtistType("Existing Artist")} checked={artistType === 'Existing Artist'} control={<Radio color="secondary" />} label="Existing Artist" />
                                        </RadioGroup>
                                    </FormControl>
                                    {artistType === 'New Artist' ? (
                                        <>
                                            <div className="form-group">
                                                {/* <label>Artist Name</label> */}
                                                <input
                                                    type="text"
                                                    required
                                                    value={collection}
                                                    placeholder="Enter Music Artist Name"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setArtist(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <label className="focus-label">Artist Profile Photo</label>
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
                                                            <img src={logo} alt="Selfie" />
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
                                                            // onChange={this.onChangeSelfieHandler}
                                                            />
                                                        </div>
                                                        <small className="form-text text-muted">
                                                            Allowed JPG, JPEG, PNG. Max size of 5MB
                      </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                {/* <label>About the Track</label> */}
                                                <textarea
                                                    type="text"
                                                    required
                                                    rows="4"
                                                    value={aboutTheTrack}
                                                    placeholder="About the Track"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setAboutTheTrack(e.target.value)
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
                                                    options={artistTypes}
                                                    // disabled={isDisabledImporter}
                                                    getOptionLabel={(option) =>
                                                        option
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setArtist("");
                                                        else {
                                                            console.log(value);
                                                            setArtist(value)
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
                                                            <img src={logo} alt="Selfie" />
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
                                                            // onChange={this.onChangeSelfieHandler}
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
                                                            <img src={logo} alt="Selfie" />
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
                                                            // onChange={this.onChangeSelfieHandler}
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
                                                    value={executiveProducer}
                                                    placeholder="Enter Fan Name"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setExecutiveProducer(e.target.value)
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
                                                            <img src={logo} alt="Selfie" />
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
                                                            // onChange={this.onChangeSelfieHandler}
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
                                            value={executiveProducer}
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
                                            <FormControlLabel style={{ color: 'black' }} value="New Collection" onChange={() => setCollectionType("New Collection")} checked={collectionType === 'New Collection'} control={<Radio color="secondary" />} label="New Collection" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Collection" onChange={() => setCollectionType("Existing Collection")} checked={collectionType === 'Existing Collection'} control={<Radio color="secondary" />} label="Existing Collection" />
                                        </RadioGroup>
                                    </FormControl>
                                    {collectionType === 'New Collection' ? (
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
                                                        option
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setCollection("");
                                                        else {
                                                            console.log(value);
                                                            setCollection(value)
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


                                    {/* {title === '' || description === '' || tokenSupply === '' || fileData === '' ? (
                                        <button
                                            className="btn"
                                            type="submit"
                                            disabled
                                        >
                                            <i className="fa fa-upload"></i>{' '}Upload to IPFS
                                        </button>
                                    ) : (
                                        <button
                                            className="btn"
                                            type="submit"
                                            onClick={handleAddClick}
                                        >
                                            <i className="fa fa-upload"></i>{' '} Upload to IPFS
                                        </button>
                                    )} */}
                                </div>
                            </div>
                        </form>

                    </div>
                    <div className="col-md-12 col-lg-6">
                        {/* <!-- Change Password Form --> */}
                        <div className="App">
                            <div class="wrapper">
                                <div class="cube-box1">
                                    {selectedNFTList.map((i, index) => (
                                        <img src={i.image} style={{ border: rarity === "Mastercraft" ? '4px solid #ff0000' : rarity === "Legendary" ? '4px solid #FFD700' : rarity === "Mastercraft" ? '4px solid ##ff0000' : rarity === "Epic" ? '4px solid #9400D3' : rarity === "Rare" ? '4px solid #0000FF' : rarity === "Uncommon" ? '4px solid #008000' : rarity === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                    ))}
                                    {new Array(6 - selectedNFTList.length).fill(0).map((_, index) => (
                                        < img src={r1} style={{ border: rarity === "Mastercraft" ? '4px solid #ff0000' : rarity === "Legendary" ? '4px solid #FFD700' : rarity === "Mastercraft" ? '4px solid ##ff0000' : rarity === "Epic" ? '4px solid #9400D3' : rarity === "Rare" ? '4px solid #0000FF' : rarity === "Uncommon" ? '4px solid #008000' : rarity === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                    ))}
                                  
                                </div>
                            </div>
                        </div>
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
                                        {selectedNFTList.map((i, index) => (
                                            <>
                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                    <Card style={{ height: "100%" }} variant="outlined">
                                                        <CardHeader className="text-center"
                                                            title={i.name}
                                                        />
                                                        <CardMedia
                                                            className={classes.media}
                                                            image={i.image}
                                                            title="NFT Image"
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>ArtWork Description: </strong>{i.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Token Price: </strong>{i.tokenPrice}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Token Supply: </strong>{i.tokenSupply}
                                                            </Typography>
                                                            <CardHeader className="text-center"
                                                                title="Image Artist"
                                                            />
                                                            <CardHeader
                                                                avatar={<Avatar src={i.artistImageBlob} aria-label="Artist" className={classes.avatar} />}
                                                                title={i.imageArtist}
                                                                subheader={i.aboutTheArt}
                                                            />
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Website URL: </strong>{i.website}
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
                                            </>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                        </form>
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
                    selectedNFTList.length === 0 ? (
                        <div className="submit-section">
                            <button type="button" disabled className="btn submit-btn">
                                Create NFT
                    </button>
                        </div>
                    ) : (
                    <div className="submit-section">
                        <button type="submit" className="btn submit-btn">
                            Create Cube
                  </button>
                    </div>
                    )

                )}
            </div>
            <SixNFTsErrorModal show={show} handleClose={handleClose} />
        </div >

    );
}

export default NewCube;
