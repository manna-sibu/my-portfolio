(function ($) {
  "use strict";

  // Portfolio subpage filters
  function portfolio_init() {
    var portfolio_grid = $("#portfolio_grid"),
      portfolio_filter = $("#portfolio_filters");

    if (portfolio_grid.length) {
      portfolio_grid.shuffle({
        speed: 450,
        itemSelector: "figure",
      });

      $(".site-main-menu").on("click", "a", function () {
        portfolio_grid.shuffle("update");
      });

      portfolio_filter.on("click", ".filter", function (e) {
        e.preventDefault();
        $("#portfolio_filters .filter").parent().removeClass("active");
        $(this).parent().addClass("active");
        portfolio_grid.shuffle("shuffle", $(this).attr("data-group"));
      });
    }
  }

  // Contact form validator
  $(function () {
    $("#contact-form").validator();

    $("#contact-form").on("submit", function (e) {
      if (!e.isDefaultPrevented()) {
        var url = "contact_form/contact_form.php";

        $.ajax({
          type: "POST",
          url: url,
          data: $(this).serialize(),
          success: function (data) {
            var messageAlert = "alert-" + data.type;
            var messageText = data.message;

            var alertBox =
              '<div class="alert ' +
              messageAlert +
              ' alert-dismissable">' +
              '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
              messageText +
              "</div>";
            if (messageAlert && messageText) {
              $("#contact-form").find(".messages").html(alertBox);
              if (messageAlert === "alert-success") {
                $("#contact-form")[0].reset();
              }
            }
          },
        });
        return false;
      }
    });
  });

  // Text Rotator
  $.fn.extend({
    rotaterator: function (options) {
      var defaults = {
        fadeSpeed: 500,
        pauseSpeed: 100,
        child: null,
      };

      var settings = $.extend(defaults, options);

      return this.each(function () {
        var obj = $(this);
        var items = $(obj.children(), obj);
        items.hide();

        var next = settings.child ? settings.child : $(obj).children(":first");
        $(next).fadeIn(settings.fadeSpeed, function () {
          $(next)
            .delay(settings.pauseSpeed)
            .fadeOut(settings.fadeSpeed, function () {
              var next = $(this).next().length
                ? $(this).next()
                : $(obj).children(":first");
              $(obj).rotaterator({
                child: next,
                fadeSpeed: settings.fadeSpeed,
                pauseSpeed: settings.pauseSpeed,
              });
            });
        });
      });
    },
  });

  // Hide Mobile Menu
  function mobileMenuHide() {
    if ($(window).width() < 1024) {
      $("#site_header").addClass("mobile-menu-hide");
    }
  }

  // Document Ready
  $(document).ready(function () {
    // Initialize Portfolio Grid
    $("#portfolio_grid").imagesLoaded(function () {
      setTimeout(portfolio_init, 500);
    });

    // Portfolio hover effect
    $("#portfolio_grid > figure > a").each(function () {
      if ($.isFunction($.fn.hoverdir)) {
        $(this).hoverdir();
      } else {
        console.error("Hoverdir plugin not loaded");
      }
    });

    // Mobile Menu Toggle
    $(".menu-toggle").click(function () {
      $("#site_header").toggleClass("mobile-menu-hide");
    });

    // Testimonials Slider
    var $testimonials = $(".testimonials.owl-carousel").owlCarousel({
      nav: true,
      items: 1,
      loop: true,
      navText: false,
      margin: 10,
    });

    $(".site-main-menu").on("click", "a", function () {
      $testimonials.trigger("refresh.owl.carousel");
    });

    // Text Rotator Init
    $("#rotate").rotaterator({
      fadeSpeed: 800,
      pauseSpeed: 1900,
    });

    // Blog Masonry Grid Init
    setTimeout(function () {
      $(".blog-masonry").masonry();
    }, 500);

    $(".site-main-menu").on("click", "a", function () {
      $(".blog-masonry").masonry();
    });

    // Lightbox Init
    $(".lightbox").magnificPopup({
      type: "image",
      removalDelay: 300,
      mainClass: "mfp-fade",
      image: {
        titleSrc: "title",
      },
      iframe: {
        patterns: {
          youtube: {
            index: "youtube.com/",
            id: "v=",
            src: "//www.youtube.com/embed/%id%?autoplay=1",
          },
          vimeo: {
            index: "vimeo.com/",
            id: "/",
            src: "//player.vimeo.com/video/%id%?autoplay=1",
          },
          gmaps: {
            index: "//maps.google.",
            src: "%id%&output=embed",
          },
        },
      },
      callbacks: {
        markupParse: function (template, values, item) {
          values.title = item.el.attr("title");
        },
      },
    });

    // Preloader
    $(window).on("load", function () {
      $(".preloader").fadeOut("slow");
    });

    // Mobile Menu Hide on Resize
    $(window).on("resize", mobileMenuHide);

    // Mobile Menu Hide on Menu Click
    $(".site-main-menu").on("click", "a", mobileMenuHide);
  });
})(jQuery);
