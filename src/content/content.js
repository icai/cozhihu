// Background objects overridden from background
var extensionConsts = {};
var localStorageSnapshot = {};
var zhihuStyleChangeId = "zhihustyleee";
var textShadowStyle = "body{ text-shadow: 1px 1px 1px #ccc;}"

// Loads color from background local storage
function loadColor() {
    colorPage(localStorageSnapshot.colorCode);
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
    if (style.styleSheet) {
        style.styleSheet.cssText = cssText;
    } else {
        style.appendChild(document.createTextNode(cssText))
    }
    document.getElementsByTagName("head")[0].appendChild(style);
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
    return localStorageSnapshot[name];
}



// Returns true if string end with suffix
function endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

// Sends message to bg to get data
function runClientServiceCommand() {

    chrome.storage.local.get(null, function(data){
        localStorageSnapshot = data || {};
        extensionConsts = data.extensionConsts || {};

        runExtensionSpecificCs();
    });
}


try {

    runClientServiceCommand();
} catch (e) {}
