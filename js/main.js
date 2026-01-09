$(document).ready(function () {
    // Skills
    const $skills = $(".skills .skill");

    $skills.hide().slice(0, 4).show();

    $("#loadMore").on("click", function (e) {
        e.preventDefault();

        const $hidden = $skills.filter(":hidden").slice(0, 4);
        $hidden.slideDown();

        if ($skills.filter(":hidden").length === 0) {
            $(this).text("No more skills").addClass("noContent");
        }
    });

    // About me
    function loadMoreAbout() {
        const isMobile = window.innerWidth <= 510;
        const $aboutBoxes = $(".about-me .about-box");
        const $btn = $("#loadMoreAbout");

        if (!$aboutBoxes.length || !$btn.length) return;

        $btn.off("click.about");

        if (!isMobile) {
            $aboutBoxes.show();
            return;
        }

        $aboutBoxes.hide().slice(0, 3).show();
        $btn.text("View More").removeClass("noContent");
        $btn.on("click.aout", function (e) {
            e.preventDefault();
            
            const $hidden = $aboutBoxes.filter(":hidden").slice(0, 3);
            $hidden.slideDown();

            if ($aboutBoxes.filter(":hidden").length === 0) {
                $(this).text("No more items").addClass("noContent");
            }
        });
    }

    loadMoreAbout();
    $(window).on("resize", function () {
        loadMoreAbout();
    })
});