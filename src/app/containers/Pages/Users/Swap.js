import { Avatar, CardHeader } from '@material-ui/core/';
import Card from '@material-ui/core/Card';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import Typography from '@material-ui/core/Typography';
import windowSize from "react-window-size";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";
import { useSnackbar } from 'notistack';


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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    card: {
        minWidth: 250,
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9
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
function Swap(props) {
    const classes = useStyles();
    const theme = useTheme();
    let [userName, setUserName] = useState();
    let [priceInUSD, setPriceInUSD] = useState();
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [tokenANumber, setTokenANumber] = useState();
    let [tokenBNumber, setTokenBNumber] = useState();
    const [tokenList, setTokenList] = useState([])
    const [istokenList, setIsTokenList] = useState(false)
    let [isLoading, setIsLoading] = useState(false);
    let [msg, setMsg] = useState("");


    let handleSubmitEvent = (event) => {
        setMsg("");
        setIsLoading(true);
        event.preventDefault();

    };
    useEffect(() => {
        axios
            .get('/tokensList')
            .then((res) => {
                console.log('resresres', res)
                console.log(res.data.tokens)
                setIsTokenList(true)
                setTokenList(res.data.tokens)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })// eslint-disable-next-line
        axios
            .post("priceconversion", {
                symbolforconversion: "CSPR",
                symboltoconvertto: "USD",
                amount: 1
            })
            .then((response) => {
                console.log("response", response.data.worth.USD);
                setPriceInUSD(response.data.worth.USD);
            })
            .catch((error) => {
                console.log("response", error.response);
            });
    }, []);

    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome selectedNav={"Swap"} />
                    <div className="card">
                        <div className="container-fluid">
                            <div
                                className="content"
                                style={{ paddingTop: "180px", height: "150vh" }}
                                position="absolute"
                            >
                                <div className="container-fluid">
                                    <div
                                        className="row"
                                        style={{ height: `${props.windowHeight}`, marginRight: "px" }}
                                    >
                                        <div className="col-md-10 offset-md-1">
                                            <div className="account-content">
                                                <div className="row align-items-center justify-content-center">
                                                    <div className="col-md-12 col-lg-6 login-right">
                                                        <>
                                                            <div className="login-header">
                                                                <h3 style={{ textAlign: "center" }}>Swap</h3>
                                                            </div>
                                                            <form onSubmit={handleSubmitEvent}>
                                                                <div className="row">
                                                                    <div className="col-md-12 col-lg-8">
                                                                        <div className="filter-widget">
                                                                            <Autocomplete
                                                                                id="combo-dox-demo"
                                                                                required
                                                                                options={tokenList}
                                                                                getOptionLabel={(option) =>
                                                                                    option.name + ',' + option.symbol
                                                                                }
                                                                                onChange={(event, value) => {
                                                                                    console.log('event', event);
                                                                                    console.log('value', value);
                                                                                    setTokenA(value)
                                                                                    setTokenBNumber(0)
                                                                                    setTokenANumber(0)
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        label="Select a token"
                                                                                        variant="outlined"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12 col-lg-4">
                                                                        {tokenB && tokenA ? (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenANumber}
                                                                                placeholder={0}
                                                                                min={0}
                                                                                step={.01}
                                                                                className="form-control"
                                                                                onChange={(e) => {
                                                                                    // setTokenANumber(e.target.value)
                                                                                    if (tokenA.name === 'WCSPR' && tokenB.name === "WISE") {
                                                                                        setTokenANumber(e.target.value)
                                                                                        setTokenBNumber(e.target.value * (10 / 1))
                                                                                    }
                                                                                    else if (tokenA.name === 'WISE' && tokenB.name === "WCSPR") {
                                                                                        setTokenANumber(e.target.value)
                                                                                        setTokenBNumber(e.target.value * (1 / 10))
                                                                                    }
                                                                                    else if (tokenA.name === 'WCSPR' && tokenB.name === "USDC") {
                                                                                        setTokenANumber(e.target.value)
                                                                                        setTokenBNumber(e.target.value * (1 / 8))
                                                                                    }
                                                                                    else if (tokenA.name === 'USDC' && tokenB.name === "WCSPR") {
                                                                                        setTokenANumber(e.target.value)
                                                                                        setTokenBNumber(e.target.value * (8 / 1))
                                                                                    }
                                                                                    else {
                                                                                        setTokenANumber(e.target.value)
                                                                                        setTokenBNumber(e.target.value)
                                                                                    }
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenANumber}
                                                                                placeholder={0}
                                                                                className="form-control"
                                                                                disabled
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <br></br>
                                                                <div className="row">
                                                                    <div className="col-md-12 col-lg-8">
                                                                        <div className="filter-widget">
                                                                            <Autocomplete
                                                                                id="combo-dox-demo"
                                                                                required
                                                                                options={tokenList}
                                                                                // disabled={isDisabledImporter}
                                                                                getOptionLabel={(option) =>
                                                                                    option.name + ',' + option.symbol
                                                                                }
                                                                                onChange={(event, value) => {
                                                                                    console.log('event', event);
                                                                                    console.log('value', value);
                                                                                    setTokenB(value)
                                                                                    setTokenBNumber(0)
                                                                                    setTokenANumber(0)
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        label="Select a token"
                                                                                        variant="outlined"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12 col-lg-4">
                                                                        {tokenB && tokenA ? (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenBNumber}
                                                                                placeholder={0}
                                                                                min={0}
                                                                                step={.01}
                                                                                className="form-control"
                                                                                onChange={(e) => {
                                                                                    if (tokenB.name === 'WCSPR' && tokenA.name === "WISE") {
                                                                                        setTokenBNumber(e.target.value)
                                                                                        setTokenANumber(e.target.value * (10 / 1))
                                                                                    }
                                                                                    else if (tokenB.name === 'WISE' && tokenA.name === "WCSPR") {
                                                                                        setTokenBNumber(e.target.value)
                                                                                        setTokenANumber(e.target.value * (1 / 10))
                                                                                    }
                                                                                    else if (tokenB.name === 'WCSPR' && tokenA.name === "USDC") {
                                                                                        setTokenBNumber(e.target.value)
                                                                                        setTokenANumber(e.target.value * (1 / 8))
                                                                                    }
                                                                                    else if (tokenB.name === 'USDC' && tokenA.name === "WCSPR") {
                                                                                        setTokenBNumber(e.target.value)
                                                                                        setTokenANumber(e.target.value * (8 / 1))
                                                                                    }
                                                                                    else {
                                                                                        setTokenBNumber(e.target.value)
                                                                                        setTokenANumber(e.target.value)
                                                                                    }

                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenBNumber}
                                                                                placeholder={0}
                                                                                disabled
                                                                                className="form-control"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {tokenA ? (
                                                                    <div className="card">
                                                                        <CardHeader
                                                                            avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                            title={tokenA.name}
                                                                            subheader={tokenA.symbol}
                                                                            contextMenu={tokenA.address}
                                                                        />
                                                                    </div>
                                                                ) : (null)}
                                                                {tokenB ? (
                                                                    <div className="card">
                                                                        <CardHeader
                                                                            avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                            title={tokenB.name}
                                                                            subheader={tokenB.symbol}
                                                                            contextMenu={tokenB.address}
                                                                        />
                                                                    </div>
                                                                ) : (null)}
                                                                <Row>
                                                                    <Col>
                                                                        {tokenA && tokenANumber > 0 ? (
                                                                            <button
                                                                                className="btn btn-block btn-lg login-btn"
                                                                                type="submit"
                                                                            >
                                                                                Approve {tokenA.name}
                                                                            </button>
                                                                        ) : (null)}
                                                                    </Col>
                                                                    <Col>
                                                                        {tokenB && tokenBNumber > 0 ? (
                                                                            <button
                                                                                className="btn btn-block btn-lg login-btn"
                                                                                type="submit"
                                                                            >
                                                                                Approve {tokenB.name}
                                                                            </button>
                                                                        ) : (null)}
                                                                    </Col>
                                                                </Row>
                                                                {tokenA && tokenB ? (
                                                                    <>
                                                                        <Typography variant="h5" color="textSecondary" component="p">
                                                                            <strong>Prices and pool share </strong>
                                                                        </Typography>
                                                                        <hr />
                                                                        <Row style={{ textAlign: 'center' }}>

                                                                            <Col>
                                                                                <Typography variant="body1" component="p">
                                                                                    {tokenA.name === 'WCSPR' && tokenB.name === "WISE" ? (
                                                                                        1 / 10
                                                                                    ) : tokenA.name === 'WISE' && tokenB.name === "WCSPR" ? (
                                                                                        10 / 1
                                                                                    ) : tokenA.name === 'WCSPR' && tokenB.name === "USDC" ? (
                                                                                        8 / 1
                                                                                    ) : tokenA.name === 'USDC' && tokenB.name === "WCSPR" ? (
                                                                                        1 / 8
                                                                                    ) : (
                                                                                        1
                                                                                    )}
                                                                                </Typography>
                                                                                <Typography variant="body1" component="p">
                                                                                    <strong> {tokenA.name} per {tokenB.name} </strong>
                                                                                </Typography>
                                                                            </Col>
                                                                            <Col>
                                                                                <Typography variant="body1" component="p">
                                                                                    {tokenB.name === 'WCSPR' && tokenA.name === "WISE" ? (
                                                                                        1 / 10
                                                                                    ) : tokenB.name === 'WISE' && tokenA.name === "WCSPR" ? (
                                                                                        10 / 1
                                                                                    ) : tokenB.name === 'WCSPR' && tokenA.name === "USDC" ? (
                                                                                        8 / 1
                                                                                    ) : tokenB.name === 'USDC' && tokenA.name === "WCSPR" ? (
                                                                                        1 / 8
                                                                                    ) : (
                                                                                        1
                                                                                    )}
                                                                                </Typography>
                                                                                <Typography variant="body1" component="p">
                                                                                    <strong> {tokenB.name} per {tokenA.name} </strong>
                                                                                </Typography>
                                                                            </Col>
                                                                            <Col>
                                                                                <Typography variant="body1" component="p">
                                                                                    10%
                                                                                </Typography>
                                                                                <Typography variant="body1" component="p">
                                                                                    <strong>Share of Swap</strong>

                                                                                </Typography>
                                                                            </Col>
                                                                        </Row>
                                                                    </>
                                                                ) : (
                                                                    null
                                                                )}
                                                                <div className="text-center">
                                                                    <p style={{ color: "red" }}>{msg}</p>
                                                                </div>

                                                                {isLoading ? (
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
                                                                    <button
                                                                        className="btn btn-block btn-lg login-btn"
                                                                        type="submit"
                                                                    >
                                                                        Swap
                                                                    </button>
                                                                )}
                                                            </form>
                                                        </>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer position={"relative"} />
            </div>


        </div >
    );
}

export default windowSize(Swap);
