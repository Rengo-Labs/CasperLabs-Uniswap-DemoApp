console.log(
  "%c Proudly Crafted with ZiOn.",
  "background: #222; color: #bada55"
);

/* ---------------------------------------------- /*
 * Preloader
 /* ---------------------------------------------- */
(function () {
  $(window).on("load", function () {
    $(".loader").fadeOut();
    $(".page-loader").delay(350).fadeOut("slow");
  });

  $(document).ready(function () {
    /* ---------------------------------------------- /*
         * Initialization General Scripts for all pages
         /* ---------------------------------------------- */

    var homeSection = $(".home-section"),
      navbar = $(".navbar-custom"),
      navHeight = navbar.height(),
      worksgrid = $("#works-grid"),
      width = Math.max($(window).width(), window.innerWidth),
      mobileTest = false;

    buildHomeSection(homeSection);

    $(window).resize(function () {
      var width = Math.max($(window).width(), window.innerWidth);
      buildHomeSection(homeSection);
    });

    /* ---------------------------------------------- /*
         * Home section height
         /* ---------------------------------------------- */

    function buildHomeSection(homeSection) {
      if (homeSection.length > 0) {
        if (homeSection.hasClass("home-full-height")) {
          homeSection.height($(window).height());
        } else {
          homeSection.height($(window).height() * 0.85);
        }
      }
    }
  });
})(jQuery);
