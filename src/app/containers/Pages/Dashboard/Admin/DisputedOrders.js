import {
  Card,
  CardContent, Grid,
  Typography
} from '@material-ui/core/';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import ForwardFundsModal from "../../../../components/Modals/ForwardFundsModal";
import PartialReleaseFundsModal from "../../../../components/Modals/PartialReleaseFunds";
import RevertFundsModal from "../../../../components/Modals/RevertFundsModal";
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
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
});

function DisputedOrders(props) {
  const { enqueueSnackbar } = useSnackbar();
  let [disputedOrders, setDisputedOrders] = useState([]);
  let [isSaving, setIsSaving] = useState(false);
  let [view, setView] = useState('list');
  let [order, setOrder] = useState();
  const classes = useStyles();
  const handleCloseRevertFundsModal = () => setShowRevertFundsModal(false);
  let [showRevertFundsModal, setShowRevertFundsModal] = useState(false);

  const handleClosePartialReleaseFundsModal = () => setShowPartialReleaseFundsModal(false);
  let [showPartialReleaseFundsModal, setShowPartialReleaseFundsModal] = useState(false);


  const handleCloseForwardFundsModal = () => setShowForwardFundsModal(false);
  let [showForwardFundsModal, setShowForwardFundsModal] = useState(false);

  let getDisputedOrders = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
      "Authorization"
    )}`;
    axios
      .get(`/api/v1/admin/getOrders/UnderDisputed`)
      .then((response) => {
        console.log("response.data", response.data.data);
        setDisputedOrders(response.data.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    getDisputedOrders();
    props.setActiveTab({
      dashboard: "",
      totalUserAccount: "",
      pendingUserAccount: "",
      disputedOrders: "active",
      resolvedDisputedOrders: "",
      tradeListOrders: "",
      referralEarnings:"",
      earningsList:"",
      settings: "",
      changePassword: "",
    });// eslint-disable-next-line
  }, []);

  let revertFunds = () => {
    setIsSaving(true);
    let data = {
      orderId: order._id,
    };
    axios
      .post(`/api/v1/admin/transferFundsBackToImporter`, data)
      .then((response) => {
        console.log("response", response);
        let variant = "success";
        enqueueSnackbar('Funds Transferd back to Importer Successfully.', { variant });
        getDisputedOrders();
        setIsSaving(false);
      })
      .catch((error) => {
        let variant = "error";
        enqueueSnackbar('Unable to Transfer Funds back to Importer .', { variant });
        setIsSaving(false);
        console.log(error.response);
      });
  };
  let partialReleaseFunds = (importerPercentage, exporterPercentage) => {
    setIsSaving(true);
    let _tokenToImporter = (order.numberOfTokens / 100) * importerPercentage;
    let _tokenToExporter = (order.numberOfTokens / 100) * exporterPercentage;
    let data = {
      orderId: order._id,
      _tokensToExporter: _tokenToExporter.toString(),
      _tokensToImporter: _tokenToImporter.toString()
    };
    console.log(data);
    axios
      .post(`/api/v1/admin/solveDispute`, data)
      .then((response) => {
        console.log("response", response);
        let variant = "success";
        enqueueSnackbar('Partially released Funds Successfully.', { variant });
        getDisputedOrders();
        setIsSaving(false);
      })
      .catch((error) => {
        let variant = "error";
        enqueueSnackbar('Unable to Partially released Funds.', { variant });
        setIsSaving(false);
        console.log(error.response);
      });
  };
  let forwardFunds = () => {
    setIsSaving(true);
    let data = {
      orderId: order._id,
    };
    axios
      .post(`/api/v1/admin/transferFundsToExporter`, data)
      .then((response) => {
        console.log("response", response);
        let variant = "success";
        enqueueSnackbar('Funds Transferd to Exporter Successfully.', { variant });
        getDisputedOrders();
        setIsSaving(false);
      })
      .catch((error) => {
        setIsSaving(false);
        let variant = "error";
        enqueueSnackbar('Unable to Transfer Funds to Exporter .', { variant });
        console.log(error.response);
      });
  };
  const handleChange = (event, nextView) => {
    console.log('nextView', nextView);
    setView(nextView);
  };
  // const download = (e, fileName, fileUrl) => {
  //   console.log(e.target.href);
  //   console.log(fileUrl.split('.').pop())
  //   fetch(e.target.href, {
  //     method: "GET",
  //     headers: {}
  //   })
  //     .then(response => {
  //       response.arrayBuffer().then(function (buffer) {
  //         const url = window.URL.createObjectURL(new Blob([buffer]));

  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", fileName + "." + fileUrl.split('.').pop()); //or any other extension
  //         document.body.appendChild(link);
  //         link.click();
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  return (
    <div className="card">
      <ul className="breadcrumb" style={{ backgroundColor: "#174153" }}>
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Disputed Orders</li>
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

                <div
                  className="table-responsive"
                  style={{ paddingTop: "20px" }}
                >
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Exporter</th>
                        <th>Importer</th>
                        <th>Documents by Importer</th>
                        <th>Documents by Exporter</th>
                        <th>Reason of Dispute</th>
                        <th>Documents of Dispute</th>

                        <th>Created At</th>
                        <th>Upadated At</th>
                        <th>Price</th>
                        <th style={{ textAlign: 'center' }} >Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disputedOrders.map((i, index) => (
                        <tr key={i._id}>
                          <td>{index + 1}</td>
                          <td>{i.exporterId.name}</td>
                          <td>{i.importerId.name}</td>
                          <td>
                            {i.documentsByImporter.length === 0 ? (
                              <tr style={{ color: 'red' }}>No Documents yet</tr>
                            ) : (
                                null
                              )}
                            {i.documentsByImporter.map((file) => {
                              return (
                                <tr>
                                  {file.name}{" "}
                                  <a
                                    href={"https://imex-backend.herokuapp.com/" + i.url}
                                    download
                                    target='_blank'
                                    rel="noopener noreferrer"
                                  // onClick={e => download(e, i.name, i.url)}
                                  >
                                    <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                  </a>
                                </tr>
                              );
                            })}
                          </td>
                          <td>
                            {i.documentsByExporter.length === 0 ? (
                              <tr style={{ color: 'red' }}>No Documents yet</tr>
                            ) : (
                                null
                              )}
                            {i.documentsByExporter.map((file) => {
                              return (
                                <tr>
                                  {file.name}{" "}
                                  <a
                                    href={"https://imex-backend.herokuapp.com/" + i.url}
                                    download
                                    target='_blank'
                                    rel="noopener noreferrer"
                                  // onClick={e => download(e, i.name, i.url)}
                                  >
                                    <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                  </a>
                                </tr>
                              );
                            })}
                          </td>
                          <td>{i.disputereason}</td>
                          <td>
                            {i.disputedocuments.length === 0 ? (
                              <tr style={{ color: 'red' }}>No Documents yet</tr>
                            ) : (
                                null
                              )}
                            {i.disputedocuments.map((file) => {
                              return (
                                <tr>
                                  {file.name}{" "}
                                  <a
                                    href={"https://imex-backend.herokuapp.com/" + i.url}
                                    download
                                    target='_blank'
                                    rel="noopener noreferrer"
                                  // onClick={e => download(e, i.name, i.url)}
                                  >
                                    <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                  </a>
                                </tr>
                              );
                            })}
                          </td>
                          <td>
                            {i.createdAt
                              ? new Date(i.createdAt).toLocaleDateString()
                              : ""}
                          </td>
                          <td>
                            {i.updatedAt
                              ? new Date(i.updatedAt).toLocaleDateString()
                              : ""}
                          </td>
                          <td>{i.numberOfTokens / 10 ** 18}</td>

                          <td>
                            {" "}
                            <div className="actions">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOrder(i);
                                  setShowRevertFundsModal(true);
                                }}
                                className="btn btn-sm bg-danger-light"
                              >
                                Revert Funds to Importer
                            </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOrder(i);
                                  setShowForwardFundsModal(true);
                                }}
                                className="btn btn-sm bg-success-light"
                              >
                                Release Funds to Exporter
                            </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOrder(i);
                                  setShowPartialReleaseFundsModal(true);
                                }}
                                className="btn btn-sm bg-warning-light"
                              >
                                Partial Release Funds
                            </Button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>

              ) : (
                  <div className="card-body">
                    <div className={classes.card}>
                      <Grid
                        container
                        spacing={2}
                        direction="row"
                        justify="flex-start"
                      // alignItems="flex-start"
                      >
                        {disputedOrders.map((i, index) => (
                          <>

                            <Grid item xs={12} sm={6} md={3} key={index}>
                              <Card className={classes.root} variant="outlined">
                                <CardContent>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Exporter:</strong>{i.exporterId.name}
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Importer:</strong>{i.importerId.name}
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Documents By Importer:</strong>
                                    <ul>
                                      {i.documentsByImporter.length === 0 ? (
                                        <p style={{ color: 'red' }}>No Documents yet</p>
                                      ) : (
                                          null
                                        )}
                                      {i.documentsByImporter.map((file) => {
                                        return (
                                          <li> {file.name}{" "}
                                            {"   "} <a
                                              href={"https://imex-backend.herokuapp.com/" + i.url}
                                              download
                                              target='_blank'
                                              rel="noopener noreferrer"
                                            // onClick={e => download(e, i.name, i.url)}
                                            >
                                              <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                            </a>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Documents By Exporter:</strong>
                                    <ul>
                                      {i.documentsByExporter.length === 0 ? (
                                        <p style={{ color: 'red' }}>No Documents yet</p>
                                      ) : (
                                          null
                                        )}
                                      {i.documentsByExporter.map((file) => {
                                        return (
                                          <li> {file.name}{" "}
                                            {"   "} <a
                                              href={"https://imex-backend.herokuapp.com/" + i.url}
                                              download
                                              target='_blank'
                                              rel="noopener noreferrer"
                                            // onClick={e => download(e, i.name, i.url)}
                                            >
                                              <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                            </a>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Create At:</strong> {i.createdAt
                                      ? new Date(i.createdAt).toLocaleDateString()
                                      : ""}
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Updated At: </strong> {i.updatedAt
                                      ? new Date(i.updatedAt).toLocaleDateString()
                                      : ""}
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Price:</strong> {i.numberOfTokens / 10 ** 18} USDT
              </Typography>
                                  <Typography style={{ wordWrap: 'break-word' }} className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Agreement Address:</strong> {i.Agreement_Address}
                                  </Typography>
                                  <Typography style={{ wordWrap: 'break-word' }} className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Reason Of Dispute:</strong> {i.disputereason}
                                  </Typography>
                                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Documents Of Dispute:</strong>
                                    <ul>
                                      {i.disputedocuments.length === 0 ? (
                                        <p style={{ color: 'red' }}>No Documents yet</p>
                                      ) : (
                                          null
                                        )}
                                      {i.disputedocuments.map((file) => {
                                        return (
                                          <li> {file.name}{" "}
                                            {"   "} <a
                                              href={"https://imex-backend.herokuapp.com/" + i.url}
                                              download
                                              target='_blank'
                                              rel="noopener noreferrer"
                                            // onClick={e => download(e, i.name, i.url)}
                                            >
                                              <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                            </a>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOrder(i);
                                      setShowRevertFundsModal(true);
                                    }}
                                    className="btn btn-block btn-sm bg-danger-light"
                                    // size="sm"
                                    block
                                  >
                                    Revert Funds to Importer
                    </Button>
                                </CardActions>
                                <CardActions>
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOrder(i);
                                      setShowForwardFundsModal(true);
                                    }}
                                    className="btn  btn-block btn-sm bg-success-light"
                                  >
                                    Release Funds to Exporter
                    </Button>
                                </CardActions>
                                <CardActions>
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOrder(i);
                                      setShowPartialReleaseFundsModal(true);
                                    }}
                                    className="btn btn-block btn-sm bg-warning-light"
                                  >
                                    Partial Release Funds
                    </Button>
                                </CardActions>
                              </Card>
                            </Grid>

                          </>
                        ))}
                      </Grid>
                    </div>
                  </div>

                )}
            </div>
          </div>
        </div>
      </div>
      <RevertFundsModal
        order={order}
        showRevertFundsModal={showRevertFundsModal}
        handleCloseRevertFundsModal={handleCloseRevertFundsModal}
        revertFunds={revertFunds}
        isSaving={isSaving}
      />
      <ForwardFundsModal
        order={order}
        showForwardFundsModal={showForwardFundsModal}
        handleCloseForwardFundsModal={handleCloseForwardFundsModal}
        forwardFunds={forwardFunds}
        isSaving={isSaving}
      />
      <PartialReleaseFundsModal
        order={order}
        showPartialReleaseFundsModal={showPartialReleaseFundsModal}
        handleClosePartialReleaseFundsModal={handleClosePartialReleaseFundsModal}
        partialReleaseFunds={partialReleaseFunds}
        isSaving={isSaving}
      />

    </div >
  );
}

export default DisputedOrders;
