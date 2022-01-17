import { Avatar, CardHeader } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { CasperClient, CasperServiceByJsonRPC, CLAccountHash, CLByteArray, CLKey, CLPublicKey, CLValueBuilder, DeployUtil, RuntimeArgs, Signer } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import windowSize from "react-window-size";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Logo from "../../../assets/img/cspr.png";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';
import HeaderHome from "../../../components/Headers/Header";
import SlippageModal from '../../../components/Modals/SlippageModal';

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
function Swap(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    let [balance, setBalance] = useState(0);
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [tokenAAmount, setTokenAAmount] = useState(0);
    let [tokenBAmount, setTokenBAmount] = useState(0);
    let [tokenABalance, setTokenABalance] = useState(0);
    let [tokenBBalance, setTokenBBalance] = useState(0);
    let [tokenAAmountPercent, setTokenAAmountPercent] = useState(tokenAAmount);
    let [tokenBAmountPercent, setTokenBAmountPercent] = useState(tokenBAmount);
    let [approveAIsLoading, setApproveAIsLoading] = useState(false);
    const [tokenList, setTokenList] = useState([])
    const [istokenList, setIsTokenList] = useState(false)
    let [isLoading, setIsLoading] = useState(false);
    const [slippage, setSlippage] = useState(0.5);
    const [openSlippage, setOpenSlippage] = useState(false);
    const handleCloseSlippage = () => {
        setOpenSlippage(false);
    };
    const handleShowSlippage = () => {
        setOpenSlippage(true);
    };
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
                let CSPR =
                {
                    address: "",
                    chainId: 1,
                    decimals: 9,
                    logoURI: Logo,
                    name: "Casper",
                    symbol: "CSPR",
                }
                setTokenList(res.data.tokens);
                setIsTokenList(true)
                setTokenList(oldArray => [...oldArray, CSPR])
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })

        // eslint-disable-next-line
        // axios
        //     .post("priceconversion", {
        //         symbolforconversion: "CSPR",
        //         symboltoconvertto: "USD",
        //         amount: 1
        //     })
        //     .then((response) => {
        //         console.log("response", response.data.worth.USD);
        //         setPriceInUSD(response.data.worth.USD.price);
        //     })
        //     .catch((error) => {
        //         console.log("response", error.response);
        //     });
    }, []);
    useEffect(() => {
        if (tokenA && tokenB) {
            console.log("tokenA", tokenA);
            console.log("tokenB", tokenB);
            axios
                .get('/getpairlist')
                .then((res) => {
                    console.log('resresres', res)
                    console.log(res.data.pairList)
                    if (tokenA.name !== "Casper" && tokenB.name !== "Casper") {

                        for (let i = 0; i < res.data.pairList.length; i++) {
                            let address0 = res.data.pairList[i].token0.id.toLowerCase();
                            let address1 = res.data.pairList[i].token1.id.toLowerCase();
                            console.log("address0", address0);
                            console.log("address1", address1);
                            if ((address0.toLowerCase() === tokenA.address.slice(5).toLowerCase() && address1.toLowerCase() === tokenB.address.slice(5).toLowerCase())) {
                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                            } else if ((address0.toLowerCase() === tokenB.address.slice(5).toLowerCase() && address1.toLowerCase() === tokenA.address.slice(5).toLowerCase())) {

                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                            }
                        }
                    } else if ((tokenA.name === "Casper" && tokenB.name === "WCSPR") || (tokenA.name === "WCSPR" && tokenB.name === "Casper")) {
                        setTokenAAmountPercent(1)
                        setTokenBAmountPercent(1)
                    } else {
                        for (let i = 0; i < res.data.pairList.length; i++) {
                            let name0 = res.data.pairList[i].token0.name;
                            let name1 = res.data.pairList[i].token1.name;
                            console.log("name0", name0);
                            console.log("name1", name1);
                            if (name0 === "WCSPR") {
                                console.log('res.WCSPRWCSPR.', res.data.pairList[i]);
                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                            } else if (name1 === "WCSPR") {

                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }
        else {
            setTokenAAmountPercent(0)
            setTokenBAmountPercent(0)
        }
    }, [activePublicKey, tokenA, tokenB]);
    useEffect(() => {
        if (tokenA && tokenA.name !== "Casper" && activePublicKey) {
            let param = {
                contractHash: tokenA.address.slice(5),
                user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
            }
            axios
                .post('/balanceagainstuser', param)
                .then((res) => {
                    console.log('tokenAbalanceagainstuser', res)
                    console.log(res.data)
                    setTokenABalance(res.data.balance)

                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }

        if (tokenA && tokenA.name === "Casper" && activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            const client = new CasperServiceByJsonRPC(
                NODE_ADDRESS
            );
            getStateRootHash(NODE_ADDRESS).then(stateRootHash => {
                console.log('stateRootHash', stateRootHash);
                client.getBlockState(
                    stateRootHash,
                    CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
                    []
                ).then(result => {
                    console.log('result', result.Account.mainPurse);
                    try {
                        const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
                        client.getAccountBalance(
                            stateRootHash,
                            result.Account.mainPurse
                        ).then(result => {
                            console.log('CSPR balance', result.toString());
                            setTokenABalance(result.toString())
                        });
                    } catch (error) {
                        console.log('error', error);
                    }
                });
            })

        }
    }, [activePublicKey, tokenA]);
    useEffect(() => {

        if (tokenB && tokenB.name !== "Casper" && activePublicKey) {
            let param = {
                contractHash: tokenB.address.slice(5),
                user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
            }
            axios
                .post('/balanceagainstuser', param)
                .then((res) => {
                    console.log('tokenBbalanceagainstuser', res)
                    console.log(res.data)
                    setTokenBBalance(res.data.balance)

                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }

        console.log("tokenB", tokenB);
        if (tokenB && tokenB.name === "Casper" && activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            const client = new CasperServiceByJsonRPC(
                NODE_ADDRESS
            );
            getStateRootHash(NODE_ADDRESS).then(stateRootHash => {
                console.log('stateRootHash', stateRootHash);
                client.getBlockState(
                    stateRootHash,
                    CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
                    []
                ).then(result => {
                    console.log('result', result.Account.mainPurse);
                    try {
                        const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
                        client.getAccountBalance(
                            stateRootHash,
                            result.Account.mainPurse
                        ).then(result => {
                            console.log('CSPR balance', result.toString());
                            setTokenBBalance(result.toString())
                        });
                    } catch (error) {
                        console.log('error', error);
                    }
                });
            })
        }
    }, [activePublicKey, tokenB]);
    function createRecipientAddress(recipient) {
        if (recipient instanceof CLPublicKey) {
            return new CLKey(new CLAccountHash(recipient.toAccountHash()));
        } else {
            return new CLKey(recipient);
        }
    };

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
                amount: CLValueBuilder.u256(amount * 10 ** 9)
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
                enqueueSnackbar('Unable to Approve', { variant });
            }

        }
        else {
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    async function signdeploywithcaspersigner(deploy, publicKeyHex) {
        let deployJSON = DeployUtil.deployToJson(deploy);
        console.log("deployJSON: ", deployJSON);
        let signedDeployJSON = await Signer.sign(deployJSON, publicKeyHex, publicKeyHex);
        console.log("signedDeployJSON: ", signedDeployJSON);
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
    const getStateRootHash = async (nodeAddress) => {
        const client = new CasperServiceByJsonRPC(nodeAddress);
        const { block } = await client.getLatestBlockInfo();
        if (block) {
            return block.header.state_root_hash;
        } else {
            throw Error("Problem when calling getLatestBlockInfo");
        }
    };
    async function swapMakeDeploy() {
        setIsLoading(true)
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {

            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;
            const tokenAAddress = tokenA.address;
            const tokenBAddress = tokenB.address;
            const amount_in = tokenAAmount;
            const amount_out_min = tokenBAmount;
            const deadline = 1739598100811;
            const paymentAmount = 20000000000;

            console.log('tokenAAddress', tokenAAddress);
            console.log('publicKeyHex', publicKeyHex);
            let path = [tokenAAddress.slice(5), tokenBAddress.slice(5)]
            console.log('path', path);
            let _paths = [];
            for (let i = 0; i < path.length; i++) {
                const p = new CLByteArray(Uint8Array.from(Buffer.from(path[i], "hex")));
                _paths.push(createRecipientAddress(p));
            }
            console.log('_paths', _paths);
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            const runtimeArgs = RuntimeArgs.fromMap({
                amount_in: CLValueBuilder.u256(amount_in * 10 ** 9),
                amount_out_min: CLValueBuilder.u256(amount_out_min * 10 ** 9 - (amount_out_min * 10 ** 9) * slippage / 100),
                token_a: new CLKey(_token_a),
                token_b: new CLKey(_token_b),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'swap_exact_tokens_for_tokens_js_client';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);

            // const runtimeArgs = {
            //     signerKey: publicKeyHex,
            //     amountin: amount_in,
            //     amountout: amount_out_min,
            //     token_a: CLValueBuilder.key(_token_a),
            //     token_b: CLValueBuilder.key(_token_b),
            //     to: CLValueBuilder.key(publicKey),
            //     deadline: deadline
            // }
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy)
                console.log('result', result);
                let variant = "success";
                enqueueSnackbar('Tokens Swapped Successfully', { variant });
                setIsLoading(false)
            }
            catch {
                let variant = "Error";
                enqueueSnackbar('Unable to Swap Tokens', { variant });
                setIsLoading(false)
            }
        }
        else {
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
            setIsLoading(false)
        }
    }
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Swap"} />
                    <p>{balance}</p>
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
                                                        <div className="login-header">
                                                            <h3 style={{ textAlign: "center" }}>Swap</h3>
                                                            <h3 onClick={handleShowSlippage} style={{ textAlign: 'right' }}><i className="fas fa-cog"></i></h3>
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
                                                                <div className="col-md-12 col-lg-4">
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
                                                                                if (e.target.value >= 0) {
                                                                                    setTokenAAmount(e.target.value)
                                                                                    setTokenBAmount(e.target.value * (tokenAAmountPercent / tokenBAmountPercent).toFixed(5))

                                                                                } else {
                                                                                    setTokenAAmount(0)
                                                                                    setTokenBAmount(0)
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
                                                                {/* <div style={{ textAlign: 'center', marginTop: '13px' }} className="col-md-12 col-lg-2">
                                                                    {Math.round(tokenAAmount * priceInUSD * 1000) / 1000}$
                                                                </div> */}
                                                            </div>
                                                            {activePublicKey && tokenA ? (
                                                                <>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>Balance: </strong>{tokenABalance / 10 ** 9}
                                                                    </Typography>
                                                                    <br></br>
                                                                </>
                                                            ) : (null)}
                                                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                                <i className="fas fa-exchange-alt fa-2x fa-rotate-90"></i>
                                                            </div>
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

                                                                <div className="col-md-12 col-lg-4">
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
                                                                                if (e.target.value >= 0) {
                                                                                    setTokenBAmount(e.target.value)
                                                                                    setTokenAAmount(e.target.value * (tokenBAmountPercent / tokenAAmountPercent).toFixed(5))
                                                                                }
                                                                                else {
                                                                                    setTokenAAmount(0)
                                                                                    setTokenBAmount(0)
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
                                                                {/* <div style={{ textAlign: 'center', marginTop: '13px' }} className="col-md-12 col-lg-2">
                                                                    {Math.round(tokenBAmount * priceInUSD * 1000) / 1000}$
                                                                </div> */}
                                                            </div>
                                                            {activePublicKey && tokenB ? (
                                                                <>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>Balance: </strong>{tokenBBalance / 10 ** 9}
                                                                    </Typography>
                                                                    <br></br>
                                                                </>
                                                            ) : (null)}

                                                            {tokenA ? (
                                                                <div className="card">
                                                                    <CardHeader
                                                                        avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                        title={tokenA.name}
                                                                        subheader={tokenA.symbol}
                                                                    />
                                                                    {tokenA.address !== "" ? (
                                                                        <>
                                                                            <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                <strong>Contract Hash: </strong>{tokenA.address}
                                                                            </Typography>
                                                                            <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                <strong>Package Hash: </strong>{tokenA.packageHash}
                                                                            </Typography>
                                                                        </>
                                                                    ) : (null)}

                                                                </div>
                                                            ) : (null)}
                                                            {tokenB ? (
                                                                <div className="card">
                                                                    <CardHeader
                                                                        avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                        title={tokenB.name}
                                                                        subheader={tokenB.symbol}
                                                                    />
                                                                    {tokenB.address !== "" ? (
                                                                        <>
                                                                            <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                <strong>Contract Hash: </strong>{tokenB.address}
                                                                            </Typography>
                                                                            <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                <strong>Package Hash: </strong>{tokenB.packageHash}
                                                                            </Typography>
                                                                        </>
                                                                    ) : (null)}

                                                                </div>
                                                            ) : (null)}
                                                            <br></br>

                                                            <div className="text-center">
                                                                <p style={{ color: "red" }}>{msg}</p>
                                                            </div>
                                                            {tokenA && tokenA.name !== 'Casper' && tokenAAmount > 0 ? (
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
                                                                        className="btn-block btn-outline-primary btn-lg"
                                                                        onClick={async () => {
                                                                            setApproveAIsLoading(true)
                                                                            await approveMakedeploy(tokenA.address, tokenAAmount)
                                                                            setApproveAIsLoading(false)
                                                                        }}
                                                                    >
                                                                        Approve {tokenA.name}
                                                                    </button>
                                                                )
                                                            ) : (null)}
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
                                                                        className="btn btn-block btn-lg"
                                                                        onClick={async () => await swapMakeDeploy()}
                                                                        style={{ marginTop: '20px' }}
                                                                    >
                                                                        Swap
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
            <SlippageModal slippage={slippage} setSlippage={setSlippage} show={openSlippage} handleClose={handleCloseSlippage} />

        </div >
    );
}

export default windowSize(Swap);
