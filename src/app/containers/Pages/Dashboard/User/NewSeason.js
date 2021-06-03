import { CardHeader, Grid } from '@material-ui/core/';
import Button from '@material-ui/core/Button';
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
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Countdown from 'react-countdown';
import { Scrollbars } from 'react-custom-scrollbars';
import r1 from '../../../../assets/img/patients/patient.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },

    media: {
        height: 300,
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
function NewSeason(props) {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [inputList, setInputList] = useState([]);
    let [isSaving, setIsSaving] = useState(false);
    let [image, setImage] = useState(r1);
    let [isUploading, setIsUploading] = useState();
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [type, setType] = useState();
    let [types, setTypes] = useState([]);
    let getMyDrops = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios.get("/drop/drops").then(
            (response) => {
                console.log("response", response);
                setInputList(response.data.Dropdata);
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
        getMyDrops();
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            newDrop: "",
            newSeason: "active",
            mySeason: "",
            myNFTs: "",
            myCubes: "",
            myDrops: "",
            newSupefNFT: "",
            newCollection: "",
            orders: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newRandomDrop: ""
        });// eslint-disable-next-line
    }, []);
    const handleRemoveClick = (index) => {
        const list = [...types];
        console.log("list", list);
        list.splice(index, 1);
        setTypes(list);
    };
    const handleAddClick = (value) => {
        setTypes([...types, value]);
        setType("");
    };
    const handleSubmitEvent = (event) => {
        event.preventDefault();
        setIsSaving(true);
        let dropList = [];
        for (let i = 0; i < types.length; i++) {
            dropList.push(types[i]._id);
        }
        let SeasonData = {
            title: name,
            description: description,
            image: image,
            dropId: dropList
        }
        console.log("cubeData", SeasonData);

        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${Cookies.get("Authorization")}`;
        axios.post("/season/createseason", SeasonData).then(
            (response) => {
                console.log('response', response);
                setIsSaving(false);
                setName("");
                setDescription("");
                setImage(r1);
                setTypes([]);
                let variant = "success";
                enqueueSnackbar('New Season Created Successfully.', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsSaving(false);
                let variant = "error";
                enqueueSnackbar('Unable to Create New Season.', { variant });
            }
        );
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
                <li className="breadcrumb-item active">New Season</li>
            </ul>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <form onSubmit={handleSubmitEvent}>
                            <div className="form-group">
                                <label>Select Drops</label>
                                <div className="filter-widget">
                                    <Autocomplete
                                        id="combo-dox-demo"
                                        required
                                        options={inputList}
                                        value={type}
                                        getOptionLabel={(option) =>
                                            option.title
                                        }
                                        onChange={(event, value) => {
                                            if (value == null)
                                                setType("");
                                            else {
                                                console.log(value);
                                                setType(value.title)
                                                handleAddClick(value);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Drops"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Season Name</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            placeholder="Enter Name of Season"
                                            className="form-control"
                                            onChange={(e) => {
                                                setName(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Season Description</label>
                                        <textarea
                                            type="text"
                                            required
                                            rows="4"
                                            value={description}
                                            placeholder="Enter Description of Season"
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
                            </div>
                        </form>
                    </div>
                    <div className="col-md-12 col-lg-6">
                        {types.length > 0 ? (
                            <Scrollbars style={{ height: 600 }}>
                                <div className="form-group">
                                    <div >
                                        <Grid
                                            container
                                            spacing={3}
                                            direction="row"
                                            justify="flex-start"
                                        >
                                            {types.map((i, index) =>
                                                <Grid item xs={12} sm={6} md={6} key={index}>
                                                    <Card style={{ height: "100%" }} variant="outlined" className={classes.root}>
                                                        <CardActionArea>
                                                            <CardHeader className="text-center"
                                                                title={i.title}
                                                            />
                                                            <CardMedia
                                                                className={classes.media}
                                                                image={i.image}
                                                                title=""
                                                            >
                                                            </CardMedia>
                                                            <CardContent>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Drop Description: </strong>{i.description}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    <strong>Minimum Bid: </strong>{i.MinimumBid} WETH
                                                                </Typography>
                                                                <Typography variant="h6" gutterBottom color="textSecondary" className="text-center">
                                                                    {new Date() < new Date(i.AuctionStartsAt) ? (
                                                                        <div style={{ color: "#00FF00" }} >
                                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                                <strong>Auction Starts At:</strong>
                                                                            </Typography>
                                                                            {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionStartsAt))}
                                                                            <Countdown daysInHours date={new Date(i.AuctionStartsAt)}>
                                                                            </Countdown>
                                                                        </div>
                                                                    ) : new Date() > new Date(i.AuctionStartsAt) && new Date() < new Date(i.AuctionEndsAt) ? (
                                                                        <div style={{ color: "#FF0000" }}>
                                                                            {console.log("Date(i.AuctionStartsAt)", Date(i.AuctionEndsAt.toLoca))}
                                                                            <Typography variant="body2" color="textSecondary" component="p">
                                                                                <strong>Auction Ends At:</strong>
                                                                            </Typography>
                                                                            <Countdown daysInHours date={new Date(i.AuctionEndsAt)}>
                                                                            </Countdown>
                                                                        </div>) : (
                                                                        <Typography variant="body2" style={{ color: "#FF0000" }} component="p">
                                                                            <strong>Auction Ended</strong>
                                                                        </Typography>
                                                                    )}
                                                                </Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                        <CardActions>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleRemoveClick(index);
                                                                }}
                                                                className="btn btn-sm bg-danger-light btn-block"
                                                            >
                                                                Remove Drop
    </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid >
                                            )}
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
                    name === "" || description === "" || image === r1 || types === [] || types.length === 0 ? (
                        <div className="submit-section">
                            <button type="button" disabled className="btn submit-btn">
                                Create Drop
                  </button>
                        </div>
                    ) : (
                        <div className="submit-section">
                            <button type="button" onClick={handleSubmitEvent} className="btn submit-btn">
                                Create Drop
                  </button>
                        </div>)
                )}
            </div>
        </div>

    );
}

export default NewSeason;
