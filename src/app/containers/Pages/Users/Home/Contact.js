import React from "react";


function Contact() {
  return (
    <div className="container-fluid" style={{ paddingTop: "170px" }} position="absolute">
      <div className="page-header">
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-12 col-md-7">
            {/* <!-- Contact Form --> */}
            <div
            // className="contact-form-area m-top-30"
            >
              <div className="card" style={{ paddingBottom: "18px" }}>
                <div className="card-body">
                  {" "}
                  <h4>Get In Touch</h4>
                  <form className="form">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <div className="icon">
                            <i className="fa fa-user"></i>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <div className="icon">
                            <i className="fa fa-user"></i>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <div className="icon">
                            <i className="fa fa-envelope"></i>
                          </div>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Type Subjects"
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group textarea">
                          <div className="icon">
                            <i className="fa fa-pencil"></i>
                          </div>
                          <textarea
                            type="textarea"
                            className="form-control"
                            rows="5"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-lg login-btn"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* <!--/ End contact Form --> */}
          </div>

          <div className="col-lg-5 col-md-5 col-12">
            <div className="contact-box-main m-top-30">
              <div className="contact-title">
                <h2>Contact with us</h2>
                <p>
                  euismod eu augue. Etiam vel dui arcu. Cras varius mieros
                  pharetra, id aliquam metus venenatis. Donec sollicit
                </p>
              </div>
              {/* <!-- Single Contact --> */}
              <div className="single-contact-box">
                <div className="c-icon">
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className="c-text">
                  <h4>Opening Hour</h4>
                  <p>
                    Friday - Saturday
                    <br />
                    08AM - 10PM (everyday)
                  </p>
                </div>
              </div>
              {/* <!--/ End Single Contact --> */}
              {/* <!-- Single Contact --> */}
              <div className="single-contact-box">
                <div className="c-icon">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="c-text">
                  <h4>Call Us Now</h4>
                  <p>
                    Tel.: 888 765 4321
                    <br /> Mob.: 765 654 3451
                  </p>
                </div>
              </div>
              {/* <!--/ End Single Contact --> */}
              {/* <!-- Single Contact --> */}
              <div className="single-contact-box">
                <div className="c-icon">
                  <i className="fa fa-envelope-o"></i>
                </div>
                <div className="c-text">
                  <h4>Email Us</h4>
                  <p>
                    contact@imex.com
                    <br />
                    info@imex.com
                  </p>
                </div>
              </div>
              {/* <!--/ End Single Contact --> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    // {/* <!--/ End Contact Us --> */ }
  );
}

export default Contact;
