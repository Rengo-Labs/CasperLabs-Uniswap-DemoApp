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
        { id: 0, image: robot1, imageBlob: robot1, name: "name", description: "description", tokenPrice: "20", tokenSupply: "30", imageArtist: "imageArtist", rarity: "Mastercraft", aboutTheArt: "aboutTheArt", website: "website", artistImage: robot6, artistImageBlob: robot6 },
        { id: 1, image: robot2, imageBlob: robot2, name: "name1", description: "description1", tokenPrice: "20", tokenSupply: "11", imageArtist: "imageArtist1", rarity: "Legendary", aboutTheArt: "aboutTheArt1", website: "website1", artistImage: robot5, artistImageBlob: robot5 },
        { id: 2, image: robot3, imageBlob: robot3, name: "name2", description: "description2", tokenPrice: "55", tokenSupply: "33", imageArtist: "imageArtist2", rarity: "Epic", aboutTheArt: "aboutTheArt2", website: "website2", artistImage: robot4, artistImageBlob: robot4 },
        { id: 3, image: robot4, imageBlob: robot4, name: "name3", description: "description3", tokenPrice: "23", tokenSupply: "31", imageArtist: "imageArtist3", rarity: "Rare", aboutTheArt: "aboutTheArt3", website: "website3", artistImage: robot3, artistImageBlob: robot3 },
        { id: 4, image: robot5, imageBlob: robot5, name: "name4", description: "description4", tokenPrice: "40", tokenSupply: "60", imageArtist: "imageArtist4", rarity: "Uncommon", aboutTheArt: "aboutTheArt4", website: "website4", artistImage: robot2, artistImageBlob: robot2 },
        { id: 5, image: robot6, imageBlob: robot6, name: "name5", description: "description5", tokenPrice: "33", tokenSupply: "3", imageArtist: "imageArtist5", rarity: "Common", aboutTheArt: "aboutTheArt5", website: "website5", artistImage: robot1, artistImageBlob: robot1 },
    ]);
    const [selectedNFTList, setSelectedNFTList] = useState([])
    let [isSaving, setIsSaving] = useState(false);
    let [name, setName] = useState();
    let [description, setDescription] = useState();
    let [aboutTheTrack, setAboutTheTrack] = useState();
    
    let [artistTypes, setArtistTypes] = useState(["Artist1", "Artist2", "Artist3", "Artist4", "Artist5"]);
    
    let [artistType, setArtistType] = useState("New Artist");
    let [artist, setArtist] = useState('');
    let [nftName, setNFTName] = useState();
    let [musicOwner, setMusicOwner] = useState();
    let [musicNonOwner, setMusicNonOwner] = useState();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let uploadMusicOwnerHandler = (event, index) => {
        console.log("event.target.files", event.target.files);
        console.log("event.target.value", event.target.value);
        if (event.target.files[0] !== undefined) {
            setMusicOwner(event.target.files[0]);
            // setAudioTune(event.target.value);
        }
    };
    let uploadMusicNonOwnerHandler = (event, index) => {
        console.log("event.target.files", event.target.files);
        console.log("event.target.value", event.target.value);
        if (event.target.files[0] !== undefined) {
            setMusicNonOwner(event.target.files[0]);
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
            setSelectedNFTList([...selectedNFTList, { id: nft.id, image: nft.image, imageBlob: nft.imageBlob, name: nft.name, rarity: nft.rarity, description: nft.description, tokenPrice: nft.tokenPrice, tokenSupply: nft.tokenSupply, imageArtist: nft.imageArtist, aboutTheArt: nft.aboutTheArt, website: nft.website, artistImage: nft.artistImage, artistImageBlob: nft.artistImageBlob }]);
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
                                            option.name + "," + option.rarity
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
                                                    value={artist}
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
                                        <img src={i.image} style={{ border: i.rarity === "Mastercraft" ? '4px solid #ff0000' : i.rarity === "Legendary" ? '4px solid #FFD700' : i.rarity === "Epic" ? '4px solid #9400D3' : i.rarity === "Rare" ? '4px solid #0000FF' : i.rarity === "Uncommon" ? '4px solid #008000' : i.rarity === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                                    ))}
                                    {new Array(6 - selectedNFTList.length).fill(0).map((_, index) => (
                                        < img src={r1} alt="" />
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
                                                        <CardContent>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>ArtWork Description: </strong>{i.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Token Rarity: </strong>{i.rarity}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Token Supply: </strong>{i.tokenSupply}
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary"  className="text-center">Image Artist</Typography>
                                                            <CardHeader
                                                                avatar={<Avatar src={i.artistImageBlob} aria-label="Artist" className={classes.avatar} />}
                                                                title={i.imageArtist}
                                                                subheader={i.aboutTheArt}
                                                            />
                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                <strong>Website URL: </strong>{i.website}
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom color="textSecondary"  className="text-center">Producers</Typography>
                                                            <CardHeader
                                                                avatar={<Avatar src={i.artistImageBlob} aria-label="Artist" className={classes.avatar} />}
                                                                title={i.imageArtist}
                                                                subheader={i.aboutTheArt}
                                                            />
                                                            <Typography variant="h6" gutterBottom color="textSecondary"  className="text-center">Executive Producers</Typography>
                                                            <CardHeader
                                                                avatar={<Avatar src={i.artistImageBlob} aria-label="Artist" className={classes.avatar} />}
                                                                title={i.imageArtist}
                                                                subheader={i.aboutTheArt}
                                                            />
                                                           
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
