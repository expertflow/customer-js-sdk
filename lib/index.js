"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoControl = exports.audioControl = exports.closeSession = exports.terminateCurrentSession = exports.closeVideo = exports.sendInvite = exports.dialCall = exports.webhookNotifications = exports.callbackRequest = exports.getConversationData = exports.getConversationDataByCustomerIdentifier = exports.setConversationDataByCustomerIdentifier = exports.setConversationData = exports.uploadToFileEngine = exports.sendJoinConversation = exports.resumeChat = exports.chatEnd = exports.sendMessage = exports.voiceRequest = exports.chatRequest = exports.eventListeners = exports.establishConnection = exports.formValidation = exports.getPreChatForm = exports.widgetConfigs = void 0;
var socket_io_client_1 = require("socket.io-client");
var SIP = require("sip.js");
var socket;
var wssServerIp;
var uriServerIp;
var diallingURI;
var sipExtension;
var extensionPassword;
var enable_sip_logs;
var enableLogs;
var wssPort;
var IP;
var dialerURI;
var sipPassword;
var ext;
var session;
var mediaElement;
var mediaLocal;
var userAgent;
var ex;
var register = false;
var displayMediaStrea;
var toggleVideo;
var video;
var audio;
var screen;
var mediaAcquire = "end";
var endCallBtn = false;
var isConversationActive = false;
/**
 *
 * @returns
 */
