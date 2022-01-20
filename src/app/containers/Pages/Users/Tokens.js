import { Avatar } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
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
function Tokens(props) {
    const classes = useStyles();
    const [tokenList, setTokenList] = useState([])
    const [istokenList, setIsTokenList] = useState(false)
    // eslint-disable-next-line
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    useEffect(() => {
        axios
            .get('/tokensList')
            .then((res) => {
                console.log('resresres', res)
                console.log(res.data.tokens)
                setIsTokenList(true)
                setTokenList(res.data.tokens)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })// eslint-disable-next-line
    }, []);
    function shortenAddress(address, chars = 15) {
        return `${address.substring(0, chars + 2)}...${address.substring(64 - chars)}`
    }
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
                                    <Typography style={{ marginLeft: '15px', marginTop: '15px' }} variant="h5" color="textSecondary" component="p"><strong>List of Tokens </strong>
                                    </Typography>
                                    <div className="container-fluid">

                                        <div
                                            className="row"
                                            style={{ height: `${props.windowHeight}`, marginRight: "px" }}
                                        >

                                            <div
                                                className="table-responsive"
                                                style={{ paddingTop: "20px" }}
                                            >
                                                {!istokenList ? (
                                                    <div className=" align-items-center justify-content-center text-center">
                                                        <Spinner
                                                            animation="border"
                                                            role="status"
                                                            style={{ color: "#e84646" }}
                                                        >
                                                            <span className="sr-only">Loading...</span>
                                                        </Spinner>
                                                    </div>
                                                ) : (
                                                    <table className="table table-hover table-center mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th >Logo</th>
                                                                <th>Name</th>
                                                                <th>Symbol</th>
                                                                <th>Contract Hash</th>
                                                                <th>Package Hash</th>

                                                            </tr>
                                                        </thead>

                                                        <tbody style={{ color: 'black' }}>
                                                            {tokenList.map((i, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td >
                                                                        <Avatar src={i.logoURI} aria-label="Artist" className={classes.avatar} />
                                                                    </td>
                                                                    <td>{i.name}</td>
                                                                    <td>{i.symbol}</td>
                                                                    <td>{shortenAddress(i.address)}</td>
                                                                    <td>{shortenAddress(i.packageHash)}</td>

                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </table>
                                                )}
                                            </div>
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
