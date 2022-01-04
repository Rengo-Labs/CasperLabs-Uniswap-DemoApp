import { Avatar, Card, CardContent, CardHeader } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import {
    CasperClient, CLAccountHash, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, DeployUtil, RuntimeArgs, Signer
} from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import windowSize from "react-window-size";
import { Some } from "ts-results";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';
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
function AddLiquidity(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    let [priceInUSD, setPriceInUSD] = useState(0);
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [tokenAAmount, setTokenAAmount] = useState(0);
    let [tokenBAmount, setTokenBAmount] = useState(0);
    let [approveAIsLoading, setApproveAIsLoading] = useState(false);
    let [approveBIsLoading, setApproveBIsLoading] = useState(false);
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));

    const [tokenList, setTokenList] = useState([])
    const [pairList, setPairList] = useState([])
    const [istokenList, setIsTokenList] = useState(false)
    const [ispairList, setIsPairList] = useState(false)
    let [isLoading, setIsLoading] = useState(false);
    let [msg, setMsg] = useState("");


    let handleSubmitEvent = (event) => {
        setMsg("");
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
                setPriceInUSD(response.data.worth.USD.price);
            })
            .catch((error) => {
                console.log("response", error.response);
            });
    }, []);
    useEffect(() => {
        let param = {
            user: activePublicKey
        }
        axios
            .post('/getpairsagainstuser', param)
            .then((res) => {
                console.log('resresres', res)
                console.log(res.data.pairList)
                setIsPairList(true)
                setPairList(res.data.pairList)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })// eslint-disable-next-line
    }, [activePublicKey]);
    function createRecipientAddress(recipient) {
        if (recipient instanceof CLPublicKey) {
            return new CLKey(new CLAccountHash(recipient.toAccountHash()));
        } else {
            return new CLKey(recipient);
        }
    };
    async function approveMakedeploy(contractHash, amount) {
        console.log('contractHash', contractHash);
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const spender = ROUTER_PACKAGE_HASH;
            const spenderByteArray = new CLByteArray(Uint8Array.from(Buffer.from(spender, 'hex')));
            const paymentAmount = 5000000000;
            const runtimeArgs = RuntimeArgs.fromMap({
                spender: createRecipientAddress(spenderByteArray),
                amount: CLValueBuilder.u256(amount * 10 ** 18)
            });

            let contractHashAsByteArray = Uint8Array.from(Buffer.from(contractHash.slice(5), "hex"));
            let entryPoint = 'approve';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy)
                console.log('result', result);
                let variant = "success";
                enqueueSnackbar('Approved Successfully', { variant });
            }
            catch {
                let variant = "Error";
                enqueueSnackbar('User Canceled Signing', { variant });
            }

        }
        else {
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    async function makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount) {
        let deploy = DeployUtil.makeDeploy(
            new DeployUtil.DeployParams(publicKey, 'casper-test'),
            DeployUtil.ExecutableDeployItem.newStoredContractByHash(
                contractHashAsByteArray,
                entryPoint,
                runtimeArgs
            ),
            DeployUtil.standardPayment(paymentAmount)
        );
        return deploy
    }

    async function signdeploywithcaspersigner(deploy, publicKeyHex) {
        let deployJSON = DeployUtil.deployToJson(deploy);
        console.log("deployJSON: ", deployJSON);
        let signedDeployJSON = await Signer.sign(deployJSON, publicKeyHex, publicKeyHex);
        let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

        console.log("signed deploy: ", signedDeploy);
        return signedDeploy;
    }
    async function putdeploy(signedDeploy) {
        // Dispatch deploy to node.
        const client = new CasperClient(NODE_ADDRESS);
        const installDeployHash = await client.putDeploy(signedDeploy);
        console.log(`... Contract installation deployHash: ${installDeployHash}`);
        const result = await getDeploy(NODE_ADDRESS, installDeployHash);
        console.log(`... Contract installed successfully.`, JSON.parse(JSON.stringify(result)));
        return result;
    }
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getDeploy(NODE_URL, deployHash) {
        const client = new CasperClient(NODE_URL);
        let i = 1000;
        while (i !== 0) {
            const [deploy, raw] = await client.getDeploy(deployHash);
            if (raw.execution_results.length !== 0) {
                // @ts-ignore
                if (raw.execution_results[0].result.Success) {

                    return deploy;
                } else {
                    // @ts-ignore
                    throw Error("Contract execution: " + raw.execution_results[0].result.Failure.error_message);
                }
            } else {
                i--;
                await sleep(1000);
                continue;
            }
        }
        throw Error('Timeout after ' + i + 's. Something\'s wrong');
    }
    async function addLiquidityMakeDeploy() {
        setIsLoading(true)
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;

            const tokenAAddress = tokenA.address;
            const tokenBAddress = tokenB.address;
            const token_AAmount = tokenAAmount * 10 ** 18;
            const token_BAmount = tokenBAmount * 10 ** 18;
            const deadline = 1739598100811;
            const paymentAmount = 20000000000;

            // const runtimeArgs = RuntimeArgs.fromMap({
            //     tokenA: createRecipientAddress(spenderByteArray),
            //     tokenB: CLValueBuilder.u256(5)
            // });
            console.log('tokenAAddress', tokenAAddress);
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            const pair = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );


            const runtimeArgs = RuntimeArgs.fromMap({
                token_a: new CLKey(_token_a),
                token_b: new CLKey(_token_b),
                amount_a_desired: CLValueBuilder.u256(token_AAmount),
                amount_b_desired: CLValueBuilder.u256(token_BAmount),
                amount_a_min: CLValueBuilder.u256(token_AAmount / 2),
                amount_b_min: CLValueBuilder.u256(token_BAmount / 2),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
                pair: new CLOption(Some(new CLKey(pair)))
            });

            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'add_liquidity_js_client';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy)
                console.log('result', result);
                let variant = "success";
                enqueueSnackbar('Liquidity Added Successfully', { variant });
                setIsLoading(false)
            }
            catch {
                let variant = "Error";
                enqueueSnackbar('User Canceled Signing', { variant });
                setIsLoading(false)
            }

        }
        else {
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Pool"} />
                    <div className="card">
                        <div className="container-fluid">
                            <div
                                className="content"
                                style={{ paddingTop: "150px", minHeight: "100vh" }}
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
                                                                <h3 style={{ textAlign: "center" }}>Add Liquidity</h3>
                                                            </div>
                                                            <form onSubmit={handleSubmitEvent}>
                                                                <div className="row">
                                                                    <div className="col-md-12 col-lg-7">
                                                                        <div className="filter-widget">
                                                                            <Autocomplete
                                                                                id="combo-dox-demo"
                                                                                required
                                                                                options={tokenList}
                                                                                disabled={!istokenList}
                                                                                getOptionLabel={(option) =>
                                                                                    option.name + ',' + option.symbol
                                                                                }
                                                                                onChange={(event, value) => {
                                                                                    console.log('event', event);
                                                                                    console.log('value', value);
                                                                                    setTokenA(value)
                                                                                    setTokenBAmount(0)
                                                                                    setTokenAAmount(0)
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
                                                                    <div className="col-md-12 col-lg-3">
                                                                        {tokenB && tokenA ? (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenAAmount}
                                                                                placeholder={0}
                                                                                min={0}
                                                                                step={.01}
                                                                                className="form-control"
                                                                                onChange={(e) => {
                                                                                    // setTokenAAmount(e.target.value)
                                                                                    if (tokenA.name === 'WCSPR' && tokenB.name === "WISE") {
                                                                                        setTokenAAmount(e.target.value)
                                                                                        setTokenBAmount(e.target.value * (10 / 1))
                                                                                    }
                                                                                    else if (tokenA.name === 'WISE' && tokenB.name === "WCSPR") {
                                                                                        setTokenAAmount(e.target.value)
                                                                                        setTokenBAmount(e.target.value * (1 / 10))
                                                                                    }
                                                                                    else if (tokenA.name === 'WCSPR' && tokenB.name === "USDC") {
                                                                                        setTokenAAmount(e.target.value)
                                                                                        setTokenBAmount(e.target.value * (1 / 8))
                                                                                    }
                                                                                    else if (tokenA.name === 'USDC' && tokenB.name === "WCSPR") {
                                                                                        setTokenAAmount(e.target.value)
                                                                                        setTokenBAmount(e.target.value * (8 / 1))
                                                                                    }
                                                                                    else {
                                                                                        setTokenAAmount(e.target.value)
                                                                                        setTokenBAmount(e.target.value)
                                                                                    }
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenAAmount}
                                                                                placeholder={0}
                                                                                className="form-control"
                                                                                disabled
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div style={{ textAlign: 'center', marginTop: '13px' }} className="col-md-12 col-lg-2">
                                                                        {Math.round(tokenAAmount * priceInUSD * 1000) / 1000}$
                                                                    </div>
                                                                </div>
                                                                <br></br>
                                                                <div className="row">
                                                                    <div className="col-md-12 col-lg-7">
                                                                        <div className="filter-widget">
                                                                            <Autocomplete
                                                                                id="combo-dox-demo"
                                                                                required
                                                                                options={tokenList}
                                                                                disabled={!istokenList}
                                                                                getOptionLabel={(option) =>
                                                                                    option.name + ',' + option.symbol
                                                                                }
                                                                                onChange={(event, value) => {
                                                                                    console.log('event', event);
                                                                                    console.log('value', value);
                                                                                    setTokenB(value)
                                                                                    setTokenBAmount(0)
                                                                                    setTokenAAmount(0)
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
                                                                    <div className="col-md-12 col-lg-3">
                                                                        {tokenB && tokenA ? (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenBAmount}
                                                                                placeholder={0}
                                                                                min={0}
                                                                                step={.01}
                                                                                className="form-control"
                                                                                onChange={(e) => {
                                                                                    if (tokenB.name === 'WCSPR' && tokenA.name === "WISE") {
                                                                                        setTokenBAmount(e.target.value)
                                                                                        setTokenAAmount(e.target.value * (10 / 1))
                                                                                    }
                                                                                    else if (tokenB.name === 'WISE' && tokenA.name === "WCSPR") {
                                                                                        setTokenBAmount(e.target.value)
                                                                                        setTokenAAmount(e.target.value * (1 / 10))
                                                                                    }
                                                                                    else if (tokenB.name === 'WCSPR' && tokenA.name === "USDC") {
                                                                                        setTokenBAmount(e.target.value)
                                                                                        setTokenAAmount(e.target.value * (1 / 8))
                                                                                    }
                                                                                    else if (tokenB.name === 'USDC' && tokenA.name === "WCSPR") {
                                                                                        setTokenBAmount(e.target.value)
                                                                                        setTokenAAmount(e.target.value * (8 / 1))
                                                                                    }
                                                                                    else {
                                                                                        setTokenBAmount(e.target.value)
                                                                                        setTokenAAmount(e.target.value)
                                                                                    }

                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                value={tokenBAmount}
                                                                                placeholder={0}
                                                                                style={{ height: '20px' }}
                                                                                disabled
                                                                                height='50'
                                                                                className="form-control"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div style={{ textAlign: 'center', marginTop: '13px' }} className="col-md-12 col-lg-2">
                                                                        {Math.round(tokenBAmount * priceInUSD * 1000) / 1000}$
                                                                    </div>
                                                                </div>
                                                                {tokenA ? (
                                                                    <div className="card">
                                                                        <CardHeader
                                                                            avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                            title={tokenA.name}
                                                                            subheader={tokenA.symbol}
                                                                        />
                                                                        <Typography variant="body3" color="textSecondary" component="p">
                                                                            <strong>Contract Hash: </strong>{tokenA.address}
                                                                        </Typography>
                                                                        <Typography variant="body3" color="textSecondary" component="p">
                                                                            <strong>Package Hash: </strong>{tokenA.packageHash}
                                                                        </Typography>
                                                                    </div>
                                                                ) : (null)}
                                                                {tokenB ? (
                                                                    <div className="card">
                                                                        <CardHeader
                                                                            avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                            title={tokenB.name}
                                                                            subheader={tokenB.symbol}
                                                                        />
                                                                        <Typography variant="body3" color="textSecondary" component="p">
                                                                            <strong>Contract Hash: </strong>{tokenB.address}
                                                                        </Typography>
                                                                        <Typography variant="body3" color="textSecondary" component="p">
                                                                            <strong>Package Hash: </strong>{tokenB.packageHash}
                                                                        </Typography>
                                                                    </div>
                                                                ) : (null)}
                                                                <Row>
                                                                    <Col>
                                                                        {tokenA && tokenAAmount > 0 ? (
                                                                            approveAIsLoading ? (
                                                                                <div className="text-center">
                                                                                    <Spinner
                                                                                        animation="border"
                                                                                        role="status"
                                                                                        style={{ color: "#e84646" }}
                                                                                    >
                                                                                        <span className="sr-only">Loading...</span>
                                                                                    </Spinner>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="btn btn-block btn-lg login-btn"
                                                                                    onClick={async () => {
                                                                                        setApproveAIsLoading(true)
                                                                                        await approveMakedeploy(tokenA.address, tokenAAmount)
                                                                                        setApproveAIsLoading(false)
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    Approve {tokenA.name}
                                                                                </button>
                                                                            )
                                                                        ) : (null)}
                                                                    </Col>
                                                                    <Col>
                                                                        {tokenB && tokenBAmount > 0 ? (
                                                                            approveBIsLoading ? (
                                                                                <div className="text-center">
                                                                                    <Spinner
                                                                                        animation="border"
                                                                                        role="status"
                                                                                        style={{ color: "#e84646" }}
                                                                                    >
                                                                                        <span className="sr-only">Loading...</span>
                                                                                    </Spinner>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="btn btn-block btn-lg login-btn"
                                                                                    onClick={async () => {
                                                                                        setApproveBIsLoading(true)
                                                                                        await approveMakedeploy(tokenB.address, tokenBAmount)
                                                                                        setApproveBIsLoading(false)
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    Approve {tokenB.name}
                                                                                </button>
                                                                            )
                                                                        ) : (null)}
                                                                    </Col>
                                                                </Row>
                                                                <br></br>
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
                                                                                    0%
                                                                                </Typography>
                                                                                <Typography variant="body1" component="p">
                                                                                    <strong>Share of Pool</strong>

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
                                                                            style={{ color: "#e84646" }}
                                                                        >
                                                                            <span className="sr-only">Loading...</span>
                                                                        </Spinner>
                                                                    </div>
                                                                ) : (
                                                                    tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg login-btn"
                                                                            onClick={async () => await addLiquidityMakeDeploy()}
                                                                            style={{ marginTop: '20px' }}
                                                                        >
                                                                            Supply
                                                                        </button>
                                                                    ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg "
                                                                            disabled
                                                                            style={{ marginTop: '20px' }}
                                                                        >
                                                                            Connect to Casper Signer
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-block btn-lg "
                                                                            disabled
                                                                            style={{ marginTop: '20px' }}
                                                                        >
                                                                            Enter an Amount
                                                                        </button>
                                                                    )

                                                                )}
                                                            </form>
                                                            <br></br>
                                                            {tokenA && tokenB ? (
                                                                <Card>
                                                                    <CardContent>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    title={tokenAAmount}
                                                                                />
                                                                            </Col>
                                                                            <Col><CardHeader
                                                                                avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                                title={tokenA.name}
                                                                            /></Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    title={tokenBAmount}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                                    title={tokenB.name}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            ) : (
                                                                null
                                                            )}
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
            </div>
        </div>
    );
}

export default windowSize(AddLiquidity);
