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
    /**
        Add the extra stuff to the <head>,
        thus make index.html slightly cleaner
    */
    $('head').append('<link rel="stylesheet" type="text/css" media="screen" title="Default" href="library/animate.css" />' + '<title>New Tab</title>' + '<link rel="shortcut icon" href="library/favicon.png" type="image/png" />');
    /**
        Get URLs from the document body * get time and hour
    */
    var uriString = $('body').text();
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
    /**
        Add top bar and preferences
    */
    $('body').html('<p id="bar"><span class="button" id="shown">Shuffle</span>' + '<span class="button" id="each">  Router  </span>' + '<span class="button" id="random">Random</span></p>');
    /*
        Imprimentdo la hora actual
    */
    $('body').append('<div id="date">' + (dayName[now.getDay()] + " " + now.getDate() + " de " + monName[now.getMonth()] + " " + strTime));
    /**
        Adds the main content blocks to the page
    */
    $('body').append('<div id="container" class="urls"></div>' + '<p id="pages"></p>' + '<form action="https://www.google.com/search" method="get">' + '<input type="text" name="q" value="" />' + '<button type="submit">Google</button>');
    $('body').append('<div id="container"></div>' + '<p id="pages"></p>' + '<form action="https://www.youtube.com/results?" method="get">' + '<input type="text" name="search_query" value="" />' + '<button type="submit">Youtube</button>');
    /**
        Set focus esto esta medio jodido luego veo como mejorarlo
    */
    $('input[name="q"]').focus();
    /**
        Create array from the uriString
    */
    var uriArray = uriString.split("\n");
    /**
        Start going thru the array
    */
    var domains = {};
    var i;
    var count = 0;
    var html = '';
    for (i in uriArray) {
        var url = jQuery.trim(uriArray[i]);
        /*
            If the line is empty,
            skip it
        */
        if (!url) continue;
        /*
            The line doesn't start with http,
            so it must be a separator that starts
            a new page and adds a heading
        */
        if (url.substr(0, 4) != 'http') {
            if (count > 0) html = html + '</div>';
            html = html + '<div><h1>' + url + '</h1>';
            count++;
            continue;
        }
        /*
            Split the domain name from the URL
        */
        var img = url.split(/\/+/g)[1];
        if (img in domains) {
            domains[img]++;
            img = img + '_' + domains[img];
        } else domains[img] = 1;
        /*
            Listo para agregar el documento teniendo en cuenta que si la url es example.com no agregar href
        */
        if (html != "www.example.com") {
            if (url != "http://www.example.com") {
                html = html + '<a href="' + url + '" style="background-image: url(thumbnails/' + img + '.png);"></a>';
            } else if (url == "http://www.example.com") {
                html = html + '<a href="' + "#" + '" style="background-image: url(thumbnails/' + "www.example.com" + '.png);"></a>';
            }
        }
    }
    /**
        Add the stuff to the document
    */
    $('#container').append(html + '</div><span id="prev"></span><span id="next"></span>');
    /**
        Add page numbers to the paragraph
    */
    $('#container div').each(function(index) {
        var page = index + 1;
        $('#pages').append('<span>' + page + '</span>');
    });
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
        window.location.hash = page;
        $('#pages span').removeClass('active');
        $(this).addClass('active');
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
        If the loaded starting URL has hash in it,
        activate that specific page
    */
    if (window.location.hash) {
        $('#pages span:nth-child(' + window.location.hash.substring(1) + ')').click();
    }
    /**
        If the page somehow opens, or ends up,
        in strange cordinates, reset the location
    */
    $('body').click(scroll(0, 0));

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
    });
    */
});