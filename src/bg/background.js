var extensionConsts = {
    colorPersistence: true,
    extensionName: "zhihu_style_changer",
    extensionDomains: ["zhihu.com"]
};

var MAIN_URL = "https://www.zhihu.com/";
var ANSWER_QUESTION = "https://www.zhihu.com/question";
var ZHUANGLAN_WRITE = "https://zhuanlan.zhihu.com/write";

// Global variables
var state = {};
var localStorageSnapshot = {};


function isUndefined(obj) {
    return (typeof obj === 'undefined');
}


function endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function escapeRegExp(str) {
    if (str == null) return '';
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function testUrl(url, domain) {
    return new RegExp("^https?:\\\/\\\/\[\\da-z\\.-\]\+\\." + escapeRegExp(domain)).test(url)
}


function ease(x) {
    return (1 - Math.sin(Math.PI / 2 + x * Math.PI)) / 2;
}


// Returns type name by value
function getTypeName(obj, toLower) {
    var res = ({}).toString.call(obj).match(new RegExp("\\s([a-zA-Z]+)"))[1];
    if (toLower)
        res = res.toLowerCase();
    return res;
}


// Loads value from local storage by property name
function loadValue(name) {
    return state[name];
}


// Keeps the value in both state object and local storage
function persistValue(name, value) {
    var sets = {};
    sets[name] = value;
    chrome.storage.local.set(sets);
    localStorageSnapshot[name] =  state[name] = value;
}



// Logs a message to console only if flag raised
function logVarArgs( /* args */ ) {
    if (!loadValue('debug'))
        return;
    try {
        var argsArray = [].slice.call(arguments);
        var isAnError = argsArray.some(function(arg) {
            return arg instanceof Error;
        });
        var logger = isAnError ? console.error : console.log;
        logger.apply(console, arguments);
    } catch (e5) {
        console.error("failed logging an error", e5);
    }
}

var log = logVarArgs.bind(null, "[background]: ");

function updateStatistics(type) {
    if (type == "renderCount") {
        var count = loadValue("renderCount") || 0;
        persistValue("renderCount", ++count);
    }
}




// Fill extension storage snapshot object for content scripts
function initExtensionStorageSnapshot() {
    var value;
    chrome.storage.local.get(null, function(data){
        localStorageSnapshot = data || {};
    })
}



// Remove old local storage properties
function cleanOldLocalStorageProperties() {
    // console.info(localStorage);
    chrome.storage.local.clear();
    localStorage.clear();
    chrome.storage.local.set({extensionConsts: extensionConsts});
}



function animateFlip(tabId) {
    var ANIMATIONFRAMES = 36;
    var ANIMATIONSPEED = 10; // ms
    var rotation = 0;
    var canvas = document.createElement('canvas');
    canvas.width = "19";
    canvas.height = "19";
    var ImageIcon = new Image();
    ImageIcon.src = chrome.extension.getURL("icons/color/19.png");
    var canvasContext = canvas.getContext('2d');

    var _drawIcon = function(tabId) {
        canvasContext.save();
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.translate(
            Math.ceil(canvas.width / 2),
            Math.ceil(canvas.height / 2));
        canvasContext.rotate(2 * Math.PI * ease(rotation));
        canvasContext.drawImage(ImageIcon, -Math.ceil(canvas.width / 2), -Math.ceil(canvas.height / 2));
        canvasContext.restore();
        if (tabId) {
            chrome.browserAction.setIcon({
                imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height),
                tabId: tabId
            });
        } else {
            chrome.browserAction.setIcon({
                imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)
            });
        }

    }
    var _animate = function(tabId) {
        rotation += 1 / ANIMATIONFRAMES;
        _drawIcon(tabId);
        if (rotation <= 1) {
            setTimeout(function() {
                _animate(tabId);
            }, ANIMATIONSPEED);
        } else {
            rotation = 0;
        }
    }
    _animate();
}


