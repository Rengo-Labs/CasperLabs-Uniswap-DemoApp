import { Grid } from '@material-ui/core/';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import NFTCard from '../../../../components/Cards/NFTCard';

function CollectionNfts(props) {
    const { collectionId } = useParams();
    const [tokenList, setTokenList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    const handleShowBackdrop = () => {
        setOpen(true);
    };
    let getCollectionNfts = () => {
        handleShowBackdrop();
        let CollectioId = {
            collectionId: collectionId
        }
        axios.post("/collection/collections", CollectioId).then(
            (response) => {
                console.log("response", response);
                setTokenList(response.data.Nftsdata);
                handleCloseBackdrop();
            },
            (error) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(error);
                    console.log(error.response);
                }
                handleCloseBackdrop();
            })
    }

    useEffect(() => {
        getCollectionNfts();
        // getCollections();?

        props.setActiveTab({
            dashboard: "",
            newNFT: "",
            orders: "",
            myNFTs: "",
            myCubes: "",
            myDrops: "",
            settings: "",
            mySeason: "",
            privacyPolicy: "",
            termsandconditions: "",
            changePassword: "",
            newDrop: "",
            newSupefNFT: "",
            newCollection: "active",
            newRandomDrop: "",
        });// eslint-disable-next-line
    }, []);

    return (
        <div className="card">
            <ul className="breadcrumb" style={{ backgroundColor: "rgb(167,0,0)" }}>
                <li className="breadcrumb-item">
                    <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/dashboard/newCollection">Collections</Link>
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
                        ) : (
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                            >
                                {tokenList.map((i, index) => (
                                    <NFTCard data={i[0]} key={index}></NFTCard>
                                ))}
                            </Grid>
                        )}
                    </div>
                </form>
            </div >
        </div >

    );
}

export default CollectionNfts;
