
// Sends message to current tab content script
function sendMsgToCS(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        tabs.forEach(function(t) {
            chrome.tabs.sendMessage(t.id, message);
        });
    });
}
var state = {};
function loadValue(name) {
    if (typeof state[name] == 'undefined') {

        var lsStr;
        if (lsStr = localStorage['s_' + name]) {
            state[name] = lsStr;
        } else if (lsStr = localStorage['n_' + name]) {
            state[name] = parseFloat(lsStr);
        } else if (lsStr = localStorage['o_' + name]) {
            state[name] = JSON.parse(lsStr);
        } else if (lsStr = localStorage['d_' + name]) {
            state[name] = new Date(Date.parse(lsStr));
        } else if (lsStr = localStorage['b_' + name]) {
            if (lsStr === 'false') lsStr = '';
            state[name] = Boolean(lsStr);
        }
    }
    return state[name];
}

var domEvents = {
    // Handles color click event
    onClick: function click(e) {
        var colorCode = e.target.getAttribute('data-name');

        var divs = document.querySelectorAll('div');
        [].forEach.call(divs, function(div){
            if(div === e.target){
                div.classList.add('active');
            } else{
                div.classList.remove('active');  
            }
        })
        chrome.runtime.sendMessage({ action: 'COLOR_SELECTED_FROM_POPUP', color: colorCode });
        sendMsgToCS({ action: 'COLOR_PAGE', colorCode: colorCode });
        setTimeout(function(){
            window.close();
        }, 300);
    },
    // Handles color mouse hover event - colors page
    onMouseover: function mouseover(e) {
        var colorCode = e.target.getAttribute('data-name');
        sendMsgToCS({ action: 'COLOR_PAGE', colorCode: colorCode });
    },
    // Handles popup window mouse out event - loads stored color
    onMouseout: function mouseout(e) {
        e = e || window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName === "HTML") {
            sendMsgToCS({ action: 'LOAD_COLOR' });
        }
    }
}


// Tracks user icon click and registers popup window event listeners
function run() {
    document.addEventListener('DOMContentLoaded', function() {
        var divs = document.querySelectorAll('div');
        var colorCode = loadValue('colorCode');
        [].forEach.call(divs,function(div, index){ 
            div.style.backgroundColor = div.id;
            if(colorCode == div.getAttribute('data-name')){
                div.classList.add('active');
            }
            div.addEventListener('click', domEvents.onClick);
            div.addEventListener("mouseover", domEvents.onMouseover);
        })
        document.addEventListener("mouseout", domEvents.onMouseout);
    });
}


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-78341631-1', 'auto');
ga('set', 'checkProtocolTask', null);
ga('send', 'pageview','/popup.html');

try {
    run();
} catch (e) {}