import { Grid } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';
import NewNFTCards from '../../../../components/Cards/NewNFTCards';
import { Scrollbars } from 'react-custom-scrollbars';
import r1 from '../../../../assets/img/patients/patient.jpg';

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



function NewSeason(props) {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [inputList, setInputList] = useState([{ id: 0, name: "Robot", price: "20" }, { id: 1, name: "Robot Cube", price: "2" }, { id: 2, name: "Cube", price: "15" }]);
    let [isSaving, setIsSaving] = useState(false);
    let [image, setImage] = useState(r1);
    let [drops, setDrops] = useState();
    let [isUploading, setIsUploading] = useState();
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");

    let [type, setType] = useState();
    let [types, setTypes] = useState([]);


    useEffect(() => {
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            newDrop: "",
            newSeason: "active",
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

        setTypes([...types, { id: value.id, name: value.name, price: value.price }]);
        setType("");
        // setCategory('');
        // setDescription('');
        // setFileData('');
    };


    const handleSubmitEvent = (event) => {
        event.preventDefault();

        setIsSaving(true);

        let jwt = Cookies.get("Authorization");
        let jwtDecoded = jwtDecode(jwt);
        let exporter = jwtDecoded.id;

        let DropData = {
            name: name,
            description: description,
            image: image,
            drops: drops
        }
        console.log("cubeData", DropData);
        axios.post("/drop/createdrop", DropData).then(
            (response) => {
                console.log('response', response);
                setIsSaving(false);

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
                                        // disabled={isDisabledImporter}
                                        getOptionLabel={(option) =>
                                            option.name
                                        }
                                        onChange={(event, value) => {
                                            if (value == null)
                                                setType("");
                                            else {
                                                console.log(value);
                                                setType(value.name)
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

                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>

                    <div className="col-md-12 col-lg-6">
                        {types.length > 0 ? (
                            <Scrollbars style={{ height: 600 }}>


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
                                            {types.map((data, index) =>
                                                <NewNFTCards key={index} index={index} data={data} handleRemoveClick={handleRemoveClick}></NewNFTCards>
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
                            style={{ color: "#00d0f1" }}
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
