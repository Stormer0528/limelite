// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require rails-ujs
//= require materialize
//= require chartist/dist/chartist
//= require chartist-plugin-tooltips/dist/chartist-plugin-tooltip
//= require cocoon
//= require jquery.dirtyforms/jquery.dirtyforms.min

$(document).ready(function() {
  M.AutoInit();
  $(".message .close").on("click", function() {
    $(this)
      .closest(".message")
      .fadeOut();
  });

  // Materialize Setup
  $(".dropdown-trigger").dropdown();
  // $("input, textarea").characterCounter();
  $("textarea").trigger("autoresize");
  $("select").formSelect();
  $(".fixed-action-btn").floatingActionButton();
  // $(".datepicker").pickadate({
  //   selectMonths: true,
  //   selectYears: 15,
  // });
  $("span.help-text").each(function() {
    const $value = $(this)[0].innerHTML;
    $(this).addClass("hide");
    $(this)
      .parents("div.input-field")
      .children("label")
      .attr("data-hint", $value);
  });

  // Enable side nav
  $(".sidenav").sidenav();
  $(".collapsible").collapsible();

  $(".title.card#bank-accounts .chart-area").each(function(i, ctx) {
    new Chartist.Bar(
      ctx,
      {
        series: [
          [
            {
              meta: "Deposits",
              value: Math.abs(parseFloat(ctx.dataset.deposits)),
            },
          ],
          [{meta: "Debits", value: Math.abs(parseFloat(ctx.dataset.debits))}],
          [
            {
              meta: "Transfers",
              value: Math.abs(parseFloat(ctx.dataset.transfers)),
            },
          ],
        ],
      },
      {
        stackBars: true,
        horizontalBars: true,
        plugins: [
          Chartist.plugins.tooltip({
            currency: "$", //accepts '£', '$', '€', etc.
            // tooltipFnc: undefined, //accepts function
            //build custom tooltip
            // transformTooltipTextFnc: undefined, // accepts function
            // transform tooltip text
            // class: undefined, // accecpts 'class1', 'class1 class2', etc.
            //adds class(es) to tooltip wrapper
            // anchorToPoint: true, //accepts true or false
            //tooltips do not follow mouse movement -- they are anchored to the point / bar.
            // appendToBody: false, //accepts true or false
            //appends tooltips to body instead of chart container
          }),
        ],

        // Hide axis
        showPoint: false,
        showLine: false,
        showArea: true,
        fullWidth: true,
        showLabel: false,
        axisX: {
          showGrid: false,
          showLabel: false,
          offset: 0,
        },
        axisY: {
          showGrid: false,
          showLabel: false,
          offset: 0,
        },
        chartPadding: 0,
        low: 0,
      }
    ).on("draw", function(data) {
      if (data.type === "bar") {
        data.element.attr({
          style: "stroke-width: 1.5rem",
        });
      }
    });
  });

  // Credit Cards
  //----------------------------------------------------------------------------
  $(".title.card#credit-cards .chart-area").each(function(i, ctx) {
    new Chartist.Bar(
      ctx,
      {
        series: [
          [
            {
              meta: "Credits",
              value: Math.abs(parseFloat(ctx.dataset.credits)),
            },
          ],
          [{meta: "Debits", value: Math.abs(parseFloat(ctx.dataset.debits))}],
        ],
      },
      {
        stackBars: true,
        horizontalBars: true,
        plugins: [
          Chartist.plugins.tooltip({
            currency: "$", //accepts '£', '$', '€', etc.
            // tooltipFnc: undefined, //accepts function
            //build custom tooltip
            // transformTooltipTextFnc: undefined, // accepts function
            // transform tooltip text
            // class: undefined, // accecpts 'class1', 'class1 class2', etc.
            //adds class(es) to tooltip wrapper
            // anchorToPoint: true, //accepts true or false
            //tooltips do not follow mouse movement -- they are anchored to the point / bar.
            // appendToBody: false, //accepts true or false
            //appends tooltips to body instead of chart container
          }),
        ],

        // Hide axis
        showPoint: false,
        showLine: false,
        showArea: true,
        fullWidth: true,
        showLabel: false,
        axisX: {
          showGrid: false,
          showLabel: false,
          offset: 0,
        },
        axisY: {
          showGrid: false,
          showLabel: false,
          offset: 0,
        },
        chartPadding: 0,
        low: 0,
      }
    ).on("draw", function(data) {
      if (data.type === "bar") {
        data.element.attr({
          style: "stroke-width: 1.5rem",
        });
      }
    });
  });

  // Dirty Check forms
  $("form.dirty-check").dirtyForms();
});