var getDynamicExt = function () {
    return new Promise(function (resolve, reject) {
        resolve(sipExtension);
    });
};
function widgetConfigs(ccmUrl, widgetIdentifier, callback) {
    fetch("".concat(ccmUrl, "/widget-configs/").concat(widgetIdentifier))
        .then(function (response) { return response.json(); })
        .then(function (data) {
        callback(data);
        wssServerIp = data.webRtc.wssFs;
        uriServerIp = data.webRtc.uriFs;
        diallingURI = data.webRtc.diallingUri;
        sipExtension = data.webRtc.sipExtension;
        extensionPassword = data.webRtc.extensionPassword;
        enable_sip_logs = data.webRtc.enabledSipLogs;
        enableLogs = enable_sip_logs;
        IP = uriServerIp;
        dialerURI = "sip:" + diallingURI + "@" + uriServerIp;
        sipPassword = extensionPassword;
    });
}
exports.widgetConfigs = widgetConfigs;
function getPreChatForm(formUrl, formId, callback) {
    fetch("".concat(formUrl, "/forms/").concat(formId))
        .then(function (response) { return response.json(); })
        .then(function (data) {
        callback(data);
    });
}
exports.getPreChatForm = getPreChatForm;
function formValidation(formUrl, callback) {
    fetch("".concat(formUrl, "/formValidation"))
        .then(function (response) { return response.json(); })
        .then(function (data) {
        callback(data);
    });
}
exports.formValidation = formValidation;
function establishConnection(socket_url, serviceIdentifier, channelCustomerIdentifier, callback) {
    try {
        if (socket !== undefined && socket.connected) {
            console.log("Resuming Existing Connection");
            eventListeners(function (data) {
                callback(data);
            });
        }
        else {
            if (socket_url !== "") {
                console.log("Starting New Connection");
                var origin_1 = new URL(socket_url).origin;
                var path = new URL(socket_url).pathname;
                socket = (0, socket_io_client_1.io)(origin_1, {
                    path: path == "/" ? "" : path + "/socket.io",
                    auth: {
                        serviceIdentifier: serviceIdentifier,
                        channelCustomerIdentifier: channelCustomerIdentifier,
                    },
                });
                eventListeners(function (data) {
                    callback(data);
                });
            }
        }
    }
    catch (error) {
        callback(error);
    }
}
exports.establishConnection = establishConnection;
function eventListeners(callback) {
    socket === null || socket === void 0 ? void 0 : socket.on("connect", function () {
        if ((socket === null || socket === void 0 ? void 0 : socket.id) !== undefined) {
            console.log("you are connected with socket:", socket);
            var error = localStorage.getItem("widget-error");
            if (error) {
                callback({ type: "SOCKET_RECONNECTED", data: socket });
            }
            else {
                callback({ type: "SOCKET_CONNECTED", data: socket });
            }
        }
    });
    socket === null || socket === void 0 ? void 0 : socket.on("CHANNEL_SESSION_STARTED", function (data) {
        console.log("Channel Session Started Data: ", data);
        callback({ type: "CHANNEL_SESSION_STARTED", data: data });
    });
    socket === null || socket === void 0 ? void 0 : socket.on("MESSAGE_RECEIVED", function (message) {
        console.log("MESSAGE_RECEIVED received: ", message);
        callback({ type: "MESSAGE_RECEIVED", data: message });
    });
    socket === null || socket === void 0 ? void 0 : socket.on("disconnect", function (reason) {
        console.error("Connection lost with the server: ", reason);
        callback({ type: "SOCKET_DISCONNECTED", data: reason });
    });
    socket === null || socket === void 0 ? void 0 : socket.on("connect_error", function (error) {
        console.log("unable to establish connection with the server: ", error.message);
        localStorage.setItem("widget-error", "1");
        callback({ type: "CONNECT_ERROR", data: error });
    });
    socket === null || socket === void 0 ? void 0 : socket.on("CHAT_ENDED", function (data) {
        console.log("CHAT_ENDED received: ", data);
        callback({ type: "CHAT_ENDED", data: data });
        socket === null || socket === void 0 ? void 0 : socket.disconnect();
    });
    socket === null || socket === void 0 ? void 0 : socket.on("ERRORS", function (data) {
        console.error("ERRORS received: ", data);
        callback({ type: "ERRORS", data: data });
    });
}
exports.eventListeners = eventListeners;
function chatRequest(data) {
    try {
        if (data) {
            var additionalAttributesData = [];
            var webChannelDataObj = {
                key: "WebChannelData",
                type: "WebChannelData",
                value: {
                    browserDeviceInfo: data.data.browserDeviceInfo,
                    queue: data.data.queue,
                    locale: data.data.locale,
                    formData: data.data.formData,
                },
            };
            additionalAttributesData.push(webChannelDataObj);
            var obj = {
                channelCustomerIdentifier: data.data.channelCustomerIdentifier,
                serviceIdentifier: data.data.serviceIdentifier,
                additionalAttributes: additionalAttributesData,
            };
            if (socket) {
                socket.emit("CHAT_REQUESTED", obj);
                console.log("SEND CHAT_REQUESTED DATA:", obj);
            }
        }
    }
    catch (error) {
        throw error;
    }
}
exports.chatRequest = chatRequest;
function voiceRequest(data) {
    try {
        if (data) {
            var additionalAttributesData = [];
            var webChannelDataObj = {
                key: "WebChannelData",
                type: "WebChannelData",
                value: {
                    browserDeviceInfo: data.data.browserDeviceInfo,
                    queue: data.data.queue,
                    locale: data.data.locale,
                    formData: data.data.formData,
                },
            };
            additionalAttributesData.push(webChannelDataObj);
            var obj = {
                channelCustomerIdentifier: data.data.channelCustomerIdentifier,
                serviceIdentifier: data.data.serviceIdentifier,
                additionalAttributes: additionalAttributesData,
            };
            if (socket) {
                socket.emit("VOICE_REQUESTED", obj);
                console.log("SEND VOICE_REQUESTED DATA:", obj);
            }
        }
    }
    catch (error) {
        throw error;
    }
}
exports.voiceRequest = voiceRequest;
function sendMessage(data) {
    data.timestamp = "";
    if (socket) {
        socket.emit("MESSAGE_RECEIVED", data, function (res) {
            console.log("[sendMessage] ", res);
            if (res.code !== 200) {
                console.log("message not sent");
            }
        });
    }
}
exports.sendMessage = sendMessage;
function chatEnd(data) {
    // Chat Disconnection Socket Event
    if (socket) {
        socket.emit("CHAT_ENDED", data);
    }
}
exports.chatEnd = chatEnd;
/**
 *
 * @param {*} data
 */
