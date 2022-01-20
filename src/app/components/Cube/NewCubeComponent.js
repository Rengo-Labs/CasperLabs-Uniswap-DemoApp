
import React from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import r1 from '../../assets/img/patients/patient.jpg';
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function NewCubeComponent(props) {
    console.log("props", props);
    return (
        <div className="wrapper">
            <div className="cube-box1">
                {props.data.map((i, index) => (
                    <img key={index} src={i.artwork} style={{ border: i.type === "Mastercraft" ? '4px solid #e84646' : i.type === "Legendary" ? '4px solid #FFD700' : i.type === "Epic" ? '4px solid #9400D3' : i.type === "Rare" ? '4px solid #0000FF' : i.type === "Uncommon" ? '4px solid #008000' : i.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                ))}
                {new Array(6 - props.data.length).fill(0).map((_, index) => (
                    < img src={r1} key={index} alt="" />
                ))}

            </div>
        </div>
    );
}

export default NewCubeComponent;
