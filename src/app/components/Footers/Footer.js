import React from "react";
// import logo from '../cspr.png'
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function Footer(props) {
  return (
    <footer className="footer" style={{ position: props.position }}>
      {/* <!-- Footer Bottom --> */}
      <div className="footer-bottom">
        <div className="container-fluid">
          {/* <!-- Copyright --> */}
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 col-lg-6">
                <div className="copyright-text">
                  <p className="mb-0">
                    &copy; 2020 Casper Swap. All rights reserved.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                {/* <!-- Copyright Menu --> */}
                {/* <div className="copyright-menu">
                  <ul className="policy-menu">
                    <li>
                      <Link
                        to="/termsandconditions"
                      >
                        Terms and Conditions
                      </Link>
                    </li> 
                    <li>
                      <Link
                        to="/privacy-policy"
                        // onClick={(e) => e.preventDefault()}
                      >
                        Policy
                      </Link>
                    </li>
                  </ul>
                </div> */}
                {/* <!-- /Copyright Menu --> */}
              </div>
            </div>
          </div>
          {/* <!-- /Copyright --> */}
        </div>
      </div>
      {/* <!-- /Footer Bottom --> */}
    </footer>
  );
}

export default Footer;
