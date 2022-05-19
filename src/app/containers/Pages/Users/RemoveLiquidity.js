import { Accordion, AccordionSummary, Avatar, Box, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Slider, Typography } from '@material-ui/core/';
import Torus from "@toruslabs/casper-embed";
import axios from "axios";
import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLPublicKey, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';
import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import { useParams } from 'react-router-dom';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { getDeploy } from '../../../components/blockchain/GetDeploy/GetDeploy';
import { getStateRootHash } from '../../../components/blockchain/GetStateRootHash/GetStateRootHash';
import { makeDeploy } from "../../../components/blockchain/MakeDeploy/MakeDeploy";
import { makeDeployWasm } from "../../../components/blockchain/MakeDeploy/MakeDeployWasm";
import { NODE_ADDRESS } from "../../../components/blockchain/NodeAddress/NodeAddress";
import { putdeploy, removeLiquidityPutDeploy } from "../../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from '../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../components/blockchain/SignDeploy/SignDeploy';
import { convertToStr } from '../../../components/ConvertToString/ConvertToString';
import HeaderHome, { CHAINS, SUPPORTED_NETWORKS } from "../../../components/Headers/Header";
import AllowanceModal from '../../../components/Modals/AllowanceModal';
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
    let { tokenAAddress, tokenBAddress } = useParams();
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
    let [pairPackageHash, setPairPackageHash] = useState();
    let [liquidity, setLiquidity] = useState();
    const [aAllowance, setAAllowance] = useState(0);
    let [activePublicKey, setActivePublicKey] = useState(
        localStorage.getItem("Address")
    );
    let [selectedWallet, setSelectedWallet] = useState(
        localStorage.getItem("selectedWallet")
    );
    let [torus, setTorus] = useState();
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
    const [openAAllowance, setOpenAAllowance] = useState(false);
    const handleCloseAAllowance = () => {
        setOpenAAllowance(false);
    };
    const handleShowAAllowance = () => {
        setOpenAAllowance(true);
    };

    let [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        axios
            .get("/tokensList")
            .then((res) => {
                console.log('resresres', res)
                console.log(res.data.tokens);
                for (let i = 0; i < res.data.tokens.length; i++) {
                    let address = res.data.tokens[i].packageHash.toLowerCase();
                    if (address.includes(tokenAAddress.toLowerCase())) {
                        console.log("res.data.tokensA.contractHash", res.data.tokens[i].contractHash);
                        setTokenA(res.data.tokens[i]);
                    }
                    if (address.includes(tokenBAddress.toLowerCase())) {
                        console.log("res.data.tokensB.contractHash", res.data.tokens[i].contractHash);
                        setTokenB(res.data.tokens[i]);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
        // eslint-disable-next-line
    }, []);
    const getPairs = useCallback(() => {
        let param = {
            user: Buffer.from(
                CLPublicKey.fromHex(activePublicKey).toAccountHash()
            ).toString("hex"),
        };
        axios
            .post("/getpairagainstuser", param)
            .then(async (res) => {
                console.log("9", res);
                console.log(res.data.userpairs);
                for (let i = 0; i < res.data.userpairs.length; i++) {
                    let address0 = res.data.pairsdata[i].token0.id.toLowerCase();
                    let address1 = res.data.pairsdata[i].token1.id.toLowerCase();
                    if (
                        (address0.includes(tokenAAddress.toLowerCase()) &&
                            address1.includes(tokenBAddress.toLowerCase())) ||
                        (address0.includes(tokenBAddress.toLowerCase()) &&
                            address1.includes(tokenAAddress.toLowerCase()))
                    ) {
                        let pathParamsArr = [];
                        if (
                            address0.includes(tokenAAddress.toLowerCase()) &&
                            address1.includes(tokenBAddress.toLowerCase())
                        ) {
                            pathParamsArr = [
                                res.data.pairsdata[i].token0.symbol,
                                res.data.pairsdata[i].token1.symbol,
                            ];
                        } else if (
                            address0.includes(tokenBAddress.toLowerCase()) &&
                            address1.includes(tokenAAddress.toLowerCase())
                        ) {
                            pathParamsArr = [
                                res.data.pairsdata[i].token1.symbol,
                                res.data.pairsdata[i].token0.symbol,
                            ];
                        }

                        let pathResParam = {
                            path: pathParamsArr,
                        };
                        console.log("pathResParam", pathResParam);
                        await axios
                            .post("/getpathreserves", pathResParam)
                            .then((res1) => {
                                console.log("getpathreserves", res1);
                                if (res1.data.reserve0 && res1.data.reserve1) {
                                    let rat0 = res1.data.reserve0;
                                    let rat1 = res1.data.reserve1;
                                    console.log("rat0", rat0);
                                    console.log("rat1", rat1);
                                    console.log(
                                        "res.data.userpairs[i].reserve0",
                                        res.data.userpairs[i].reserve0
                                    );
                                    console.log(
                                        "res.data.userpairs[i].reserve1",
                                        res.data.userpairs[i].reserve1
                                    );
                                    if (
                                        rat0 < rat1 &&
                                        parseInt(res.data.userpairs[i].reserve0) <
                                        parseInt(res.data.userpairs[i].reserve1)
                                    ) {
                                        console.log("1");
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve1;
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve0;
                                    } else if (
                                        rat0 < rat1 &&
                                        parseInt(res.data.userpairs[i].reserve0) >
                                        parseInt(res.data.userpairs[i].reserve1)
                                    ) {
                                        console.log("2");
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve0;
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve1;
                                    } else if (
                                        rat0 > rat1 &&
                                        parseInt(res.data.userpairs[i].reserve0) <
                                        parseInt(res.data.userpairs[i].reserve1)
                                    ) {
                                        console.log("3");
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve0;
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve1;
                                    } else if (
                                        rat0 > rat1 &&
                                        parseInt(res.data.userpairs[i].reserve0) >
                                        parseInt(res.data.userpairs[i].reserve1)
                                    ) {
                                        console.log("4");
                                        res.data.userpairs[i].rat0 = res.data.userpairs[i].reserve1;
                                        res.data.userpairs[i].rat1 = res.data.userpairs[i].reserve0;
                                    }
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                console.log(error.response);
                            });
                        console.log("res.data.pairsdata", res.data.pairsdata[i]);
                        console.log("res.data.userpairs", res.data.userpairs[i]);
                        setTokenAAmount(res.data.userpairs[i].rat0 / 10 ** 9);
                        setTokenBAmount(res.data.userpairs[i].rat1 / 10 ** 9);
                        setPairHash(res.data.userpairs[i].pair);
                        let params = {
                            packageHash: res.data.userpairs[i].pair,
                        };
                        axios
                            .post("/getContractHashAgainstPackageHash", params)
                            .then((res2) => {
                                console.log("res2", res2);
                                setPairPackageHash(res2.data.Data.contractHash);
                            })
                            .catch((error) => {
                                console.log(error);
                                console.log(error.response);
                            });
                        setTokenAAmountPercent(
                            (res.data.userpairs[i].rat0 * value) / 100 / 10 ** 9
                        );
                        setTokenBAmountPercent(
                            (res.data.userpairs[i].rat1 * value) / 100 / 10 ** 9
                        );

                        let param = {
                            to: Buffer.from(
                                CLPublicKey.fromHex(activePublicKey).toAccountHash()
                            ).toString("hex"),
                            pairid: res.data.userpairs[i].pair,
                        };
                        console.log(
                            "await Signer.getSelectedPublicKeyBase64()",
                            Buffer.from(
                                CLPublicKey.fromHex(activePublicKey).toAccountHash()
                            ).toString("hex")
                        );

                        axios
                            .post("/liquidityagainstuserandpair", param)
                            .then((res1) => {
                                console.log("liquidityagainstuserandpair", res1);
                                setLiquidity(res1.data.liquidity / 10 ** 9);
                                console.log("res1.data.liquidity", res1.data.liquidity);
                            })
                            .catch((error) => {
                                console.log(error);
                                console.log(error.response);
                            });
                        let allowanceParam = {
                            contractHash: res.data.userpairs[i].pair,
                            owner: CLPublicKey.fromHex(activePublicKey)
                                .toAccountHashStr()
                                .slice(13),
                            spender: ROUTER_PACKAGE_HASH,
                        };
                        console.log("allowanceParam0", allowanceParam);
                        axios
                            .post(
                                "/allowanceagainstownerandspenderpaircontract",
                                allowanceParam
                            )
                            .then((res) => {
                                console.log("allowanceagainstownerandspenderpaircontract", res);
                                console.log(res.data);
                                setpairAllowance(res.data.allowance);
                            })
                            .catch((error) => {
                                console.log(error);
                                console.log(error.response);
                            });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, [activePublicKey, tokenAAddress, tokenBAddress, value]);
    useEffect(() => {
        if (
            activePublicKey !== "null" &&
            activePublicKey !== null &&
            activePublicKey !== undefined
        ) {
            getPairs();
        } // eslint-disable-next-line
    }, [tokenAAddress, tokenBAddress, activePublicKey]);
    useEffect(() => {
        if (
            activePublicKey !== "null" &&
            activePublicKey !== null &&
            activePublicKey !== undefined
        ) {
            const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
            getStateRootHash(NODE_ADDRESS).then((stateRootHash) => {
                console.log("stateRootHash", stateRootHash);
                client
                    .getBlockState(
                        stateRootHash,
                        CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
                        []
                    )
                    .then((result) => {
                        console.log("result", result.Account.mainPurse);
                        setMainPurse(result.Account.mainPurse);
                    });
            });
        }
    }, [activePublicKey]);

    async function increaseAndDecreaseAllowanceMakeDeploy(contractHash, amount, tokenApproved, increase) {
        handleShowSigning();
        const publicKeyHex = activePublicKey;
        if (
            publicKeyHex !== null &&
            publicKeyHex !== "null" &&
            publicKeyHex !== undefined
        ) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const spender = ROUTER_PACKAGE_HASH;
            const caller = contractHash;
            const spenderByteArray = new CLByteArray(
                Uint8Array.from(Buffer.from(spender, "hex"))
            );
            const paymentAmount = 5000000000;
            const runtimeArgs = RuntimeArgs.fromMap({
                spender: createRecipientAddress(spenderByteArray),
                amount: CLValueBuilder.u256(convertToStr(amount)),
            });

            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = increase ? "increase_allowance" : "decrease_allowance";

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(
                publicKey,
                contractHashAsByteArray,
                entryPoint,
                runtimeArgs,
                paymentAmount
            );
            console.log("make deploy: ", deploy);
            try {
                if (selectedWallet === "Casper") {
                    let signedDeploy = await signdeploywithcaspersigner(
                        deploy,
                        publicKeyHex
                    );
                    let result = await putdeploy(signedDeploy, enqueueSnackbar);
                    console.log("result", result);
                } else {
                    // let Torus = new Torus();
                    torus = new Torus();
                    console.log("torus", torus);
                    // Slider;
                    await torus.init({
                        buildEnv: "testing",
                        showTorusButton: true,
                        network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                    });
                    console.log("Torus123", torus);
                    console.log("torus", torus.provider);
                    const casperService = new CasperServiceByJsonRPC(torus?.provider);
                    const deployRes = await casperService.deploy(deploy);
                    console.log("deployRes", deployRes.deploy_hash);
                    console.log(
                        `... Contract installation deployHash: ${deployRes.deploy_hash}`
                    );
                    let result = await getDeploy(
                        NODE_ADDRESS,
                        deployRes.deploy_hash,
                        enqueueSnackbar
                    );
                    console.log(
                        `... Contract installed successfully.`,
                        JSON.parse(JSON.stringify(result))
                    );
                    console.log("result", result);
                }
                handleCloseAAllowance();
                handleCloseSigning();
                let allowanceParam = {
                    contractHash: pair,
                    owner: CLPublicKey.fromHex(activePublicKey)
                        .toAccountHashStr()
                        .slice(13),
                    spender: ROUTER_PACKAGE_HASH,
                };
                console.log("allowanceParam0", allowanceParam);
                axios
                    .post("/allowanceagainstownerandspenderpaircontract", allowanceParam)
                    .then((res) => {
                        console.log("allowanceagainstownerandspenderpaircontract", res);
                        console.log(res.data);
                        setpairAllowance(res.data.allowance);
                    })
                    .catch((error) => {
                        console.log(error);
                        console.log(error.response);
                    });

                let variant = "success";
                increase ?
                    enqueueSnackbar("Allowance Increased Successfully", { variant })
                    :
                    enqueueSnackbar("Allowance Decreased Successfully", { variant })


            } catch {
                handleCloseSigning();
                let variant = "Error";
                increase ?
                    enqueueSnackbar("Unable to Increase Allowance", { variant })
                    :
                    enqueueSnackbar("Unable to Decrease Allowance", { variant })
            }
        } else {
            handleCloseSigning();
            let variant = "error";
            enqueueSnackbar("Connect to Wallet Please", { variant });
        }

    }

    async function RemoveLiquidityMakeDeploy() {
        handleShowSigning();
        setIsLoading(true);
        const publicKeyHex = activePublicKey;
        if (
            publicKeyHex !== null &&
            publicKeyHex !== "null" &&
            publicKeyHex !== undefined
        ) {
            console.log("tokenA", tokenA);
            console.log("tokenB", tokenB);
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;
            const tokenAAddress = tokenA.packageHash;
            const tokenBAddress = tokenB.packageHash;
            const token_AAmount = tokenAAmountPercent.toFixed(9);
            const token_BAmount = tokenBAmountPercent.toFixed(9);
            const deadline = 1739598100811;
            const paymentAmount = 5000000000;
            console.log("token_AAmount", token_AAmount);
            console.log("token_BAmount", token_BAmount);

            console.log("tokenAAddress", tokenAAddress);
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );

            const runtimeArgs = RuntimeArgs.fromMap({
                token_a: new CLKey(_token_a),
                token_b: new CLKey(_token_b),
                liquidity: CLValueBuilder.u256(convertToStr((liquidity * value) / 100)),
                amount_a_min: CLValueBuilder.u256(
                    convertToStr(
                        Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9)
                    )
                ),
                amount_b_min: CLValueBuilder.u256(
                    convertToStr(
                        Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9)
                    )
                ),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
            });
            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = "remove_liquidity_js_client";

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(
                publicKey,
                contractHashAsByteArray,
                entryPoint,
                runtimeArgs,
                paymentAmount
            );
            console.log("make deploy: ", deploy);
            try {
                if (selectedWallet === "Casper") {
                    let signedDeploy = await signdeploywithcaspersigner(
                        deploy,
                        publicKeyHex
                    );
                    let result = await putdeploy(signedDeploy, enqueueSnackbar);
                    console.log("result", result);
                } else {
                    // let Torus = new Torus();
                    torus = new Torus();
                    console.log("torus", torus);
                    await torus.init({
                        buildEnv: "testing",
                        showTorusButton: true,
                        network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                    });
                    console.log("Torus123", torus);
                    console.log("torus", torus.provider);
                    const casperService = new CasperServiceByJsonRPC(torus?.provider);
                    const deployRes = await casperService.deploy(deploy);
                    console.log("deployRes", deployRes.deploy_hash);
                    console.log(
                        `... Contract installation deployHash: ${deployRes.deploy_hash}`
                    );
                    let result = await getDeploy(
                        NODE_ADDRESS,
                        deployRes.deploy_hash,
                        enqueueSnackbar
                    );
                    console.log(
                        `... Contract installed successfully.`,
                        JSON.parse(JSON.stringify(result))
                    );
                    console.log("result", result);
                }
                let variant = "success";
                handleCloseSigning();
                getPairs();
                enqueueSnackbar("Liquidity Removed Successfully", { variant });
                setIsLoading(false);
                // window.location.reload(false);
            } catch {
                handleCloseSigning();
                let variant = "Error";
                enqueueSnackbar("Unable to Remove Liquidity", { variant });
                setIsLoading(false);
            }
        } else {
            handleCloseSigning();
            let variant = "error";
            enqueueSnackbar("Connect to Wallet Please", { variant });
        }
    }
    async function RemoveLiquidityCSPRMakeDeploy() {
        handleShowSigning();
        setIsLoading(true);
        const publicKeyHex = activePublicKey;
        if (
            publicKeyHex !== null &&
            publicKeyHex !== "null" &&
            publicKeyHex !== undefined
        ) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            // const caller = ROUTER_CONTRACT_HASH;
            let token;
            let cspr_Amount;
            let token_Amount;
            if (tokenA.symbol === "WCSPR") {
                token = tokenB.packageHash;
                cspr_Amount = tokenAAmountPercent.toFixed(9);
                token_Amount = tokenBAmountPercent.toFixed(9);
            } else {
                token = tokenA.packageHash;
                cspr_Amount = tokenBAmountPercent.toFixed(9);
                token_Amount = tokenAAmountPercent.toFixed(9);
            }
            const deadline = 1739598100811;
            const paymentAmount = 8000000000;

            console.log("token", token);
            const _token = new CLByteArray(
                Uint8Array.from(Buffer.from(token.slice(5), "hex"))
            );
            ;
            const runtimeArgs = RuntimeArgs.fromMap({
                amount: CLValueBuilder.u512(convertToStr(Number(cspr_Amount - (cspr_Amount * slippage) / 100).toFixed(9))),
                destination_entrypoint: CLValueBuilder.string("remove_liquidity_cspr"),
                router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
                token: new CLKey(_token),
                liquidity: CLValueBuilder.u256(convertToStr((liquidity * value) / 100)),
                amount_cspr_min: CLValueBuilder.u256(
                    convertToStr(
                        Number(cspr_Amount - (cspr_Amount * slippage) / 100).toFixed(9)
                    )
                ),
                amount_token_min: CLValueBuilder.u256(
                    convertToStr(
                        Number(token_Amount - (token_Amount * slippage) / 100).toFixed(9)
                    )
                ),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
            });
            console.log("runtimeArgs", runtimeArgs);
            // let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            // let entryPoint = "remove_liquidity_cspr_js_client";

            // Set contract installation deploy (unsigned).
            // let deploy = await makeDeploy(
            //   publicKey,
            //   contractHashAsByteArray,
            //   entryPoint,
            //   runtimeArgs,
            //   paymentAmount
            // );
            let deploy = await makeDeployWasm(
                publicKey,
                runtimeArgs,
                paymentAmount
            );
            console.log("make deploy: ", deploy);
            try {
                if (selectedWallet === "Casper") {
                    let signedDeploy = await signdeploywithcaspersigner(
                        deploy,
                        publicKeyHex
                    );
                    let result = await removeLiquidityPutDeploy(signedDeploy, enqueueSnackbar, activePublicKey);
                    console.log("result", result);
                } else {
                    // let Torus = new Torus();
                    torus = new Torus();
                    console.log("torus", torus);
                    await torus.init({
                        buildEnv: "testing",
                        showTorusButton: true,
                        network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                    });
                    console.log("Torus123", torus);
                    console.log("torus", torus.provider);
                    const casperService = new CasperServiceByJsonRPC(torus?.provider);
                    const deployRes = await casperService.deploy(deploy);
                    console.log("deployRes", deployRes.deploy_hash);
                    console.log(
                        `... Contract installation deployHash: ${deployRes.deploy_hash}`
                    );
                    let result = await getDeploy(
                        NODE_ADDRESS,
                        deployRes.deploy_hash,
                        enqueueSnackbar
                    );
                    console.log(
                        `... Contract installed successfully.`,
                        JSON.parse(JSON.stringify(result))
                    );
                    console.log("result", result);
                }
                let variant = "success";
                handleCloseSigning();
                getPairs();
                enqueueSnackbar("Liquidity Removed Successfully", { variant });
                setIsLoading(false);
                // window.location.reload(false);
            } catch {
                handleCloseSigning();
                let variant = "Error";
                enqueueSnackbar("Unable to Remove Liquidity", { variant });
                setIsLoading(false);
            }
        } else {
            let variant = "error";
            handleCloseSigning();
            enqueueSnackbar("Connect to Wallet Please", { variant });
        }
    }
    function valuetext(value) {
        // console.log('value', value);
        setValue(value);
        setTokenAAmountPercent((tokenAAmount * value) / 100);
        setTokenBAmountPercent((tokenBAmount * value) / 100);
        return `${value}%`;
    }
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} setSelectedWallet={setSelectedWallet} selectedWallet={selectedWallet} setTorus={setTorus} selectedNav={"Pool"} />
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
                                                                        <Accordion
                                                                            key={0}
                                                                            style={{
                                                                                borderRadius: "0px 0px",
                                                                            }}
                                                                        >
                                                                            <AccordionSummary
                                                                                expandIcon={
                                                                                    <Typography
                                                                                        variant="h5"
                                                                                        style={{
                                                                                            color: "#000027",
                                                                                            fontWeight: "550",
                                                                                        }}
                                                                                        gutterBottom
                                                                                    >
                                                                                        <strong>
                                                                                            {numeral((liquidity * value) / 100
                                                                                            ).format("0,0.000000000")}
                                                                                        </strong>
                                                                                    </Typography>
                                                                                }
                                                                                aria-controls="panel1bh-content"
                                                                                id="panel1bh-header"
                                                                            >
                                                                                <CardHeader
                                                                                    avatar={
                                                                                        <div style={{ display: 'flex' }}>
                                                                                            <Avatar
                                                                                                src={tokenA.logoURI}
                                                                                                aria-label="Artist"
                                                                                            />
                                                                                            <Avatar
                                                                                                src={tokenB.logoURI}
                                                                                                aria-label="Artist"
                                                                                            />
                                                                                        </div>
                                                                                    }
                                                                                    title={tokenA.name + '-' + tokenB.name}
                                                                                    subheader={tokenA.symbol + '-' + tokenB.symbol}
                                                                                />

                                                                            </AccordionSummary>
                                                                        </Accordion>
                                                                        <Accordion
                                                                            key={1}
                                                                            style={{
                                                                                borderRadius: "0px 0px",
                                                                            }}
                                                                        >
                                                                            <AccordionSummary
                                                                                expandIcon={
                                                                                    <Typography
                                                                                        variant="h5"
                                                                                        style={{
                                                                                            color: "#000027",
                                                                                            fontWeight: "550",
                                                                                        }}
                                                                                        gutterBottom
                                                                                    >
                                                                                        <strong>
                                                                                            {numeral(
                                                                                                tokenAAmountPercent
                                                                                            ).format("0,0.000000000")}
                                                                                        </strong>
                                                                                    </Typography>
                                                                                }
                                                                                aria-controls="panel1bh-content"
                                                                                id="panel1bh-header"
                                                                            >
                                                                                <CardHeader
                                                                                    avatar={
                                                                                        <Avatar
                                                                                            src={tokenA.logoURI}
                                                                                            aria-label="Artist"
                                                                                        />
                                                                                    }
                                                                                    title={tokenA.name}
                                                                                    subheader={tokenA.symbol}
                                                                                />
                                                                            </AccordionSummary>
                                                                        </Accordion>
                                                                        <Accordion
                                                                            key={2}
                                                                            style={{
                                                                                borderRadius: "0px 0px ",
                                                                            }}
                                                                        >
                                                                            <AccordionSummary
                                                                                expandIcon={
                                                                                    <Typography
                                                                                        variant="h5"
                                                                                        style={{
                                                                                            color: "#000027",
                                                                                            fontWeight: "550",
                                                                                        }}
                                                                                        gutterBottom
                                                                                    >
                                                                                        <strong>
                                                                                            {numeral(
                                                                                                tokenBAmountPercent
                                                                                            ).format("0,0.000000000")}
                                                                                        </strong>
                                                                                    </Typography>
                                                                                }
                                                                                aria-controls="panel1bh-content"
                                                                                id="panel1bh-header"
                                                                            >
                                                                                <CardHeader
                                                                                    avatar={
                                                                                        <Avatar
                                                                                            src={tokenB.logoURI}
                                                                                            aria-label="Artist"
                                                                                        />
                                                                                    }
                                                                                    title={tokenB.name}
                                                                                    subheader={tokenB.symbol}
                                                                                />
                                                                            </AccordionSummary>
                                                                        </Accordion>
                                                                        <br />
                                                                        {activePublicKey !== "null" &&
                                                                            activePublicKey !== null &&
                                                                            activePublicKey !== undefined ? (
                                                                            <Row
                                                                                style={{
                                                                                    color: "#000027",
                                                                                    fontWeight: "550",
                                                                                }}
                                                                            >
                                                                                <Col
                                                                                    xs={{ span: 2, offset: 1 }}
                                                                                    md={{ span: 2, offset: 1 }}
                                                                                >
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        component="p"
                                                                                    >
                                                                                        Price
                                                                                    </Typography>
                                                                                </Col>
                                                                                <Col xs={9} md={9}>
                                                                                    <CardContent
                                                                                        style={{ padding: "0px" }}
                                                                                        className="text-right"
                                                                                    >
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            component="p"
                                                                                        >
                                                                                            {`1 ${tokenA.name} = ${numeral(
                                                                                                tokenBAmountPercent /
                                                                                                tokenAAmountPercent
                                                                                            ).format("0,0.000000000")} ${tokenB.name
                                                                                                }`}
                                                                                        </Typography>
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            component="p"
                                                                                        >
                                                                                            {`1 ${tokenB.name} = ${numeral(
                                                                                                tokenAAmountPercent /
                                                                                                tokenBAmountPercent
                                                                                            ).format("0,0.000000000")} ${tokenA.name
                                                                                                }`}
                                                                                        </Typography>
                                                                                    </CardContent>
                                                                                </Col>
                                                                            </Row>
                                                                        ) : null}
                                                                    </>
                                                                ) : (
                                                                    null
                                                                )}
                                                                {tokenA && tokenAAmount > 0 && tokenB && tokenBAmount > 0 && parseInt((liquidity * 10 ** 9) * value / 100) > pairAllowance ? (
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
                                                                            Approve {tokenA.symbol}-{tokenB.symbol}
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-block btn-lg"
                                                                            onClick={async () => {
                                                                                handleShowAAllowance()
                                                                                // setApproveAIsLoading(true)
                                                                                // await approveMakeDeploy()
                                                                                // setApproveAIsLoading(false)
                                                                            }}>
                                                                            Approve {tokenA.symbol}-{tokenB.symbol}
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
                                                                    activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && parseInt((liquidity * 10 ** 9) * value / 100) <= pairAllowance && tokenAAmountPercent !== 0 && tokenBAmountPercent !== 0 && tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
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
                                                                            Connect to Wallet
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
                                                                                    subheader={`Your total pool tokens (${tokenA.symbol}-${tokenB.symbol}):`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={liquidity.toFixed(9)}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`Pooled ${tokenA.name}:`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={(tokenAAmount).toFixed(9)}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`Pooled ${tokenB.name}:`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={(tokenBAmount).toFixed(9)}
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
            <AllowanceModal allowance={aAllowance} setAllowance={setAAllowance} show={openAAllowance} handleClose={handleCloseAAllowance} approvalAmount={parseInt((liquidity * 10 ** 9) * value / 100) - pairAllowance} tokenAddress={pairPackageHash} tokenAmount={liquidity} tokenApproved='tokenA' increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} />
            <SigningModal show={openSigning} />
        </div >
    );
}

export default RemoveLiquidity;
