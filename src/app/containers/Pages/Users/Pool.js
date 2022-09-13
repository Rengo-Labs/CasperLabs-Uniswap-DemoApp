import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Container } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { CLPublicKey } from 'casper-js-sdk';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import Spinner from "react-bootstrap/Spinner";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import HeaderHome from "../../../components/Headers/Header";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));
// let RecipientType = CLPublicKey | CLAccountHash | CLByteArray;
function Pool(props) {
    const classes = useStyles();
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    let [selectedWallet, setSelectedWallet] = useState(localStorage.getItem("selectedWallet"));
    let [,setTorus] = useState();
    const [userPairs, setUserPairs] = useState([])
    const [userPairsData, setUserPairsData] = useState([])
    const [error, setError] = useState()
    const [ispairList, setIsPairList] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            setIsLoading(true)
            let param = {
                user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
            }
            axios
                .post('/getpairagainstuser', param)
                .then(async (res) => {
                    console.log('res', res)
                    setUserPairs(res.data.userpairs)
                    setUserPairsData(res.data.pairsdata)
                    for (let i = 0; i < res.data.userpairs.length; i++) {
                        let pathParamsArr = [
                            res.data.pairsdata[i].token0.symbol,
                            res.data.pairsdata[i].token1.symbol,
                        ]
                        let pathResParam = {
                            path: pathParamsArr
                        }
                        console.log("pathResParam", pathResParam);
                        await axios
                            .post('/getexchangerates', pathResParam)
                            .then((res1) => {
                                console.log('getexchangerates', res1)
                                if (res1.data.rate0 && res1.data.rate1) {
                                    let rat0 = res1.data.rate0;
                                    let rat1 = res1.data.rate1;
                                    console.log("rat0", rat0);
                                    console.log("rat1", rat1);
                                    console.log("res.data.userpairs[i].reserve0", res.data.userpairs[i].reserve0);
                                    console.log("res.data.userpairs[i].reserve1", res.data.userpairs[i].reserve1);
                                    if (rat0 < rat1 && parseInt(res.data.userpairs[i].reserve0) < parseInt(res.data.userpairs[i].reserve1)) {
                                        console.log('1');
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve1
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve0
                                    } else if (rat0 < rat1 && parseInt(res.data.userpairs[i].reserve0) > parseInt(res.data.userpairs[i].reserve1)) {
                                        console.log('2');
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve0
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve1
                                    } else if (rat0 > rat1 && parseInt(res.data.userpairs[i].reserve0) < parseInt(res.data.userpairs[i].reserve1)) {
                                        console.log('3');
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve0
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve1
                                    } else if (rat0 > rat1 && parseInt(res.data.userpairs[i].reserve0) > parseInt(res.data.userpairs[i].reserve1)) {
                                        console.log('4');
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve1
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve0
                                    }
                                }

                            })
                            .catch((error) => {
                                console.log(error)
                                console.log(error.response)
                            })


                        let param = {
                            to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
                            pairid: res.data.pairsdata[i].id
                        }
                        console.log('await Signer.getSelectedPublicKeyBase64()',
                            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))

                        await axios
                            .post('/liquidityagainstuserandpair', param)
                            .then((res1) => {
                                console.log('liquidityagainstuserandpair', res1)
                                res.data.userpairs[i].liquidity = res1.data.liquidity
                                setUserPairs(res.data.userpairs)
                                console.log("res.data.userpairs", res.data.userpairs);
                                setUserPairsData(res.data.pairsdata)
                                setIsPairList(true)
                                setIsError(false)
                                setError()
                            })
                            .catch((error) => {
                                console.log(error)
                                console.log(error.response)
                            })
                    }

                    setIsLoading(false)


                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                    setIsError(true)
                    setError("There is no pair against this user.")
                })
        }// eslint-disable-next-line
    }, [activePublicKey]);

    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} setSelectedWallet={setSelectedWallet} selectedWallet={selectedWallet} setTorus={setTorus} selectedNav={"Pool"} />
                    <div style={{ backgroundColor: '#e846461F' }} className="card">
                        <div className="container-fluid">
                            <div className="content" style={{ paddingTop: "150px", minHeight: "100vh" }} position="absolute">
                                <div className="container-fluid">
                                    <div className="row" style={{ height: `${props.windowHeight}` }}>
                                        <div className="col-md-6 offset-md-3">
                                            <div className="account-content">
                                                <h3>
                                                    My Liquidity Positions
                                                </h3>
                                            </div>
                                            <div className="account-content">
                                                {!ispairList && !isError ? (
                                                    <Card style={{ marginBottom: '10px' }} className={classes.root}>
                                                        <CardContent >
                                                            <Alert style={{ marginBottom: '0px' }} color="light">
                                                                Connect to a wallet to view your liquidity.
                                                            </Alert>
                                                        </CardContent>
                                                    </Card>
                                                ) : isError && error ? (
                                                    <Card style={{ marginBottom: '10px' }} className={classes.root}>
                                                        <CardContent >
                                                            <Alert style={{ marginBottom: '0px' }} color="light">
                                                                No liquidity was found
                                                            </Alert>
                                                        </CardContent>
                                                    </Card>
                                                ) : isLoading ? (
                                                    <Card style={{ marginBottom: '10px' }} className={classes.root}>
                                                        <CardContent >
                                                            <Alert style={{ marginBottom: '0px' }} color="light">
                                                                <div className="text-center">
                                                                    <Spinner
                                                                        animation="border"
                                                                        role="status"
                                                                        style={{ color: "#e84646" }}
                                                                    >
                                                                        <span className="sr-only">Loading...</span>
                                                                    </Spinner>
                                                                </div>
                                                            </Alert>
                                                        </CardContent>
                                                    </Card>
                                                ) : (
                                                    userPairs.map((i, index) => (
                                                        <Accordion style={{ marginBottom: '10px' }} key={index} expanded={expanded === index} onChange={handleChange(index)}>
                                                            <AccordionSummary
                                                                expandIcon={<i className="fas fa-chevron-down"></i>}
                                                                aria-controls="panel1bh-content"
                                                                id="panel1bh-header"
                                                            >
                                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                                    {userPairsData[index].token0.name} / {userPairsData[index].token1.name}
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails >
                                                                <Card style={{ backgroundColor: '#e846461F' }} className={classes.root}>
                                                                    <CardContent>
                                                                        <Row>
                                                                            <Col>Your total Pool Tokens:</Col>
                                                                            <Col><Typography>{(i.reserve0 / i.reserve1).toFixed(5)}</Typography></Col>
                                                                        </Row>

                                                                        {i.liquidity ? (
                                                                            <Row>
                                                                                <Col>Your Liquidity:</Col>
                                                                                <Col><Typography>{(i.liquidity / 10 ** 9)}</Typography></Col>
                                                                            </Row>
                                                                        ) : (null)}

                                                                        <Row>
                                                                            <Col>Pooled {userPairsData[index].token0.name}:</Col>
                                                                            <Col><Typography>{i.rat0 / 10 ** 9}</Typography></Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>Pooled {userPairsData[index].token1.name}:</Col>
                                                                            <Col><Typography>{i.rat1 / 10 ** 9}</Typography></Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                    <Container>
                                                                        <Row>
                                                                            <Col>
                                                                                <Link to='/pool/addLiquidity'>
                                                                                    <button
                                                                                        className="btn-block btn-primary btn-lg"
                                                                                        style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                                                        Add
                                                                                    </button>
                                                                                </Link>
                                                                            </Col>
                                                                            <Col>
                                                                                <Link to={`/pool/removeLiquidity/${userPairsData[index].token0.id}/${userPairsData[index].token1.id}`}>
                                                                                    <button
                                                                                        className="btn-block btn-primary btn-lg"
                                                                                        style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                                                        Remove
                                                                                    </button>
                                                                                </Link>
                                                                            </Col>
                                                                        </Row>
                                                                    </Container>
                                                                </Card>
                                                                {/* </Typography> */}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))
                                                )}
                                                {/* <Link to='/pool/addLiquidity'>
                                                    <Button variant="primary" style={{ margin: '10px' }}>
                                                        Create Pair
                                                    </Button>
                                                </Link> */}
                                                <Link to='/pool/addLiquidity'>
                                                    <button
                                                        className="btn-block btn-primary btn-lg"
                                                        style={{ marginBottom: '10px' }}>
                                                        Add Liquidity
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >


        </div >
    );
}

export default Pool;
