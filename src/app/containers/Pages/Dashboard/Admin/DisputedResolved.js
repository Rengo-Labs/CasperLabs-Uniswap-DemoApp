import {
    Card,
    CardContent, Grid,
    Typography
} from '@material-ui/core/';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import OrderDetailModal from "../../../../components/Modals/OrderDetailModal";


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

function DisputedResolved(props) {
    let [disputedOrders, setDisputedOrders] = useState([]);
    const handleClose = () => setShow(false);
    let [show, setShow] = useState(false);
    let [view, setView] = useState('list');
    let [order, setOrder] = useState();

    const classes = useStyles();
    let getDisputedOrders = () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios
            .get(`/api/v1/admin/getOrders/ResolvedDisputed`)
            .then((response) => {
                console.log("response.data", response.data.data);
                setDisputedOrders(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    useEffect(() => {
        getDisputedOrders();
        props.setActiveTab({
            dashboard: "",
            totalUserAccount: "",
            pendingUserAccount: "",
            disputedOrders: "",
            tradeListOrders: "",
            earningsList:"",
            referralEarnings:"",
            resolvedDisputedOrders: "active",
            settings: "",
            changePassword: "",
        });// eslint-disable-next-line
    }, []);
    const handleChange = (event, nextView) => {
        console.log('nextView', nextView);
        setView(nextView);
    };
    // const download = (e, fileName, fileUrl) => {
    //     console.log(e.target.href);
    //     console.log(fileUrl.split('.').pop())
    //     fetch(e.target.href, {
    //         method: "GET",
    //         headers: {}
    //     })
    //         .then(response => {
    //             response.arrayBuffer().then(function (buffer) {
    //                 const url = window.URL.createObjectURL(new Blob([buffer]));

    //                 const link = document.createElement("a");
    //                 link.href = url;
    //                 link.setAttribute("download", fileName + "." + fileUrl.split('.').pop()); //or any other extension
    //                 document.body.appendChild(link);
    //                 link.click();
    //             });
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // };
    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "#174153" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Resolved Disputes</li>
            </ul>
            <div className="container">
                <ToggleButtonGroup style={{ float: 'right' }} orientation="horizontal" value={view} exclusive onChange={handleChange}>
                    <ToggleButton value="list" aria-label="list">
                        <ViewListIcon />
                    </ToggleButton>
                    <ToggleButton value="module" aria-label="module">
                        <ViewModuleIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
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
                                                <th>Exporter</th>
                                                <th>Importer</th>
                                                <th>Documents by Importer</th>
                                                <th>Documents by Exporter</th>
                                                <th>Reason of Dispute</th>
                                                <th>Documents of Dispute</th>
                                                <th>Created At</th>
                                                <th>Upadated At</th>
                                                <th>Price</th>
                                                <th style={{ textAlign: 'center' }} >Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disputedOrders.map((i, index) => (
                                                <tr key={i._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{i.exporterId.name}</td>
                                                    <td>{i.importerId.name}</td>
                                                    <td>
                                                        {i.documentsByImporter.map((file) => {
                                                            return (
                                                                <tr>
                                                                    {file.name}{" "}
                                                                    {"   "}<a
                                                                        href={"https://imex-backend.herokuapp.com/" + i.url}
                                                                        download
                                                                        target='_blank'
                                                                        rel="noopener noreferrer"
                                                                    // onClick={e => download(e, i.name, i.url)}
                                                                    >
                                                                        <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                    </a>
                                                                </tr>
                                                            );
                                                        })}
                                                    </td>
                                                    <td>
                                                        {i.documentsByExporter.map((file) => {
                                                            return (
                                                                <tr>
                                                                    {file.name}{" "}
                                                                    {"   "}<a
                                                                        href={"https://imex-backend.herokuapp.com/" + i.url}
                                                                        download
                                                                        target='_blank'
                                                                        rel="noopener noreferrer"
                                                                    // onClick={e => download(e, i.name, i.url)}
                                                                    >
                                                                        <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                    </a>
                                                                </tr>
                                                            );
                                                        })}
                                                    </td>
                                                    <td>{i.disputereason}</td>
                                                    <td>
                                                        {i.disputedocuments.map((file) => {
                                                            return (
                                                                <tr>
                                                                    {file.name}{" "}
                                                                    <a
                                                                        href={"https://imex-backend.herokuapp.com/" + i.url}
                                                                        download
                                                                        target='_blank'
                                                                        rel="noopener noreferrer"
                                                                    // onClick={e => download(e, i.name, i.url)}
                                                                    >
                                                                        <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                    </a>
                                                                </tr>
                                                            );
                                                        })}
                                                    </td>
                                                    <td>
                                                        {i.createdAt
                                                            ? new Date(i.createdAt).toLocaleDateString()
                                                            : ""}
                                                    </td>
                                                    <td>
                                                        {i.updatedAt
                                                            ? new Date(i.updatedAt).toLocaleDateString()
                                                            : ""}
                                                    </td>
                                                    <td>{i.numberOfTokens / 10 ** 18}</td>

                                                    <td>
                                                        {" "}
                                                        <div className="actions">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setOrder(i);
                                                                    setShow(true);
                                                                }}
                                                                className="btn btn-sm bg-warning-light"
                                                            >
                                                                View Details
                            </Button>
                                                        </div>
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
                        <div className="card-body">
                            <div className={classes.card}>
                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                // alignItems="flex-start"
                                >
                                    {disputedOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card className={classes.root} variant="outlined">
                                                    <CardContent>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Exporter:</strong>{i.exporterId.name}
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Importer:</strong>{i.importerId.name}
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Documents By Importer:</strong>
                                                            <ul>
                                                                {i.documentsByImporter.length === 0 ? (
                                                                    <p style={{ color: 'red' }}>No Documents yet</p>
                                                                ) : (
                                                                        null
                                                                    )}
                                                                {i.documentsByImporter.map((file) => {
                                                                    return (
                                                                        <li> {file.name}{" "}
                                                                            {"   "}<a
                                                                                href={"https://imex-backend.herokuapp.com/" + i.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, i.url)}
                                                                            >
                                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Documents By Exporter:</strong>
                                                            <ul>
                                                                {i.documentsByExporter.length === 0 ? (
                                                                    <p style={{ color: 'red' }}>No Documents yet</p>
                                                                ) : (
                                                                        null
                                                                    )}
                                                                {i.documentsByExporter.map((file) => {
                                                                    return (
                                                                        <li> {file.name}{" "}
                                                                            {"   "}<a
                                                                                href={"https://imex-backend.herokuapp.com/" + i.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, i.url)}
                                                                            >
                                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Create At:</strong> {i.createdAt
                                                                ? new Date(i.createdAt).toLocaleDateString()
                                                                : ""}
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Updated At: </strong> {i.updatedAt
                                                                ? new Date(i.updatedAt).toLocaleDateString()
                                                                : ""}
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Price:</strong> {i.numberOfTokens / 10 ** 18} USDT
              </Typography>
                                                        <Typography style={{ wordWrap: 'break-word' }} className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Agreement Address:</strong> {i.Agreement_Address}
                                                        </Typography>
                                                        <Typography style={{ wordWrap: 'break-word' }} className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Reason Of Dispute:</strong> {i.disputereason}
                                                        </Typography>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <strong>Documents Of Dispute:</strong>
                                                            <ul>
                                                                {i.disputedocuments.length === 0 ? (
                                                                    <p style={{ color: 'red' }}>No Documents yet</p>
                                                                ) : (
                                                                        null
                                                                    )}
                                                                {i.disputedocuments.map((file) => {
                                                                    return (
                                                                        <li> {file.name}{" "}
                                                                            {"   "}<a
                                                                                href={"https://imex-backend.herokuapp.com/" + i.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, i.url)}
                                                                            >
                                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </Typography>

                                                    </CardContent>


                                                    <CardActions>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setOrder(i);
                                                                setShow(true);
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                        >
                                                            View Details
                            </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}



            </div>
            <OrderDetailModal
                order={order}
                show={show}
                handleClose={handleClose}
            />
        </div >
    );
}

export default DisputedResolved;
