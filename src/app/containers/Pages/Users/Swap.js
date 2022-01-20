import { Avatar, CardHeader } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { CasperServiceByJsonRPC, CLByteArray, CLKey, CLList, CLPublicKey, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from "../../../assets/img/cspr.png";
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
import SlippageModal from '../../../components/Modals/SlippageModal';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent } from '@material-ui/core/';

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
    let [inputSelection, setInputSelection] = useState();
    let [mainPurse, setMainPurse] = useState();
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [tokenAAmount, setTokenAAmount] = useState(0);
    let [tokenBAmount, setTokenBAmount] = useState(0);
    let [tokenABalance, setTokenABalance] = useState(0);
    let [tokenBBalance, setTokenBBalance] = useState(0);
    let [tokenAAmountPercent, setTokenAAmountPercent] = useState(tokenAAmount);
    let [tokenBAmountPercent, setTokenBAmountPercent] = useState(tokenBAmount);
    let [approveAIsLoading, setApproveAIsLoading] = useState(false);
    let [tokenAAllowance, setTokenAAllowance] = useState(0);
    let [isInvalidPair, setIsInvalidPair] = useState(false);
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
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    useEffect(() => {
        axios
            .get('/tokensList')
            .then((res) => {
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
                let holdArr = res.data.tokens;
                console.log('holdArr', holdArr);
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
                                setIsInvalidPair(false)
                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                                break;
                            } else if ((address0.toLowerCase() === tokenB.address.slice(5).toLowerCase() && address1.toLowerCase() === tokenA.address.slice(5).toLowerCase())) {
                                setIsInvalidPair(false)
                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                                break;
                            } else {
                                setIsInvalidPair(true)
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
                                console.log('11111111', res.data.pairList[i]);
                                setIsInvalidPair(false)
                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                                break;
                            } else if (name1 === "WCSPR") {
                                console.log('222222', res.data.pairList[i]);
                                setIsInvalidPair(false)
                                setTokenAAmountPercent(parseFloat(res.data.pairList[i].reserve0 / 10 ** 9))
                                setTokenBAmountPercent(parseFloat(res.data.pairList[i].reserve1 / 10 ** 9))
                                break;
                            } else {
                                setIsInvalidPair(true)
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
                    setMainPurse(result.Account.mainPurse)
                    try {
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
                })
            })
        }
    }, [activePublicKey])


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
                setTokenAAllowance(amount * 10 ** 9)
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



    async function swapMakeDeploy() {
        setIsLoading(true)
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const deadline = 1739598100811;
            const paymentAmount = 20000000000;
            if (inputSelection === "tokenA") {
                if (tokenA.name === 'Casper') {
                    console.log("swap_exact_cspr_for_token");
                    const publicKey = CLPublicKey.fromHex(publicKeyHex);
                    const caller = ROUTER_CONTRACT_HASH;
                    const tokenAAddress = tokenA.address;
                    const tokenBAddress = tokenB.address;
                    const amount_in = tokenAAmount;
                    const amount_out_min = tokenBAmount;


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

                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_in: CLValueBuilder.u256(amount_in * 10 ** 9),
                        amount_out_min: CLValueBuilder.u256(parseInt(amount_out_min * 10 ** 9 - (amount_out_min * 10 ** 9) * slippage / 100)),
                        path: new CLList(_paths),
                        to: createRecipientAddress(publicKey),
                        purse: CLValueBuilder.uref(Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")), 3),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
                    let entryPoint = 'swap_exact_cspr_for_tokens_js_client';

                    // Set contract installation deploy (unsigned).
                    let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
                    console.log("make deploy: ", deploy);
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
                } else if (tokenB.name === "Casper") {
                    console.log("swap_exact_token_for_cspr");
                    const publicKey = CLPublicKey.fromHex(publicKeyHex);
                    const caller = ROUTER_CONTRACT_HASH;
                    const tokenAAddress = tokenA.address;
                    const tokenBAddress = tokenB.address;
                    const amount_in = tokenAAmount;
                    const amount_out_min = tokenBAmount;


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
                    // const _token_a = new CLByteArray(
                    //     Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
                    // );
                    // const _token_b = new CLByteArray(
                    //     Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
                    // );
                    console.log('mainPurse', mainPurse);
                    console.log('mainPurse', Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")));
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_in: CLValueBuilder.u256(amount_in * 10 ** 9),
                        amount_out_min: CLValueBuilder.u256(parseInt(amount_out_min * 10 ** 9 - (amount_out_min * 10 ** 9) * slippage / 100)),
                        path: new CLList(_paths),
                        // to: createRecipientAddress(publicKey),
                        to: CLValueBuilder.uref(Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")), 3),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
                    let entryPoint = 'swap_exact_tokens_for_cspr_js_client';

                    // Set contract installation deploy (unsigned).
                    let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
                    console.log("make deploy: ", deploy);
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
                } else {
                    console.log("swap_exact_token_for_token");
                    const publicKey = CLPublicKey.fromHex(publicKeyHex);
                    const caller = ROUTER_CONTRACT_HASH;
                    const tokenAAddress = tokenA.address;
                    const tokenBAddress = tokenB.address;
                    const amount_in = tokenAAmount;
                    const amount_out_min = tokenBAmount;


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
                        amount_out_min: CLValueBuilder.u256(parseInt(amount_out_min * 10 ** 9 - (amount_out_min * 10 ** 9) * slippage / 100)),
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
            } else if (inputSelection === "tokenB") {
                if (tokenA.name === 'Casper') {
                    console.log("swap_cspr_for_exact_token");
                    const publicKey = CLPublicKey.fromHex(publicKeyHex);
                    const caller = ROUTER_CONTRACT_HASH;
                    const tokenAAddress = tokenA.address;
                    const tokenBAddress = tokenB.address;

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
                    console.log('mainPurse', Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")));
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_out: CLValueBuilder.u256(tokenBAmount * 10 ** 9),
                        amount_in_max: CLValueBuilder.u256(parseInt(tokenAAmount * 10 ** 9 + (tokenAAmount * 10 ** 9) * slippage / 100)),
                        path: new CLList(_paths),
                        to: createRecipientAddress(publicKey),
                        purse: CLValueBuilder.uref(Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")), 3),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
                    let entryPoint = 'swap_cspr_for_exact_tokens_js_client';

                    // Set contract installation deploy (unsigned).
                    let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
                    console.log("make deploy: ", deploy);
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
                } else if (tokenB.name === "Casper") {
                    console.log("swap_token_for_exact_cspr");
                    const publicKey = CLPublicKey.fromHex(publicKeyHex);
                    const caller = ROUTER_CONTRACT_HASH;
                    const tokenAAddress = tokenA.address;
                    const tokenBAddress = tokenB.address;

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

                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_out: CLValueBuilder.u256(tokenBAmount * 10 ** 9),
                        amount_in_max: CLValueBuilder.u256(parseInt(tokenAAmount * 10 ** 9 + (tokenAAmount * 10 ** 9) * slippage / 100)),
                        path: new CLList(_paths),
                        // to: createRecipientAddress(publicKey),
                        to: CLValueBuilder.uref(Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")), 3),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
                    let entryPoint = 'swap_tokens_for_exact_cspr_js_client';

                    // Set contract installation deploy (unsigned).
                    let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
                    console.log("make deploy: ", deploy);
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
                } else {
                    console.log("swap_token_for_exact_token");
                    const publicKey = CLPublicKey.fromHex(publicKeyHex);
                    const caller = ROUTER_CONTRACT_HASH;
                    const tokenAAddress = tokenA.address;
                    const tokenBAddress = tokenB.address;

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

                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_out: CLValueBuilder.u256(tokenBAmount * 10 ** 9),
                        amount_in_max: CLValueBuilder.u256(parseInt(tokenAAmount * 10 ** 9 + (tokenAAmount * 10 ** 9) * slippage / 100)),
                        path: new CLList(_paths),
                        to: createRecipientAddress(publicKey),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
                    let entryPoint = 'swap_tokens_for_exact_tokens_js_client';

                    // Set contract installation deploy (unsigned).
                    let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
                    console.log("make deploy: ", deploy);
                    // try {
                    let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                    let result = await putdeploy(signedDeploy)
                    console.log('result', result);
                    let variant = "success";
                    enqueueSnackbar('Tokens Swapped Successfully', { variant });
                    setIsLoading(false)
                    // }
                    // catch {
                    //     let variant = "Error";
                    //     enqueueSnackbar('Unable to Swap Tokens', { variant });
                    //     setIsLoading(false)
                    // }
                }
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
                                                        <div className="login-header">
                                                            <h3  >
                                                                <div style={{ textAlign: "center" }}>Swap
                                                                    <span onClick={handleShowSlippage} style={{ float: 'right' }}><i className="fas fa-cog"></i></span>
                                                                </div>
                                                            </h3>
                                                        </div>
                                                        <form >
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
                                                                <div className="col-md-12 col-lg-5">
                                                                    {tokenB && tokenA ? (
                                                                        <input
                                                                            type="number"
                                                                            required
                                                                            value={tokenAAmount}
                                                                            placeholder={0}
                                                                            min={0}
                                                                            step="any"
                                                                            className="form-control"
                                                                            onChange={(e) => {
                                                                                // setTokenAAmount(e.target.value)
                                                                                if (e.target.value >= 0) {
                                                                                    setTokenAAmount(e.target.value)
                                                                                    setTokenBAmount(e.target.value * (tokenAAmountPercent / tokenBAmountPercent).toFixed(5))
                                                                                    setInputSelection('tokenA')
                                                                                } else {
                                                                                    setTokenAAmount(0)
                                                                                    setTokenBAmount(0)
                                                                                    setInputSelection()
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
                                                            </div>
                                                            {activePublicKey && tokenA ? (
                                                                <>
                                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                                        <strong>Balance: </strong>{tokenABalance / 10 ** 9}
                                                                    </Typography>
                                                                </>
                                                            ) : (null)}
                                                            <div style={{ textAlign: 'center', margin: '20px' }}>
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

                                                                <div className="col-md-12 col-lg-5">
                                                                    {tokenB && tokenA ? (
                                                                        <input
                                                                            type="number"
                                                                            required
                                                                            value={tokenBAmount}
                                                                            placeholder={0}
                                                                            min={0}
                                                                            step="any"
                                                                            className="form-control"
                                                                            onChange={(e) => {
                                                                                if (e.target.value >= 0) {
                                                                                    setTokenBAmount(e.target.value)
                                                                                    setTokenAAmount(e.target.value * (tokenBAmountPercent / tokenAAmountPercent).toFixed(5))
                                                                                    setInputSelection('tokenB')
                                                                                }
                                                                                else {
                                                                                    setTokenAAmount(0)
                                                                                    setTokenBAmount(0)
                                                                                    setInputSelection()
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
                                                                <Accordion key={1} expanded={expanded === 1} onChange={handleChange(1)}>
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

                                                            {tokenA && tokenA.name !== 'Casper' && tokenAAmount > 0 && tokenAAmount * 10 ** 9 > tokenAAllowance && !isInvalidPair ? (
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
                                                            <br></br>
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
                                                            ) : tokenA && tokenA.name !== "Casper" && tokenAAmount * 10 ** 9 > tokenAAllowance ? (
                                                                <button
                                                                    className="btn btn-block btn-lg "
                                                                    disabled
                                                                >
                                                                    Approve {tokenA.name} First
                                                                </button>
                                                            ) : (
                                                                activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
                                                                    <button
                                                                        className="btn btn-block btn-lg"
                                                                        onClick={async () => await swapMakeDeploy()}
                                                                    >
                                                                        Swap
                                                                    </button>
                                                                ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined ? (
                                                                    <button
                                                                        className="btn btn-block btn-lg "
                                                                        disabled
                                                                    >
                                                                        Connect to Casper Signer
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-block btn-lg "
                                                                        disabled
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

export default Swap;
