/**
    Released under MIT License
    
    Copyright (c) 2010 Jukka Svahn
    <http://rahforum.biz>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/
$(document).ready(function() {

    var dayName = new Array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado")
    var monName = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nomviembre", "Diciembre")
    var now = new Date
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    //hours es false si es 0
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var time = (dayName[now.getDay()] + " " + now.getDate() + " de " + monName[now.getMonth()] + " " + strTime);

    $('#date').html(time);

    /**
        Adds active state
    */
    $('#pages span:first-child').addClass('active');
    /**
        Hovering #prev and #next causes
        the prev/next page links to glow
    */
    $('#prev').hover(function() {
        $('#pages span.active').prev('#pages span').addClass('shine');
    }, function() {
        $('#pages span').removeClass('shine');
    });
    $('#next').hover(function() {
        $('#pages span.active').next('#pages span').addClass('shine');
    }, function() {
        $('#pages span').removeClass('shine');
    });
    /**
        When page link is
        clicked
    */
    var timer;
    var boleanTimer = true;
    $('#pages span').click(function() {
        if ($(this).hasClass('active')) {return false}
        if (boleanTimer === false) {
            return;
        }
        var page = $(this).html();
        var beforePage = $('#pages span.active').html();
        if (page > beforePage) {
            animation = {
                inAnimation: "animated slideInRight",
                OutAnimation: "animated slideOutLeft"
            };
        } else {
            animation = {
                inAnimation: "animated slideInLeft",
                OutAnimation: "animated slideOutRight"
            };
        }
        $('#pages span').removeClass('active');
        $(this).addClass('active');
        window.location.hash = (page);
        $('#container div').removeClass();
        $('#container div:nth-child(' + beforePage + ')').addClass(animation.OutAnimation);
        $('#container div:nth-child(' + beforePage + ')').fadeOut(300);
        $('#container div:nth-child(' + page + ')').fadeIn(300);
        $('#container div:nth-child(' + page + ')').addClass(animation.inAnimation);
        boleanTimer = false;
        timer = setTimeout(function() {
            boleanTimer = true
        }, 300);
    });
    /**
        Hook clicks from the #prev to
        previous page link
    */
    $('#prev').click(function() {
        $('#pages span.active').prev('#pages span').click();
    });
    /**
        Hook click from the #next
    */
    $('#next').click(function() {
        $('#pages span.active').next('#pages span').click();
    });
    /**
        Select random URL and redirect
    */
    $('#random').click(function() {
        var url = "0";
        while (url == "http://www.example.com" || url == "0") {
            var count = $('#container a').length;
            var random = Math.floor(Math.random() * count);
            var url = $('#container').find('a').eq(random).attr('href');
        }
        window.location = url;
    });
    /**
        Open Router direccion
    */
    $('#each').click(function() {
        if (confirm('Desea Acceder al router ?')) {
            window.location = "http://192.168.0.1/";
        }
    });
    /*
        Open visible links
    */
    $('#shown').click(function() {
        var url = "0";
        while (url == "http://www.example.com" || url == "0") {
            var count = $('#container div:visible a').length;
            var random = Math.floor(Math.random() * count);
            var url = $('#container').find('a').eq(random).attr('href');
            var url = $('#container div:visible').find('a').eq(random).attr('href');
        }
        window.location = url;
    });
    /*


        Bind arrows, and transfer it as
        a click to the page links
    */
    $(document).keydown(function(event) {
        var goTo = '';
        if (event.keyCode == 37) goTo = 'prev';
        else if (event.keyCode == 39) goTo = 'next';
        if (goTo) {
            $('#pages span').removeClass('shine');
            $('#pages span.active')[goTo]('#pages span').click();
            return false;
        }
    });
    /* 
    Evento rueda del mouse para 
    cambiar entre  las categorias

    */
    $('body').bind('DOMMouseScroll mousewheel', function(e) {
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
            $('#pages span.active').prev('#pages span').click();
        } else {
            $('#pages span.active').next('#pages span').click();
        }
    });
    /**
    /**
        If the page somehow opens, or ends up,
        in strange cordinates, reset the location
    */
    $('body').click(scroll(0, 0));

    /*
        Menu overlay hide
    */
    $(".btn-menu").click(function() {
        $('.overlay').removeClass('animated fadeInUp');
        $('.overlay').addClass('animated fadeOutDown');
        $('.overlay').delay(2000).hide(0);
    });

        
    $(document).keyup(function(e) {
        focusedInput = $('input').is(":focus");
        var key = e.keyCode || e.charCode;
            if ((key >= 48 && key <= 57 || key >= 96 && key <= 105) && focusedInput===false) {
                key = key <=57 ? key- 48 : key - 96 ;
                $('#pages span:nth-child(' + key + ')').click();
        }
    });


    /*$.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?id=3646738&APPID=cd351cd4c23b5ea27db44d0b043203d6&units=metric",
    });*/
});