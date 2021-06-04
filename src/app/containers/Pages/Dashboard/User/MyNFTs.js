import { Grid } from '@material-ui/core/';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import NFTCard from '../../../../components/Cards/NFTCard';
import Card from '@material-ui/core/Card';

function MyNFTs(props) {
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [totalNfts, setTotalNfts] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [tokenList, setTokenList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getMyNFTs = (start, end) => {
        handleShowBackdrop();
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        axios.get(`/nft/createnft/${start}/${end}`).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.NFTdata);
                setTotalNfts(response.data.Nftcount);

                handleCloseBackdrop();
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                if (error.response.data !== undefined) {
                    if (error.response.data === "Unauthorized access (invalid token) !!") {
                        Cookies.remove("Authorization");
                        localStorage.removeItem("Address")
                        window.location.reload();
                    }
                }
                handleCloseBackdrop();
            })
    }

    useEffect(() => {
        getMyNFTs(0, rowsPerPage);
        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "active",
            myCubes: "",
            myDrops: "",
            settings: "",
            mySeason: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "",
            newRandomDrop: "",
        });// eslint-disable-next-line
    }, []);
    const handleChangePage = (event, newPage) => {
        console.log("newPage", newPage);
        setPage(newPage);
        console.log("Start", newPage * rowsPerPage);
        console.log("End", newPage * rowsPerPage + rowsPerPage);
        getMyNFTs(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        getMyNFTs(0, parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">My NFTs</li>
            </ul>
            <div className="card-body">
                <form >
                    <div className="form-group">

                        {open ? (
                            <div align="center" className="text-center">
                                <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ color: "#ff0000" }}
                                >

                                </Spinner>
                                <span style={{ color: "#ff0000" }} className="sr-only">Loading...</span>
                            </div>
                        ) : tokenList.length === 0 ? (
                            <Card variant="outlined" style={{ padding: "40px", marginTop: '20px', marginBottom: '20px' }}>
                                <Typography variant="body2" className="text-center" color="textSecondary" component="p"  >
                                    <strong>No items to display </strong>
                                </Typography>
                            </Card>
                        ) : (
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                            >
                                {tokenList.map((i, index) => (
                                    <NFTCard data={i} key={index}></NFTCard>
                                ))}
                            </Grid>
                        )}
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[4, 8, 12, 24]}
                        component="div"
                        count={totalNfts}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </form>
            </div >
        </div >

    );
}

export default MyNFTs;
