import React from "react";
import { useHistory } from "react-router-dom";
import TablePagination from '@material-ui/core/TablePagination';
function UserFan(props) {
    let history = useHistory();
    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="card">
                    <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                    <li className="breadcrumb-item" style={{ color: "#fff", cursor: 'pointer' }} onClick={() => history.goBack()}>
                            <i className="fas fa-arrow-left"></i> Back
                        </li>
                        <li className="breadcrumb-item active"> Fan</li>
                    </ul>
                    <div className="card-body">
                        <form >
                            <div className="form-group">

                                {/* {open ? (
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
                                {tokenList.map((i, index) => (
                                    <NFTCard data={i} key={index}></NFTCard>
                                ))}
                            </Grid>
                        )} */}
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[4, 8, 12, 24]}
                                component="div"
                                count={props.totalUserUserNftsData}
                                rowsPerPage={props.rowsPerPage}
                                page={props.page}
                                onChangePage={props.handleChangePage}
                                onChangeRowsPerPage={props.handleChangeRowsPerPage}
                            />
                        </form>
                    </div >
                </div >
            </div>
        </div>

    );
}

export default UserFan;
