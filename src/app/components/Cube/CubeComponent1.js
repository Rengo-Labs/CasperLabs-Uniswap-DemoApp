
import React from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function CubeComponent1(props) {
    return (
        <div className="wrapper">
            <div className="cube-box">
                {props.data[props.index].map((j, jindex) => (
                    <img src={j.artwork} key={jindex} style={{ border: j.type === "Mastercraft" ? '4px solid #e84646' : j.type === "Legendary" ? '4px solid #FFD700' : j.type === "Epic" ? '4px solid #9400D3' : j.type === "Rare" ? '4px solid #0000FF' : j.type === "Uncommon" ? '4px solid #008000' : j.type === "Common" ? '4px solid #FFFFFF' : 'none' }} alt="" />
                ))}
            </div>
        </div>
    );
}

export default CubeComponent1;
