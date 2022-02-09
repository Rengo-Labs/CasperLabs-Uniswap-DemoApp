import { Avatar, Box, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Slider, Typography } from '@material-ui/core/';
import axios from "axios";
import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLPublicKey, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import { useParams } from 'react-router-dom';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { getStateRootHash } from '../../../components/blockchain/GetStateRootHash/GetStateRootHash';
import { makeDeploy } from '../../../components/blockchain/MakeDeploy/MakeDeploy';
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';
import { putdeploy } from '../../../components/blockchain/PutDeploy/PutDeploy';
import { createRecipientAddress } from '../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../components/blockchain/SignDeploy/SignDeploy';
import HeaderHome from "../../../components/Headers/Header";
import SigningModal from '../../../components/Modals/SigningModal';
import SlippageModal from '../../../components/Modals/SlippageModal';


const marks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 25,
        label: '25%',
    },
    {
        value: 50,
        label: '50%',
    },
    {
        value: 75,
        label: '75%',
    },
    {
        value: 100,
        label: '100%',
    },
];

function RemoveLiquidity(props) {
    let { tokenAAddress, tokenBAddress } = useParams()
    const { enqueueSnackbar } = useSnackbar();
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [isRemoveLiquidityCSPR, setIsRemoveLiquidityCSPR] = useState(false);
    let [pairAllowance, setpairAllowance] = useState(0);
    let [tokenAAmount, setTokenAAmount] = useState(0);
    let [tokenBAmount, setTokenBAmount] = useState(0);
    let [tokenAAmountPercent, setTokenAAmountPercent] = useState(tokenAAmount);
    let [tokenBAmountPercent, setTokenBAmountPercent] = useState(tokenBAmount);
    let [pair, setPairHash] = useState();
    let [liquidity, setLiquidity] = useState();
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    const [value, setValue] = useState(25);
    let [approveAIsLoading, setApproveAIsLoading] = useState(false);
    const [slippage, setSlippage] = useState(0.5);
    const [openSlippage, setOpenSlippage] = useState(false);
    let [mainPurse, setMainPurse] = useState();
    const handleCloseSlippage = () => {
        setOpenSlippage(false);
    };
    const handleShowSlippage = () => {
        setOpenSlippage(true);
    };
    const [openSigning, setOpenSigning] = useState(false);
    const handleCloseSigning = () => {
        setOpenSigning(false);
    };
    const handleShowSigning = () => {
        setOpenSigning(true);
    };

    let [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        axios
            .get('/tokensList')
            .then((res) => {
                // console.log('resresres', res)
                console.log(res.data.tokens)
                for (let i = 0; i < res.data.tokens.length; i++) {
                    let address = res.data.tokens[i].address.toLowerCase();
                    if (address.includes(tokenAAddress.toLowerCase())) {
                        console.log('res.data.tokensA.address', res.data.tokens[i].address);
                        setTokenA(res.data.tokens[i])
                    }
                    if (address.includes(tokenBAddress.toLowerCase())) {
                        console.log('res.data.tokensB.address', res.data.tokens[i].address);
                        setTokenB(res.data.tokens[i])
                    }

                }
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })
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
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            let param = {
                user: activePublicKey
            }
            axios
                .post('/getpairsagainstuser', param)
                .then((res) => {
                    console.log('9', res)
                    console.log(res.data.userpairs)
                    for (let i = 0; i < res.data.userpairs.length; i++) {
                        let address0 = res.data.userpairs[i].token0.id.toLowerCase();
                        let address1 = res.data.userpairs[i].token1.id.toLowerCase();
                        if ((address0.includes(tokenAAddress.toLowerCase()) && address1.includes(tokenBAddress.toLowerCase())) || (address0.includes(tokenBAddress.toLowerCase()) && address1.includes(tokenAAddress.toLowerCase()))) {
                            console.log('res.data.', res.data.userpairs[i]);
                            setTokenAAmount((res.data.userpairs[i].reserve0 / 10 ** 9))
                            setTokenBAmount((res.data.userpairs[i].reserve1 / 10 ** 9))
                            setPairHash(res.data.userpairs[i].id)
                            setTokenAAmountPercent(((res.data.userpairs[i].reserve0 * value / 100) / 10 ** 9))
                            setTokenBAmountPercent(((res.data.userpairs[i].reserve1 * value / 100) / 10 ** 9))

                            let param = {
                                to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
                                pairid: res.data.userpairs[i].id
                            }
                            console.log('await Signer.getSelectedPublicKeyBase64()',
                                Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))

                            axios
                                .post('/liquidityagainstuserandpair', param)
                                .then((res1) => {
                                    console.log('liquidityagainstuserandpair', res1)
                                    setLiquidity(res1.data.liquidity)
                                    console.log("res1.data.liquidity", res1.data.liquidity)
                                })
                                .catch((error) => {
                                    console.log(error)
                                    console.log(error.response)
                                })
                            let allowanceParam = {
                                contractHash: res.data.userpairs[i].id,
                                owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
                                spender: ROUTER_PACKAGE_HASH
                            }
                            console.log('allowanceParam0', allowanceParam);
                            axios
                                .post('/allowanceagainstownerandspenderpaircontract', allowanceParam)
                                .then((res) => {
                                    console.log('allowanceagainstownerandspenderpaircontract', res)
                                    console.log(res.data)
                                    setpairAllowance(res.data.allowance)

                                })
                                .catch((error) => {
                                    console.log(error)
                                    console.log(error.response)
                                })

                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }// eslint-disable-next-line
    }, [tokenAAddress, tokenBAddress, activePublicKey]);
    useEffect(() => {
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
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
                    setMainPurse(result.Account.mainPurse)
                });
            })
        }
    }, [activePublicKey]);

    async function approveMakeDeploy() {
        handleShowSigning()
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const spender = ROUTER_PACKAGE_HASH;
            const caller = pair;
            const spenderByteArray = new CLByteArray(Uint8Array.from(Buffer.from(spender, 'hex')));
            const paymentAmount = 5000000000;
            const runtimeArgs = RuntimeArgs.fromMap({
                spender: createRecipientAddress(spenderByteArray),
                amount: CLValueBuilder.u256(Math.round(liquidity * value / 100))
            });

            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'approve';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy, enqueueSnackbar)
                console.log('result', result);
                handleCloseSigning()
                let variant = "success";
                enqueueSnackbar('Approved Successfully', { variant });
            }
            catch {
                handleCloseSigning()
                let variant = "Error";
                enqueueSnackbar('Unable to Approve', { variant });
            }
        }
        else {
            handleCloseSigning()
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }

    async function RemoveLiquidityMakeDeploy() {
        handleShowSigning()
        setIsLoading(true)
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;
            const tokenAAddress = tokenA.address;
            const tokenBAddress = tokenB.address;
            const token_AAmount = (tokenAAmountPercent).toFixed(5);
            const token_BAmount = (tokenBAmountPercent).toFixed(5);
            const deadline = 1739598100811;
            const paymentAmount = 5000000000;

            console.log('tokenAAddress', tokenAAddress);
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );

            const runtimeArgs = RuntimeArgs.fromMap({
                token_a: new CLKey(_token_a),
                token_b: new CLKey(_token_b),
                liquidity: CLValueBuilder.u256(Math.round(liquidity * value / 100)),
                amount_a_min: CLValueBuilder.u256(parseInt(token_AAmount * 10 ** 9 - (token_AAmount * 10 ** 9) * slippage / 100)),
                amount_b_min: CLValueBuilder.u256(parseInt(token_BAmount * 10 ** 9 - (token_BAmount * 10 ** 9) * slippage / 100)),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
            });
            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'remove_liquidity_js_client';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy, enqueueSnackbar)
                console.log('result', result);
                let variant = "success";
                handleCloseSigning()
                enqueueSnackbar('Liquidity Removed Successfully', { variant });
                setIsLoading(false)
            }
            catch {
                handleCloseSigning()
                let variant = "Error";
                enqueueSnackbar('Unable to Remove Liquidity', { variant });
                setIsLoading(false)
            }
        }
        else {
            handleCloseSigning()
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    async function RemoveLiquidityCSPRMakeDeploy() {
        setIsLoading(true)
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;
            let token
            let cspr_Amount
            let token_Amount
            if (tokenA.symbol === "WCSPR") {
                token = tokenB.address;
                cspr_Amount = (tokenAAmountPercent).toFixed(5);
                token_Amount = (tokenBAmountPercent).toFixed(5);
            } else {
                token = tokenA.address;
                cspr_Amount = (tokenBAmountPercent).toFixed(5);
                token_Amount = (tokenAAmountPercent).toFixed(5);
            }
            const deadline = 1739598100811;
            const paymentAmount = 5000000000;

            console.log('token', token);
            const _token = new CLByteArray(
                Uint8Array.from(Buffer.from(token.slice(5), "hex"))
            );
            const runtimeArgs = RuntimeArgs.fromMap({
                token: new CLKey(_token),
                liquidity: CLValueBuilder.u256(Math.round(liquidity * value / 100)),
                amount_cspr_min: CLValueBuilder.u256(parseInt(cspr_Amount * 10 ** 9 - (cspr_Amount * 10 ** 9) * slippage / 100)),
                amount_token_min: CLValueBuilder.u256(parseInt(token_Amount * 10 ** 9 - (token_Amount * 10 ** 9) * slippage / 100)),
                to: createRecipientAddress(publicKey),
                to_purse: CLValueBuilder.uref(Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")), AccessRights.READ_ADD_WRITE),
                deadline: CLValueBuilder.u256(deadline),
            });
            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'remove_liquidity_cspr_js_client';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy, enqueueSnackbar)
                console.log('result', result);
                let variant = "success";
                handleCloseSigning()
                enqueueSnackbar('Liquidity Removed Successfully', { variant });
                setIsLoading(false)
            }
            catch {
                let variant = "Error";
                handleCloseSigning()
                enqueueSnackbar('Unable to Remove Liquidity', { variant });
                setIsLoading(false)
            }
        }
        else {
            let variant = "error";
            handleCloseSigning()
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    function valuetext(value) {
        // console.log('value', value);
        setValue(value)
        setTokenAAmountPercent(tokenAAmount * value / 100)
        setTokenBAmountPercent(tokenBAmount * value / 100)
        return `${value}%`;
    }
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Pool"} />
                    <div style={{ backgroundColor: '#e846461F' }} className="card">
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
                                                                <h3  >
                                                                    <div style={{ textAlign: "center" }}>Remove Liquidity
                                                                        <span onClick={handleShowSlippage} style={{ float: 'right' }}><i className="fas fa-cog"></i></span>
                                                                    </div>
                                                                </h3>
                                                            </div>

                                                            <form>
                                                                <br></br>
                                                                <Box style={{ margin: '10px' }}>
                                                                    <Slider
                                                                        style={{ color: '#ed0b25' }}
                                                                        aria-label="Custom marks"
                                                                        defaultValue={25}
                                                                        getAriaValueText={valuetext}
                                                                        step={1}
                                                                        valueLabelDisplay="auto"
                                                                        marks={marks}
                                                                    />
                                                                </Box>
                                                                <div className="login-header" style={{ margin: '40px' }}>
                                                                    <h1 className="neonText" style={{ textAlign: "center" }}>{value}%</h1>
                                                                </div>

                                                                {tokenA && tokenB ? (
                                                                    <>
                                                                        <Card>
                                                                            <CardContent>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            title={numeral(tokenAAmountPercent).format('0,0.000000000')}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" />}
                                                                                            title={tokenA.name}
                                                                                        /></Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            title={numeral(tokenBAmountPercent).format('0,0.000000000')}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" />}
                                                                                            title={tokenB.name}
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            </CardContent>
                                                                        </Card>
                                                                        <br />
                                                                        {activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined ? (
                                                                            <Row style={{ marginBottom: '20px' }}>
                                                                                <Col xs={2} md={2}>
                                                                                    <CardHeader
                                                                                        subheader={'Price'}
                                                                                    />
                                                                                </Col>
                                                                                <Col xs={10} md={10}>
                                                                                    <CardContent className="text-right" >
                                                                                        <Typography variant="body2" component="p">
                                                                                            {`1 ${tokenA.name} = ${numeral(tokenBAmountPercent / tokenAAmountPercent).format('0,0.000000000')} ${tokenB.name}`}
                                                                                        </Typography>
                                                                                        <Typography variant="body2" component="p">
                                                                                            {`1 ${tokenB.name} = ${numeral(tokenAAmountPercent / tokenBAmountPercent).format('0,0.000000000')} ${tokenA.name}`}
                                                                                        </Typography>
                                                                                    </CardContent>
                                                                                </Col>
                                                                            </Row>

                                                                        ) : (null)}
                                                                    </>
                                                                ) : (
                                                                    null
                                                                )}
                                                                {tokenA && tokenAAmount > 0 && tokenB && tokenBAmount > 0 && (liquidity) * value / 100 > pairAllowance ? (
                                                                    approveAIsLoading ? (
                                                                        <div className="text-center">
                                                                            <Spinner
                                                                                animation="border"
                                                                                role="status"
                                                                                style={{ color: "#e84646", marginBottom: '10px' }}
                                                                            >
                                                                                <span className="sr-only">Loading...</span>
                                                                            </Spinner>
                                                                        </div>
                                                                    ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg "
                                                                            disabled
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            onClick={async () => {
                                                                                setApproveAIsLoading(true)
                                                                                await approveMakeDeploy()
                                                                                setApproveAIsLoading(false)
                                                                            }}>
                                                                            Approve
                                                                        </button>
                                                                    )
                                                                ) : (null)}
                                                                {isLoading ? (
                                                                    <div className="text-center">
                                                                        <Spinner
                                                                            animation="border"
                                                                            role="status"
                                                                            style={{ color: "#e84646", marginTop: '10px' }}
                                                                        >
                                                                            <span className="sr-only">Loading...</span>
                                                                        </Spinner>
                                                                    </div>
                                                                ) : (
                                                                    activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && (liquidity) * value / 100 <= pairAllowance && tokenAAmountPercent !== 0 && tokenBAmountPercent !== 0 && tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
                                                                        isRemoveLiquidityCSPR ? (
                                                                            <button
                                                                                className="btn btn-block btn-lg"
                                                                                onClick={async () => await RemoveLiquidityCSPRMakeDeploy()}
                                                                            >
                                                                                Remove Liquidity CSPR
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-block btn-lg"
                                                                                onClick={async () => await RemoveLiquidityMakeDeploy()}
                                                                            >
                                                                                Remove Liquidity
                                                                            </button>
                                                                        )
                                                                    ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            disabled
                                                                        >
                                                                            Connect to Signer
                                                                        </button>
                                                                    ) : isRemoveLiquidityCSPR ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            disabled
                                                                        >
                                                                            Remove Liquidity CSPR
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            disabled
                                                                        >
                                                                            Remove Liquidity
                                                                        </button>
                                                                    )
                                                                )}
                                                                {(tokenA && tokenB) && (tokenA.symbol === "WCSPR" || tokenB.symbol === "WCSPR") ? (
                                                                    <FormGroup>
                                                                        <FormControlLabel onClick={() => {
                                                                            setIsRemoveLiquidityCSPR(!isRemoveLiquidityCSPR)

                                                                        }} value={isRemoveLiquidityCSPR} control={<Checkbox defaultValue={isRemoveLiquidityCSPR} />} label="Remove Liquidity CSPR" />
                                                                    </FormGroup>
                                                                ) : (null)}
                                                            </form>
                                                            <br></br>
                                                            {tokenA && tokenB && liquidity ? (
                                                                <Card>
                                                                    <CardContent>
                                                                        <h3>Your Position</h3>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`${tokenA.symbol}/${tokenB.symbol}`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={liquidity / 10 ** 9}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`${tokenA.name}:`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={(tokenAAmount).toFixed(5)}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`${tokenB.name}:`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={(tokenBAmount).toFixed(5)}
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
            <SlippageModal slippage={slippage} setSlippage={setSlippage} show={openSlippage} handleClose={handleCloseSlippage} />
            <SigningModal show={openSigning} />
        </div >
    );
}

export default RemoveLiquidity;
