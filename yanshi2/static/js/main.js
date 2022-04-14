function outLink(link) {
	window.open(link, '_blank');
}

$(document).ready(function(){
   $('input[name=sent_frm]').each(function(){
            $(this).val("1");
       }) 

});




$(document).ready(function(){
    $( "#thumb_trigger" ).click(function() {
      $( "#thumb_holder" ).css( "height", "600px" );
      $( "#thumb_trigger" ).css( "display", "none" );
    })

});

$(document).ready(function(){
                var words = $(".tag_cloud").text().split(" ");
                $(".tag_cloud").empty();
                $.each(words, function(i, v) {
                    $(".tag_cloud").append($("<span>").text(v + ' '));
                });
            /*     add color */
                $( ".tag_cloud span" ).each(function( index, element ) {
                    var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
                    var size = (Math.floor((Math.random()*17)+10)) + 'px';
                    $( element ).css( "color", hue );
                    $( element ).css( "font-size", size );
                });    
});


function consent_dismiss() {
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 24 * 365 * 1000;
    now.setTime(time);
    
    document.cookie = "cc_dismiss=1; expires=" + now.toUTCString() + ";";
    document.getElementById('cc_container').style.display = 'none';

}

$(document).ready(function(){
    if (document.cookie.indexOf("cc_dismiss") >= 0) {
    
    }
    else {
        var cc = document.createElement("div");
        cc.setAttribute("id", "cc_container");
        cc.innerHTML = window.cc_text + ' &nbsp;&nbsp;&nbsp; <u onclick="consent_dismiss()">' + window.cc_dismiss + '</u>';
        document.body.appendChild(cc);
    }
    
});



particlesJS('particles-js',
  
{
  "particles": {
    "number": {
      "value": 43,
      "density": {
        "enable": false,
        "value_area": 800
      }
    },
    "color": {
      "value": "#a51cde"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 8,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 0.5666582342524665
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}
);
