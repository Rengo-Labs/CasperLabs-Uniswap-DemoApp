import { Grid } from '@material-ui/core/';
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Scrollbars } from 'react-custom-scrollbars';
import DateTimePicker from 'react-datetime-picker';
import NewNFTCards from '../../../../components/Cards/NewNFTCards';

function RandomDrop(props) {

    const { enqueueSnackbar } = useSnackbar();
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    let [isSaving, setIsSaving] = useState(false);
    let [salePrice, setSalePrice] = useState();
    let [minimumBid, setMinimumBid] = useState();
    // eslint-disable-next-line
    let [type, setType] = useState();
    let [types, setTypes] = useState([]);


    useEffect(() => {
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            newDrop: "",
            newRandomDrop: "active",
            newCollection: "",
            myNFTs: "",
            mySeason: "",
            myCubes: "",
            myDrops: "",
            orders: "",
            settings: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newSupefNFT: "",
        });// eslint-disable-next-line
    }, []);
    const handleRemoveClick = (index) => {
        console.log("index", index);
        console.log("inputList", types);

        const list = [...types];
        console.log("list", list);
        list.splice(index, 1);

        setTypes(list);
    };


    const handleSubmitEvent = (event) => {
        event.preventDefault();
        setIsSaving(true);

        let jwt = Cookies.get("Authorization");
        let jwtDecoded = jwtDecode(jwt);
        let exporter = jwtDecoded.id;
        let fileData = new FormData();
        fileData.append("exporterId", exporter);
        let catagoryArray = [];
        let descriptionArray = [];
        console.log(descriptionArray);

        fileData.append(`description`, JSON.stringify(descriptionArray));
        fileData.append(`documentNames`, JSON.stringify(catagoryArray));
        fileData.append(`numberOfTokens`, salePrice * 10 ** 18);

        for (var pair of fileData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        axios.post("api/v1/exporter/addOrder", fileData).then(
            (response) => {
                setIsSaving(false);
                let variant = "success";
                enqueueSnackbar('Order Added Successfully.', { variant });
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                setIsSaving(false);
                let variant = "error";
                enqueueSnackbar('Unable to Add Order.', { variant });

            }
        );
    };

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">New Random Drop</li>
            </ul>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <form onSubmit={handleSubmitEvent}>
                            <div className="form-group">

                                {/* <label>Select NFTs</label>
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
                                                label="NFTs"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
 */}
                                <div className="form-group">
                                    <label>Sale Price (ETH)</label>
                                    <div className="filter-widget">
                                        <input
                                            type="number"
                                            placeholder="Enter Total Supply"
                                            required
                                            value={salePrice}
                                            className="form-control"
                                            onChange={(e) => {
                                                if (e.target.value < 0) {
                                                    setSalePrice(0);
                                                } else {
                                                    setSalePrice(e.target.value);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* <label>Select Supply Type</label>
                                <div className="filter-widget">
                                    <Autocomplete
                                        id="combo-dox-demo"
                                        required
                                        // options={supplies}
                                        // disabled={isDisabledImporter}
                                        getOptionLabel={(option) =>
                                            option
                                        }
                                        onChange={(event, value) => {
                                            if (value == null) setType("");
                                            else {
                                                console.log(value);
                                                // setSupply(value)
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Supply Type"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div> */}

                                <div className="form-group">
                                    <label>Auction Starts At</label>
                                    <div className="form-group">
                                        <DateTimePicker
                                            className="form-control"
                                            onChange={setStartTime}
                                            value={startTime}
                                        />
                                    </div>
                                    <label>Auction Ends At</label>
                                    <div className="form-group">
                                        <DateTimePicker
                                            className="form-control"
                                            onChange={setEndTime}
                                            value={endTime}
                                        />
                                    </div>
                                    <label>Minimum Bid (WETH)</label>
                                    <div className="form-group">
                                        <div className="filter-widget">
                                            <input
                                                type="number"
                                                placeholder="Enter Total Supply"
                                                required
                                                value={minimumBid}
                                                className="form-control"
                                                onChange={(e) => {
                                                    if (e.target.value < 0) {
                                                        setMinimumBid(0);
                                                    } else {
                                                        setMinimumBid(e.target.value);
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
                            <Scrollbars style={{ height: 600 }}>


                                {/* <!-- Change Password Form --> */}
                                <div className="form-group">
                                    <div >
                                        <Grid
                                            container
                                            spacing={3}
                                            direction="row"
                                            justify="flex-start"
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
                            style={{ color: "#ff0000" }}
                        >
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className="submit-section">
                        <button type="button" onClick={handleSubmitEvent} className="btn submit-btn">
                            Create Random Drop
                  </button>
                    </div>
                )}
            </div>

        </div>

    );
}

export default RandomDrop;
