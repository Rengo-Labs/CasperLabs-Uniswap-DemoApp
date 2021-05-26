import React from "react";
function HomeBanner() {
  return (
    <section className="section section-search">
      <div className="container-fluid">
        <div className="banner-wrapper" style={{ paddingTop: "90px" }}>
          <div className="banner-header text-center" >
            <h1 style={{ color: 'white' }}>The largest NFT marketplace</h1>
            <p style={{ color: 'white' }}>
              Buy, sell, and discover rare digital items
            </p>
            {/* <p>using the power of Blockchain.</p> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
