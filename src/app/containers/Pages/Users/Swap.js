import { FormControl, FormHelperText, Input } from "@material-ui/core";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardContent, CardHeader } from '@material-ui/core/';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Torus from "@toruslabs/casper-embed";
import axios from "axios";
import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLList, CLPublicKey, CLString, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import numeral from "numeral";
import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import Logo from "../../../assets/img/cspr.png";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { getDeploy } from "../../../components/blockchain/GetDeploy/GetDeploy";
import { getStateRootHash } from '../../../components/blockchain/GetStateRootHash/GetStateRootHash';
import { makeDeploy } from '../../../components/blockchain/MakeDeploy/MakeDeploy';
import { makeDeployWasm } from "../../../components/blockchain/MakeDeploy/MakeDeployWasm";
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';
import { putdeploy } from '../../../components/blockchain/PutDeploy/PutDeploy';
import { createRecipientAddress } from '../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../components/blockchain/SignDeploy/SignDeploy';
import { convertToStr } from "../../../components/ConvertToString/ConvertToString";
import HeaderHome, { CHAINS, SUPPORTED_NETWORKS } from "../../../components/Headers/Header";
import AllowanceModal from "../../../components/Modals/AllowanceModal";
import SigningModal from "../../../components/Modals/SigningModal";
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
function Swap(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
  let [selectedWallet, setSelectedWallet] = useState(localStorage.getItem("selectedWallet"));
  let [torus, setTorus] = useState(JSON.parse(localStorage.getItem("torus")));
  let [inputSelection, setInputSelection] = useState();
  let [mainPurse, setMainPurse] = useState();
  let [tokenA, setTokenA] = useState();
  let [tokenB, setTokenB] = useState();
  let [tokenAAmount, setTokenAAmount] = useState(0);
  let [tokenBAmount, setTokenBAmount] = useState(0);
  let [tokenABalance, setTokenABalance] = useState(0);
  let [tokenBBalance, setTokenBBalance] = useState(0);
  let [approveAIsLoading, setApproveAIsLoading] = useState(false);
  let [tokenAAllowance, setTokenAAllowance] = useState(0);
  let [isInvalidPair, setIsInvalidPair] = useState(false);
  const [tokenList, setTokenList] = useState([])
  const [isTokenList, setIsTokenList] = useState(false)
  const [swapPath, setSwapPath] = useState([])
  const [reserve0, setReserve0] = useState(1)
  const [reserve1, setReserve1] = useState(1)
  console.log('window.torus', window.torus);
  console.log("localStorage.getItem(torus)", JSON.parse(localStorage.getItem("torus")));
  console.log("torus", torus);

  let [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [allowance, setAllowance] = useState(0);
  const [openSlippage, setOpenSlippage] = useState(false);
  const handleCloseSlippage = () => {
    setOpenSlippage(false);
  };
  const handleShowSlippage = () => {
    setOpenSlippage(true);
  };
  const [openAllowance, setOpenAllowance] = useState(false);
  const handleCloseAllowance = () => {
    setOpenAllowance(false);
  };
  const handleShowAllowance = () => {
    setOpenAllowance(true);
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
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  const resetData = () => {
    getTokenData()
    setInputSelection()
    setTokenA()
    setTokenB()
    setTokenAAmount(0)
    setTokenBAmount(0)
    setTokenABalance(0)
    setTokenBBalance(0)
    setTokenAAllowance()
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
        // console.log('CSPR', CSPR);
        let holdArr = res.data.tokens;
        // console.log('holdArr', holdArr);
        for (let i = 0; i < holdArr.length; i++) {
          let param = {
            contractHash: holdArr[i].contractHash.slice(5),
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
  }, [activePublicKey, getTokenData]);

  useEffect(() => {
    if (tokenA && tokenB) {
      let pathParams = {
        tokenASymbol: tokenA.symbol,
        tokenBSymbol: tokenB.symbol,
      }
      if (tokenA.symbol === "CSPR") {
        pathParams.tokenASymbol = "WCSPR"

      } else if (tokenB.symbol === "CSPR") {
        pathParams.tokenBSymbol = "WCSPR"
      }

      console.log('pathParams', pathParams);
      axios
        .post('/getpath', pathParams)
        .then((res) => {
          console.log('getPath', res)
          setIsInvalidPair(false);
          setSwapPath(res.data.pathwithcontractHash)
          let pathResParam = {
            path: res.data.path
          }
          console.log("pathResParam", pathResParam);
          axios
            .post('/getpathreserves', pathResParam)
            .then((res) => {
              console.log('getpathreserves', res)
              if (res.data.reserve0 && res.data.reserve1) {
                setReserve0(res.data.reserve0)
                setReserve1(res.data.reserve1)
              } else {
                setReserve0(1)
                setReserve1(1)
              }
            })
            .catch((error) => {
              console.log(error)
              console.log(error.response)
            })


        })
        .catch((error) => {
          setIsInvalidPair(true);
          setReserve0(1)
          setReserve1(1)
          console.log(error)
          console.log(error.response)
        })
    }

  }, [tokenA, tokenB]);
  useEffect(() => {
    if (tokenA && tokenA.name !== "Casper" && activePublicKey) {
      let balanceParam = {
        contractHash: tokenA.contractHash.slice(5),
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
        contractHash: tokenA.contractHash.slice(5),
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
        contractHash: tokenB.contractHash.slice(5),
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


  async function approveMakeDeploy(contractHash, amount) {
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
          amount: CLValueBuilder.u256(parseInt(amount * 10 ** 9)),
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
          setTokenAAllowance(parseInt(amount * 10 ** 9));
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
  async function increaseAndDecreaseAllowanceMakeDeploy(contractHash, amount, tokenApproved, increase) {
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
          increase ? setTokenAAllowance(allowance + amount * 10 ** 9) :
            setTokenAAllowance(allowance - amount * 10 ** 9)
          handleCloseAllowance();
          handleCloseSigning();
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
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Input values are not Valid", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  async function swapMakeDeploy() {
    handleShowSigning();
    setIsLoading(true);
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const deadline = 1739598100811;
      const paymentAmount = 10000000000;
      if (inputSelection === "tokenA") {
        if (tokenA.name === "Casper") {
          console.log("swap_exact_cspr_for_token");
          const publicKey = CLPublicKey.fromHex(publicKeyHex);
          const caller = ROUTER_CONTRACT_HASH;
          const amount_in = tokenAAmount;
          const amount_out_min = tokenBAmount;

          console.log("publicKeyHex", publicKeyHex);
          let path = swapPath;
          console.log("path", path);
          let _paths = [];
          for (let i = 0; i < path.length; i++) {
            const p = new CLString("hash-".concat(path[i]));
            _paths.push(p);
          }
          console.log("_paths", _paths);
          try {
            const runtimeArgs = RuntimeArgs.fromMap({
              amount: CLValueBuilder.u512(convertToStr(amount_in)),
              destination_entrypoint: CLValueBuilder.string("swap_exact_cspr_for_tokens"),
              router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
              amount_in: CLValueBuilder.u256(convertToStr(amount_in)),
              amount_out_min: CLValueBuilder.u256(
                convertToStr(amount_out_min - (amount_out_min * slippage) / 100)
              ),
              path: new CLList(_paths),
              to: createRecipientAddress(publicKey),
              purse: CLValueBuilder.uref(
                Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                AccessRights.READ_ADD_WRITE
              ),
              deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(
              Buffer.from(caller, "hex")
            );
            let entryPoint = "swap_exact_cspr_for_tokens_js_client";

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
                const casperService = new CasperServiceByJsonRPC(
                  torus?.provider
                );
                const deployRes = await casperService.deploy(deploy);
                console.log("deployRes", deployRes.deploy_hash);
                // console.log(
                //   `... Contract installation deployHash: ${deployRes.deploy_hash}`
                // );
                // let result = await getDeploy(
                //   NODE_ADDRESS,
                //   deployRes.deploy_hash,
                //   enqueueSnackbar
                // );
                // console.log(
                //   `... Contract installed successfully.`,
                //   JSON.parse(JSON.stringify(result))
                // );
                // console.log("result", result);
              }

              handleCloseSigning();
              let variant = "success";
              enqueueSnackbar("Tokens Swapped Successfully", { variant });
              setIsLoading(false);
              resetData();
              // window.location.reload(false);
            } catch {
              handleCloseSigning();
              let variant = "Error";
              enqueueSnackbar("Unable to Swap Tokens", { variant });
              setIsLoading(false);
            }
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Input values are too large", { variant });
          }
        } else if (tokenB.name === "Casper") {
          console.log("swap_exact_token_for_cspr");
          const publicKey = CLPublicKey.fromHex(publicKeyHex);
          const caller = ROUTER_CONTRACT_HASH;
          const amount_in = tokenAAmount;
          const amount_out_min = tokenBAmount;

          console.log("publicKeyHex", publicKeyHex);
          let path = swapPath;
          console.log("path", path);
          let _paths = [];
          for (let i = 0; i < path.length; i++) {
            const p = new CLString("hash-".concat(path[i]));
            _paths.push(p);
          }
          console.log("_paths", _paths);
          console.log("mainPurse", mainPurse);
          console.log(
            "mainPurse",
            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex"))
          );
          try {
            const runtimeArgs = RuntimeArgs.fromMap({
              amount: CLValueBuilder.u512(convertToStr(amount_in)),
              destination_entrypoint: CLValueBuilder.string("swap_exact_tokens_for_cspr"),
              router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
              amount_in: CLValueBuilder.u256(convertToStr(amount_in)),
              amount_out_min: CLValueBuilder.u256(
                convertToStr(amount_out_min - (amount_out_min * slippage) / 100)
              ),
              path: new CLList(_paths),
              to: CLValueBuilder.uref(
                Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                AccessRights.READ_ADD_WRITE
              ),
              deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(
              Buffer.from(caller, "hex")
            );
            let entryPoint = "swap_exact_tokens_for_cspr_js_client";

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
                const casperService = new CasperServiceByJsonRPC(
                  torus?.provider
                );
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
              handleCloseSigning();
              let variant = "success";
              enqueueSnackbar("Tokens Swapped Successfully", { variant });
              setIsLoading(false);
              resetData();
              // window.location.reload(false);
            } catch {
              handleCloseSigning();
              let variant = "Error";
              enqueueSnackbar("Unable to Swap Tokens", { variant });
              setIsLoading(false);
            }
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Input values are too large", { variant });
          }
        } else {
          console.log("swap_exact_token_for_token");
          const publicKey = CLPublicKey.fromHex(publicKeyHex);
          const caller = ROUTER_CONTRACT_HASH;
          const amount_in = tokenAAmount;
          const amount_out_min = tokenBAmount;
          console.log("publicKeyHex", publicKeyHex);
          let path = swapPath;
          console.log("path", path);
          let _paths = [];
          for (let i = 0; i < path.length; i++) {
            const p = new CLString("hash-".concat(path[i]));
            _paths.push(p);
          }
          console.log("_paths", _paths);
          console.log(
            "amount_out_min * 10 ** 9 - (amount_out_min * 10 ** 9) * slippage / 100",
            amount_out_min * 10 ** 9 -
            (amount_out_min * 10 ** 9 * slippage) / 100
          );
          console.log(
            "amount_out_min - (amount_out_min) * slippage / 100",
            amount_out_min - (amount_out_min * slippage) / 100
          );
          try {
            const runtimeArgs = RuntimeArgs.fromMap({
              amount_in: CLValueBuilder.u256(convertToStr(amount_in)),
              amount_out_min: CLValueBuilder.u256(
                convertToStr(amount_out_min - (amount_out_min * slippage) / 100)
              ),
              path: new CLList(_paths),
              to: createRecipientAddress(publicKey),
              deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(
              Buffer.from(caller, "hex")
            );
            let entryPoint = "swap_exact_tokens_for_tokens_js_client";

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
                const casperService = new CasperServiceByJsonRPC(
                  torus?.provider
                );
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
              handleCloseSigning();
              let variant = "success";
              enqueueSnackbar("Tokens Swapped Successfully", { variant });
              setIsLoading(false);
              resetData();
              // window.location.reload(false);
            } catch {
              handleCloseSigning();
              let variant = "Error";
              enqueueSnackbar("Unable to Swap Tokens", { variant });
              setIsLoading(false);
            }
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Input values are too large", { variant });
          }
        }
      } else if (inputSelection === "tokenB") {
        if (tokenA.name === "Casper") {
          console.log("swap_cspr_for_exact_token");
          const publicKey = CLPublicKey.fromHex(publicKeyHex);
          const caller = ROUTER_CONTRACT_HASH;
          console.log("publicKeyHex", publicKeyHex);
          let path = swapPath;
          console.log("path", path);
          let _paths = [];
          for (let i = 0; i < path.length; i++) {
            const p = new CLString("hash-".concat(path[i]));
            _paths.push(p);
          }
          console.log("_paths", _paths);
          console.log(
            "mainPurse",
            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex"))
          );
          try {
            const runtimeArgs = RuntimeArgs.fromMap({
              amount: CLValueBuilder.u512(convertToStr(tokenBAmount)),
              destination_entrypoint: CLValueBuilder.string("swap_cspr_for_exact_tokens"),
              router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
              amount_out: CLValueBuilder.u256(convertToStr(tokenBAmount)),
              amount_in_max: CLValueBuilder.u256(
                convertToStr(
                  Number(tokenAAmount) + Number((tokenAAmount * slippage) / 100)
                )
              ),
              path: new CLList(_paths),
              to: createRecipientAddress(publicKey),
              purse: CLValueBuilder.uref(
                Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                AccessRights.READ_ADD_WRITE
              ),
              deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(
              Buffer.from(caller, "hex")
            );
            let entryPoint = "swap_cspr_for_exact_tokens_js_client";

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
                const casperService = new CasperServiceByJsonRPC(
                  torus?.provider
                );
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
              handleCloseSigning();
              let variant = "success";
              enqueueSnackbar("Tokens Swapped Successfully", { variant });
              setIsLoading(false);
              resetData();
              // window.location.reload(false);
            } catch {
              handleCloseSigning();
              let variant = "Error";
              enqueueSnackbar("Unable to Swap Tokens", { variant });
              setIsLoading(false);
            }
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Input values are too large", { variant });
          }
        } else if (tokenB.name === "Casper") {
          console.log("swap_token_for_exact_cspr");
          const publicKey = CLPublicKey.fromHex(publicKeyHex);
          const caller = ROUTER_CONTRACT_HASH;
          console.log("publicKeyHex", publicKeyHex);
          let path = swapPath;
          console.log("path", path);
          let _paths = [];
          for (let i = 0; i < path.length; i++) {
            const p = new CLString("hash-".concat(path[i]));
            _paths.push(p);
          }
          console.log("_paths", _paths);
          try {
            const runtimeArgs = RuntimeArgs.fromMap({
              amount: CLValueBuilder.u512(convertToStr(tokenBAmount)),
              destination_entrypoint: CLValueBuilder.string("swap_tokens_for_exact_cspr"),
              router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
              amount_out: CLValueBuilder.u256(convertToStr(tokenBAmount)),
              amount_in_max: CLValueBuilder.u256(
                convertToStr(
                  Number(tokenAAmount) + Number((tokenAAmount * slippage) / 100)
                )
              ),
              path: new CLList(_paths),
              to: CLValueBuilder.uref(
                Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                AccessRights.READ_ADD_WRITE
              ),
              deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(
              Buffer.from(caller, "hex")
            );
            let entryPoint = "swap_tokens_for_exact_cspr_js_client";

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
                const casperService = new CasperServiceByJsonRPC(
                  torus?.provider
                );
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
              handleCloseSigning();
              let variant = "success";
              enqueueSnackbar("Tokens Swapped Successfully", { variant });
              setIsLoading(false);
              resetData();
              // window.location.reload(false);
            } catch {
              handleCloseSigning();
              let variant = "Error";
              enqueueSnackbar("Unable to Swap Tokens", { variant });
              setIsLoading(false);
            }
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Input values are too large", { variant });
          }
        } else {
          console.log("swap_token_for_exact_token");
          const publicKey = CLPublicKey.fromHex(publicKeyHex);
          const caller = ROUTER_CONTRACT_HASH;
          console.log("publicKeyHex", publicKeyHex);
          let path = swapPath;
          console.log("path", path);
          let _paths = [];
          for (let i = 0; i < path.length; i++) {
            const p = new CLString("hash-".concat(path[i]));
            _paths.push(p);
          }
          console.log("_paths", _paths);
          try {
            const runtimeArgs = RuntimeArgs.fromMap({
              amount_out: CLValueBuilder.u256(convertToStr(tokenBAmount)),
              amount_in_max: CLValueBuilder.u256(
                convertToStr(
                  Number(tokenAAmount) + Number((tokenAAmount * slippage) / 100)
                )
              ),
              path: new CLList(_paths),
              to: createRecipientAddress(publicKey),
              deadline: CLValueBuilder.u256(deadline),
            });

            let contractHashAsByteArray = Uint8Array.from(
              Buffer.from(caller, "hex")
            );
            let entryPoint = "swap_tokens_for_exact_tokens_js_client";

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
                const casperService = new CasperServiceByJsonRPC(
                  torus?.provider
                );
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
              handleCloseSigning();
              let variant = "success";
              enqueueSnackbar("Tokens Swapped Successfully", { variant });
              setIsLoading(false);
              resetData();
              // window.location.reload(false);
            } catch {
              handleCloseSigning();
              let variant = "Error";
              enqueueSnackbar("Unable to Swap Tokens", { variant });
              setIsLoading(false);
            }
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Input values are too large", { variant });
          }
        }
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
          <HeaderHome setActivePublicKey={setActivePublicKey} setSelectedWallet={setSelectedWallet} selectedWallet={selectedWallet} setTorus={setTorus} selectedNav={"Swap"} />
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
                                          if (regex.test(e.target.value)) {
                                            if (e.target.value >= 0) {
                                              setTokenAAmount(e.target.value)
                                              setTokenBAmount(parseFloat(e.target.value * reserve0).toFixed(9))
                                              setInputSelection('tokenA')

                                            } else {
                                              setTokenAAmount(0)
                                              setTokenBAmount(0)
                                              setInputSelection()
                                            }
                                          } else {
                                            setTokenAAmount(tokenAAmount)
                                            setTokenBAmount(tokenBAmount)
                                          }
                                        }}
                                        // endAdornment={<InputAdornment position="end">%</InputAdornment>}
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
                              <div style={{ textAlign: 'center', margin: '20px' }}>
                                <i className="fas fa-exchange-alt fa-2x fa-rotate-90"></i>
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
                                              console.log("e.target.valu", e.target.value);
                                              setTokenBAmount(Number(e.target.value))
                                              console.log("e.target.value * reserve1", e.target.value * reserve1);
                                              setTokenAAmount(parseFloat(e.target.value * reserve1).toFixed(9))
                                              setInputSelection('tokenB')
                                            }
                                            else {
                                              setTokenAAmount(0)
                                              setTokenBAmount(0)
                                              setInputSelection()
                                            }
                                          } else {
                                            setTokenAAmount(tokenAAmount)
                                            setTokenBAmount(tokenBAmount)
                                          }

                                        }}
                                        // endAdornment={<InputAdornment position="end">%</InputAdornment>}
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
                                        // endAdornment={<InputAdornment position="end"></InputAdornment>}
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
                                    expandIcon={tokenA.contractHash !== "" && tokenA.contractHash !== undefined && tokenA.contractHash !== null ? (<i className="fas fa-chevron-down"></i>) : (null)}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                  >
                                    <CardHeader
                                      avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                      title={tokenA.name}
                                      subheader={tokenA.symbol}
                                    />
                                  </AccordionSummary>
                                  {tokenA.contractHash !== "" && tokenA.contractHash !== undefined && tokenA.contractHash !== null ? (
                                    <AccordionDetails >
                                      <Card style={{ backgroundColor: '#e846461F' }} className={classes.root}>
                                        <CardContent>
                                          <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                            <strong>Contract Hash: </strong>{tokenA.contractHash}
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
                                    expandIcon={tokenB.contractHash !== "" && tokenB.contractHash !== undefined && tokenB.contractHash !== null ? (<i className="fas fa-chevron-down"></i>) : (null)}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                  >
                                    <CardHeader
                                      avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                      title={tokenB.name}
                                      subheader={tokenB.symbol}
                                    />
                                  </AccordionSummary>
                                  {tokenB.contractHash !== "" && tokenB.contractHash !== undefined && tokenB.contractHash !== null ? (
                                    <AccordionDetails >
                                      <Card style={{ backgroundColor: '#e846461F' }} className={classes.root}>
                                        <CardContent>
                                          <Typography style={{ margin: '10px' }} variant="body2" color="textSecondary" component="p">
                                            <strong>Contract Hash: </strong>{tokenB.contractHash}
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
                                ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined || tokenABalance < tokenAAmount * 10 ** 9 ? (
                                  <button
                                    className="btn btn-block btn-lg "
                                    disabled
                                  >
                                    Insufficient Balance
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn-block btn-outline-primary btn-lg"
                                    onClick={async () => {
                                      // setApproveAIsLoading(true)
                                      setAllowance(tokenAAllowance)
                                      handleShowAllowance();
                                      // await approveMakeDeploy(tokenA.contractHash, tokenAAmount)
                                      // setApproveAIsLoading(false)
                                    }}
                                  >
                                    Approve {tokenA.name}
                                  </button>
                                )
                              ) : (null)}
                              <br></br>
                              {tokenA && tokenB && !isInvalidPair ? (
                                <>
                                  <Card>
                                    <CardContent>
                                      <Row>
                                        <Col>
                                          <CardHeader
                                            style={{ margin: '10px' }}
                                            title={numeral(tokenAAmount).format('0,0.000000000')}
                                          />
                                        </Col>
                                        <Col>
                                          <CardHeader
                                            avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" />}
                                            title={tokenA.name}
                                          />
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col>
                                          <CardHeader
                                            style={{ margin: '10px' }}
                                            title={numeral(tokenBAmount).format('0,0.0000000000')}
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
                                  <hr />
                                  <Row style={{ marginBottom: '20px' }}>
                                    <Col xs={2} md={2}>
                                      <CardHeader
                                        subheader={'Price'}
                                      />
                                    </Col>
                                    <Col xs={10} md={10}>
                                      <CardContent className="text-right" >
                                        <Typography variant="body2" component="p">
                                          {`1 ${tokenA.name} = ${numeral(reserve0).format('0,0.000000000')} ${tokenB.name}`}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                          {`1 ${tokenB.name} = ${numeral(reserve1).format('0,0.000000000')} ${tokenA.name}`}
                                        </Typography>
                                      </CardContent>
                                    </Col>
                                  </Row>
                                </>
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
                              ) : activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && tokenABalance < tokenAAmount * 10 ** 9 ? (
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
                              ) : (
                                activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined && tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== '0.000000000' && tokenBAmount !== '0.000000000' && tokenAAmount !== null && tokenBAmount !== null && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
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
                                    Connect to Wallet
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
      <AllowanceModal allowance={allowance} setAllowance={setAllowance} show={openAllowance} handleClose={handleCloseAllowance} approvalAmount={tokenAAmount} tokenAddress={tokenA?.contractHash} tokenAmount={tokenAAmount} tokenApproved='tokenA' increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} />
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

    </div >
  );
}

export default Swap;
