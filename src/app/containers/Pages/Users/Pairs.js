import Typography from '@material-ui/core/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import HeaderHome from "../../../components/Headers/Header";
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
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
    console.log("orderBy", orderBy);
    console.log("a", a);
    console.log("b", b);
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
        id: 'nameA/B',
        numeric: false,
        disablePadding: false,
        label: 'Name A/B',
    },
    {
        id: 'symbolA/B',
        numeric: false,
        disablePadding: false,
        label: 'Symbol A/B',
    },
    {
        id: 'contractHashA/B',
        numeric: false,
        disablePadding: false,
        label: 'Contract Hash A/B',
    },
    {
        id: 'reserveA',
        numeric: true,
        disablePadding: false,
        label: 'Reserve A',
    },
    {
        id: 'reserveB',
        numeric: true,
        disablePadding: false,
        label: 'Reserve B',
    },
    {
        id: 'reserveCSPR',
        numeric: true,
        disablePadding: false,
        label: 'ReserveCSPR',
    },
    {
        id: 'reserveUSD',
        numeric: true,
        disablePadding: false,
        label: 'ReserveUSD',
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
                List of Pairs
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
function Pairs(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('NameA/B');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [pairList, setPairList] = useState([])
    const [isPairList, setIsPairList] = useState(false)
    let [, setActivePublicKey] = useState(localStorage.getItem("Address"));
    let [selectedWallet, setSelectedWallet] = useState(localStorage.getItem("selectedWallet"));
    let [, setTorus] = useState();
    useEffect(() => {
        setIsPairList(true)
        axios
            .get('/getpairlist')
            .then((res) => {
                console.log('resresres', res)
                console.log(res.data.pairList)
                setIsPairList(false)
                setPairList(res.data.pairList)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
                setIsPairList(false)
            })// eslint-disable-next-line
    }, []);
    function shortenAddress(address, chars = 15) {
        return `${address.substring(0, chars + 2)}...${address.substring(64 - chars)}`
    }

    const handleRequestSort = (event, property) => {
        console.log('property', property);
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
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pairList.length) : 0;

    return (
        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} setSelectedWallet={setSelectedWallet} selectedWallet={selectedWallet} setTorus={setTorus} selectedNav={"pairs"} />
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
                                                        {isPairList ? (
                                                            <div style={{ padding: '20px' }} className="row align-items-center justify-content-center">
                                                                <Spinner style={{ textAlign: 'center', color: "#e84646" }}
                                                                    animation="border"
                                                                    role="status"
                                                                >
                                                                    <span className="sr-only">Loading...</span>
                                                                </Spinner>
                                                            </div>
                                                        ) : (
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
                                                                    {stableSort(pairList, getComparator(order, orderBy))
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
                                                                                    <TableCell align="left">{row.token0.name}/{row.token1.name}</TableCell>
                                                                                    <TableCell align="left">{row.token0.symbol}/{row.token1.symbol}</TableCell>
                                                                                    <TableCell align="left">{shortenAddress(row.token0.id)}/{shortenAddress(row.token1.id)}</TableCell>
                                                                                    <TableCell align="right">{row.reserve0 / 10 ** 9}</TableCell>
                                                                                    <TableCell align="right">{row.reserve1 / 10 ** 9}</TableCell>
                                                                                    <TableCell align="right">{row.reserveETH / 10 ** 9}</TableCell>
                                                                                    <TableCell align="right">{row.reserveUSD / 10 ** 9}</TableCell>
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
                                                        )}
                                                    </TableContainer>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25]}
                                                        component="div"
                                                        count={pairList.length}
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

export default Pairs;
