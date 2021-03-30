import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import Agreement from '../../../../components/blockchain/Abis/Agreement.json';
import USDTToken from '../../../../components/blockchain/Abis/USDTToken.json';
import * as Addresses from '../../../../components/blockchain/Addresses/Addresses';
import AcceptRejectImporterDocumentModal from "../../../../components/Modals/AcceptRejectImporterDocumentModal.js";
import DisputeOrderModal from "../../../../components/Modals/DisputeOrdersModal";
import FinalizeConfirmationModal from "../../../../components/Modals/FinalizeConfirmationModal.js";
import LockingFundsConfirmationModal from "../../../../components/Modals/LockingFundsConfirmationModal.js";
import OrderDetailModal from "../../../../components/Modals/OrderDetailModal.js";
import ReceivedandReleaseFundsModal from "../../../../components/Modals/ReceivedandReleaseFundsModal";
import UploadDocumentModal from "../../../../components/Modals/UploadDocumentModal.js";
import CardsTabPanel from '../../../../components/Tabs/CardsTabs.js';
import TabPanel from '../../../../components/Tabs/Tabs.js';

function Orders(props) {
  const handleClose = () => setShow(false);
  let [show, setShow] = useState(false);
  let [order, setOrder] = useState();
  const [view, setView] = React.useState('list');
  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    getAllOrders();
    props.setActiveTab({
      dashboard: "",
      newOrders: "",
      orders: "active",
      ordersReceived: "",
      privacyPolicy:"",
      termsandconditions: "",
      settings: "",
      changePassword: "",
    });// eslint-disable-next-line
  },[]);

  const [inputList, setInputList] = useState([{ category: "", description: "", fileData: "" }]);
  let [isUploading, setIsUploading] = useState(false);
  let [isReceivedAndReleaseOrder, setIsReceivedAndReleaseOrder] = useState(false);
  let [isFinalizeOrder, setIsFinalizeOrder] = useState(false);
  let [isDisputing, setIsDisputing] = useState(false);

  let [isLockingFunds, setIsLockingFunds] = useState(false);
  let [isRejectingDocument, setIsRejectingDocument] = useState(false);
  let [isAcceptingDocument, setIsAcceptingDocument] = useState(false);
  let [pendingOrders, setPendingOrders] = useState([]);
  let [acceptedOrders, setAcceptedOrders] = useState([]);
  let [rejectedOrders, setRejectedOrders] = useState([]);
  let [finalizedOrders, setFinalizedOrders] = useState([]);
  let [disputedOrders, setDisputedOrders] = useState([]);
  let [underDeliveryOrders, setUnderDeliveryOrders] = useState([]);
  let [completedOrders, setCompletedOrders] = useState([]);
  let [fundsLockedOrders, setFundsLockedOrders] = useState([]);

  let [isError, setIsError] = useState(false);
  let [isSuccess, setIsSuccess] = useState(false);
  let [errorMsg, setErrorMsg] = useState();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const handleCloseUploadModal = () => {
    setShowUploadModal(false)
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  };
  const handleShowUploadModal = () => setShowUploadModal(true);

  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false);
  const handleCloseAcceptRejectModal = () => {
    setShowAcceptRejectModal(false)
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  };
  const handleShowAcceptRejectModal = () => setShowAcceptRejectModal(true);

  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const handleCloseFinalizeModal = () => {
    setShowFinalizeModal(false)
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  };
  const handleShowFinalizeModal = () => setShowFinalizeModal(true);

  const [showReceivedAndReleaseModal, setShowReceivedAndReleaseModal] = useState(false);
  const handleCloseReceivedAndReleaseModal = () => {
    setShowReceivedAndReleaseModal(false)
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  };
  const handleShowReceivedAndReleaseModal = () => setShowReceivedAndReleaseModal(true);


  const [showLockFundsModal, setShowLockFundsModal] = useState(false);
  const handleCloseLockFundsModal = () => {
    setShowLockFundsModal(false)
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  };
  const handleShowLockFundsModal = () => setShowLockFundsModal(true);


  const [showDisputeOrderModal, setShowDisputeOrderModal] = useState(false);
  const handleCloseDisputeOrderModal = () => {
    setShowDisputeOrderModal(false)
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  };
  const handleShowDisputeOrderModal = () => setShowDisputeOrderModal(true);

  let getAllOrders = () => {
    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);
    let importer = jwtDecoded.id;

    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/Pending/${importer}`)
      .then((response) => {
        console.log(response.data);
        setPendingOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setPendingOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/Accepted/${importer}`)
      .then((response) => {
        console.log(response.data);
        setAcceptedOrders(response.data.data);
        if (order !== '' && order !== null && order !== undefined) {
          let data = response.data.data.filter(item => item._id === order._id)
          setOrder(data[0]);
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setAcceptedOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/Rejected/${importer}`)
      .then((response) => {
        console.log(response.data);
        setRejectedOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setRejectedOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/Finalized/${importer}`)
      .then((response) => {
        console.log(response.data);
        setFinalizedOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setFinalizedOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/UnderDisputed/${importer}`)
      .then((response) => {
        console.log(response.data);
        setDisputedOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setDisputedOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/UnderDelivery/${importer}`)
      .then((response) => {
        console.log(response.data);
        setUnderDeliveryOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setUnderDeliveryOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/Completed/${importer}`)
      .then((response) => {
        console.log(response.data);
        setCompletedOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setCompletedOrders([]);
      });
    axios
      .get(`/api/v1/importer/getOrders/OrderPlaced/FundsLocked/${importer}`)
      .then((response) => {
        console.log(response.data);
        setFundsLockedOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setFundsLockedOrders([]);
      });
  };
  let fileSelectHandler = (event, index) => {
    if (event.target.files[0] !== undefined) {
      let newArr = [...inputList];
      newArr[index].fileData = event.target.files[0];
      setInputList(newArr);
    }
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  const handleAddClick = () => {
    setInputList([...inputList, { category: "", description: "", fileData: "" }]);
  };
  let uploadDocument = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setIsError(false);
    if (inputList.length > 0) {
      inputList.forEach((file, index) => {
        if (file.category === undefined || file.category === "") {
          setIsError(true);
          setErrorMsg(`Please Add a File Category at ${index + 1} position`);
          setIsUploading(false);
          return;
        } else
          if (file.description === "" || file.description === "undefined") {
            setIsError(true);
            setErrorMsg(`Please Add a File Description at ${index + 1} position`);
            setIsUploading(false);
            return;
          } else
            if (file.fileData === "" || file.fileData === "undefined") {
              setIsError(true);
              setErrorMsg(`Please Upload a File at ${index + 1} position`);
              setIsUploading(false);
              return;
            }
      });
    }
    let fileData = new FormData();
    console.log("JSON.stringify(inputList)", inputList);
    let catagoryArray = [];
    let descriptionArray = [];
    for (let i = 0; i < inputList.length; i++) {
      catagoryArray.push(inputList[i].category);
      descriptionArray.push(inputList[i].description);
      fileData.append(`file`, inputList[i].fileData);
    }
    console.log(descriptionArray);

    fileData.append(`description`, JSON.stringify(descriptionArray));
    fileData.append(`documentNames`, JSON.stringify(catagoryArray));
    fileData.append(`orderId`, order._id);

    for (var pair of fileData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    axios.post("api/v1/importer/uploadDocuments", fileData).then(
      (response) => {
        console.log("response", response);
        setIsUploading(false);
        getAllOrders();
        let variant = "success";
        enqueueSnackbar('Documents Uploaded Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsUploading(false);
        let variant = "error";
        enqueueSnackbar('Unable to Uploade Documents', { variant });
      }
    );
  }
  let rejectDocument = (documentId, reason) => {
    console.log(order._id);
    setIsRejectingDocument(true);
    console.log(documentId);
    let rejectDocumentObject = {
      orderId: order._id,
      documentId: [documentId],
      rejectionreason: reason
    }
    console.log(rejectDocumentObject);
    axios.post("api/v1/importer/rejectFile", rejectDocumentObject).then(
      (response) => {
        console.log("response", response);
        setIsRejectingDocument(false);
        getAllOrders();
        let variant = "success";
        enqueueSnackbar('Documents Rejected Successfully', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsRejectingDocument(false);
        let variant = "error";
        enqueueSnackbar('Unable to Reject Document', { variant });

      })
  }
  let acceptDocument = (documentId) => {
    console.log(order._id);
    setIsAcceptingDocument(true);
    console.log(documentId);
    let acceptDocumentObject = {
      orderId: order._id,
      documentId: [documentId]
    }
    console.log(acceptDocumentObject);
    axios.post("api/v1/importer/acceptFile", acceptDocumentObject).then(
      (response) => {
        console.log("response", response);
        setIsAcceptingDocument(false);
        getAllOrders();
        let variant = "success";
        enqueueSnackbar('Documents Accepted Successfully.', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsAcceptingDocument(false);
        let variant = "error";
        enqueueSnackbar('Unable to Accept Document', { variant });

      })
  }
  let finalizeOrder = async () => {
    console.log(order._id);
    setIsFinalizeOrder(true);
    await loadWeb3();
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    console.log("Account test: ", accounts[0]);
    let finlizeOrderObject = {
      orderId: order._id,
      importer_address: accounts[0]
    }
    axios.post("api/v1/importer/finalizeStatus", finlizeOrderObject).then(
      (response) => {
        console.log("response", response);
        setIsFinalizeOrder(false);
        getAllOrders();
        let variant = "success";
        enqueueSnackbar('Order Finalized Successfully.', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsFinalizeOrder(false);
        let variant = "error";
        enqueueSnackbar('Unable to Finalize Order.', { variant });

      })
  }
  let loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  let lockFunds = async () => {
    console.log(order._id);
    setIsLockingFunds(true);
    let lockFundsObject = {
      orderId: order._id,
    }

    await loadWeb3();
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const address = Addresses.USDTTokenAddress;
    const abi = USDTToken;

    var myContractInstance = await new web3.eth.Contract(abi, address);
    console.log("contract", order.numberOfTokens);
    await myContractInstance.methods.transfer(order.Agreement_Address, order.numberOfTokens).send({ from: accounts[0] }, (err, response) => {
      console.log('get transaction', err, response);
      if (err !== null) {
        console.log("err", err);
        let variant = "error";
        enqueueSnackbar('User Canceled Transaction', { variant });
        setIsLockingFunds(false);
      }
    })
      .on('receipt', (receipt) => {
        console.log("receipt", receipt);
        axios.post("api/v1/importer/fundsLocked", lockFundsObject).then(
          (response) => {
            console.log("response", response);
            setIsLockingFunds(false);
            getAllOrders();
            let variant = "success";
            enqueueSnackbar('Funds Locked Successfully.', { variant });
          },
          (error) => {
            if (process.env.NODE_ENV === "development") {
              console.log(error);
              console.log(error.response);
            }
            setIsLockingFunds(false);
          })
      })

  }
  let receiveAndReleaseFunds = async () => {
    console.log(order._id);
    setIsReceivedAndReleaseOrder(true);
    let receiveAndReleaseFundsObject = {
      orderId: order._id,
    }
    await loadWeb3();
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const address = order.Agreement_Address;
    const abi = Agreement;

    var myContractInstance = await new web3.eth.Contract(abi, address);
    console.log("contract", myContractInstance);
    await myContractInstance.methods.releaseFunds().send({ from: accounts[0] }, (err, response) => {
      console.log('get transaction', err, response);
      if (err !== null) {
        console.log("err", err);
        let variant = "error";
        enqueueSnackbar('User Canceled Transaction', { variant });
        setIsReceivedAndReleaseOrder(false);
      }
    })
      .on('receipt', (receipt) => {
        console.log("receipt", receipt);
        axios.post("api/v1/importer/releasefunds", receiveAndReleaseFundsObject).then(
          (response) => {
            console.log("response", response);
            setIsReceivedAndReleaseOrder(false);
            getAllOrders();
            let variant = "success";
            enqueueSnackbar('Funds Releases Successfully.', { variant });
          },
          (error) => {
            if (process.env.NODE_ENV === "development") {
              console.log(error);
              console.log(error.response);
            }
            setIsReceivedAndReleaseOrder(false);
            let variant = "error";
            enqueueSnackbar('Unable to Release Funds.', { variant });
          })
      })
  }

  let disputeOrder = (inputListData, disputeReason) => {
    console.log(order._id, inputListData, disputeReason);
    setIsDisputing(true);
    let fileData = new FormData();
    let catagoryArray = [];
    let descriptionArray = [];
    for (let i = 0; i < inputListData.length; i++) {
      catagoryArray.push(inputListData[i].category);
      descriptionArray.push(inputListData[i].description);
      fileData.append(`disputedocuments`, inputListData[i].fileData);
    }
    console.log(descriptionArray);

    fileData.append(`description`, JSON.stringify(descriptionArray));
    fileData.append(`disputereason`, disputeReason);
    fileData.append(`documentNames`, JSON.stringify(catagoryArray));
    fileData.append(`orderId`, order._id);

    for (var pair of fileData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    // let disputeOrderObject = {
    //   orderId: order._id,
    // }
    axios.post("api/v1/importer/havedispute", fileData).then(
      (response) => {
        console.log("response", response);
        setIsDisputing(false);
        getAllOrders();
        let variant = "success";
        enqueueSnackbar('Order disputed Successfully.', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsDisputing(false);
        let variant = "error";
        enqueueSnackbar('Unable to Dispute Order.', { variant });
      })
  }
  const handleChange = (event, nextView) => {
    console.log('nextView', nextView);
    setView(nextView);
  };
  return (
    <>
      <div className="card">
        <ul className="breadcrumb" style={{ backgroundColor: "#174153" }}>
          <li className="breadcrumb-item">
            <a href="/">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Orders Sent</li>
        </ul>
        <div className="container">
          <ToggleButtonGroup style={{ float: 'right' }} orientation="horizontal" value={view} exclusive onChange={handleChange}>
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                {view === 'list' ? (
                  <TabPanel
                    setValue={setValue}
                    value={value}
                    pendingOrders={pendingOrders}
                    acceptedOrders={acceptedOrders}
                    rejectedOrders={rejectedOrders}
                    finalizedOrders={finalizedOrders}
                    disputedOrders={disputedOrders}
                    underDeliveryOrders={underDeliveryOrders}
                    completedOrders={completedOrders}
                    fundsLockedOrders={fundsLockedOrders}
                    setOrder={setOrder}
                    setShow={setShow}
                    handleShowUploadModal={handleShowUploadModal}
                    handleShowAcceptRejectModal={handleShowAcceptRejectModal}
                    handleShowFinalizeModal={handleShowFinalizeModal}
                    handleShowLockFundsModal={handleShowLockFundsModal}
                    handleShowReceivedAndReleaseModal={handleShowReceivedAndReleaseModal}
                    handleShowDisputeOrderModal={handleShowDisputeOrderModal}
                  ></TabPanel>
                ) : (
                    <CardsTabPanel
                      setValue={setValue}
                      value={value}
                      pendingOrders={pendingOrders}
                      acceptedOrders={acceptedOrders}
                      rejectedOrders={rejectedOrders}
                      finalizedOrders={finalizedOrders}
                      disputedOrders={disputedOrders}
                      underDeliveryOrders={underDeliveryOrders}
                      completedOrders={completedOrders}
                      fundsLockedOrders={fundsLockedOrders}
                      setOrder={setOrder}
                      setShow={setShow}
                      handleShowUploadModal={handleShowUploadModal}
                      handleShowAcceptRejectModal={handleShowAcceptRejectModal}
                      handleShowFinalizeModal={handleShowFinalizeModal}
                      handleShowLockFundsModal={handleShowLockFundsModal}
                      handleShowReceivedAndReleaseModal={handleShowReceivedAndReleaseModal}
                      handleShowDisputeOrderModal={handleShowDisputeOrderModal}
                    ></CardsTabPanel>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderDetailModal
        order={order}
        show={show}
        handleClose={handleClose}
      />
      <UploadDocumentModal
        handleCloseUploadModal={handleCloseUploadModal}
        isUploading={isUploading}
        errorMsg={errorMsg}
        isSuccess={isSuccess}
        isError={isError}
        inputList={inputList}
        handleAddClick={handleAddClick}
        handleRemoveClick={handleRemoveClick}
        fileSelectHandler={fileSelectHandler}
        setInputList={setInputList}
        uploadDocument={uploadDocument}
        showUploadModal={showUploadModal}
      />
      <AcceptRejectImporterDocumentModal
        isRejectingDocument={isRejectingDocument}
        isAcceptingDocument={isAcceptingDocument}
        rejectDocument={rejectDocument}
        acceptDocument={acceptDocument}
        showAcceptRejectModal={showAcceptRejectModal}
        handleCloseAcceptRejectModal={handleCloseAcceptRejectModal}
        order={order}
      />
      <LockingFundsConfirmationModal
        showLockFundsModal={showLockFundsModal}
        handleCloseLockFundsModal={handleCloseLockFundsModal}
        order={order}
        lockFunds={lockFunds}
        isError={isError}
        errorMsg={errorMsg}
        isSuccess={isSuccess}
        isLockingFunds={isLockingFunds}
      />

      <FinalizeConfirmationModal
        handleCloseFinalizeModal={handleCloseFinalizeModal}
        showFinalizeModal={showFinalizeModal}
        order={order}
        errorMsg={errorMsg}
        isError={isError}
        isSuccess={isSuccess}
        isFinalizeOrder={isFinalizeOrder}
        finalizeOrder={finalizeOrder}
      />
      <ReceivedandReleaseFundsModal
        showLockFundsModal={showLockFundsModal}
        handleCloseReceivedAndReleaseModal={handleCloseReceivedAndReleaseModal}
        order={order}
        showReceivedAndReleaseModal={showReceivedAndReleaseModal}
        isError={isError}
        errorMsg={errorMsg}
        isSuccess={isSuccess}
        isReceivedAndReleaseOrder={isReceivedAndReleaseOrder}
        receiveAndReleaseFunds={receiveAndReleaseFunds}
      />
      <DisputeOrderModal
        handleCloseDisputeOrderModal={handleCloseDisputeOrderModal}
        showDisputeOrderModal={showDisputeOrderModal}
        order={order}
        errorMsg={errorMsg}
        isError={isError}
        isSuccess={isSuccess}
        isDisputing={isDisputing}
        disputeOrder={disputeOrder}
      />
    </>
  );
}

export default Orders;
