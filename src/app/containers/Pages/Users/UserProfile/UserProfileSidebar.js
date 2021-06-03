import React from "react";
import { Link } from "react-router-dom";
function UserProfileSidebar(props) {

    return (
        <div
            className="sidebar"
            id="sidebar"
            style={{ backgroundColor: "#f8f9fa" }}
        >
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li className="menu-title">
                            <span>Main</span>
                        </li>
                        <li className={props.activeTab.profile}>
                            <Link to={`/User/Profile/Detail/profile/${props.userId}/null`}>
                                <i className="far fa-id-card"></i> <span>User's Profile</span>
                            </Link>
                        </li>
                        <li className={props.activeTab.nfts}>
                            <Link to={`/User/Profile/Detail/nfts/${props.userId}/null`}>
                                <i className="fas fa-th"></i> <span>User's NFTs</span>
                            </Link>
                        </li>
                        <li className={props.activeTab.cubes}>
                            <Link to={`/User/Profile/Detail/cubes/${props.userId}/null`}>
                                <i className="fas fa-cubes"></i> <span>User's Cubes</span>
                            </Link>
                        </li>

                        <li className="menu-title">
                            <span>Roles</span>
                        </li>
                        <li className={props.activeTab.imageArtist}>
                            <Link to={`/User/Profile/Detail/imageArtist/${props.userId}/null`}>
                            <i className="far fa-images"></i> <span> Image Artist</span>
                            </Link>
                        </li>
                        <li className={props.activeTab.musicArtist}>
                            <Link to={`/User/Profile/Detail/musicArtist/${props.userId}/null`}>
                                <i className="fas fa-music"></i> <span> Music Artist</span>
                            </Link>
                        </li>
                        <li className={props.activeTab.producer}>
                            <Link to={`/User/Profile/Detail/producer/${props.userId}/null`}>
                                <i className="fas fa-user-tie"></i> <span> Producer</span>
                            </Link>
                        </li>
                        <li className={props.activeTab.executiveProducer}>
                            <Link to={`/User/Profile/Detail/executiveProducer/${props.userId}/null`}>
                                <i className="fas fa-user-secret"></i> <span> Executive Producer</span>
                            </Link>
                        </li>
                        <li className={props.activeTab.fan}>
                            <Link to={`/User/Profile/Detail/fan/${props.userId}/null`}>
                                <i className="fas fa-user-alt"></i> <span> Fan</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UserProfileSidebar;
