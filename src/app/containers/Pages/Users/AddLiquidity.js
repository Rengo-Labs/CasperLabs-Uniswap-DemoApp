import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardContent, CardHeader, FormControl, FormHelperText, Input } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Torus from "@toruslabs/casper-embed";
import axios from "axios";
import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';
import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import { Some } from "ts-results";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from "../../../assets/img/cspr.png";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { getDeploy } from '../../../components/blockchain/GetDeploy/GetDeploy';
import { getStateRootHash } from '../../../components/blockchain/GetStateRootHash/GetStateRootHash';
import { makeDeploy } from '../../../components/blockchain/MakeDeploy/MakeDeploy';
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';
import { putdeploy } from '../../../components/blockchain/PutDeploy/PutDeploy';
import { createRecipientAddress } from '../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../components/blockchain/SignDeploy/SignDeploy';
import { convertToStr } from '../../../components/ConvertToString/ConvertToString';
import HeaderHome, { CHAINS, SUPPORTED_NETWORKS } from "../../../components/Headers/Header";
import SigningModal from '../../../components/Modals/SigningModal';
import SlippageModal from '../../../components/Modals/SlippageModal';
import TokenAModal from '../../../components/Modals/TokenAModal';
import TokenBModal from '../../../components/Modals/TokenBModal';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));
const regex = /^\s*-?(\d+(\.\d{1,9})?|\.\d{1,9})\s*$/;
// let RecipientType = CLPublicKey | CLAccountHash | CLByteArray;
function AddLiquidity(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    let [selectedWallet, setSelectedWallet] = useState(localStorage.getItem("selectedWallet"));
    let [torus, setTorus] = useState();
    let [mainPurse, setMainPurse] = useState();
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [tokenAAmount, setTokenAAmount] = useState(0);
    let [tokenBAmount, setTokenBAmount] = useState(0);
    let [tokenABalance, setTokenABalance] = useState(0);
    let [tokenBBalance, setTokenBBalance] = useState(0);
    let [approveAIsLoading, setApproveAIsLoading] = useState(false);
    let [approveBIsLoading, setApproveBIsLoading] = useState(false);
    let [tokenAAllowance, setTokenAAllowance] = useState(0);
    let [tokenBAllowance, setTokenBAllowance] = useState(0);
    let [isInvalidPair, setIsInvalidPair] = useState(false);
    const [tokenList, setTokenList] = useState([])
    const [isTokenList, setIsTokenList] = useState(false)
    let [isLoading, setIsLoading] = useState(false);
    const [slippage, setSlippage] = useState(0.5);
    const [ratio0, setRatio0] = useState(1)
    const [ratio1, setRatio1] = useState(1)
    const [reserve0, setReserve0] = useState(1)
    const [reserve1, setReserve1] = useState(1)
    const [openSlippage, setOpenSlippage] = useState(false);
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
    const [openTokenAModal, setOpenTokenAModal] = useState(false);
    const handleCloseTokenAModal = () => {
        setOpenTokenAModal(false);
    };
    const handleShowTokenAModal = () => {
        setOpenTokenAModal(true);
    };
    const [openTokenBModal, setOpenTokenBModal] = useState(false);
    const handleCloseTokenBModal = () => {
        setOpenTokenBModal(false);
    };
    const handleShowTokenBModal = () => {
        setOpenTokenBModal(true);
    };
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    let [liquidity, setLiquidity] = useState();

    console.log("selectedWallet", selectedWallet);
    const resetData = () => {
        getTokenData()
        setTokenA()
        setTokenB()
        setTokenAAmount(0)
        setTokenBAmount(0)
        setTokenABalance(0)
        setTokenBBalance(0)
        setTokenAAllowance(0)
        setTokenBAllowance(0)
        setReserve0(1)
        setReserve1(1)
    }

    const getTokenData = useCallback(() => {
        axios
            .get('/tokensList')
            .then(async (res) => {
                console.log('tokensList', res)
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
                                CSPR.balance = result.toString()
                            });
                        } catch (error) {
                            CSPR.balance = 0;
                            console.log('error', error);
                        }
                    });
                })
                console.log('CSPR', CSPR);
                let holdArr = res.data.tokens;
                console.log('holdArr', holdArr);
                for (let i = 0; i < holdArr.length; i++) {
                    let param = {
                        contractHash: holdArr[i].address.slice(5),
                        user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
                    }
                    await axios
                        .post('/balanceagainstuser', param)
                        .then((res) => {
                            console.log('balanceagainstuser', res)
                            console.log(res.data)
                            holdArr[i].balance = res.data.balance;
                            // setTokenBBalance(res.data.balance)

                        })
                        .catch((error) => {
                            console.log(error)
                            console.log(error.response)
                        })
                }
                holdArr.splice(0, 0, CSPR)
                console.log('holdArr', holdArr);
                setTokenList(res.data.tokens);
                setIsTokenList(true)
                // setTokenList(oldArray => [...oldArray, CSPR])
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })
    }, [activePublicKey])
    useEffect(() => {
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            getTokenData()
        }
    }, [getTokenData, activePublicKey]);
    useEffect(() => {
        if (tokenA && tokenB) {
            if (tokenA.name === tokenB.name) {
                setIsInvalidPair(true)
                setReserve0(1)
                setReserve1(1)
            } else if ((tokenA.symbol === "CSPR" && tokenB.symbol === "WCSPR") || (tokenB.symbol === "CSPR" && tokenA.symbol === "WCSPR")) {
                setIsInvalidPair(true)
                setReserve0(1)
                setReserve1(1)
            } else {
                let pathParamsArr = [
                    tokenA.symbol,
                    tokenB.symbol,
                ]
                if (tokenA.symbol === "CSPR") {
                    pathParamsArr[0] = "WCSPR"

                } else if (tokenB.symbol === "CSPR") {
                    pathParamsArr[1] = "WCSPR"
                }

                let pathResParam = {
                    path: pathParamsArr
                }
                console.log("pathResParam", pathResParam);
                axios
                    .post('/getpathreserves', pathResParam)
                    .then((res) => {
                        console.log('getpathreserves', res)
                        if (res.data.reserve0 && res.data.reserve1) {
                            setRatio0(res.data.reserve0)
                            setRatio1(res.data.reserve1)
                            axios
                                .get('/getpairlist')
                                .then((res1) => {
                                    console.log('resresres', res1)
                                    console.log(res1.data.pairList)
                                    if (tokenA.name !== "Casper" && tokenB.name !== "Casper") {
                                        for (let i = 0; i < res1.data.pairList.length; i++) {
                                            let address0 = res1.data.pairList[i].token0.id.toLowerCase();
                                            let address1 = res1.data.pairList[i].token1.id.toLowerCase();
                                            console.log("address0", address0);
                                            console.log("address1", address1);
                                            if ((address0.toLowerCase() === tokenA.address.slice(5).toLowerCase() && address1.toLowerCase() === tokenB.address.slice(5).toLowerCase())) {
                                                setIsInvalidPair(false)
                                                liquiditySetter(res1.data.pairList[i])
                                                getUserReservers(res1.data.pairList[i], res.data.reserve0, res.data.reserve1)
                                                break;
                                            } else if ((address0.toLowerCase() === tokenB.address.slice(5).toLowerCase() && address1.toLowerCase() === tokenA.address.slice(5).toLowerCase())) {
                                                setIsInvalidPair(false)
                                                liquiditySetter(res1.data.pairList[i])
                                                getUserReservers(res1.data.pairList[i], res.data.reserve0, res.data.reserve1)
                                                break;
                                            } else {
                                                setIsInvalidPair(true)
                                                setReserve0(1)
                                                setReserve1(1)
                                            }
                                        }
                                    } else {
                                        for (let i = 0; i < res1.data.pairList.length; i++) {
                                            let name0 = res1.data.pairList[i].token0.name;
                                            let name1 = res1.data.pairList[i].token1.name;
                                            if (name0 === "Wrapped Casper" && tokenA.name === "Casper" && tokenB.name === name1) {
                                                console.log('1', res1.data.pairList[i]);
                                                setIsInvalidPair(false)
                                                liquiditySetter(res1.data.pairList[i])
                                                getUserReservers(res1.data.pairList[i], res.data.reserve0, res.data.reserve1)
                                                break;
                                            } else if (name0 === "Wrapped Casper" && tokenB.name === "Casper" && tokenA.name === name1) {
                                                console.log('2', res1.data.pairList[i]);
                                                setIsInvalidPair(false)
                                                liquiditySetter(res1.data.pairList[i])
                                                getUserReservers(res1.data.pairList[i], res.data.reserve0, res.data.reserve1)
                                                break;
                                            } else if (name1 === "Wrapped Casper" && tokenA.name === "Casper" && tokenB.name === name0) {
                                                console.log('3', res1.data.pairList[i]);
                                                setIsInvalidPair(false)
                                                liquiditySetter(res1.data.pairList[i])
                                                getUserReservers(res1.data.pairList[i], res.data.reserve0, res.data.reserve1)
                                                break;
                                            } else if (name1 === "Wrapped Casper" && tokenB.name === "Casper" && tokenA.name === name0) {
                                                console.log('4', res1.data.pairList[i]);
                                                setIsInvalidPair(false)
                                                liquiditySetter(res1.data.pairList[i])
                                                getUserReservers(res1.data.pairList[i], res.data.reserve0, res.data.reserve1)
                                                break;
                                            } else {
                                                setIsInvalidPair(true)
                                                setReserve0(1)
                                                setReserve1(1)
                                            }
                                        }
                                    }
                                })
                                .catch((error) => {
                                    console.log(error)
                                    console.log(error.response)
                                })
                        } else {
                            setRatio0(1)
                            setRatio1(1)
                        }

                    })
                    .catch((error) => {
                        setRatio0(1)
                        setRatio1(1)
                        console.log(error)
                        console.log(error.response)
                    })
            }
        }
        function getUserReservers(pair, rat0, rat1) {
            let param = {
                user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
            }
            axios
                .post('/getpairagainstuser', param)
                .then((res) => {
                    console.log('resresres', res)
                    console.log('res.data', res.data)
                    console.log("res.data.userpairs", res.data.userpairs)
                    console.log("res.data.pairsdata", res.data.pairsdata)
                    console.log("res.data.userpairs.length", res.data.userpairs.length);
                    for (let i = 0; i < res.data.userpairs.length; i++) {
                        // console.log("res.data.userpairs[i].pair", res.data.userpairs[i].pair);
                        console.log("pair", pair);

                        if (pair.id === res.data.userpairs[i].pair) {

                            if (rat0 < rat1 && parseInt(res.data.userpairs[i].reserve0) < parseInt(res.data.userpairs[i].reserve1)) {
                                console.log('1');
                                setReserve0(res.data.userpairs[i].reserve1 / 10 ** 9)
                                setReserve1(res.data.userpairs[i].reserve0 / 10 ** 9)
                            } else if (rat0 < rat1 && parseInt(res.data.userpairs[i].reserve0) > parseInt(res.data.userpairs[i].reserve1)) {
                                console.log('2');
                                setReserve0(res.data.userpairs[i].reserve0 / 10 ** 9)
                                setReserve1(res.data.userpairs[i].reserve1 / 10 ** 9)
                            } else if (rat0 > rat1 && parseInt(res.data.userpairs[i].reserve0) < parseInt(res.data.userpairs[i].reserve1)) {
                                console.log('3');
                                setReserve0(res.data.userpairs[i].reserve0 / 10 ** 9)
                                setReserve1(res.data.userpairs[i].reserve1 / 10 ** 9)
                            } else if (rat0 > rat1 && parseInt(res.data.userpairs[i].reserve0) > parseInt(res.data.userpairs[i].reserve1)) {
                                console.log('4');
                                setReserve0(res.data.userpairs[i].reserve1 / 10 ** 9)
                                setReserve1(res.data.userpairs[i].reserve0 / 10 ** 9)
                            }

                        }

                    }
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }
        function liquiditySetter(pair) {
            let param = {
                to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
                pairid: pair.id
            }
            console.log('await Signer.getSelectedPublicKeyBase64()',
                Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))
            axios
                .post('/liquidityagainstuserandpair', param)
                .then((res1) => {
                    console.log('liquidityagainstuserandpair', res1)
                    setLiquidity(parseFloat(res1.data.liquidity).toFixed(9))
                    console.log("res1.data.liquidity", res1.data.liquidity)
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }
    }, [activePublicKey, tokenA, tokenB]);


    async function approveMakeDeploy(contractHash, amount, tokenApproved) {
        handleShowSigning();
        console.log("contractHash", contractHash);
        const publicKeyHex = activePublicKey;
        if (
            publicKeyHex !== null &&
            publicKeyHex !== "null" &&
            publicKeyHex !== undefined
        ) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const spender = ROUTER_PACKAGE_HASH;
            const spenderByteArray = new CLByteArray(
                Uint8Array.from(Buffer.from(spender, "hex"))
            );
            const paymentAmount = 5000000000;
            try {
                const runtimeArgs = RuntimeArgs.fromMap({
                    spender: createRecipientAddress(spenderByteArray),
                    amount: CLValueBuilder.u256(convertToStr(amount)),
                });
                let contractHashAsByteArray = Uint8Array.from(
                    Buffer.from(contractHash.slice(5), "hex")
                );
                let entryPoint = "approve";
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
                    if (tokenApproved === "tokenA") {
                        setTokenAAllowance(amount * 10 ** 9);
                    } else {
                        setTokenBAllowance(amount * 10 ** 9);
                    }
                    // console.log('result', result);
                    handleCloseSigning();
                    let variant = "success";
                    enqueueSnackbar("Approved Successfully", { variant });
                } catch {
                    handleCloseSigning();
                    let variant = "Error";
                    enqueueSnackbar("Unable to Approve", { variant });
                }
            } catch {
                handleCloseSigning();
                let variant = "Error";
                enqueueSnackbar("Input values are too large", { variant });
            }
        } else {
            handleCloseSigning();
            let variant = "error";
            enqueueSnackbar("Connect to Wallet Please", { variant });
        }
    }
    const getTokenBalance = useCallback(() => {
        let balanceParam = {
            contractHash: tokenA.address.slice(5),
            user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
        }
        axios
            .post('/balanceagainstuser', balanceParam)
            .then((res) => {
                console.log('tokenAbalanceagainstuser', res)
                console.log(res.data)
                setTokenABalance(res.data.balance)

            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            });

        let allowanceParam = {
            contractHash: tokenA.address.slice(5),
            owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
            spender: ROUTER_PACKAGE_HASH
        }
        console.log('allowanceParam0', allowanceParam);
        axios
            .post('/allowanceagainstownerandspender', allowanceParam)
            .then((res) => {
                console.log('allowanceagainstownerandspender', res)
                console.log(res.data)
                setTokenAAllowance(res.data.allowance)

            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })
    }, [activePublicKey, tokenA])
    const getCurrencyBalance = useCallback(() => {
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
    }, [activePublicKey])
    useEffect(() => {
        if (tokenA && tokenA.name !== "Casper" && activePublicKey) {
            getTokenBalance();
        }
        if (tokenA && tokenA.name === "Casper" && activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            getCurrencyBalance()
        }
    }, [getTokenBalance, getCurrencyBalance, activePublicKey, tokenA]);


    useEffect(() => {
        if (tokenB && tokenB.name !== "Casper" && activePublicKey) {
            let balanceParam = {
                contractHash: tokenB.address.slice(5),
                user: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
            }
            axios
                .post('/balanceagainstuser', balanceParam)
                .then((res) => {
                    console.log('tokenAbalanceagainstuser', res)
                    console.log(res.data)
                    setTokenBBalance(res.data.balance)

                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                });

            let allowanceParam = {
                contractHash: tokenB.address.slice(5),
                owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
                spender: ROUTER_PACKAGE_HASH
            }
            console.log('allowanceParam0', allowanceParam);
            axios
                .post('/allowanceagainstownerandspender', allowanceParam)
                .then((res) => {
                    console.log('allowanceagainstownerandspender', res)
                    console.log(res.data)
                    setTokenBAllowance(res.data.allowance)
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }
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
                    setMainPurse(result.Account.mainPurse)
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

    useEffect(() => {
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
            const client = new CasperServiceByJsonRPC(
                NODE_ADDRESS
            );
            getStateRootHash(NODE_ADDRESS).then(stateRootHash => {
                console.log('stateRootHash', stateRootHash);
                console.log('CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),', CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),);
                client.getBlockState(
                    stateRootHash,
                    CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
                    []
                ).then(result => {
                    console.log('result', result.Account.mainPurse);
                    setMainPurse(result.Account.mainPurse)
                }).catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
            })
        }
    }, [activePublicKey])
    async function addLiquidityMakeDeploy() {
        handleShowSigning();
        setIsLoading(true);
        const publicKeyHex = activePublicKey;
        if (
            publicKeyHex !== null &&
            publicKeyHex !== "null" &&
            publicKeyHex !== undefined
        ) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;
            const tokenAAddress = tokenA.address;
            const tokenBAddress = tokenB.address;
            const token_AAmount = tokenAAmount;
            const token_BAmount = tokenBAmount;
            const deadline = 1739598100811;
            const paymentAmount = 10000000000;
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            const pair = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            if (tokenA.name === "Casper") {
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        token: new CLKey(_token_b),
                        amount_cspr_desired: CLValueBuilder.u256(convertToStr(token_AAmount)),
                        amount_token_desired: CLValueBuilder.u256(convertToStr(token_BAmount)),
                        amount_cspr_min: CLValueBuilder.u256(convertToStr(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
                        amount_token_min: CLValueBuilder.u256(convertToStr(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
                        to: createRecipientAddress(publicKey),
                        purse: CLValueBuilder.uref(
                            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                            AccessRights.READ_ADD_WRITE
                        ),
                        deadline: CLValueBuilder.u256(deadline),
                        pair: new CLOption(Some(new CLKey(pair))),
                    });
                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "add_liquidity_cspr_js_client";
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
                        setTokenAAllowance(0);
                        setTokenBAllowance(0);
                        setTokenAAmount(0);
                        setTokenBAmount(0);
                        getCurrencyBalance();
                        handleCloseSigning();
                        let variant = "success";
                        enqueueSnackbar("Liquidity Added Successfully", { variant });
                        setIsLoading(false);
                        resetData();
                    } catch {
                        handleCloseSigning();
                        let variant = "Error";
                        enqueueSnackbar("Unable to Add Liquidity", { variant });
                        setIsLoading(false);
                    }
                } catch {
                    handleCloseSigning();
                    let variant = "Error";
                    enqueueSnackbar("Input values are too large", { variant });
                    setIsLoading(false);
                }
            } else if (tokenB.name === "Casper") {
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        token: new CLKey(_token_a),
                        amount_cspr_desired: CLValueBuilder.u256(
                            convertToStr(token_BAmount)
                        ),
                        amount_token_desired: CLValueBuilder.u256(
                            convertToStr(token_AAmount)
                        ),
                        amount_cspr_min: CLValueBuilder.u256(convertToStr(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
                        amount_token_min: CLValueBuilder.u256(convertToStr(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
                        to: createRecipientAddress(publicKey),
                        purse: CLValueBuilder.uref(
                            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                            AccessRights.READ_ADD_WRITE
                        ),
                        deadline: CLValueBuilder.u256(deadline),
                        pair: new CLOption(Some(new CLKey(_token_a))),
                    });

                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "add_liquidity_cspr_js_client";

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
                        setTokenAAllowance(0);
                        setTokenBAllowance(0);
                        setTokenAAmount(0);
                        setTokenBAmount(0);
                        getCurrencyBalance();
                        handleCloseSigning();
                        let variant = "success";
                        enqueueSnackbar("Liquidity Added Successfully", { variant });
                        setIsLoading(false);
                        resetData();
                    } catch {
                        handleCloseSigning();
                        let variant = "Error";
                        enqueueSnackbar("Unable to Add Liquidity", { variant });
                        setIsLoading(false);
                    }
                } catch {
                    handleCloseSigning();
                    let variant = "Error";
                    enqueueSnackbar("Input values are too large", { variant });
                    setIsLoading(false);
                }
            } else {
                // eslint-disable-next-line
                console.log("token_AAmount", (token_AAmount - (token_AAmount * slippage) / 100).toFixed(9));
                console.log("token_BAmount", token_BAmount - (token_BAmount * slippage) / 100);
                // try {
                const runtimeArgs = RuntimeArgs.fromMap({
                    token_a: new CLKey(_token_a),
                    token_b: new CLKey(_token_b),
                    amount_a_desired: CLValueBuilder.u256(convertToStr(token_AAmount)),
                    amount_b_desired: CLValueBuilder.u256(convertToStr(token_BAmount)),
                    amount_a_min: CLValueBuilder.u256(convertToStr(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
                    amount_b_min: CLValueBuilder.u256(convertToStr(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
                    to: createRecipientAddress(publicKey),
                    deadline: CLValueBuilder.u256(deadline),
                    pair: new CLOption(Some(new CLKey(pair))),
                });

                let contractHashAsByteArray = Uint8Array.from(
                    Buffer.from(caller, "hex")
                );
                let entryPoint = "add_liquidity_js_client";

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
                    enqueueSnackbar("Liquidity Added Successfully", { variant });
                    setIsLoading(false);
                    resetData();
                } catch {
                    handleCloseSigning();
                    let variant = "Error";
                    enqueueSnackbar("Unable to Add Liquidity", { variant });
                    setIsLoading(false);
                }
                // } catch {
                //   handleCloseSigning();
                //   let variant = "Error";
                //   enqueueSnackbar("Input values are too large", { variant });
                //   setIsLoading(false);
                // }
            }
        } else {
            handleCloseSigning();
            let variant = "error";
            enqueueSnackbar("Connect to Wallet Please", { variant });
            setIsLoading(false);
        }
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
                                                                    <div style={{ textAlign: "center" }}>Add Liquidity
                                                                        <span onClick={handleShowSlippage} style={{ float: 'right' }}><i className="fas fa-cog"></i></span>
                                                                    </div>
                                                                </h3>
                                                            </div>
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-md-12 col-lg-5">
                                                                        <div className="filter-widget">
                                                                            {tokenA ? (
                                                                                <Card
                                                                                    className='custom-card'
                                                                                >
                                                                                    <CardHeader
                                                                                        onClick={() => {
                                                                                            handleShowTokenAModal()
                                                                                        }}
                                                                                        avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" />}
                                                                                        title={tokenA.name}
                                                                                        subheader={tokenA.symbol}
                                                                                    />
                                                                                </Card>
                                                                            ) : (
                                                                                <Card onClick={() => {
                                                                                    handleShowTokenAModal()

                                                                                }} className='custom-card' style={{ padding: '20px' }}>
                                                                                    Select Token  <i style={{ float: 'right' }} className="fas fa-chevron-down"></i>
                                                                                </Card>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12 col-lg-7">
                                                                        {tokenB && tokenA ? (
                                                                            <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                                                                                <Input
                                                                                    step="any"
                                                                                    type='number'
                                                                                    min={0}
                                                                                    id="standard-adornment-weight"
                                                                                    value={tokenAAmount}
                                                                                    onChange={(e) => {
                                                                                        console.log('regex.test(e.target.value)', regex.test(e.target.value));
                                                                                        if (regex.test(e.target.value)) {

                                                                                            if (e.target.value >= 0) {
                                                                                                setTokenAAmount(e.target.value)
                                                                                                setTokenBAmount(parseFloat(e.target.value * ratio0).toFixed(9))
                                                                                            } else {
                                                                                                setTokenAAmount(0)
                                                                                                setTokenBAmount(0)
                                                                                            }
                                                                                        } else {

                                                                                            setTokenAAmount(tokenAAmount)
                                                                                            setTokenBAmount(tokenBAmount)
                                                                                        }
                                                                                    }}
                                                                                    aria-describedby="standard-weight-helper-text"
                                                                                    inputProps={{
                                                                                        'aria-label': 'weight',
                                                                                    }}
                                                                                />
                                                                                <FormHelperText id="standard-weight-helper-text"><strong>Balance: </strong>{(tokenABalance / 10 ** 9).toFixed(9)}</FormHelperText>
                                                                            </FormControl>
                                                                        ) : (
                                                                            <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                                                                                <Input
                                                                                    step="any"
                                                                                    type='number'
                                                                                    min={0}
                                                                                    placeholder="0"
                                                                                    disabled
                                                                                    id="standard-adornment-weight"
                                                                                    aria-describedby="standard-weight-helper-text"
                                                                                    inputProps={{
                                                                                        'aria-label': 'weight',
                                                                                    }}
                                                                                />
                                                                                <FormHelperText id="standard-weight-helper-text"><strong>Balance: </strong>{0}</FormHelperText>
                                                                            </FormControl>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-12 col-lg-5">
                                                                        <div className="filter-widget">
                                                                            {tokenB ? (
                                                                                <Card
                                                                                    className='custom-card'
                                                                                >
                                                                                    <CardHeader
                                                                                        onClick={() => {
                                                                                            handleShowTokenBModal()
                                                                                        }}
                                                                                        avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" />}
                                                                                        title={tokenB.name}
                                                                                        subheader={tokenB.symbol}
                                                                                    />
                                                                                </Card>
                                                                            ) : (
                                                                                <Card onClick={() => {
                                                                                    handleShowTokenBModal()
                                                                                }} style={{ padding: '20px' }}
                                                                                    className='custom-card'
                                                                                >
                                                                                    Select Token<i style={{ float: 'right' }} className="fas fa-chevron-down"></i>
                                                                                </Card>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12 col-lg-7">
                                                                        {tokenB && tokenA ? (
                                                                            <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                                                                                <Input
                                                                                    step="any"
                                                                                    type='number'
                                                                                    min={0} max={50}
                                                                                    id="standard-adornment-weight"
                                                                                    value={tokenBAmount}
                                                                                    onChange={(e) => {
                                                                                        if (regex.test(e.target.value)) {
                                                                                            if (e.target.value >= 0) {
                                                                                                setTokenBAmount(e.target.value)
                                                                                                setTokenAAmount(parseFloat(e.target.value * ratio1).toFixed(9))
                                                                                            }
                                                                                            else {
                                                                                                setTokenAAmount(0)
                                                                                                setTokenBAmount(0)
                                                                                            }
                                                                                        } else {

                                                                                            setTokenAAmount(tokenAAmount)
                                                                                            setTokenBAmount(tokenBAmount)
                                                                                        }
                                                                                    }}
                                                                                    aria-describedby="standard-weight-helper-text"
                                                                                    inputProps={{
                                                                                        'aria-label': 'weight',
                                                                                    }}
                                                                                />
                                                                                <FormHelperText id="standard-weight-helper-text"><strong>Balance: </strong>{(tokenBBalance / 10 ** 9).toFixed(9)}</FormHelperText>
                                                                            </FormControl>
                                                                        ) : (
                                                                            <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                                                                                <Input
                                                                                    step="any"
                                                                                    type='number'
                                                                                    min={0}
                                                                                    placeholder="0"
                                                                                    disabled
                                                                                    id="standard-adornment-weight"
                                                                                    aria-describedby="standard-weight-helper-text"
                                                                                    inputProps={{
                                                                                        'aria-label': 'weight',
                                                                                    }}
                                                                                />
                                                                                <FormHelperText id="standard-weight-helper-text"><strong>Balance: </strong>{0}</FormHelperText>
                                                                            </FormControl>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {tokenA ? (
                                                                    <Accordion key={0} expanded={expanded === 0} onChange={handleChange(0)}>
                                                                        <AccordionSummary
                                                                            expandIcon={tokenA.address !== "" ? (<i className="fas fa-chevron-down"></i>) : (null)}
                                                                            aria-controls="panel1bh-content"
                                                                            id="panel1bh-header"
                                                                        >
                                                                            <CardHeader
                                                                                avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                                title={tokenA.name}
                                                                                subheader={tokenA.symbol}
                                                                            />
                                                                        </AccordionSummary>
                                                                        {tokenA.address !== "" ? (
                                                                            <AccordionDetails >
                                                                                <Card style={{ backgroundColor: '#e846461F' }} className={classes.root}>
                                                                                    <CardContent>
                                                                                        <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                            <strong>Contract Hash: </strong>{tokenA.address}
                                                                                        </Typography>
                                                                                        <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                            <strong>Package Hash: </strong>{tokenA.packageHash}
                                                                                        </Typography>
                                                                                    </CardContent>

                                                                                </Card>
                                                                            </AccordionDetails>
                                                                        ) : (null)}
                                                                    </Accordion>
                                                                ) : (null)}
                                                                {tokenB ? (
                                                                    <Accordion style={{ marginBottom: '10px' }} key={1} expanded={expanded === 1} onChange={handleChange(1)}>
                                                                        <AccordionSummary
                                                                            expandIcon={tokenB.address !== "" ? (<i className="fas fa-chevron-down"></i>) : (null)}
                                                                            aria-controls="panel1bh-content"
                                                                            id="panel1bh-header"
                                                                        >
                                                                            <CardHeader
                                                                                avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                                title={tokenB.name}
                                                                                subheader={tokenB.symbol}
                                                                            />
                                                                        </AccordionSummary>
                                                                        {tokenB.address !== "" ? (
                                                                            <AccordionDetails >
                                                                                <Card style={{ backgroundColor: '#e846461F' }} className={classes.root}>
                                                                                    <CardContent>
                                                                                        <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                            <strong>Contract Hash: </strong>{tokenB.address}
                                                                                        </Typography>
                                                                                        <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                                                                            <strong>Package Hash: </strong>{tokenB.packageHash}
                                                                                        </Typography>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </AccordionDetails>
                                                                        ) : (null)}
                                                                    </Accordion>
                                                                ) : (null)}
                                                                <Row>
                                                                    {tokenA && tokenA.name !== 'Casper' && tokenAAmount > 0 && tokenAAmount * 10 ** 9 > tokenAAllowance && !isInvalidPair ? (
                                                                        approveAIsLoading ? (
                                                                            <Col>
                                                                                <div className="text-center">
                                                                                    <Spinner
                                                                                        animation="border"
                                                                                        role="status"
                                                                                        style={{ color: "#e84646" }}
                                                                                    >
                                                                                        <span className="sr-only">Loading...</span>
                                                                                    </Spinner>
                                                                                </div>
                                                                            </Col>
                                                                        ) : activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && tokenABalance < tokenAAmount * 10 ** 9 ? (
                                                                            <Col>
                                                                                <button
                                                                                    className="btn btn-block btn-lg "
                                                                                    disabled
                                                                                >
                                                                                    Insufficient Balance
                                                                                </button>
                                                                            </Col>
                                                                        ) : activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined ? (
                                                                            <Col>
                                                                                <button
                                                                                    className="btn btn-block btn-lg"
                                                                                    onClick={async () => {
                                                                                        setApproveAIsLoading(true)
                                                                                        await approveMakeDeploy(tokenA.address, tokenAAmount, 'tokenA')
                                                                                        setApproveAIsLoading(false)
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    Approve {tokenA.symbol}
                                                                                </button>
                                                                            </Col>
                                                                        ) : (
                                                                            <Col>
                                                                                <button
                                                                                    className="btn btn-block btn-lg"
                                                                                    disabled
                                                                                >
                                                                                    Connect to Wallet First
                                                                                </button>
                                                                            </Col>
                                                                        )
                                                                    ) : (null)}


                                                                    {tokenB && tokenB.name !== 'Casper' && tokenBAmount > 0 && tokenBAmount * 10 ** 9 > tokenBAllowance && !isInvalidPair ? (
                                                                        approveBIsLoading ? (
                                                                            <Col>
                                                                                <div className="text-center">
                                                                                    <Spinner
                                                                                        animation="border"
                                                                                        role="status"
                                                                                        style={{ color: "#e84646" }}
                                                                                    >
                                                                                        <span className="sr-only">Loading...</span>
                                                                                    </Spinner>
                                                                                </div>
                                                                            </Col>
                                                                        ) : activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && tokenBBalance < tokenBAmount * 10 ** 9 ? (
                                                                            <Col>
                                                                                <button
                                                                                    className="btn btn-block btn-lg "
                                                                                    disabled
                                                                                >
                                                                                    Insufficient Balance
                                                                                </button>
                                                                            </Col>
                                                                        ) : activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined ? (
                                                                            <Col>
                                                                                <button
                                                                                    className="btn btn-block btn-lg"
                                                                                    onClick={async () => {
                                                                                        setApproveBIsLoading(true)
                                                                                        await approveMakeDeploy(tokenB.address, tokenBAmount, 'tokenB')
                                                                                        setApproveBIsLoading(false)
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    Approve {tokenB.symbol}
                                                                                </button>
                                                                            </Col>
                                                                        ) : (
                                                                            <Col>
                                                                                <button
                                                                                    className="btn btn-block btn-lg"
                                                                                    disabled
                                                                                >
                                                                                    Connect to Wallet First
                                                                                </button>
                                                                            </Col>
                                                                        )
                                                                    ) : (null)}

                                                                </Row>
                                                                <br></br>
                                                                {tokenA && tokenB && !isInvalidPair ? (
                                                                    <Row style={{ marginBottom: '20px' }}>
                                                                        <Col xs={2} md={2}>
                                                                            <CardHeader
                                                                                subheader={'Price'}
                                                                            />
                                                                        </Col>
                                                                        <Col xs={10} md={10}>
                                                                            <CardContent className="text-right" >
                                                                                <Typography variant="body2" component="p">
                                                                                    {`1 ${tokenA.name} = ${numeral(ratio0).format('0,0.000000000')} ${tokenB.name}`}
                                                                                </Typography>
                                                                                <Typography variant="body2" component="p">
                                                                                    {`1 ${tokenB.name} = ${numeral(ratio1).format('0,0.000000000')} ${tokenA.name}`}
                                                                                </Typography>
                                                                            </CardContent>
                                                                        </Col>
                                                                    </Row>
                                                                ) : (
                                                                    null
                                                                )}

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
                                                                ) : isInvalidPair ? (
                                                                    <button
                                                                        className="btn btn-block btn-lg"
                                                                        disabled
                                                                    >
                                                                        Invalid Pair
                                                                    </button>
                                                                ) : activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && (tokenABalance < tokenAAmount * 10 ** 9 || tokenBBalance < tokenBAmount * 10 ** 9) ? (
                                                                    <button
                                                                        className="btn btn-block btn-lg "
                                                                        disabled
                                                                    >
                                                                        Insufficient Balance
                                                                    </button>
                                                                ) : tokenA && tokenA.name !== "Casper" && tokenAAmount * 10 ** 9 > tokenAAllowance ? (
                                                                    <button
                                                                        className="btn btn-block btn-lg "
                                                                        disabled
                                                                    >
                                                                        Approve {tokenA.name} First
                                                                    </button>
                                                                ) : tokenB && tokenB.name !== "Casper" && tokenBAmount * 10 ** 9 > tokenBAllowance ? (
                                                                    <button
                                                                        className="btn btn-block btn-lg "
                                                                        disabled
                                                                    >
                                                                        Approve {tokenB.name} First
                                                                    </button>
                                                                ) : (
                                                                    activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== '0.000000000' && tokenBAmount !== '0.000000000' && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            onClick={async () => await addLiquidityMakeDeploy()}
                                                                        >
                                                                            Supply
                                                                        </button>
                                                                    ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined ? (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            disabled
                                                                        >
                                                                            Connect to Wallet
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-block btn-lg"
                                                                            disabled
                                                                        >
                                                                            Enter an Amount
                                                                        </button>
                                                                    )

                                                                )}
                                                            </form>
                                                            <br></br>
                                                            {tokenA && tokenB && liquidity && liquidity !== '0.000000000' && !isInvalidPair ? (
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
                                                                                    subheader={numeral(liquidity / 10 ** 9).format('0,0.000000000')}
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
                                                                                    subheader={numeral(reserve0).format('0,0.000000000')}
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
                                                                                    subheader={numeral(reserve1).format('0,0.000000000')}
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
            <TokenAModal
                setTokenAAmount={setTokenAAmount}
                setTokenBAmount={setTokenBAmount}
                token={tokenA}
                tokenB={tokenB}
                setToken={setTokenA}
                setTokenList={setTokenList}
                isTokenList={isTokenList}
                tokenList={tokenList}
                show={openTokenAModal}
                handleClose={handleCloseTokenAModal}
                activePublicKey={activePublicKey}
            />
            <TokenBModal
                setTokenAAmount={setTokenAAmount}
                setTokenBAmount={setTokenBAmount}
                token={tokenB}
                tokenA={tokenA}
                setToken={setTokenB}
                setTokenList={setTokenList}
                isTokenList={isTokenList}
                tokenList={tokenList}
                show={openTokenBModal}
                handleClose={handleCloseTokenBModal}
                activePublicKey={activePublicKey}
            />

        </div>
    );
}

export default AddLiquidity;
