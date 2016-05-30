/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById("myNav").style.height = "100%";

    $(".leaflet-control-zoom").css("visibility", "hidden");
    $("#helpBtn").css("visibility", "hidden");
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.height = "0%";

    $(".leaflet-control-zoom").css("visibility", "visible");
    $("#helpBtn").css("visibility", "visible");

}