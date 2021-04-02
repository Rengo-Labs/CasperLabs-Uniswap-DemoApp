import {
  Card,
  CardContent, Grid
} from '@material-ui/core/';
// import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';

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
  card: {
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
}));



function NewOrder(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [inputList, setInputList] = useState([]);
  let [isSaving, setIsSaving] = useState(false);
  let [category, setCategory] = useState();
  let [description, setDescription] = useState();
  let [importers, setImporters] = useState();
  let [fileData, setFileData] = useState('');
  let [tokens, setTokens] = useState();
  let [importerName, setImporterName] = useState('');
  let [importerId, setImporterId] = useState();
  let [isDisabledImporter, setIsDisabledImporter] = useState(true);

  let fileSelectHandler = (event, index) => {
    if (event.target.files[0] !== undefined) {
      setFileData(event.target.files[0]);
    }
  };


  let getImporters = () => {
    axios
      .get("/api/v1/exporter/getAllImporters", { withCredentials: true })
      .then((response) => {
        console.log("response", response);
        setImporters(response.data.importers);
        setIsDisabledImporter(false);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  };

  useEffect(() => {
    props.setActiveTab({
      dashboard: "",
      newOrders: "active",
      orders: "",
      settings: "",
      privacyPolicy:"",
      termsandconditions: "",
      changePassword: "",
    });
    getImporters();// eslint-disable-next-line
  }, []);

  const handleSubmitEvent = (event) => {
    event.preventDefault();
    setIsSaving(true);

    let jwt = Cookies.get("Authorization");
    let jwtDecoded = jwtDecode(jwt);
    let exporter = jwtDecoded.id;
    let importer = importerId;
    let fileData = new FormData();
    fileData.append("importerId", importer);
    fileData.append("exporterId", exporter);
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
    fileData.append(`numberOfTokens`, tokens * 10 ** 18);

    for (var pair of fileData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    axios.post("api/v1/exporter/addOrder", fileData).then(
      (response) => {
        setIsSaving(false);
        let variant = "success";
        enqueueSnackbar('Order Added Successfully.', { variant });
      },
      (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          console.log(error.response);
        }
        setIsSaving(false);
        let variant = "error";
        enqueueSnackbar('Unabel to Add Order.', { variant });

      }
    );
  };
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {

    setInputList([...inputList, { category: category, description: description, fileData: fileData }]);
    setCategory('');
    setDescription('');
    setFileData('');
  };

  return (
    <div className="card">
      <ul className="breadcrumb" style={{ backgroundColor: "rgb(167, 0, 0)" }}>
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">New Order</li>
      </ul>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12 col-lg-6">
            <form onSubmit={handleSubmitEvent}>
              <div className="form-group">
                <label>Select Importer</label>
                <div className="filter-widget">
                  <Autocomplete
                    id="combo-dox-demo"
                    required
                    options={importers}
                    disabled={isDisabledImporter}
                    getOptionLabel={(option) =>
                      option.name + ", " + option.city + ", " + option.country
                    }
                    onChange={(event, value) => {
                      if (value == null) setImporterId("");
                      else {
                        setImporterId(value._id);
                        setImporterName(value.name);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Importer"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price</label>
                  <div className="filter-widget">
                    <input
                      type="number"
                      required
                      value={tokens}
                      placeholder="eg. 22 ,0.00001 or .1"
                      className="form-control"
                      onChange={(e) => {
                        setTokens(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Upload Document</label>{" "}
                </div>
                <div className="form-group">
                  <div className="form-group">
                    <input
                      type="text"
                      required
                      value={category}
                      placeholder="Enter File Category"
                      className="form-control"
                      onChange={(e) => {
                        setCategory(e.target.value)
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      type="text"
                      required
                      rows="4"
                      value={description}
                      placeholder="Enter File Description"
                      className="form-control"
                      onChange={(e) => {
                        setDescription(e.target.value)
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      required
                      type="file"
                      name="sampleFile"
                      accept=".jpg,.png,.jpeg,.jfif,.pdf,.docx"
                      className="form-control"
                      onChange={(e) => fileSelectHandler(e)}
                    />
                  </div>
                  {category === '' || description === '' || tokens === '' || fileData === '' || importerId === "" || typeof importerId === "undefined" ? (
                    <button
                      className="btn"
                      type="submit"
                      disabled
                    >
                      <i className="fa fa-plus"></i> Add Document
                    </button>
                  ) : (
                      <button
                        className="btn"
                        type="submit"
                        onClick={handleAddClick}
                      >
                        <i className="fa fa-plus"></i> Add Document
                      </button>
                    )}
                </div>
              </div>
            </form>

          </div>
          <div className="col-md-12 col-lg-6">
            {/* <!-- Change Password Form --> */}
            <form onSubmit={handleSubmitEvent}>
              <div className="form-group">
                <div >
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                  // alignItems="flex-start"
                  >
                    {inputList.map((i, index) => (
                      <>

                        <Grid item xs={12} sm={6} md={6} key={index}>
                          <Card style={{ height: "100%" }} variant="outlined">
                            <CardContent>
                              <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <strong>Importer:</strong>{importerName}
                              </Typography>
                              <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <strong>Sale Price:</strong>{tokens}
                              </Typography>
                              <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <strong>File Category:</strong>{i.category}
                              </Typography>
                              <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <strong>File Description:</strong>{i.description}
                              </Typography>
                              <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <strong>Document:</strong> {i.fileData.name}
                              </Typography>
                            </CardContent>
                            <div >
                              <CardActions>
                                {/* <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveClick(index);
                                  }}
                                  className="btn btn-sm bg-warning-light"
                                  block
                                >
                                  Edit Document
    </Button> */}
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveClick(index);
                                  }}
                                  className="btn btn-sm bg-danger-light btn-block"

                                >
                                  Remove Document
    </Button>
                              </CardActions>
                            </div>
                          </Card>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </div>
              </div>
            </form>
          </div>

        </div>
        {isSaving ? (
          <div className="text-center">
            <Spinner
              animation="border"
              role="status"
              style={{ color: "#00d0f1" }}
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : (
            inputList.length === 0 ? (
              <div className="submit-section">
                <button type="button" disabled className="btn submit-btn">
                  Create Order
                  </button>
              </div>
            ) : (
                <div className="submit-section">
                  <button type="button" onClick={handleSubmitEvent} className="btn submit-btn">
                    Create Order
                </button>
                </div>
              )

          )}
      </div>
    </div>
  );
}

export default NewOrder;
