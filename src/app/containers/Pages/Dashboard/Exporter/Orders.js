import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import AcceptRejectExporterDocumentModal from "../../../../components/Modals/AcceptRejectExporterDocumentModal.js";
import CreateShipmentModal from "../../../../components/Modals/CreateShipmentModal.js";
import FinalizeConfirmationModal from "../../../../components/Modals/FinalizeConfirmationModal.js";
import OrderDetailModal from "../../../../components/Modals/OrderDetailModal.js";
import UploadDocumentModal from "../../../../components/Modals/UploadDocumentModal.js";
import CardsTabPanel from '../../../../components/Tabs/CardsTabs.js';
import TabPanel from '../../../../components/Tabs/Tabs.js';
function Orders(props) {
  const { enqueueSnackbar } = useSnackbar();
  const handleClose = () => setShow(false);
  let [show, setShow] = useState(false);
  let [order, setOrder] = useState();
  const [view, setView] = React.useState('list');

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    getAllOrders();
    props.setActiveTab({
      dashboard: "",
      newOrders: "",
      orders: "active",
      privacyPolicy:"",
      termsandconditions: "",
      settings: "",
      changePassword: "",
    });// eslint-disable-next-line
  }, []);

  const [inputList, setInputList] = useState([{ category: "", description: "", fileData: "" }]);
  let [isUploading, setIsUploading] = useState(false);
  let [isFinalizeOrder, setIsFinalizeOrder] = useState(false);
  let [isCreatingShipment, setIsCreatingShipment] = useState(false);


  let [pendingOrders, setPendingOrders] = useState([]);
  let [acceptedOrders, setAcceptedOrders] = useState([]);
  let [rejectedOrders, setRejectedOrders] = useState([]);
  let [finalizedOrders, setFinalizedOrders] = useState([]);
  let [disputedOrders, setDisputedOrders] = useState([]);
  let [underShipmentOrders, setUnderShipmentOrders] = useState([]);
  let [completedOrders, setCompletedOrders] = useState([]);
  let [isError, setIsError] = useState(false);
  let [isSuccess, setIsSuccess] = useState(false);
  let [errorMsg, setErrorMsg] = useState();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  }
  const handleShowUploadModal = () => setShowUploadModal(true);
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false);
  const handleCloseAcceptRejectModal = () => {
    setShowAcceptRejectModal(false);
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  }
  const handleShowAcceptRejectModal = () => setShowAcceptRejectModal(true);

  const [showCreateShipmentModal, setShowCreateShipmentModal] = useState(false);
  const handleCloseCreateShipmentModal = () => {
    setShowCreateShipmentModal(false);
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  }
  const handleShowCreateShipmentModal = () => setShowCreateShipmentModal(true);

  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const handleCloseFinalizeModal = () => {
    setShowFinalizeModal(false);
    setErrorMsg("");
    setIsSuccess(false);
    setIsError(false);
  }
  const handleShowFinalizeModal = () => setShowFinalizeModal(true);

  let [isRejectingDocument, setIsRejectingDocument] = useState(false);
  let [isAcceptingDocument, setIsAcceptingDocument] = useState(false);

  let getAllOrders = () => {
    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);
    let exporter = jwtDecoded.id;

    axios
      .get(`/api/v1/exporter/getOrders/OrderPlaced/Pending/${exporter}`)
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
      .get(`/api/v1/exporter/getOrders/OrderPlaced/Accepted/${exporter}`)
      .then((response) => {
        console.log(response.data);
        setAcceptedOrders(response.data.data);
        if (order !== '' && order !== null && order !== undefined) {
          console.log("COME HERE");
          let data = response.data.data.filter(item => item._id === order._id)
          console.log("Data", data);
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
      .get(`/api/v1/exporter/getOrders/OrderPlaced/Rejected/${exporter}`)
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
      .get(`/api/v1/exporter/getOrders/OrderPlaced/Finalized/${exporter}`)
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
      .get(`/api/v1/exporter/getOrders/OrderPlaced/UnderDisputed/${exporter}`)
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
      .get(`/api/v1/exporter/getOrders/OrderPlaced/UnderShipment/${exporter}`)
      .then((response) => {
        console.log(response.data);
        setUnderShipmentOrders(response.data.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error.response);
        }
        setUnderShipmentOrders([]);
      });
    axios
      .get(`/api/v1/exporter/getOrders/OrderPlaced/Completed/${exporter}`)
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

    axios.post("api/v1/exporter/uploadDocuments", fileData).then(
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
    axios.post("api/v1/exporter/rejectFile", rejectDocumentObject).then(
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
    axios.post("api/v1/exporter/acceptFile", acceptDocumentObject).then(
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

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    console.log("Account test: ", accounts[0]);
    let finlizeOrderObject = {
      orderId: order._id,
      exporter_address: accounts[0]
    }
    axios.post("api/v1/exporter/finalizeStatus", finlizeOrderObject).then(
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
  let createShipment = (inputListData) => {
    console.log(order._id, inputListData);
    setIsCreatingShipment(true);
    let fileData = new FormData();
    let catagoryArray = [];
    let descriptionArray = [];
    for (let i = 0; i < inputListData.length; i++) {
      catagoryArray.push(inputListData[i].category);
      descriptionArray.push(inputListData[i].description);
      fileData.append(`shipmentdocuments`, inputListData[i].fileData);
    }
    fileData.append(`description`, JSON.stringify(descriptionArray));
    fileData.append(`documentNames`, JSON.stringify(catagoryArray));
    fileData.append(`orderId`, order._id);

    axios.post("api/v1/exporter/shipment", fileData).then(
      (response) => {
        console.log("response", response);
        setIsCreatingShipment(false);
        getAllOrders();
        let variant = "success";
        enqueueSnackbar('Shipment Created Successfully.', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsCreatingShipment(false);
        let variant = "error";
        enqueueSnackbar('Unable to Create Shipment.', { variant });
      })
  }
  const handleChange = (event, nextView) => {
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
                    underShipmentOrders={underShipmentOrders}
                    completedOrders={completedOrders}
                    handleShowCreateShipmentModal={handleShowCreateShipmentModal}
                    setOrder={setOrder}
                    setShow={setShow}
                    handleShowUploadModal={handleShowUploadModal}
                    handleShowAcceptRejectModal={handleShowAcceptRejectModal}
                    handleShowFinalizeModal={handleShowFinalizeModal}
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
                      underShipmentOrders={underShipmentOrders}
                      completedOrders={completedOrders}
                      handleShowCreateShipmentModal={handleShowCreateShipmentModal}
                      setOrder={setOrder}
                      setShow={setShow}
                      handleShowUploadModal={handleShowUploadModal}
                      handleShowAcceptRejectModal={handleShowAcceptRejectModal}
                      handleShowFinalizeModal={handleShowFinalizeModal}
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
      <AcceptRejectExporterDocumentModal
        isRejectingDocument={isRejectingDocument}
        isAcceptingDocument={isAcceptingDocument}
        rejectDocument={rejectDocument}
        acceptDocument={acceptDocument}
        showAcceptRejectModal={showAcceptRejectModal}
        handleCloseAcceptRejectModal={handleCloseAcceptRejectModal}
        order={order}
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
      <CreateShipmentModal
        order={order}
        errorMsg={errorMsg}
        isError={isError}
        isSuccess={isSuccess}
        isCreatingShipment={isCreatingShipment}
        handleCloseCreateShipmentModal={handleCloseCreateShipmentModal}
        showCreateShipmentModal={showCreateShipmentModal}
        createShipment={createShipment}
      />
    </>
  );
}

export default Orders;