function disablePopup(tabId) {
    if (tabId) {
        chrome.browserAction.setIcon({ path: "icons/default/19.png", tabId: tabId });
        chrome.browserAction.setPopup({ popup: "", tabId: tabId });
    } else {
        chrome.browserAction.setIcon({ path: "icons/default/19.png" });
        chrome.browserAction.setPopup({ popup: "" });
    }
}

function enablePopup(tabId) {
    chrome.browserAction.setPopup({ popup: "popup.html", tabId: tabId });
    if (loadValue("disablerotation")) {
        chrome.browserAction.setIcon({ path: "icons/color/19.png", tabId: tabId });
    } else {
        animateFlip(tabId);
    }
}

function getMessage(messageID) {
    return chrome.i18n.getMessage(messageID);
}


function createContextMenus() {
    if (chrome.contextMenus) {
        chrome.contextMenus.create({
            title: getMessage("openZhihuQuestion"),
            contexts: ["page_action", "browser_action"],
            onclick: function() {
                chrome.tabs.create({ url: ANSWER_QUESTION });
            }
        });

        chrome.contextMenus.create({
            title: getMessage("openZhuanlanWriteTab"),
            contexts: ["page_action", "browser_action"],
            onclick: function() {
                chrome.tabs.create({ url: ZHUANGLAN_WRITE });
            }
        });
    }
}


function openInstallPage() {
    chrome.tabs.create({ url: chrome.extension.getURL('options.html') });
}

function sendGa(){
    try{
        ga.apply(this, arguments);
    }catch(e){}
}


function registerRunTimeEventListeners() {
    chrome.runtime.onInstalled.addListener(function(details) {
        try {
            disablePopup();
            animateFlip();
        } catch (e) {}
        switch (details.reason) {
            case 'update':
                persistValue("updateDate", new Date().getTime());
                break;
            case 'install':
                persistValue("installDate", new Date().getTime());
                openInstallPage();
                break;
        }
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        try {
            if (!request) return;

            switch (request.action) {
                case 'TRACK_EVENT':
                    break;
                case 'PERSIST_VALUE':
                    persistValue(request.name, request.value);
                    break;
                case 'LOG_CONTENT_EVENT':
                    logVarArgs(sender.tab ? ("[tab #" + sender.tab.id + "]: ") : ("[tab #?]: "), request.message, request.exceptionMessage);
                    break;
                case 'ERROR':
                    break;
            }
        } catch (e) {}
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.action) {
            case 'COLOR_SELECTED_FROM_POPUP':
                persistValue("colorCode", request.color);
                updateStatistics("renderCount");
                sendGa('send', 'event', { eventCategory: 'Color', eventAction: 'click', eventLabel: 'Click Color:' + request.color})
                break;
        }
    });
}


function registerEventsListeners() {
    // browserAction icon as bookmark
    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.create({ url: MAIN_URL });
    });

    chrome.tabs.onCreated.addListener(function(tab) {
        disablePopup(tab.id);
    });

    // check current tab url, in order to change browserAction icon behavior
    chrome.tabs.onActivated.addListener(function(info) {
        chrome.tabs.get(info.tabId, function(tab) {
            // return false;
            if (!extensionConsts.extensionDomains.some(function(domain) {
                    return testUrl(tab.url, domain);
                })) {
                disablePopup(tab.tabId);
            } else {
                enablePopup(tab.tabId);
            }

        })
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'loading') {
            if (!extensionConsts.extensionDomains.some(function(domain) {
                    return testUrl(tab.url, domain);
                })) {
                disablePopup(tabId);
            } else {
                enablePopup(tabId);
            }
        }
    });

}



try {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-78341631-1', 'auto');
    ga('set', 'checkProtocolTask', null);
    ga('send', 'pageview','/background.html');
} catch (e) {};

registerEventsListeners();
cleanOldLocalStorageProperties();
initExtensionStorageSnapshot();
registerRunTimeEventListeners();
createContextMenus();
