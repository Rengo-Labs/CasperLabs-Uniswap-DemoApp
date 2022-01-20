import Typography from '@material-ui/core/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import HeaderHome from "../../../components/Headers/Header";

function Pairs(props) {

    const [pairList, setPairList] = useState([])
    const [isPairList, setIsPairList] = useState(false)
    // eslint-disable-next-line
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
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
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"pairs"} />
                    <div style={{ backgroundColor: '#e846461F' }} className="card">
                        <div className="container-fluid">
                            <div
                                className="content"
                                style={{ paddingTop: "180px", height: "150vh" }}
                                position="absolute"
                            >
                                <div className="card">
                                    <Typography style={{ marginLeft: '15px', marginTop: '15px' }} variant="h5" color="textSecondary" component="p"><strong>List of Pairs </strong>
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

                                                {isPairList ? (
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
                                                                <th>Name A/B</th>
                                                                <th>Symbol A/B</th>
                                                                <th>Contract Hash A/B</th>
                                                                <th>Reserve A</th>
                                                                <th>Reserve B</th>
                                                                <th>ReserveCSPR</th>
                                                                <th>ReserveUSD</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ color: 'black' }}>
                                                            {pairList.map((i, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{i.token0.name}/{i.token1.name}</td>
                                                                    <td>{i.token0.symbol}/{i.token1.symbol}</td>
                                                                    <td>{shortenAddress(i.token0.id)}/{shortenAddress(i.token1.id)}</td>
                                                                    <td>{i.reserve0 / 10 ** 9}</td>
                                                                    <td>{i.reserve1 / 10 ** 9}</td>
                                                                    <td>{i.reserveETH / 10 ** 9}</td>
                                                                    <td>{i.reserveUSD / 10 ** 9}</td>
                                                                    {/* <td>{shortenAddress(i.token0.packageHash)/shortenAddress(i.token1.packageHash)}</td> */}

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

export default Pairs;
