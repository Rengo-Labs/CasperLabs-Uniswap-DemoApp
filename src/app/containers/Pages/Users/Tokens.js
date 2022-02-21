import { Avatar } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
import { CLPublicKey } from 'casper-js-sdk';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import HeaderHome from "../../../components/Headers/Header";



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
  avatar: {
    marginLeft: 0,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const headCells = [
  {
    id: '#',
    numeric: true,
    disablePadding: false,
    label: '#',
  },
  {
    id: 'logo',
    numeric: false,
    disablePadding: false,
    label: 'Logo',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'symbol',
    numeric: false,
    disablePadding: false,
    label: 'Symbol',
  },
  {
    id: 'contractHash',
    numeric: false,
    disablePadding: false,
    label: 'Contract Hash',
  },
  {
    id: 'packageHash',
    numeric: false,
    disablePadding: false,
    label: 'Package Hash',
  },
  {
    id: 'Userbalance',
    numeric: true,
    disablePadding: false,
    label: 'User Balance',
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        List of Tokens
      </Typography>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
function Tokens(props) {
  
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const classes = useStyles();
  const [tokenList, setTokenList] = useState([])
  const [istokenList, setIsTokenList] = useState(false)
  // eslint-disable-next-line
  let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
  // useEffect(() => {
  //     axios
  //         .get('/tokensList')
  //         .then((res) => {
  //             console.log('resresres', res)
  //             console.log(res.data.tokens)
  //             setIsTokenList(true)
  //             setTokenList(res.data.tokens)
  //         })
  //         .catch((error) => {
  //             console.log(error)
  //             console.log(error.response)
  //         })// eslint-disable-next-line
  // }, []);
  useEffect(() => {
    axios
      .get('/tokensList')
      .then(async (res) => {
        console.log('tokensList', res)
        console.log(res.data.tokens)
        // let CSPR =
        // {
        //     address: "",
        //     chainId: 1,
        //     decimals: 9,
        //     logoURI: Logo,
        //     name: "Casper",
        //     symbol: "CSPR",
        // }
        // if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
        //     const client = new CasperServiceByJsonRPC(
        //         NODE_ADDRESS
        //     );
        //     getStateRootHash(NODE_ADDRESS).then(stateRootHash => {
        //         console.log('stateRootHash', stateRootHash);
        //         client.getBlockState(
        //             stateRootHash,
        //             CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
        //             []
        //         ).then(result => {
        //             console.log('result', result.Account.mainPurse);
        //             try {
        //                 const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
        //                 client.getAccountBalance(
        //                     stateRootHash,
        //                     result.Account.mainPurse
        //                 ).then(result => {
        //                     console.log('CSPR balance', result.toString());
        //                     CSPR.balance = result.toString()
        //                 });
        //             } catch (error) {
        //                 CSPR.balance = 0;
        //                 console.log('error', error);
        //             }
        //         });
        //     })
        // }
        // console.log('CSPR', CSPR);
        let holdArr = res.data.tokens;
        console.log('holdArr', holdArr);
        if (activePublicKey !== 'null' && activePublicKey !== null && activePublicKey !== undefined) {
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
                holdArr[i].balance = 0;
                console.log(error)
                console.log(error.response)
              })
          }
        }
        // holdArr.splice(0, 0, CSPR)
        console.log('holdArr', holdArr);
        setTokenList(res.data.tokens);
        setIsTokenList(true)
        // setTokenList(oldArray => [...oldArray, CSPR])
      })
      .catch((error) => {
        console.log(error)
        console.log(error.response)
      })
  }, [activePublicKey]);
  function shortenAddress(address, chars = 15) {
    return `${address.substring(0, chars + 2)}...${address.substring(64 - chars)}`
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tokenList.length) : 0;

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Tokens"} />
          <div style={{ backgroundColor: '#e846461F' }} className="card">
            <div className="container-fluid">
              <div
                className="content"
                style={{ paddingTop: "180px", height: "150vh" }}
                position="absolute"
              >
                <div className="card">
                  <Typography style={{ marginLeft: '15px', marginTop: '15px' }} variant="h5" color="textSecondary" component="p"><strong></strong>
                  </Typography>
                  <div className="container-fluid">

                    <div
                      className="row"
                      style={{ height: `${props.windowHeight}`, marginRight: "px" }}
                    >

                      <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                          <EnhancedTableToolbar />
                          <TableContainer>
                            <Table
                              sx={{ minWidth: 750 }}
                              aria-labelledby="tableTitle"
                              size={dense ? 'small' : 'medium'}
                            >
                              <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                              />
                              <TableBody>
                                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   rows.slice().sort(getComparator(order, orderBy)) */}
                                {stableSort(tokenList, getComparator(order, orderBy))
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                      <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={index}
                                      >
                                        <TableCell
                                          component="th"
                                          id={labelId}
                                          scope="row"
                                          align="right"
                                        >
                                          {index + 1}
                                        </TableCell>
                                        <TableCell align="right"><Avatar src={row.logoURI} aria-label="Artist" className={classes.avatar} /></TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">{row.symbol}</TableCell>
                                        <TableCell align="left">{shortenAddress(row.address)}</TableCell>
                                        <TableCell align="left">{shortenAddress(row.packageHash)}</TableCell>
                                        <TableCell align="right">{row.balance ? (row.balance / 10 ** 9) : (0)}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                {emptyRows > 0 && (
                                  <TableRow
                                    style={{
                                      height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                  >
                                    <TableCell colSpan={6} />
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={tokenList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Paper>
                        <FormControlLabel
                          control={<Switch checked={dense} onChange={handleChangeDense} />}
                          label="Dense padding"
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Tokens;
