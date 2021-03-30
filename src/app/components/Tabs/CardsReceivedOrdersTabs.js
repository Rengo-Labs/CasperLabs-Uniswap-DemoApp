import {
    Card,
    CardContent, Grid
} from '@material-ui/core/';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import ErrorIcon from '@material-ui/icons/Error';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LockIcon from '@material-ui/icons/Lock';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import PropTypes from 'prop-types';
import React from 'react';
import { Spinner } from 'react-bootstrap';



// const useStyles = makeStyles((theme) => ({

// }));
function CardsTabPanel(props) {

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

CardsTabPanel.propTypes = {
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

export default function ScrollableTabsButtonForce(props) {
    const classes = useStyles();
    // const [value, setValue] = React.useState(0);

    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);

    console.log("props", props.pendingOrdersCount);

    const handleChange = (event, newValue) => {
        props.setValue(newValue);
    };
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
                    {/* <div > */}
                    <Tab label="New" icon={
                        <Badge badgeContent={props.pendingOrders.length.toString()} color="primary">
                            <NewReleasesIcon />
                        </Badge>
                    } {...a11yProps(0)}></Tab>
                    {/* </div> */}
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
            <CardsTabPanel value={props.value} index={0}>
                {props.pendingOrders.length === 0 ? (
                    <p>No New Orders Found</p>
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
                                    {props.pendingOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                    </CardContent>
                                                    {props.isRejecting ? (
                                                        <div className="text-center">
                                                            <Spinner
                                                                animation="border"
                                                                role="status"
                                                                className="bg-danger-light"
                                                            //   style={{ color: "#00d0f1" }}
                                                            >
                                                                <span className="sr-only">Loading...</span>
                                                            </Spinner>
                                                        </div>
                                                    ) : (
                                                            <div className="actions">
                                                                <CardActions>
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            props.rejectOrder(i._id);
                                                                        }}
                                                                        // block
                                                                        className="btn btn-sm btn-block bg-danger-light"
                                                                    >
                                                                        Reject Order
                </Button>
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            props.setOrder(i);
                                                                            props.handleShowAcceptModal();
                                                                        }}
                                                                        className="btn btn-sm btn-block bg-success-light"
                                                                    // block
                                                                    >
                                                                        Accept Order
                </Button>
                                                                </CardActions>

                                                            </div>

                                                        )}




                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}

            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={1}>
                {props.acceptedOrders.length === 0 ? (
                    <p>No Accepted Orders Found</p>
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
                                    {props.acceptedOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
                                                                            >
                                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            {jwtDecoded.roles[0] === "importer" ? (
                                                                <CardActions>
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            props.setOrder(i);
                                                                            props.handleShowUploadModal()
                                                                        }}
                                                                        className="btn btn-sm btn-block bg-warning-light"
                                                                    >
                                                                        <i className="fa fa-upload" aria-hidden="true"></i>
                              Upload More Documents
                    </Button>
                                                                </CardActions>
                                                            ) : (null)}
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
                                                                            >
                                                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            {jwtDecoded.roles[0] === "exporter" ? (
                                                                <CardActions>

                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            props.setOrder(i);
                                                                            props.handleShowUploadModal()
                                                                        }}
                                                                        className="btn btn-sm btn-block bg-warning-light"
                                                                    >
                                                                        <i className="fa fa-upload" aria-hidden="true"></i>
                              Upload More Documents
                    </Button>
                                                                </CardActions>
                                                            ) : (null)}
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
                                                    </CardContent>
                                                    <div style={{ alignContent: 'center', alignItems: 'center' }}>

                                                        <CardActions>
                                                            {(jwtDecoded.roles[0] === "importer" && i.documentsByExporter.length === 0) || (jwtDecoded.roles[0] === "exporter" && i.documentsByImporter.length === 0) ? (
                                                                <Button
                                                                    disabled
                                                                    // onClick={(e) => {
                                                                    //     e.preventDefault();

                                                                    //     // props.setOrder(i);
                                                                    //     // props.handleShowAcceptRejectModal();
                                                                    // }}
                                                                    className="btn btn-sm btn-block bg-info-light"
                                                                    block
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
                                                                        className="btn btn-sm btn-block bg-info-light"
                                                                        block
                                                                    >
                                                                        Accept/Reject Documents
                                                                    </Button>
                                                                )}

                                                        </CardActions>
                                                        <CardActions>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.handleShowFinalizeModal();
                                                                }}
                                                                className="btn btn-sm btn-block bg-success-light"
                                                                block
                                                            >
                                                                FInalize Order
                            </Button>
                                                        </CardActions>
                                                    </div>
                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}
            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={2}>
                {props.rejectedOrders.length === 0 ? (
                    <p>No Rejected Orders Found</p>
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
                                    {props.rejectedOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                    </CardContent>
                                                    <div >
                                                        <CardActions>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.setShow(true);
                                                                }}
                                                                className="btn btn-sm btn-block bg-warning-light"
                                                                block
                                                            >
                                                                view details
                    </Button>
                                                        </CardActions>
                                                    </div>
                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}

            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={3}>
                {props.finalizedOrders.length === 0 ? (
                    <p>No Finalized Orders Found</p>
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
                                    {props.finalizedOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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

                                                        {jwtDecoded.roles[0] === "importer" ? (
                                                            <Typography className={classes.title} style={{ wordWrap: 'break-word' }} color="textSecondary" gutterBottom><strong> Agreement Address: </strong>
                                                                {i.Agreement_Address !== undefined ? (
                                                                    <p>{i.Agreement_Address}</p>
                                                                ) : (
                                                                        <p>Waiting for Exporter to Finalize</p>
                                                                    )}
                                                            </Typography>
                                                        ) : (null)}

                                                    </CardContent>
                                                    <div >
                                                        <CardActions>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.setShow(true);
                                                                }}
                                                                className="btn btn-sm btn-block bg-warning-light"
                                                                block
                                                            >
                                                                view details
            </Button>
                                                            {/* </CardActions>
                                                        <CardActions> */}
                                                            {jwtDecoded.roles[0] === "importer" ? (
                                                                i.isexporterstatusfinalized && i.Agreement_Address !== undefined ? (
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            props.setOrder(i);
                                                                            props.handleShowLockFundsModal();
                                                                        }}
                                                                        block
                                                                        className="btn btn-sm btn-block bg-danger-light "
                                                                    >

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
                                                                            block
                                                                            className="btn btn-sm btn-block bg-danger-light not-allowed"
                                                                        >

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
                                                                            block
                                                                            className="btn btn-sm btn-block bg-success-light"
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
                                                                                block
                                                                                className="btn btn-sm btn-block bg-success-light not-allowed"
                                                                            >

                                                                                Create Shipment
                                                                            </Button>
                                                                        )

                                                                )}
                                                        </CardActions>
                                                    </div>
                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}
            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={4}>
                {props.disputedOrders.length === 0 ? (
                    <p>No Disputed Orders Yet</p>
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
                                    {props.disputedOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                    </CardContent>
                                                    <div >
                                                        <CardActions>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.setShow(true);
                                                                }}
                                                                className="btn btn-sm btn-block bg-warning-light"
                                                                block
                                                            >
                                                                view details
            </Button>
                                                        </CardActions>
                                                    </div>
                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}
            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={5}>
                {jwtDecoded.roles[0] === "importer" ? (
                    props.underDeliveryOrders.length === 0 ? (
                        <p>No Order is in under Delivery</p>
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
                                        {props.underDeliveryOrders.map((i, index) => (
                                            <>

                                                <Grid item xs={12} sm={6} md={3} key={index}>
                                                    <Card style={{ height: "100%" }} variant="outlined">
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
                                                                                {"   "} <a
                                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                    download
                                                                                    target='_blank'
                                                                                    rel="noopener noreferrer"
                                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                                                {"   "} <a
                                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                    download
                                                                                    target='_blank'
                                                                                    rel="noopener noreferrer"
                                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                            <Typography className={classes.title} style={{ wordWrap: 'break-word' }} color="textSecondary" gutterBottom>
                                                                <strong> Agreement Address: </strong>
                                                                {i.Agreement_Address}
                                                            </Typography>
                                                        </CardContent>
                                                        <div >
                                                            <CardActions>
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.setShow(true);
                                                                    }}
                                                                    className="btn btn-sm btn-block bg-warning-light"
                                                                    block
                                                                >
                                                                    view details
                </Button>
                                                            </CardActions>
                                                            <CardActions>
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.handleShowDisputeOrderModal();
                                                                    }}
                                                                    className="btn btn-sm btn-block bg-danger-light"
                                                                    block
                                                                >
                                                                    Dispute Order
                </Button>
                                                            </CardActions>
                                                            <CardActions>
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.handleShowReceivedAndReleaseModal();
                                                                    }}
                                                                    className="btn btn-sm btn-block bg-success-light"
                                                                    block
                                                                >
                                                                    Received and Release Funds
                </Button>
                                                            </CardActions>
                                                        </div>
                                                    </Card>
                                                </Grid>

                                            </>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                        )) : (
                        props.underShipmentOrders.length === 0 ? (
                            <p>No Order is in under Shipment</p>
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
                                            {props.underShipmentOrders.map((i, index) => (
                                                <>

                                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                                        <Card style={{ height: "100%" }} variant="outlined">
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
                                                                                    {"   "} <a
                                                                                        href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                        download
                                                                                        target='_blank'
                                                                                        rel="noopener noreferrer"
                                                                                    // onClick={e => download(e, i.name, file.url)}
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
                                                                                    {"   "} <a
                                                                                        href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                        download
                                                                                        target='_blank'
                                                                                        rel="noopener noreferrer"
                                                                                    // onClick={e => download(e, i.name, file.url)}
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
                                                            </CardContent>
                                                            <div >
                                                                <CardActions>
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            props.setOrder(i);
                                                                            props.setShow(true);
                                                                        }}
                                                                        className="btn btn-sm btn-block bg-warning-light"
                                                                        block
                                                                    >
                                                                        view details
            </Button>
                                                                </CardActions>
                                                            </div>
                                                        </Card>
                                                    </Grid>

                                                </>
                                            ))}
                                        </Grid>
                                    </div>
                                </div>
                            )
                    )}
            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={6}>
                {props.completedOrders.length === 0 ? (
                    <p>No Order is Completed</p>
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
                                    {props.completedOrders.map((i, index) => (
                                        <>

                                            <Grid item xs={12} sm={6} md={3} key={index}>
                                                <Card style={{ height: "100%" }} variant="outlined">
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                                            {"   "} <a
                                                                                href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                download
                                                                                target='_blank'
                                                                                rel="noopener noreferrer"
                                                                            // onClick={e => download(e, i.name, file.url)}
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
                                                    </CardContent>
                                                    <div >
                                                        <CardActions>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    props.setOrder(i);
                                                                    props.setShow(true);
                                                                }}
                                                                className="btn btn-sm btn-block bg-warning-light"
                                                                block
                                                            >
                                                                view details
    </Button>
                                                        </CardActions>
                                                    </div>
                                                </Card>
                                            </Grid>

                                        </>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    )}
            </CardsTabPanel>
            <CardsTabPanel value={props.value} index={7}>
                {jwtDecoded.roles[0] === "importer" ? (
                    props.fundsLockedOrders.length === 0 ? (
                        <p>No Order is In Funds Locked</p>
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
                                        {props.fundsLockedOrders.map((i, index) => (
                                            <>

                                                <Grid item xs={12} sm={6} md={3} key={index}>
                                                    <Card style={{ height: "100%" }} variant="outlined">
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
                                                                                {"   "} <a
                                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                    download
                                                                                    target='_blank'
                                                                                    rel="noopener noreferrer"
                                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                                                {"   "} <a
                                                                                    href={"https://imex-backend.herokuapp.com/" + file.url}
                                                                                    download
                                                                                    target='_blank'
                                                                                    rel="noopener noreferrer"
                                                                                // onClick={e => download(e, i.name, file.url)}
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
                                                        </CardContent>
                                                        <div >
                                                            <CardActions>
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        props.setOrder(i);
                                                                        props.setShow(true);
                                                                    }}
                                                                    className="btn btn-sm btn-block bg-warning-light"
                                                                    block
                                                                >
                                                                    view details
        </Button>
                                                            </CardActions>
                                                        </div>
                                                    </Card>
                                                </Grid>

                                            </>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                        )
                ) : (null)}
            </CardsTabPanel>
        </div >
    );
}
