import { Divider } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import Cookies from "js-cookie";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import logo from "../../assets/img/logo3.png";

const drawerWidth = 280;
const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#ffffff",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarShift: {
    backgroundColor: "#ffffff",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },

  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "rgb(167, 0, 0)",
  },
  title: {
    flexGrow: 1,
  },
  avatarRoot: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function HeaderMenuAppBar(props) {
  let history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    history.push("/dashboard");
    handleClose();
  };

  const handleProfileSetting = () => {
    history.push(`${props.match.url}/profilesettings`);
    handleClose();
  };

  let handleDisconnect = (e) => {
    Cookies.remove("Authorization");
    history.push("/");
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar)}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={props.handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <div className={classes.title}>
            <NavLink to={"/"}>
              <img
                src={logo}
                alt={"Casper Swap"}
                width="80"
                height="70"
              />
              Casper Swap
            </NavLink>
          </div>
          <div>
            <div className={classes.avatarRoot}>
              {props.userData !== undefined ? (
                <>
                  {/* {props.userData.pictureURL !== undefined ? ( */}

                  <Avatar
                    src={props.userData.pictureURL}
                    onClick={handleMenu}
                  ></Avatar>
                  {/* ) : null} */}
                </>
              ) : null}
            </div>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileSetting}>
                <div className="row">
                  <Avatar
                    src={props.userData.pictureURL}
                    onClick={handleMenu}
                  ></Avatar>
                  <p style={{ marginTop: "5%", paddingLeft: "5%" }}>
                    {props.userData.name}
                  </p>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
              <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
