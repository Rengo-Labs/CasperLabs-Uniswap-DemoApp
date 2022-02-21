import { Avatar, CardHeader, Typography } from "@material-ui/core";
import numeral from "numeral";
import React from "react";
import { Col, Row } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function TokenContent(props) {
    return (
        <Row>
            <Col>
                <CardHeader
                    avatar={<Avatar src={props.i.logoURI} aria-label="Artist" />}
                    title={props.i.name}
                    subheader={props.i.symbol}
                />
            </Col>
            <Col className="text-center">
                <div style={{ margin: '30px', float: 'right' }}>
                    <Typography variant="body2" component="p">
                        {`${numeral(props.i.balance / 10 ** 9).format('0,0.000000000')}`}
                    </Typography>
                </div>
            </Col>
        </Row>

    );

}

export default TokenContent;