function resumeChat(data, callback) {
    if (socket) {
        socket.emit("CHAT_RESUMED", data, function (res) {
            if (res) {
                console.log(res, "resume chat response in sdk.");
                callback(res);
            }
        });
    }
}
exports.resumeChat = resumeChat;
/**
 *
 * @param {*} data
 */
function sendJoinConversation(data) {
    socket === null || socket === void 0 ? void 0 : socket.emit("joinConversation", data, function (res) {
        console.log("[sendJoinConversation] ", data);
        return res;
    });
}
exports.sendJoinConversation = sendJoinConversation;
/**
 *
 * @param {*} customer
 */
// export function getInitChat(customer: any) {
//   console.log("[initChat] customer ", customer);
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(customer),
//   };
//   fetch(`${config?.ServerUrl}/api/customer/init`, requestOptions)
//     .then((response) => response.json())
//     .then((data) => {
//       // onInitChat(data);
//       isConversationActive = true;
//     })
//     .catch((error) => {
//       console.error(`[initChat] `, error);
//       // onInitChat({ error: error });
//     });
// }
/**
 * File Upload to File Engine Function
 * @param {*} formData
 * @param {*} callback
 */
function uploadToFileEngine(fileServerUrl, formData, callback) {
    fetch("".concat(fileServerUrl, "/api/uploadFileStream"), {
        method: "POST",
        body: formData,
    })
        .then(function (response) { return response.json(); })
        .then(function (result) {
        console.log("Success: ", result);
        callback(result);
    })
        .catch(function (error) {
        console.error("Error: ", error);
        callback(error);
    });
}
exports.uploadToFileEngine = uploadToFileEngine;
/**
 * Set Conversation Data Api
 */
