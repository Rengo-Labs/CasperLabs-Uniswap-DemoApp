import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import ErrorIcon from '@material-ui/icons/Error';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LockIcon from '@material-ui/icons/Lock';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import PropTypes from 'prop-types';
import React from 'react';

function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

// const download = (e, fileName, fileUrl) => {
//     console.log(e.target.href);
//     console.log(fileUrl.split('.').pop())
//     fetch("https://imex-backend.herokuapp.com/" + fileUrl, {

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

export default function ScrollableTabsButtonForce(props) {
    const classes = useStyles();
    // const [value, setValue] = React.useState(0);
    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);
    console.log("props", props);

    const handleChange = (event, newValue) => {
        props.setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={props.value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                >
                    <Tab label="Pending" icon={
                        <Badge badgeContent={props.pendingOrders.length.toString()} color="primary">
                            <AccessTimeIcon />
                        </Badge>
                    } {...a11yProps(0)} />
                    <Tab label="Accepted" icon={
                        <Badge badgeContent={props.acceptedOrders.length.toString()} color="primary">
                            <ThumbUp />
                        </Badge>
                    } {...a11yProps(1)} />
                    <Tab label="Rejected" icon={
                        <Badge badgeContent={props.rejectedOrders.length.toString()} color="primary">
                            <ThumbDown />
                        </Badge>
                    } {...a11yProps(2)} />
                    <Tab label="Finalized" icon={
                        <Badge badgeContent={props.finalizedOrders.length.toString()} color="primary">
                            <DoneOutlineIcon />
                        </Badge>
                    } {...a11yProps(3)} />
                    <Tab label="Disputed" icon={
                        <Badge badgeContent={props.disputedOrders.length.toString()} color="primary">
                            <ErrorIcon />
                        </Badge>
                    } {...a11yProps(4)} />
                    {jwtDecoded.roles[0] === "importer" ? (
                        <Tab label="Under Delivery" icon={
                            <Badge badgeContent={props.underDeliveryOrders.length.toString()} color="primary">
                                <LocalShippingIcon />
                            </Badge>
                        } {...a11yProps(5)} />
                    ) : (
                            <Tab label="Under Shipment" icon={
                                <Badge badgeContent={props.underShipmentOrders.length.toString()} color="primary">
                                    <LocalShippingIcon />
                                </Badge>
                            } {...a11yProps(5)} />
                        )}
                    <Tab label="Completed" icon={
                        <Badge badgeContent={props.completedOrders.length.toString()} color="primary">
                            <DoneAllIcon />
                        </Badge>
                    } {...a11yProps(6)} />
                    {jwtDecoded.roles[0] === "importer" ? (
                        <Tab label="Funds Locked" icon={
                            <Badge badgeContent={props.fundsLockedOrders.length.toString()} color="primary">
                                <LockIcon />
                            </Badge>
                        } {...a11yProps(7)} />
                    ) : (null)}
                </Tabs>
            </AppBar>
            <TabPanel value={props.value} index={0}>
                {props.pendingOrders.length === 0 ? (
                    <p>No New Orders Found</p>
                ) : (
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
                                        <th>Created At</th>
                                        <th>Upadated At</th>
                                        <th>Price</th>
                                        <th style={{ textAlign: 'center' }} >Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.pendingOrders.map((i, index) => (
                                        <tr key={i._id}>
                                            <td>{index + 1}</td>
                                            <td>{i.exporterId.name}</td>
                                            <td>{i.importerId.name}</td>
                                            <td>
                                                {i.documentsByImporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                {
                                                    <div className="actions">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.setShow(true);
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                        >

                                                            view details
                                </Button>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

            </TabPanel>
            <TabPanel value={props.value} index={1}>
                {props.acceptedOrders.length === 0 ? (
                    <p>No Accepted Orders Found</p>
                ) : (
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
                                        <th>Created At</th>
                                        <th>Upadated At</th>
                                        <th>Price</th>
                                        <th style={{ textAlign: 'center' }} >Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.acceptedOrders.map((i, index) => (
                                        <tr key={i._id}>
                                            <td>{index + 1}</td>
                                            <td>{i.exporterId.name}</td>
                                            <td>{i.importerId.name}</td>
                                            <td>
                                                {i.documentsByImporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
                                                            >
                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                            </a>
                                                        </tr>
                                                    );
                                                })}
                                                {jwtDecoded.roles[0] === "importer" ? (
                                                    <div className="actions" style={{ marginTop: '10px' }}>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.handleShowUploadModal()
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                            block
                                                        >
                                                            <i className="fa fa-upload" aria-hidden="true"></i>
                              Upload More Documents
                    </Button>
                                                    </div>
                                                ) : (null)}
                                            </td>
                                            <td>
                                                {i.documentsByExporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
                                                            >
                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                            </a>
                                                        </tr>
                                                    );
                                                })}
                                                {jwtDecoded.roles[0] === "exporter" ? (
                                                    <div className="actions" style={{ marginTop: '10px' }}>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.handleShowUploadModal()
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                            block
                                                        >
                                                            <i className="fa fa-upload" aria-hidden="true"></i>
                              Upload More Documents
                    </Button>
                                                    </div>
                                                ) : (null)}
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
                                                {
                                                    <div className="actions">
                                                        {(jwtDecoded.roles[0] === "importer" && i.documentsByExporter.length === 0) || (jwtDecoded.roles[0] === "exporter" && i.documentsByImporter.length === 0) ? (
                                                            <Button
                                                                disabled
                                                                className="btn btn-sm bg-info-light"
                                                            >
                                                                Accept/Reject Documents
                                                            </Button>
                                                        ) : (
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.handleShowAcceptRejectModal();
                                                                    }}
                                                                    className="btn btn-sm bg-info-light"
                                                                >
                                                                    Accept/Reject Documents
                                                                </Button>
                                                            )}
                                                        {' '}
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.handleShowFinalizeModal();
                                                            }}
                                                            className="btn btn-sm bg-success-light"
                                                        >
                                                            FInalize Order
                                </Button>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </TabPanel>
            <TabPanel value={props.value} index={2}>
                {props.rejectedOrders.length === 0 ? (
                    <p>No Rejected Orders Found</p>
                ) : (
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
                                        <th>Created At</th>
                                        <th>Upadated At</th>
                                        <th>Price</th>
                                        <th style={{ textAlign: 'center' }} >Actions</th>

                                        {/* <th className="text-right">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.rejectedOrders.map((i, index) => (
                                        <tr key={i._id}>
                                            <td>{index + 1}</td>
                                            <td>{i.exporterId.name}</td>
                                            <td>{i.importerId.name}</td>
                                            <td>
                                                {i.documentsByImporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                {
                                                    <div className="actions">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.setShow(true);
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                        >

                                                            view details
                                    </Button>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    )}

            </TabPanel>
            <TabPanel value={props.value} index={3}>
                {props.finalizedOrders.length === 0 ? (
                    <p>No Finalized Orders Found</p>
                ) : (
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
                                        <th>Created At</th>
                                        <th>Upadated At</th>
                                        <th>Price</th>
                                        {jwtDecoded.roles[0] === "importer" ? (
                                            <th>Agreement Address</th>
                                        ) : (null)}
                                        <th style={{ textAlign: 'center' }} >Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.finalizedOrders.map((i, index) => (
                                        <tr key={i._id}>
                                            <td>{index + 1}</td>
                                            <td>{i.exporterId.name}</td>
                                            <td>{i.importerId.name}</td>
                                            <td>
                                                {i.documentsByImporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                            {jwtDecoded.roles[0] === "importer" ? (
                                                i.Agreement_Address !== undefined ? (
                                                    <td >{i.Agreement_Address}</td>
                                                ) : (
                                                        <td>Waiting for Exporter to Finalize</td>
                                                    )

                                            ) : (null)}

                                            <td>
                                                {" "}
                                                <div className="actions">
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            props.setOrder(i);
                                                            props.setShow(true);
                                                        }}
                                                        className="btn btn-sm bg-warning-light"
                                                    >

                                                        view details
                            </Button>{' '}
                                                    {jwtDecoded.roles[0] === "importer" ? (
                                                        i.isexporterstatusfinalized && i.Agreement_Address !== undefined ? (
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.handleShowLockFundsModal();
                                                                }}
                                                                className="btn btn-sm bg-danger-light "
                                                            >
                                                                <i className="fe fe-lock"></i>
                                                        Lock Funds
                                                            </Button>
                                                        ) : (
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        console.log("HELLO");
                                                                        // props.setOrder(i);
                                                                        // props.setShow(true);
                                                                    }}
                                                                    disabled
                                                                    className="btn btn-sm bg-danger-light not-allowed"
                                                                >
                                                                    <i className="fe fe-lock"></i>
                                                        Lock Funds
                                                                </Button>
                                                            )

                                                    ) : (
                                                            i.isimporterstatusfundslocked ? (
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.handleShowCreateShipmentModal();
                                                                    }}
                                                                    className="btn btn-sm bg-success-light"
                                                                >
                                                                    <i className="fe fe-truck"></i>
                                                Create Shipment
                                                                </Button>
                                                            ) : (
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                        }}
                                                                        disabled
                                                                        className="btn btn-sm bg-success-light not-allowed"
                                                                    >
                                                                        <i className="fe fe-lock"></i>
                                                                    Create Shipment
                                                                    </Button>
                                                                )

                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    )}
            </TabPanel>
            <TabPanel value={props.value} index={4}>
                {props.disputedOrders.length === 0 ? (
                    <p>No Disputed Orders Yet</p>
                ) : (
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
                                        <th>Created At</th>
                                        <th>Upadated At</th>
                                        <th>Price</th>

                                        <th style={{ textAlign: 'center' }} >Actions</th>

                                        {/* <th className="text-right">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.disputedOrders.map((i, index) => (
                                        <tr key={i._id}>
                                            <td>{index + 1}</td>
                                            <td>{i.exporterId.name}</td>
                                            <td>{i.importerId.name}</td>
                                            <td>
                                                {i.documentsByImporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                {
                                                    <div className="actions">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.setShow(true);
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                        >

                                                            view details
                                </Button>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </TabPanel>
            <TabPanel value={props.value} index={5}>
                {jwtDecoded.roles[0] === "importer" ? (
                    props.underDeliveryOrders.length === 0 ? (
                        <p>No Order is in under Delivery</p>
                    ) : (
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
                                            <th>Created At</th>
                                            <th>Upadated At</th>
                                            <th>Price</th>
                                            <th>Agreement Address</th>
                                            <th style={{ textAlign: 'center' }} >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.underDeliveryOrders.map((i, index) => (
                                            <tr key={i._id}>
                                                <td>{index + 1}</td>
                                                <td>{i.exporterId.name}</td>
                                                <td>{i.importerId !== null ? (i.importerId.name) : (null)}</td>
                                                <td>
                                                    {i.documentsByImporter.map((file) => {
                                                        return (
                                                            <tr>
                                                                {file.name}{" "}
                                                                {"   "} <a
                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                    download
                                                                    target='_blank'
                                                                    rel="noopener noreferrer"
                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                                {"   "} <a
                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                    download
                                                                    target='_blank'
                                                                    rel="noopener noreferrer"
                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                <td>{i.Agreement_Address}</td>
                                                <td>
                                                    {" "}
                                                    {
                                                        <div className="actions">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.setShow(true);
                                                                }}
                                                                className="btn btn-sm bg-warning-light"
                                                            >

                                                                view details
                                </Button>{' '}
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.handleShowDisputeOrderModal();
                                                                }}
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                Dispute Order
                                </Button>{' '}
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.handleShowReceivedAndReleaseModal();
                                                                }}
                                                                className="btn btn-sm bg-success-light"
                                                            >
                                                                Received and Release Funds
                                </Button>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )) : (
                        props.underShipmentOrders.length === 0 ? (
                            <p>No Order is in under Delivery</p>
                        ) : (
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
                                                <th>Created At</th>
                                                <th>Upadated At</th>
                                                <th>Price</th>

                                                <th style={{ textAlign: 'center' }} >Actions</th>

                                                {/* <th className="text-right">Actions</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {props.underShipmentOrders.map((i, index) => (
                                                <tr key={i._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{i.exporterId.name}</td>
                                                    <td>{i.importerId !== null ? (i.importerId.name) : (null)}</td>
                                                    <td>
                                                        {i.documentsByImporter.map((file) => {
                                                            return (
                                                                <tr>
                                                                    {file.name}{" "}
                                                                    {"   "} <a
                                                                        href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                        download
                                                                        target='_blank'
                                                                        rel="noopener noreferrer"
                                                                    // onClick={e => download(e, i.name, file.url)}
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
                                                                    {"   "} <a
                                                                        href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                        download
                                                                        target='_blank'
                                                                        rel="noopener noreferrer"
                                                                    // onClick={e => download(e, i.name, file.url)}
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
                                                        {
                                                            <div className="actions">
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.setShow(true);
                                                                    }}
                                                                    className="btn btn-sm btn-block bg-warning-light"
                                                                >

                                                                    view details
                                        </Button>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                    )}
            </TabPanel>
            <TabPanel value={props.value} index={6}>
                {props.completedOrders.length === 0 ? (
                    <p>No Order is Completed</p>
                ) : (
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
                                        <th>Created At</th>
                                        <th>Upadated At</th>
                                        <th>Price</th>
                                        <th style={{ textAlign: 'center' }} >Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.completedOrders.map((i, index) => (
                                        <tr key={i._id}>
                                            <td>{index + 1}</td>
                                            <td>{i.exporterId.name}</td>
                                            <td>{i.importerId.name}</td>
                                            <td>
                                                {i.documentsByImporter.map((file) => {
                                                    return (
                                                        <tr>
                                                            {file.name}{" "}
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                            {"   "} <a
                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                download
                                                                target='_blank'
                                                                rel="noopener noreferrer"
                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                {
                                                    <div className="actions">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                props.setOrder(i);
                                                                props.setShow(true);
                                                            }}
                                                            className="btn btn-sm btn-block bg-warning-light"
                                                        >

                                                            view details
                                </Button>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </TabPanel>
            <TabPanel value={props.value} index={7}>
                {jwtDecoded.roles[0] === "importer" ? (
                    props.fundsLockedOrders.length === 0 ? (
                        <p>No Order is In Funds Locked</p>
                    ) : (
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
                                            <th>Created At</th>
                                            <th>Upadated At</th>
                                            <th>Price</th>
                                            <th style={{ textAlign: 'center' }} >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.fundsLockedOrders.map((i, index) => (
                                            <tr key={i._id}>
                                                <td>{index + 1}</td>
                                                <td>{i.exporterId.name}</td>
                                                <td>{i.importerId.name}</td>
                                                <td>
                                                    {i.documentsByImporter.map((file) => {
                                                        return (
                                                            <tr>
                                                                {file.name}{" "}
                                                                {"   "} <a
                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                    download
                                                                    target='_blank'
                                                                    rel="noopener noreferrer"
                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                                {"   "} <a
                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                    download
                                                                    target='_blank'
                                                                    rel="noopener noreferrer"
                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                    {
                                                        <div className="actions">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.setShow(true);
                                                                }}
                                                                className="btn btn-sm btn-block bg-warning-light"
                                                            >

                                                                view details
                                </Button>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                ) : (null)}
            </TabPanel>
        </div>
    );
}
