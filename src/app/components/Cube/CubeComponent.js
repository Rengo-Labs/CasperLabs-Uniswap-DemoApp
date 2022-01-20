
import React from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import r1 from '../../assets/img/patients/patient.jpg';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function CubeComponent(props) {
    return (
        <div className="wrapper">
            <div className="cube-box">
                {props.data.map((j, jindex) => (
                    <img src={j[0].artwork} key={jindex} style={{ border: j[0].type === "Mastercraft" ? '4px solid #e84646' : j[0].type === "Legendary" ? '4px solid #FFD700' : j[0].type === "Epic" ? '4px solid #9400D3' : j[0].type === "Rare" ? '4px solid #0000FF' : j[0].type === "Uncommon" ? '4px solid #008000' : j[0].type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                ))}
                {new Array(6 - props.data.length).fill(0).map((_, index) => (
                    < img src={r1} alt="" />
                ))}
            </div>
        </div>
    );
}

export default CubeComponent;