function setConversationData(url, conversationId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(url, "/").concat(conversationId, "/conversation-data"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
exports.setConversationData = setConversationData;
/**
 * Set Conversation Data Api By Customer Channel Identifier
 */
function setConversationDataByCustomerIdentifier(url, channelIdentifier, data, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(url, "/").concat(channelIdentifier, "/conversation-data-by-identifier"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 403) {
                        console.error("Forbidden: The server returned a 403 Forbidden response.");
                        callback(response);
                    }
                    if (!response.ok) {
                        console.error("Network response was not ok");
                        callback(response);
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    console.log("Success:", result);
                    callback(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error:", error_1);
                    callback(error_1); // Re-throw the error for the caller to handle
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.setConversationDataByCustomerIdentifier = setConversationDataByCustomerIdentifier;
/**
 * Get Conversation Data Api By Customer Identifier
 */
function getConversationDataByCustomerIdentifier(url, channelIdentifier, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(url, "/get/").concat(channelIdentifier), {
                            method: "GET", // Specify the HTTP method as GET
                            headers: {
                                "Content-Type": "application/json", // Set appropriate headers if needed
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 403)) return [3 /*break*/, 2];
                    console.error("Forbidden: The server returned a 403 Forbidden response.");
                    callback(response);
                    return [3 /*break*/, 5];
                case 2:
                    if (!!response.ok) return [3 /*break*/, 3];
                    console.error("Failed to fetch data from ".concat(url, "/get/").concat(channelIdentifier, ": ").concat(response.status, " ").concat(response.statusText));
                    callback(response);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    callback(data);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error:", error_2);
                    callback(error_2); // Re-throw the error for the caller to handle
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.getConversationDataByCustomerIdentifier = getConversationDataByCustomerIdentifier;
/**
 * Get Conversation Data Api
 */
function getConversationData(url, conversationId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(url, "/").concat(conversationId, "/conversation-data"))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch data from ".concat(url, "/").concat(conversationId, "/conversation-data: ").concat(response.status, " ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getConversationData = getConversationData;
/**
 * Callback Request To ECM
 * @param {*} payload
 * @param {*} url
 */
function callbackRequest(url, payload, callback) {
    try {
        // Make an API Call
        fetch("".concat(url), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            // Handle the API response here
            console.log("API response:", data);
            callback(data);
        })
            .catch(function (error) {
            // Handle any errors that occur during the API call
            console.error("API Call Error", error);
            callback(error);
        });
    }
    catch (error) {
        console.error("API Function Error", error);
        callback(error);
    }
}
exports.callbackRequest = callbackRequest;
/**
 * Webhook Notifications Functions
 * @param {*} data
 */
function webhookNotifications(url, data) {
    var notifications = {
        text: undefined,
    };
    notifications["text"] = "".concat(data);
    fetch("".concat(url), {
        method: "POST",
        body: JSON.stringify(notifications),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })
        .then(function (response) { return response.json(); })
        .then(function (result) {
        console.log("Success: ", result);
    })
        .catch(function (error) {
        console.error("Error: ", error);
    });
}
exports.webhookNotifications = webhookNotifications;
/**
 *
 * @param {*} eventsCallback
 */
function dialCall(eventsCallback) {
    getDynamicExt()
        .then(function (extension) {
        ext = extension;
        console.log(wssServerIp, "ip at call time");
        userAgent = new SIP.UA({
            uri: extension + "@" + uriServerIp,
            transportOptions: { wsServers: wssServerIp, traceSip: true },
            authorizationUser: extension,
            password: extensionPassword,
            log: {
                builtinEnabled: enableLogs,
                level: 3,
            },
            register: true,
        });
        userAgent.start();
        if (typeof eventsCallback === "function") {
            var event_1 = {
                event: "get_dynamic_ext",
                response: extension,
                cause: "",
            };
            eventsCallback(event_1);
        }
        userAgent.on("unregistered", function (response, cause) {
            register = false;
            if (typeof eventsCallback === "function") {
                var event_2 = {
                    event: "unregistered",
                    response: response,
                    cause: cause,
                };
                eventsCallback(event_2);
            }
        });
        userAgent.on("registered", function () {
            register = true;
            if (typeof eventsCallback === "function") {
                var event_3 = {
                    event: "registered",
                    response: "",
                    cause: "",
                };
                eventsCallback(event_3);
            }
        });
        userAgent.on("registrationFailed", function (response, cause) {
            if (typeof eventsCallback === "function") {
                var event_4 = {
                    event: "registrationFailed",
                    response: response,
                    cause: cause,
                };
                eventsCallback(event_4);
            }
        });
    })
        .catch(function (rej) {
        if (typeof eventsCallback === "function") {
            var event_5 = {
                event: "get_dynamic_ext",
                response: "",
                cause: rej,
            };
            eventsCallback(event_5);
        }
    });
}
exports.dialCall = dialCall;
/**
 *
 * @param {*} mediaType
 * @param {*} videoName
 * @param {*} videoLocal
 * @param {*} userData
 * @param {*} eventsCallback
 * @returns
 */
var sendInvite = function (mediaType, videoName, videoLocal, userData, eventsCallback) {
    return new Promise(function (resolve, reject) {
        var mediaConstraints = { audio: true, video: true };
        toggleVideo = "web_cam";
        mediaElement = document.getElementById(videoName);
        if (videoLocal === "") {
            mediaLocal = "";
        }
        else {
            mediaLocal = document.getElementById(videoLocal);
        }
        audio = "true";
        if (mediaType === "audio") {
            mediaConstraints = { audio: true, video: false };
            video = "false";
        }
        else {
            mediaConstraints = { audio: true, video: true };
            video = "true";
        }
        screen = "false";
        console.log("invite function has been triggered");
        if (userData !== null) {
            var extraHeaderString = [];
            var index = 0;
            for (var key in userData) {
                if (typeof userData[key] === "string") {
                    var keyvalue = userData[key].trim();
                    extraHeaderString.push("X-variable" + index + ":" + key + "|" + keyvalue);
                    index++;
                }
                else {
                    console.warn("Value for key ".concat(key, " is not a string and will be skipped."));
                }
            }
        }
        session = userAgent.invite("sip:" + diallingURI + "@" + uriServerIp, {
            sessionDescriptionHandlerOptions: {
                constraints: mediaConstraints,
            },
            extraHeaders: extraHeaderString,
        });
        if (typeof eventsCallback === "function") {
            var event_6 = {
                event: "Channel Creating",
                response: "",
                cause: "",
            };
            eventsCallback(event_6);
        }
        session.on("accepted", function () {
            // Assumes you have a media element on the DOM
            var remoteStream = new MediaStream();
            if (video === "false") {
                console.log("closing video");
            }
            session.sessionDescriptionHandler.peerConnection
                .getReceivers()
                .forEach(function (receiver) {
                if (receiver.track) {
                    console.log(receiver.track);
                    remoteStream.addTrack(receiver.track);
                }
            });
            mediaElement.srcObject = remoteStream;
            if (mediaLocal !== "") {
                var localStream_1 = new MediaStream();
                session.sessionDescriptionHandler.peerConnection
                    .getSenders()
                    .forEach(function (sender) {
                    if (sender.track.kind === "video") {
                        console.log(sender.track);
                        localStream_1.addTrack(sender.track);
                    }
                });
                mediaLocal.srcObject = localStream_1;
            }
            if (typeof eventsCallback === "function") {
                var event_7 = {
                    event: "session-accepted",
                    response: "",
                    cause: "",
                };
                eventsCallback(event_7);
            }
        });
        session.on("progress", function (response) {
            if (typeof eventsCallback === "function") {
                var event_8 = {
                    event: "session-progress",
                    response: response,
                    cause: "",
                };
                eventsCallback(event_8);
            }
        });
        session.on("rejected", function (response, cause) {
            if (typeof eventsCallback === "function") {
                var event_9 = {
                    event: "session-rejected",
                    response: response,
                    cause: cause,
                };
                eventsCallback(event_9);
            }
        });
        session.on("failed", function (response, cause) {
            if (typeof eventsCallback === "function") {
                var event_10 = {
                    event: "session-failed",
                    response: response,
                    cause: cause,
                };
                eventsCallback(event_10);
            }
            var options = {
                all: true,
            };
            userAgent.unregister(options);
        });
        session.on("terminated", function (message, cause) {
            closeSession(eventsCallback);
            if (typeof eventsCallback === "function") {
                var event_11 = {
                    event: "session-terminated",
                    response: message,
                    cause: cause,
                };
                eventsCallback(event_11);
            }
        });
        session.on("bye", function (request) {
            if (typeof eventsCallback === "function") {
                var event_12 = {
                    event: "session-bye",
                    response: request,
                    cause: "",
                };
                eventsCallback(event_12);
            }
        });
        session.on("iceConnectionDisconnected", function () {
            if (typeof eventsCallback === "function") {
                var event_13 = {
                    event: "session-iceConnectionDisconnected",
                    response: "request",
                    cause: "",
                };
                eventsCallback(event_13);
            }
        });
        session.on("SessionDescriptionHandler-created", function () {
            session.sessionDescriptionHandler.on("getDescription", function (sdpWrapper) {
                if (typeof eventsCallback === "function") {
                    var event_14 = {
                        event: "session-SessionDescriptionHandler-getDescription",
                        response: sdpWrapper,
                        cause: "",
                    };
                    eventsCallback(event_14);
                }
            });
            session.sessionDescriptionHandler.on("Media acquire start", function () {
                mediaAcquire = "start";
                if (typeof eventsCallback === "function") {
                    var event_15 = {
                        event: "session-SessionDescriptionHandler-Media acquire start",
                        response: "",
                        cause: "",
                    };
                    eventsCallback(event_15);
                }
            });
            session.sessionDescriptionHandler.on("Media acquire end", function () {
                if (endCallBtn === true) {
                    terminateCurrentSession(function () {
                        eventsCallback();
                    });
                    endCallBtn = false;
                }
                mediaAcquire = "end";
                if (typeof eventsCallback === "function") {
                    var event_16 = {
                        event: "session-SessionDescriptionHandler-Media acquire end",
                        response: "",
                        cause: "",
                    };
                    eventsCallback(event_16);
                }
            });
            if (typeof eventsCallback === "function") {
                var event_17 = {
                    event: "session-SessionDescriptionHandler-created",
                    response: "",
                    cause: "",
                };
                eventsCallback(event_17);
            }
        });
        resolve("successful");
    });
};
exports.sendInvite = sendInvite;
/**
 * Close Video Function
 */
function closeVideo() {
    var pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().find(function (s) {
        if (s.track.readyState == "live" && s.track.kind === "video") {
            s.track.stop();
        }
    });
}
exports.closeVideo = closeVideo;
/**
 *
 * @param {*} eventsCallback
 */
/**
 *
 * @param {*} eventsCallback
 */
function terminateCurrentSession(eventsCallback) {
    promise1
        .then(function (value) {
        userAgent.stop();
    })
        .then(function () {
        return userAgent.transport.disconnect();
    })
        .then(function () {
        var options = {
            all: true,
        };
        return userAgent.unregister(options);
    })
        .then(function () {
        if (typeof eventsCallback === "function") {
            var event_18 = {
                event: "session-session_ended",
                response: "userAgent unregistered",
                cause: "",
            };
            eventsCallback(event_18);
        }
    })
        .catch(function (error) {
        if (typeof eventsCallback === "function") {
            var event_19 = {
                event: "session-termination-failed",
                response: "An error occurred during session termination",
                cause: error.message,
            };
            eventsCallback(event_19);
        }
    });
}
exports.terminateCurrentSession = terminateCurrentSession;
/**
 * Promise
 * @param {resolve , reject}
 */
var promise1 = new Promise(function (resolve, reject) {
    resolve("Success!");
});
/**
 *
 *
 * @param {*} eventsCallback
 */
function closeSession(eventsCallback) {
    if (mediaAcquire === "start") {
        endCallBtn = true;
        if (typeof eventsCallback === "function") {
            var event_20 = {
                event: "session-terminated",
                response: "Session terminated due to media acquire start",
                cause: "",
            };
            eventsCallback(event_20);
        }
    }
    else {
        terminateCurrentSession(eventsCallback);
    }
}
exports.closeSession = closeSession;
/**
 * Audio Call Control
 */
function audioControl() {
    var pc = session.sessionDescriptionHandler.peerConnection;
    if (audio === "true") {
        pc.getSenders().find(function (s) {
            console.log(s.track.kind + "--------------" + s.track.readyState);
            if (s.track.readyState == "live" && s.track.kind === "audio") {
                s.track.stop();
            }
        });
        audio = "false";
    }
    else {
        navigator.mediaDevices
            .getUserMedia({
            audio: true,
        })
            .then(function (stream) {
            var audioTrack = stream.getAudioTracks()[0];
            var sender = pc.getSenders().find(function (s) {
                return s.track.kind == audioTrack.kind;
            });
            console.log("found sender:", sender);
            sender.replaceTrack(audioTrack);
        })
            .catch(function (err) {
            console.error("Error happens:", err);
        });
        audio = "true";
    }
}
exports.audioControl = audioControl;
/**
 * Video Call Control
 */
function videoControl() {
    var pc = session.sessionDescriptionHandler.peerConnection;
    if (video === "true") {
        pc.getSenders().find(function (s) {
            console.log(s.track.kind + "--------------" + s.track.readyState);
            if (s.track.readyState == "live" && s.track.kind === "video") {
                s.track.stop();
            }
        });
        video = "false";
    }
    else {
        navigator.mediaDevices
            .getUserMedia({
            video: true,
        })
            .then(function (stream) {
            var videoTrack = stream.getVideoTracks()[0];
            var sender = pc.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            });
            console.log("found sender:", sender);
            sender.replaceTrack(videoTrack);
            mediaLocal.srcObject = stream;
            mediaLocal.play();
        })
            .catch(function (err) {
            console.error("Error happens:", err);
        });
        video = "true";
    }
}
exports.videoControl = videoControl;
/**
 * ScreenControl
 */
function screenControl() {
    if (screen === "false") {
        screen = "true";
    }
    else {
    }
}
window.dialCall = dialCall;
window.sendInvite = exports.sendInvite;
window.closeSession = closeSession;
window.videoControl = videoControl;
window.audioControl = audioControl;
window.screenControl = screenControl;
