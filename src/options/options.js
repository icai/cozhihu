function initLang() {
    var langDoms = document.querySelectorAll('var');
    [].slice.call(langDoms, 0).forEach(function(item, index) {
        if (item.id) {
            var lang = chrome.i18n.getMessage(item.id) || chrome.app.getDetails()[item.id];
            item.parentNode.replaceChild(document.createTextNode(lang), item);
        }
    })
}

function setTitle() {
    document.title = [].slice.call(arguments, 0).map(function(item) {
    	return chrome.i18n.getMessage(item) || item;
    }).join('');
}


function renderBackground() {
    var json = {
        particles: {
            number: {
                value: 20,
                density: {
                    enable: !0,
                    value_area: 1E3
                }
            },
            color: {
                value: "#e1e1e1"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: .5,
                random: !1,
                anim: {
                    enable: !1,
                    speed: 1,
                    opacity_min: .1,
                    sync: !1
                }
            },
            size: {
                value: 15,
                random: !0,
                anim: {
                    enable: !1,
                    speed: 180,
                    size_min: .1,
                    sync: !1
                }
            },
            line_linked: {
                enable: !0,
                distance: 650,
                color: "#cfcfcf",
                opacity: .26,
                width: 1
            },
            move: {
                enable: !0,
                speed: 2,
                direction: "none",
                random: !0,
                straight: !1,
                out_mode: "out",
                bounce: !1,
                attract: {
                    enable: !1,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: !1,
                    mode: "repulse"
                },
                onclick: {
                    enable: !1,
                    mode: "push"
                },
                resize: !0
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: .4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: !0
    };

    var div = document.createElement('div');
    div.id = 'particles';
    document.body.appendChild(div);
    particlesJS("particles", json)
}


function resetStatus(){
    chrome.storage.local.get(null, function(data){
        if (data["usetextshadow"] && data["usetextshadow"] === "true")
            document.getElementById('usetextshadow').checked = true;


        if (data["disablerotation"] && data["disablerotation"] === "true")
            document.getElementById('disablerotation').checked = true;


        if(data["renderCount"]){
            document.getElementById('rendercount').innerHTML = data["renderCount"];
        }
    })
}

function addEvent(el, event, callback){
    el.addEventListener(event, callback, false);
}


function persistValue(name, value) {
    chrome.runtime.sendMessage({
        action: 'PERSIST_VALUE',
        name: name,
        value: value
    });
}


// Registers dom content loaded event
function addEventListeners() {
    addEvent(document, "DOMContentLoaded", function() {

        initLang();
        setTitle('extName', ' - ', 'options');

        resetStatus();

        var element = document.getElementById('usetextshadow');
            element.focus();
        addEvent(element,'change', function() {
            var enableCS = element.checked;
            persistValue("usetextshadow", enableCS);
        })


        var element2 = document.getElementById('disablerotation');
        addEvent(element2,'change', function() {
            var enableCS = element2.checked;
            persistValue("disablerotation", enableCS);
        })

        renderBackground();
        // set app id
        document.getElementById("chromestoreurl").href = "https://chrome.google.com/webstore/detail/" + chrome.app.getDetails().id;
    });
}

// Starts install page proccess
function runInstall() {
    addEventListeners();
}

try {
    runInstall();
} catch (e) {}