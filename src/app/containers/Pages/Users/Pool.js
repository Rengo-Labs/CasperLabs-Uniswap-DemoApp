import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Container } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { CLPublicKey } from 'casper-js-sdk';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
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
// let RecipientType = CLPublicKey | CLAccountHash | CLByteArray;
function Pool(props) {
    const classes = useStyles();
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));

    const [userPairs, setUserPairs] = useState([])
    const [userPairsData, setUserPairsData] = useState([])
    const [userData, setUserData] = useState([])
    const [error, setError] = useState()
    const [ispairList, setIsPairList] = useState(false)
    const [isError, setIsError] = useState(false)
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            let param = {
                user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
            }
            axios
                .post('/getpairagainstuser', param)
                .then((res) => {
                    console.log('res', res)
                    // console.log('res.data', res.data)
                    // console.log("res.data.userpairs", res.data.userpairs)
                    // console.log("res.data.pairsdata", res.data.pairsdata)
                    // console.log("res.data.userpairs.length", res.data.userpairs.length);
                    setUserPairs(res.data.userpairs)
                    setUserPairsData(res.data.pairsdata)
                    setUserData(res.data.pairsdata)
                    // console.log(userPairsData);
                    // console.log("res.data.userpairs.length", res.data.userpairs.length);
                    for (let i = 0; i < res.data.userpairs.length; i++) {
                        let param = {
                            to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
                            pairid: res.data.pairsdata[i].id
                        }
                        console.log('await Signer.getSelectedPublicKeyBase64()',
                            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))

                        axios
                            .post('/liquidityagainstuserandpair', param)
                            .then((res1) => {
                                console.log('liquidityagainstuserandpair', res1)
                                // console.log("res.data.", res.data);
                                // setLiquidity(res1.data.liquidity)
                                // res.data.userpairs[i] = res.data.pairsdata[i]
                                res.data.userpairs[i].liquidity = res1.data.liquidity
                                // console.log("res.data.userpairs[i]", res.data.userpairs[i])
                                setUserPairs(res.data.userpairs)
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

                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                    setIsError(true)
                    setError("There is no pair against this user.")
                })
        }// eslint-disable-next-line
    }, [activePublicKey]);
    // console.log("userPairs", userPairs);
    // console.log("userPairsData", userPairsData);

    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Pool"} />
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
                                                                            <Col><Typography>{i.reserve0 / 10 ** 9}</Typography></Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>Pooled {userPairsData[index].token1.name}:</Col>
                                                                            <Col><Typography>{i.reserve1 / 10 ** 9}</Typography></Col>
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
