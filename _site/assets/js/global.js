if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += "no-touch";
}

$('a').on("touchstart", function (e) {
    var link = $(this);
    if (link.hasClass('hover')) {
        return true;
    } else {
        link.addClass('hover');
        $('a').not(this).removeClass('hover');
        e.preventDefault();
        return false;
    }
});

$(document).ready(function($) {
    $('.container--grid ul').mixItUp({
        animation: {
        duration: 350,
        effects: 'fade translateY(40px)',
        easing: 'ease'
        }
    });
    var filter_tab = $('.filter .placeholder a');
    $('.filter ').on('click', function(event){
        var selected_filter = $(event.target).data('type');
        if( filter_tab.data('type') !== selected_filter ) {
            $('.filter .selected').removeClass('selected');
            $(event.target).addClass('selected');
        }
    });
});


var lazyLoad = {
    getoffsetTop: function(elem) {
        var offTop = 0;
        while (elem != null) {
            offTop += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return offTop;
    },
    isLoad: function(elem) {
        var cHeight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight,
            sX = window.pageXOffset || document.body.scrollTop || document.documentElement.scrollTop,
            threshold = 10,
            oTop = this.getoffsetTop(elem),
            viewHeight = oTop - sX - threshold;
        if (cHeight >= viewHeight)
        {
            return true;
        } else {
            return false;
        }
    },

    loadImg: function(elems, isFadein) {
        for (var i = 0, len = elems.length; i < len; i++) {
            if (this.isLoad(elems[i])) {
                var classNames = elems[i].className;
                if (classNames.indexOf("loaded") < 0) {
                    var dataUrl = elems[i].getAttribute("data-url");
                    elems[i].style.backgroundImage = "url(" + dataUrl + ")";
                    elems[i].className = classNames + " loaded";
                    if (isFadein) {
                        this.fadeIn(elems[i]);
                    }
                }
            } else {
                return;
            }
        }
    },
    fadeIn: function(elem) {
        var n = 0,
            isnotIE = window.XMLHttpRequest ? true : false;
        if (isnotIE) {
            elem.style.opacity = 0;
        } else {
            elem.style.filter = "alpha(opacity=0)";
        }
        var t = setInterval(function() {
            if (n < 100) {
                n += 5;
                if (isnotIE) {
                    elem.style.opacity = n / 100;
                } else {
                    elem.style.filter = "alpha(opacity=" + n + ")";
                }
            } else {
                clearInterval(t);
            }
        }, 10);
    }
};

window.onscroll = function() {
    lazyLoad.loadImg(document.getElementsByClassName("card-image"), true);
};
window.onload = function() {
    lazyLoad.loadImg(document.getElementsByClassName("card-image"), true);
};
