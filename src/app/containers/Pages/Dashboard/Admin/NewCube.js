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
import axios from 'axios';


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
        // { id: 0, image: robot1, imageBlob: robot1, name: "name", description: "description", tokenPrice: "20", tokenSupply: "30", imageArtist: "imageArtist", rarity: "Mastercraft", aboutTheArt: "aboutTheArt", website: "website", artistImage: robot6, artistImageBlob: robot6 },
        // { id: 1, image: robot2, imageBlob: robot2, name: "name1", description: "description1", tokenPrice: "20", tokenSupply: "11", imageArtist: "imageArtist1", rarity: "Legendary", aboutTheArt: "aboutTheArt1", website: "website1", artistImage: robot5, artistImageBlob: robot5 },
        // { id: 2, image: robot3, imageBlob: robot3, name: "name2", description: "description2", tokenPrice: "55", tokenSupply: "33", imageArtist: "imageArtist2", rarity: "Epic", aboutTheArt: "aboutTheArt2", website: "website2", artistImage: robot4, artistImageBlob: robot4 },
        // { id: 3, image: robot4, imageBlob: robot4, name: "name3", description: "description3", tokenPrice: "23", tokenSupply: "31", imageArtist: "imageArtist3", rarity: "Rare", aboutTheArt: "aboutTheArt3", website: "website3", artistImage: robot3, artistImageBlob: robot3 },
        // { id: 4, image: robot5, imageBlob: robot5, name: "name4", description: "description4", tokenPrice: "40", tokenSupply: "60", imageArtist: "imageArtist4", rarity: "Uncommon", aboutTheArt: "aboutTheArt4", website: "website4", artistImage: robot2, artistImageBlob: robot2 },
        // { id: 5, image: robot6, imageBlob: robot6, name: "name5", description: "description5", tokenPrice: "33", tokenSupply: "3", imageArtist: "imageArtist5", rarity: "Common", aboutTheArt: "aboutTheArt5", website: "website5", artistImage: robot1, artistImageBlob: robot1 },
    ]);
    const [selectedNFTList, setSelectedNFTList] = useState([])
    let [isSaving, setIsSaving] = useState(false);
    let [name, setName] = useState();
    let [description, setDescription] = useState();
    let [aboutTheTrack, setAboutTheTrack] = useState();
    let [salePrice, setSalePrice] = useState();
    let [artistTypes, setArtistTypes] = useState([]);

    let [artistType, setArtistType] = useState("New");
    let [artist, setArtist] = useState('');
    let [nftName, setNFTName] = useState();
    let [musicOwner, setMusicOwner] = useState("");
    let [musicNonOwner, setMusicNonOwner] = useState("");
    let [artistImage, setArtistImage] = useState(logo);

    let [isUploadingArtist, setIsUploadingArtist] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let getProfileData = () => {
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
            newSupefNFT: "active",
            myNFTs: "",
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
    let getMyNFTs = () => {
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
            })
    }

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        setIsSaving(true);

        let jwt = Cookies.get("Authorization");
        let jwtDecoded = jwtDecode(jwt);

        let nftIds = [];
        for (let i = 0; i < selectedNFTList.length; i++) {
            nftIds.push(selectedNFTList[i]._id);
        }
        let cubeData = {
            tokenId: '1',
            title: name,
            description: description,
            nftids: nftIds,
            ownermusicfile: musicOwner,
            nonownermusicfile: musicNonOwner,
            MusicArtistName: artist,
            MusicArtistAbout: aboutTheTrack,
            MusicArtistProfile: artistImage,
            musicartisttype: artistType,
            SalePrice: salePrice
        }
        console.log("cubeData", cubeData);
        axios.post("/token/TokenIds", cubeData).then(
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
            var index = list.findIndex(i => i._id === nft._id);
            list.splice(index, 1);
            setTokenList(list);
            // setTokenList([...tokenList, {}]);
            setSelectedNFTList([...selectedNFTList, nft]);
        }
        else {
            handleShow();
        }

    };
    let onChangeArtistHandler = (e) => {
        setIsUploadingArtist(true);
        let fileData = new FormData();
        fileData.append("image", e.target.files[0]);
        axios.post("upload/uploadtos3", fileData).then(
            (response) => {
                console.log("response", response);
                setArtistImage(response.data.url);
                setIsUploadingArtist(false);
                let variant = "success";
                enqueueSnackbar('Image Uploaded to S3 Successfully', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsUploadingArtist(false);
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
                                        // value={nftName}
                                        // disabled={isDisabledImporter}
                                        getOptionLabel={(option) =>
                                            option.title + "," + option.type + ',' + option.tokensupply
                                        }
                                        onChange={(event, value) => {
                                            if (value == null)
                                                setNFTName("");
                                            else {
                                                console.log(value);
                                                setNFTName(value.title)
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
                                        <label>Sale Price</label>
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                placeholder="Enter Total Supply"
                                                required
                                                value={salePrice}
                                                placeholder=""
                                                className="form-control"
                                                onChange={(e) => {
                                                    setSalePrice(e.target.value);
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
                                    <FormControl component="fieldset">
                                        <lable component="legend">Select to add Music Artist </lable>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                            <FormControlLabel style={{ color: 'black' }} value="New Artist" onChange={() => setArtistType("New")} checked={artistType === 'New'} control={<Radio color="secondary" />} label="New Artist" />
                                            <FormControlLabel style={{ color: 'black' }} value="Existing Artist" onChange={() => setArtistType("Existing")} checked={artistType === 'Existing'} control={<Radio color="secondary" />} label="Existing Artist" />
                                        </RadioGroup>
                                    </FormControl>
                                    {artistType === 'New' ? (
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
                                                            <img src={artistImage} alt="Selfie" />
                                                        </div>
                                                    </div>
                                                    <div className="upload-img">
                                                        <div
                                                            className="change-photo-btn"
                                                            style={{ backgroundColor: "rgb(167,0,0)" }}
                                                        >
                                                            {isUploadingArtist ? (
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
                                                                onChange={onChangeArtistHandler}
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
                                                        option.Name
                                                    }
                                                    onChange={(event, value) => {
                                                        if (value == null) setArtist("");
                                                        else {
                                                            console.log(value);
                                                            setArtist(value.Name);
                                                            setAboutTheTrack(value.About);
                                                            setArtistImage(value.Profile)
                                                            // Profile

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
                                        <img src={i.artwork} style={{ border: i.type === "Mastercraft" ? '4px solid #ff0000' : i.type === "Legendary" ? '4px solid #FFD700' : i.type === "Epic" ? '4px solid #9400D3' : i.type === "Rare" ? '4px solid #0000FF' : i.type === "Uncommon" ? '4px solid #008000' : i.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
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
                                            <Grid item xs={12} sm={6} md={6} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                    selectedNFTList.length === 0 || salePrice === undefined || description === "" || name === "" || artist === "" || artistImage === logo || aboutTheTrack === "" || musicNonOwner === "" || musicOwner === "" ? (
                        <div className="submit-section">
                            <button type="button" disabled className="btn submit-btn">
                                Create Cube
                    </button>
                        </div>
                    ) : (
                        <div className="submit-section">
                            <button type="button" onClick={(e) => handleSubmitEvent(e)} className="btn submit-btn">
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
