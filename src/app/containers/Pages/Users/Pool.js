import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from 'react-bootstrap';
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

    const [userPairs, setuserPairs] = useState([])
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
                user: activePublicKey
            }
            axios
                .post('/getpairsagainstuser', param)
                .then((res) => {
                    console.log('resresres', res)
                    console.log(res.data.userpairs)
                    setIsPairList(true)
                    setIsError(false)
                    setError()
                    setuserPairs(res.data.userpairs)
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
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Pool"} />
                    <div className="card">
                        <div className="container-fluid">
                            <div className="content" style={{ paddingTop: "150px", minHeight: "100vh" }} position="absolute">
                                <div className="container-fluid">
                                    <div className="row" style={{ height: `${props.windowHeight}`, marginRight: "px" }}>
                                        <div className="col-md-4 offset-md-4">
                                            <div className="account-content">
                                                <Link to='/pool/addLiquidity'>
                                                    <Button variant="primary" style={{ margin: '10px' }}>
                                                        Create Pair
                                                    </Button>
                                                </Link>
                                                <Link to='/pool/addLiquidity'>
                                                    <Button variant="primary" style={{ margin: '10px' }}>
                                                        Add Liquidity
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="account-content">
                                                {!ispairList && !isError ? (
                                                    <Alert color="info">
                                                        Connect to a wallet to view your liquidity.
                                                    </Alert>
                                                ) : isError && error ? (
                                                    <Alert color="info">
                                                        {error}
                                                    </Alert>
                                                ) : (
                                                    userPairs.map((i, index) => (
                                                        <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                                                            <AccordionSummary
                                                                expandIcon={<i className="fas fa-chevron-down"></i>}
                                                                aria-controls="panel1bh-content"
                                                                id="panel1bh-header"
                                                            >
                                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                                    {i.token0.name}/{i.token1.name}
                                                                </Typography>
                                                                {/* <Typography sx={{ color: 'text.secondary' }}>{i.token0.name}/{i.token1.name}</Typography> */}
                                                            </AccordionSummary>
                                                            <AccordionDetails >
                                                                {/* <Typography sx style={{border:'1px solid'}}> */}
                                                                <Card className={classes.root}>
                                                                    <CardContent>
                                                                        <Row>
                                                                            <Col>Your total Pool Tokens</Col>
                                                                            <Col><Typography>{(i.reserve0 / i.reserve1).toFixed(5)}</Typography></Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>Pooled {i.token0.name}</Col>
                                                                            <Col><Typography>{i.reserve0 / 10 ** 9}</Typography></Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>Pooled {i.token1.name}</Col>
                                                                            <Col><Typography>{i.reserve1 / 10 ** 9}</Typography></Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                    <Link to='/pool/addLiquidity'>
                                                                        <Button variant="primary" style={{ margin: '10px' }}>
                                                                            Add Liquidity
                                                                        </Button>
                                                                    </Link>
                                                                    <Link to={`/pool/removeLiquidity/${i.token0.id}/${i.token1.id}`}>
                                                                        <Button variant="primary" style={{ margin: '10px' }}>
                                                                            Remove Liquidity
                                                                        </Button>
                                                                    </Link>
                                                                </Card>
                                                                {/* </Typography> */}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))
                                                )}
                                                {/* <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                                        <AccordionSummary
                                                            expandIcon={<i className="fas fa-chevron-down"></i>}
                                                            aria-controls="panel2bh-content"
                                                            id="panel2bh-header"
                                                        >
                                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
                                                            <Typography sx={{ color: 'text.secondary' }}>
                                                                You are currently not an owner
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography>
                                                                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                                                varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                                                laoreet.
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                                        <AccordionSummary
                                                            expandIcon={<i className="fas fa-chevron-down"></i>}
                                                            aria-controls="panel3bh-content"
                                                            id="panel3bh-header"
                                                        >
                                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                                Advanced settings
                                                            </Typography>
                                                            <Typography sx={{ color: 'text.secondary' }}>
                                                                Filtering has been entirely disabled for whole web server
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography>
                                                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                                                amet egestas eros, vitae egestas augue. Duis vel est augue.
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                                                        <AccordionSummary
                                                            expandIcon={<i className="fas fa-chevron-down"></i>}
                                                            aria-controls="panel4bh-content"
                                                            id="panel4bh-header"
                                                        >
                                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography>
                                                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                                                amet egestas eros, vitae egestas augue. Duis vel est augue.
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion> */}
                                                {/* </Card> */}
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
