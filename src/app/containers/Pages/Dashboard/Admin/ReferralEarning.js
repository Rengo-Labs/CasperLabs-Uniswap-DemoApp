import {
    Card,
    CardContent,
    Grid,
    Typography
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import NumberFormat from 'react-number-format';


const useStyles = makeStyles({
    root: {
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
});

function ReferralEarningList(props) {
    let [referralEarningListOrders, setReferralEarningListOrders] = useState([]);

    let [totalEarnings, setTotalEarnings] = useState(1);
    let [disabledButton, setDisabledButton] = useState(true);
    let [earningPerTrade, setEarningPerTrade] = useState("01");
    let [view, setView] = useState('list');



    const classes = useStyles();
    let getReferralEarningListOrders = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios
            .get(`/api/v1/admin/listoftrades`)
            .then((response) => {
                console.log("response.data", response.data.data);
                setReferralEarningListOrders(response.data.data);
                setTotalEarnings(0);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    useEffect(() => {
        getReferralEarningListOrders();
        props.setActiveTab({
            dashboard: "",
            totalUserAccount: "",
            pendingUserAccount: "",
            referralEarningList: "",
            referralEarnings:"active",
            tradeListOrders: "",
            disputedOrders: "",
            resolvedDisputedOrders: "",
            settings: "",
            changePassword: "",
        });// eslint-disable-next-line
    }, []);
    const handleChange = (event, nextView) => {
        // console.log('nextView', nextView);
        setView(nextView);
    };
    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Referral Earnings</li>
            </ul>
            <div className="container">
                {/* <p></p> */}
                <Row>
                    <Col>
                        <input value={"Total Earnings: " + totalEarnings + "USDT"} disabled className="form-control" />
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                {/* <input tp placeholder="Earnings per trade" className="form-control" /> */}
                                <NumberFormat
                                    format="## %" mask="_"
                                    value={earningPerTrade}
                                    required
                                    placeholder="Earnings per trade"
                                    className="form-control"
                                    onValueChange={(e) => {
                                        console.log('e', e.value);
                                        if (e.value === earningPerTrade || e.value === '') {
                                            setDisabledButton(true);
                                        }
                                        else {
                                            setDisabledButton(false);
                                            setEarningPerTrade(e.value)
                                        }

                                    }}
                                />
                            </Col>
                            {disabledButton ? (
                                <div class="input-group-prepend">
                                    <button type="button" disabled class="btn btn-outline-secondary">Update</button>
                                </div>
                            ) : (
                                <div class="input-group-prepend">
                                    <button type="button" class="btn btn-outline-secondary">Update</button>
                                </div>
                            )}


                        </Row>

                    </Col>
                    <Col>
                        <ToggleButtonGroup style={{ float: 'right' }} orientation="horizontal" value={view} exclusive onChange={handleChange}>
                            <ToggleButton value="list" aria-label="list">
                                <ViewListIcon />
                            </ToggleButton>
                            <ToggleButton value="module" aria-label="module">
                                <ViewModuleIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>

            </div>
            <div className="card-body">
                {view === 'list' ? (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">

                                <div
                                    className="table-responsive"
                                    style={{ paddingTop: "20px" }}
                                >
                                    <table className="table table-hover table-center mb-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Order Placed by</th>
                                                <th>Exporter Name</th>
                                                <th>Importer Name</th>
                                                <th>Created At</th>
                                                <th>Upadated At</th>
                                                <th>Price</th>
                                                <th>Order Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {referralEarningListOrders.map((i, index) => (
                                                i.importerstatus === 'Completed' ? (<tr key={i._id}>
                                                    <td>{index + 1}</td>
                                                    {i.exporterorderstatus === "OrderPlaced" ? (
                                                        <td>Importer</td>
                                                    ) : (<td>Exporter</td>)}
                                                    <td>{i.exporterId.name}</td>
                                                    <td>{i.importerId.name}</td>
                                                    <td>
                                                        <tr>
                                                            <strong>Date: </strong> {i.createdAt
                                                                ? new Date(i.createdAt).toLocaleDateString()
                                                                : ""}</tr>
                                                        <tr>
                                                            <strong>Time: </strong>
                                                            {i.createdAt
                                                                ? new Date(i.createdAt).toLocaleTimeString()
                                                                : ""}
                                                        </tr>

                                                    </td>
                                                    <td>
                                                        <tr>
                                                            <strong>Date: </strong> {i.updatedAt
                                                                ? new Date(i.updatedAt).toLocaleDateString()
                                                                : ""}</tr>
                                                        <tr>
                                                            <strong>Time: </strong>
                                                            {i.updatedAt
                                                                ? new Date(i.updatedAt).toLocaleTimeString()
                                                                : ""}
                                                        </tr>

                                                    </td>
                                                    <td >{i.numberOfTokens / 10 ** 18}</td>
                                                    <td>
                                                        <tr>
                                                            <strong>Importer: </strong> {i.importerstatus}
                                                        </tr>
                                                        <tr>
                                                            <strong>Exporter: </strong> {i.exporterstatus}
                                                        </tr>
                                                    </td>
                                                </tr>) : (null)

                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (

                    <div className={classes.root}>
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            justify="flex-start"
                        // alignItems="flex-start"
                        >
                            {referralEarningListOrders.map((i, index) => (
                                i.importerstatus === "Completed" ? (<>

                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Order Placed by: </strong>{i.exporterorderstatus === "OrderPlaced" ? (
                                                        <>Importer</>
                                                    ) : (<>Exporter</>)}
                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Exporter:</strong>{i.exporterId.name}
                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Importer:</strong>{i.importerId.name}
                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Create At:</strong>
                                                    <ul>
                                                        <li>
                                                            <strong>Date: </strong> {i.createdAt
                                                                ? new Date(i.createdAt).toLocaleDateString()
                                                                : ""}
                                                        </li>
                                                        <li>
                                                            <strong>Time: </strong>
                                                            {i.createdAt
                                                                ? new Date(i.createdAt).toLocaleTimeString()
                                                                : ""}
                                                        </li>
                                                    </ul>

                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Updated At: </strong>
                                                    <ul>
                                                        <li>
                                                            <strong>Date: </strong> {i.updatedAt
                                                                ? new Date(i.updatedAt).toLocaleDateString()
                                                                : ""}
                                                        </li>
                                                        <li>
                                                            <strong>Time: </strong>
                                                            {i.updatedAt
                                                                ? new Date(i.updatedAt).toLocaleTimeString()
                                                                : ""}
                                                        </li>
                                                    </ul>
                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Price:</strong>{i.numberOfTokens / 10 ** 18} USDT
                                                    </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    <strong>Order Status: </strong>
                                                    <ul>
                                                        <li><strong>Importer: </strong> {i.importerstatus}</li>
                                                        <li><strong>Exporter: </strong> {i.exporterstatus}</li>
                                                    </ul>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </>) : (null)

                            ))}
                        </Grid>
                    </div>
                )}
            </div>
        </div >
    );
}

export default ReferralEarningList;
