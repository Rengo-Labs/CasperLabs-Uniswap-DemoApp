import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import Axios from 'axios';
import React from "react";
import { Col, Row } from "react-bootstrap";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
// import Cookies from "js-cookie";


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
        minWidth: 500,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
}));

function ModalFormData(props) {
    const classes = useStyles();
    // const download = (e, fileName, fileUrl) => {
    //     console.log(e.target.href);
    //     console.log(fileUrl.split('.').pop())
    //     fetch(e.target.href, {
    //         method: "GET",
    //         headers: {}
    //     })
    //         .then(response => {
    //             response.arrayBuffer().then(function (buffer) {
    //                 const url = window.URL.createObjectURL(new Blob([buffer]));
    //                 console.log("response", response);
    //                 console.log("url", url);

    //                 const link = document.createElement("a");
    //                 console.log("link", link);
    //                 link.href = url;
    //                 console.log("link", link);
    //                 link.setAttribute("download", fileName + "." + fileUrl.split('.').pop()); //or any other extension
    //                 document.body.appendChild(link);
    //                 link.click();
    //             });
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    //     // Axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
    //     //     "Authorization"
    //     // )}`;
    //     // Axios({
    //     //     url: `${fileUrl}`,
    //     //     method: "GET",
    //     //     responseType: "blob" // important
    //     // }).then(response => {
    //     //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     //     const link = document.createElement("a");
    //     //     link.href = url;
    //     //     link.setAttribute(
    //     //         "download",
    //     //         `${fileName}.${fileUrl.split('.').pop()}`
    //     //     );
    //     //     document.body.appendChild(link);
    //     //     link.click();
    //     // });

    // };
    return (

        <>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                <strong>Order Id: </strong>
                {props.order.orderId}
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                <Row>
                    <Col>
                        <strong>Exporter Name: </strong>{props.order.exporterId.name}
                    </Col>
                    <Col>
                        <strong>Importer Name: </strong>{props.order.importerId.name}
                    </Col>
                </Row>
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                <Row>
                    <Col>
                        <strong>Create At:</strong> {props.order.createdAt
                            ? new Date(props.order.createdAt).toLocaleDateString()
                            : ""}
                    </Col>
                    <Col>
                        <strong>Updated At: </strong> {props.order.updatedAt
                            ? new Date(props.order.updatedAt).toLocaleDateString()
                            : ""}
                    </Col>
                </Row>

            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                <strong>Price:</strong> {props.order.numberOfTokens / 10 ** 18} USDT
</Typography>
            {props.order.Agreement_Address !== '' && props.order.Agreement_Address !== undefined && props.order.Agreement_Address !== null ? (
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    <strong>Agreement Address:</strong> {props.order.Agreement_Address}
                </Typography>
            ) : (null)}



            <Typography className={classes.title} color="textSecondary" gutterBottom>
                <strong>Documents By Importer:</strong>
                <ul>
                    {props.order.documentsByImporter.length === 0 ? (
                        <p style={{ color: 'red' }}>No Documents yet</p>

                    ) : (
                            null
                        )}
                    {props.order.documentsByImporter.map((i) => {
                        return (
                            <li key={i._id}>
                                <Row className="align-items-center" >
                                    <Col>
                                        <p><strong>Name :</strong>{i.name}
                                            <a
                                                href={"https://imex-backend.herokuapp.com/" + i.url}
                                                download
                                                target='_blank'
                                                rel="noopener noreferrer"
                                            // onClick={e => download(e, i.name, i.url)}
                                            >
                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                            </a>
                                        </p>
                                        <p style={{ wordWrap: 'break-word' }}><strong>Description: </strong>{i.description}</p>
                                        {i.rejectionreason !== undefined ? (
                                            <p><strong>Reason of Rejection: </strong>{i.rejectionreason}</p>
                                        ) : (null)}
                                    </Col>
                                    <Col >
                                        {i.status === 'Pending' ? (
                                            <button disabled className="btn bg-warning-light not-allowed" style={{ float: 'right' }}>
                                                Pending
                                            </button>
                                        ) : i.status === 'Accepted' ? (
                                            <button disabled className="btn bg-success-light not-allowed" style={{ float: 'right' }}>
                                                Accepted
                                            </button>
                                        ) : (
                                                    <button disabled className="btn bg-danger-light not-allowed" style={{ float: 'right' }}>
                                                        Rejected
                                                    </button>
                                                )}
                                    </Col>
                                </Row>
                            </li>
                        );
                    })}
                </ul>
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                <strong>Documents By Exporter:</strong>
                <ul>
                    {props.order.documentsByExporter.length === 0 ? (
                        <p style={{ color: 'red' }}>No Documents yet</p>

                    ) : (
                            null
                        )}
                    {props.order.documentsByExporter.map((i) => {
                        return (
                            <li key={i._id}>
                                <Row className="align-items-center" >
                                    <Col>
                                        <p><strong>Name :</strong>{i.name}
                                            <a
                                                href={"https://imex-backend.herokuapp.com/" + i.url}
                                                download
                                                target='_blank'
                                                rel="noopener noreferrer"
                                            // onClick={e => download(e, i.name, i.url)}
                                            >
                                                <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                            </a>
                                        </p>
                                        <p style={{ wordWrap: 'break-word' }}><strong>Description: </strong>{i.description}</p>
                                        {i.rejectionreason !== undefined ? (
                                            <p><strong>Reason of Rejection: </strong>{i.rejectionreason}</p>
                                        ) : (null)}
                                    </Col>
                                    <Col >
                                        {i.status === 'Pending' ? (
                                            <button disabled className="btn bg-warning-light not-allowed" style={{ float: 'right' }}>
                                                Pending
                                            </button>
                                        ) : i.status === 'Accepted' ? (
                                            <button disabled className="btn bg-success-light not-allowed" style={{ float: 'right' }}>
                                                Accepted
                                            </button>
                                        ) : (
                                                    <button disabled className="btn bg-danger-light not-allowed" style={{ float: 'right' }}>
                                                        Rejected
                                                    </button>
                                                )}
                                    </Col>
                                </Row>
                            </li>
                        );
                    })}
                </ul>
            </Typography>

            {props.order.shipmentdocuments.length !== 0 ? (
                <>

                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        <strong>Documents Of Shipment:</strong>
                        <ul>
                            {props.order.shipmentdocuments.map((i) => {
                                return (
                                    <li key={i._id}>
                                        <Row className="align-items-center" >
                                            <Col>
                                                <p><strong>Name :</strong>{i.name}
                                                    <a
                                                        href={"https://imex-backend.herokuapp.com/" + i.url}
                                                        download
                                                        target='_blank'
                                                        rel="noopener noreferrer"
                                                    // onClick={e => download(e, i.name, i.url)}
                                                    >
                                                        <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                    </a>
                                                </p>
                                                <p style={{ wordWrap: 'break-word' }}><strong>Description: </strong>{i.description}</p>
                                            </Col>
                                        </Row>
                                    </li>
                                );
                            })}
                        </ul>
                    </Typography>
                </>
            ) : (null)}
            {props.order.disputereason !== '' && props.order.disputereason !== undefined && props.order.disputereason !== null ? (
                <>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        <Row>
                            <Col>
                                <strong>Reason Of Dispute: </strong>
                                {props.order.disputereason}
                            </Col>

                        </Row>

                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        <strong>Documents Of Dispute:</strong>
                        <ul>
                            {props.order.disputedocuments.length === 0 ? (
                                <p style={{ color: 'red' }}>No Documents yet</p>

                            ) : (
                                    null
                                )}
                            {props.order.disputedocuments.map((i) => {
                                return (
                                    <li key={i._id}>
                                        <Row className="align-items-center" >
                                            <Col>
                                                <p><strong>Name :</strong>{i.name}
                                                    <a
                                                        href={"https://imex-backend.herokuapp.com/" + i.url}
                                                        download
                                                        target='_blank'
                                                        rel="noopener noreferrer"
                                                    // onClick={e => download(e, i.name, i.url)}
                                                    >
                                                        <i style={{ color: '#0dd9f9' }} className="fa fa-download"></i>
                                                    </a>
                                                </p>
                                                <p style={{ wordWrap: 'break-word' }}><strong>Description: </strong>{i.description}</p>
                                            </Col>
                                        </Row>
                                    </li>
                                );
                            })}
                        </ul>
                    </Typography>
                </>
            ) : (null)}

        </>
    );
}

export default ModalFormData;
