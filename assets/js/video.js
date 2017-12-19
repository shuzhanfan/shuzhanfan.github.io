var getUrlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(decodeURI(window.location.href));
    return results && results[1] || 0;
};
var videoUrl = getUrlParam('url');
if (!videoUrl) {
    videoUrl = 'https://v.qq.com/x/cover/t5jqhgw8pix81mw/v0024wohpa1.html';
}
$("#videoIframe").attr('src', 'http://jx.vgoodapi.com/jx.php?url=' + videoUrl);

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
            $("#videoIframe").attr('src', 'http://jx.vgoodapi.com/jx.php?url=' + videoUrl);
            history.pushState('', '', '?url=' + videoUrl);
            s.val('');
            f.removeClass('explode');
            m.removeClass('show');
        }, 3000);
    })
}());
