import {
    Card,
    CardContent,
    Grid,
    Typography
} from '@material-ui/core/';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';



const useStyles = makeStyles((theme) => ({
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
    search: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 350,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));


function TradeList(props) {
    let [tradeListOrders, setTradeListOrders] = useState([]);
    let [view, setView] = useState('list');
    let [search, setSearch] = useState('');




    const classes = useStyles();
    tradeListOrders = tradeListOrders.filter(trade => {
        return trade.exporterId.name.includes(search) ||
            trade.importerId.name.includes(search) ||
            trade.numberOfTokens.includes(search) ||
            trade.importerstatus.includes(search) ||
            trade.exporterstatus.includes(search)



        // &&
        // // trade.sqft >= 500 &&
        // // trade.num_of_beds >=2 &&
        // // trade.num_of_baths >= 2.5;
    })
    console.log("tradeListOrders", tradeListOrders);
    let getTradeListOrders = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios
            .get(`/api/v1/admin/listoftrades`)
            .then((response) => {
                console.log("response.data", response.data.data);
                setTradeListOrders(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    useEffect(() => {
        getTradeListOrders();
        props.setActiveTab({
            dashboard: "",
            totalUserAccount: "",
            pendingUserAccount: "",
            tradeListOrders: "active",
            disputedOrders: "",
            earningsList: "",
            referralEarnings: "",
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
            {/* <Row>
                <Col>
                </Col>
                <Col>
                </Col>
                <Col>
                    <Paper component="form" className={classes.search}>
                        <InputBase
                            className={classes.input}
                            placeholder="Search . . ."
                            inputProps={{ 'aria-label': 'Search . . .' }}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Col>
            </Row> */}

            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Trade List</li>
            </ul>
            <div className="container">
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>

                    <Col>
                        <Paper component="form" style={{ float: 'right' }} className={classes.search}>
                            <InputBase
                                className={classes.input}
                                value={search}
                                placeholder="Search . . ."
                                inputProps={{ 'aria-label': 'Search . . .' }}
                                onChange={(e) => {
                                    console.log('search', e.target.value);
                                    setSearch(e.target.value)
                                }}
                            />
                            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
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
                                            {tradeListOrders.map((i, index) => (
                                                <tr key={i._id}>
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
                                                </tr>
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
                            {tradeListOrders.map((i, index) => (
                                <>

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

                                </>
                            ))}
                        </Grid>
                    </div>
                )}
            </div>
        </div >
    );
}

export default TradeList;
