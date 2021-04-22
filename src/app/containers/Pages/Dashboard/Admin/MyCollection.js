import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    TablePagination,
    Typography
} from '@material-ui/core/';
import CardActionArea from '@material-ui/core/CardActionArea';
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
import CollectionCard from '../../../../components/Cards/CollectionCard';
import { useSnackbar } from 'notistack';
import { Spinner } from "react-bootstrap";
import { Link } from 'react-router-dom';
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
    cardHeight: {
        maxWidth: 345,
    },
    media: {
        // height: 140,
        height: 0,
        paddingTop: '100%', // 16:9
    },
});


function MyCollection(props) {
    const { enqueueSnackbar } = useSnackbar();
    let [collections, setCollections] = useState([]);
    let [collection, setCollection] = useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [page, setPage] = React.useState(0);
    let [isCreating, setIsCreating] = useState(false);
    let [open, setOpen] = useState(false);

    let [collectionCount, setCollectionCount] = useState(0);

    const classes = useStyles();
    let getCollections = (start, end) => {
        // axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
        //     "Authorization"
        // )}`;
        setOpen(true);
        axios
            .get(`/collection/collections/${start}/${end}`)
            .then((response) => {
                console.log("response.data", response.data);
                setCollections(response.data.Collectiondata);
                setCollectionCount(response.data.CollectionCount)
                setOpen(false);
            })
            .catch((error) => {
                console.log(error.response.data);
                if (error.response.data !== undefined) {
                    if (error.response.data === "Unauthorized access (invalid token) !!") {
                        Cookies.remove("Authorization");
                        window.location.reload();
                    }
                }
                setOpen(false);
            });
    };

    let createCollections = () => {
        setIsCreating(true);
        let CollectionData = {
            collectiontitle: collection
        }
        axios
            .post(`/collection/createcollection`, CollectionData)
            .then((response) => {
                setIsCreating(false);
                console.log("response.data", response);
                setCollection("response.data.Collectiondata");

                let variant = "success";
                enqueueSnackbar('Collection Created Successfully .', { variant });
                getCollections()
            })
            .catch((error) => {
                console.log(error.response);
                setIsCreating(false);
                let variant = "error";
                enqueueSnackbar('Unable to Create Collection .', { variant });
            });
    };
    const handleChangePage = (event, newPage) => {
        console.log("newPage", newPage);
        setPage(newPage);
        console.log("Start", newPage * rowsPerPage);
        console.log("End", newPage * rowsPerPage + rowsPerPage);
        getCollections(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        getCollections(0, parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        getCollections(0, rowsPerPage);
        props.setActiveTab({
            dashboard: "",
            totalUserAccount: "",
            pendingUserAccount: "",
            newSupefNFT: "",
            myNFTs: "",
            newCollection: "active",
            mySeason: "",
            tradeListOrders: "",
            myDrops: "",
            myCubes: "",
            referralEarnings: "",
            disputedOrders: "",
            resolvedDisputedOrders: "",
            settings: "",
            changePassword: "",
            newRandomDrop: ""
        });// eslint-disable-next-line
    }, []);
    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Collections</li>
            </ul>
            {/* <div className="container">
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <input type='text' onChange={(e) => setCollection(e.target.value)} value={collection} placeholder="Collection Name" className="form-control" />

                            </Col>
                            <div class="input-group-prepend">
                                {collection !== "" ? (
                                    isCreating ? (
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
                                        <button type="button" onClick={() => createCollections()} className="btn submit-btn">Create New Collection</button>
                                    )
                                ) : (<button type="button" disabled className="btn submit-btn">Create New Collection</button>)}

                            </div>
                        </Row>
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </div> */}
            <div className="card-body">
                <div className={classes.root}>
                    {open ? (
                        <div align="center" className="text-center">
                            <Spinner
                                animation="border"
                                role="status"
                                style={{ color: "#ff0000" }}
                            >

                            </Spinner>
                            <span style={{ color: "#ff0000" }} className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            justify="flex-start"
                        >
                            {collections.map((i, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Link to={"/dashboard/collection/nfts/" + i._id}>
                                        <Card style={{ height: "100%" }} variant="outlined" className={classes.cardHeight}>
                                            <CardActionArea>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={i.image}
                                                    title="Contemplative Reptile"
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" className="text-center" component="h2">
                                                        {i.collectiontitle}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </div>
            </div>
            <TablePagination
                rowsPerPageOptions={[4, 8, 12, 24]}
                component="div"
                count={collectionCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div >
    );
}

export default MyCollection;
