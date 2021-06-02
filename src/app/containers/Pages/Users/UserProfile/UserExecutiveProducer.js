import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid } from '@material-ui/core/';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Cookies from "js-cookie";
import axios from 'axios';
import { Spinner } from "react-bootstrap";
import NFTCard from "../../../../components/Cards/NFTCard";

function UserExecutiveProducer(props) {
    let history = useHistory();
    const [rowsPerPage, setRowsPerPage] = useState(8);
    let [data, setData] = useState([]);
    const [totalExecutiveProducerNftsData, setTotalExecutiveProducerNftsData] = useState(0);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        console.log("newPage", newPage);
        setPage(newPage);
        console.log("Start", newPage * rowsPerPage);
        console.log("End", newPage * rowsPerPage + rowsPerPage);
        getUserData(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        getUserData(0, parseInt(event.target.value, 10));
        setPage(0);
    };

    let getUserData = (start, end) => {
        handleShowBackdrop();
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
            "Authorization"
        )}`;
        // nft/getnft/{userId}/{start}/{end} 
        axios.get(`/nft/getprofileusernft/${props.userId}/Executive Producer/${start}/${end}`).then(
            (response) => {
                console.log("response", response);
                setData(response.data.NFTdata);
                setTotalExecutiveProducerNftsData(response.data.NFTcount);
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
        getUserData(0, rowsPerPage);
        // eslint-disable-next-line
    }, []);
    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="card">
                    <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                        <li className="breadcrumb-item" style={{ color: "#fff", cursor: 'pointer' }} onClick={() => history.goBack()}>
                            <i className="fas fa-arrow-left"></i> Back
                        </li>
                        <li className="breadcrumb-item active"> Executive Producer</li>
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
                                ) : data.length === 0 ? (
                                    <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }} >
                                        <strong>Nothing to Display </strong>
                                    </Typography>
                                ) : (
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                    >
                                        {data.map((i, index) => (
                                            <NFTCard data={i} key={index}></NFTCard>
                                        ))}
                                    </Grid>
                                )}
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[4, 8, 12, 24]}
                                component="div"
                                count={totalExecutiveProducerNftsData}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </form>
                    </div >
                </div >
            </div>
        </div>

    );
}

export default UserExecutiveProducer;
