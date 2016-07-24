// Background objects overridden from background
var extensionConsts = {};
var localStorageSnapshot = {};
var zhihuStyleChangeId = "zhihustyleee";
var textShadowStyle = "body{ text-shadow: 1px 1px 1px #ccc;}"

// Loads color from background local storage
function loadColor() {
    chrome.runtime.sendMessage({
        action: 'GET_COLOR'
    }, function(response) {
        if (response && response.colorCode) {
            colorPage(response.colorCode);

        }
    });
}

function updateStatistics(){
    chrome.runtime.sendMessage({
        action: 'UPDATE_STATISTICS'
    }, function(response) {
        if (response && response.colorCode) {
            colorPage(response.colorCode);
        }
    });    

}


// Execute specific extension logic
function runExtensionSpecificCs() {
    if (window !== window.top) return;

    if (!extensionConsts.extensionDomains.some(function(domain) {
            return endsWith(window.location.hostname, domain);
        })) {
        return;
    }

    if (extensionConsts.colorPersistence){
        loadColor();
        updateStatistics("renderCount");
    }

    chrome.runtime.onMessage.addListener(function(request) {
        if (!request) return;

        switch (request.action) {
            case 'COLOR_PAGE':
                colorPage(request.colorCode);
                break;
            case 'LOAD_COLOR':
                loadColor();
                break;
        }
    });
}



// load css Text
function loadCssStyle(cssText) {
    cssText = colorsStyle[cssText + '.css'];

    if (loadValue("usetextshadow")) {
        cssText += textShadowStyle;
    }

    var oldStyle = document.getElementById(zhihuStyleChangeId);
    if (oldStyle) {
        oldStyle.parentNode.removeChild(oldStyle);
    }
    var style = document.createElement("style");
    style.type = "text/css";
    style.id = zhihuStyleChangeId;
    document.getElementsByTagName("head")[0].appendChild(style);
    if (style.styleSheet) {
        style.styleSheet.cssText = cssText;
    } else {
        style.appendChild(document.createTextNode(cssText))
    }
}



// Specific site page color
function colorPage(colorCode) {
    loadCssStyle(colorCode);
}


// Sends a message to bg script for logging
function log(message, exception) {
    try {
        chrome.runtime.sendMessage({
            action: 'LOG_CONTENT_EVENT',
            url: window.location.href,
            domain: window.location.hostname,
            message: message,
            exceptionMessage: exception ? (exception.message || exception.toString()) : null
        });
    } catch (e) {
    }
}

// Loads value from localStorageSnapshot by name
function loadValue(name) {
    var lsStr;
    if (lsStr = localStorageSnapshot['s_' + name]) {
        return lsStr;
    } else if (lsStr = localStorageSnapshot['n_' + name]) {
        return parseFloat(lsStr);
    } else if (lsStr = localStorageSnapshot['o_' + name]) {
        return JSON.parse(lsStr);
    } else if (lsStr = localStorageSnapshot['d_' + name]) {
        return new Date(Date.parse(lsStr));
    } else if (lsStr = localStorageSnapshot['b_' + name]) {
        if (lsStr === 'false') lsStr = '';
        return Boolean(lsStr);
    }
}



// Returns true if string end with suffix
function endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

// Sends message to bg to get data
function runClientServiceCommand() {
    // Request extension consts from background
    chrome.runtime.sendMessage({
        action: 'GET_BG_DATA',
        url: window.location.href,
        domain: window.location.hostname
    }, function(msg) {
        if (!msg) return;
        // executed on pageload
        if (msg.action === 'BG_DATA') {
            extensionConsts = msg.extensionConsts;
            localStorageSnapshot = msg.localStorageSnapshot;

            runExtensionSpecificCs();
        }
    });
}

try {
    runClientServiceCommand();
} catch (e) {}
