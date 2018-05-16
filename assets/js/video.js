var getUrlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(decodeURI(window.location.href));
    return results && results[1] || 0;
};
var videoUrl = getUrlParam('url');
if (!videoUrl) {
    videoUrl = 'http://www.iqiyi.com/v_19rre19on4.html#vfrm=2-4-0-1';
}

// $("#videoIframe").attr('src', 'http://17kyun.com/api.php?url=' + videoUrl);
$("#videoIframe").attr('src', 'https://api.pangujiexi.com/player.php?url=' + videoUrl);

(function() {
    var s = $('input'),
        f = $('form'),
        a = $('.after'),
        m = $('h4');
    s.focus(function(){
        if( f.hasClass('open') ) return;
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 1300);
    });
    a.on('click', function(e){
        e.preventDefault();
        if( !f.hasClass('open') ) return;
        s.val('');
        f.addClass('close');
        f.removeClass('open');
        setTimeout(function(){
            f.removeClass('close');
        }, 1300);
    })
    f.submit(function(e){
        e.preventDefault();
        m.html('正在搜索!').addClass('show');
        var videoUrl = document.getElementById('videoSearchInput').value;
        f.addClass('explode');
        setTimeout(function(){
            $("#videoIframe").attr('src', 'http://17kyun.com/api.php?url=' + videoUrl);
            history.pushState('', '', '?url=' + videoUrl);
            s.val('');
            f.removeClass('explode');
            m.removeClass('show');
        }, 3000);
    })
}());
