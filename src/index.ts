import { io, Socket } from "socket.io-client";
const SIP = require("sip.js");

let socket: Socket | undefined;
let wssServerIp: string;
let uriServerIp: string;
let diallingURI: string;
let sipExtension: string;
let extensionPassword: string;
let enable_sip_logs: boolean;
let enableLogs: boolean;
let wssPort: any;
let IP: string;
let dialerURI: string;
let sipPassword: string;
let ext: any;
let session: any;
let mediaElement: any;
let mediaLocal: any;
let userAgent: any;
let ex: any;
let register = false;
let displayMediaStrea: any;
let toggleVideo: any;
let video: any;
var audio: any;
let screen: any;
let mediaAcquire = "end";
let endCallBtn = false;

let isConversationActive: boolean = false;

/**
 *
 * @returns
 */
const getDynamicExt = () =>
  new Promise((resolve, reject) => {
    resolve(sipExtension);
  });

export function widgetConfigs(
  ccmUrl: string,
  widgetIdentifier: string,
  callback: (data: any) => void
) {
  fetch(`${ccmUrl}/widget-configs/${widgetIdentifier}`)
    .then((response) => response.json())
    .then((data) => {
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

export function getPreChatForm(
  formUrl: string,
  formId: string,
  callback: (data: any) => void
) {
  fetch(`${formUrl}/forms/${formId}`)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function formValidation(formUrl: string, callback: (data: any) => void) {
  fetch(`${formUrl}/formValidation`)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

export function establishConnection(
  socket_url: string,
  serviceIdentifier: string,
  channelCustomerIdentifier: string,
  callback: (data: any) => void
) {
  try {
    if (socket !== undefined && socket.connected) {
      console.log("Resuming Existing Connection");
      eventListeners((data) => {
        callback(data);
      });
    } else {
      if (socket_url !== "") {
        console.log("Starting New Connection");
        const origin = new URL(socket_url).origin;
        const path = new URL(socket_url).pathname;
        socket = io(origin, {
          path: path == "/" ? "" : path + "/socket.io",
          auth: {
            serviceIdentifier: serviceIdentifier,
            channelCustomerIdentifier: channelCustomerIdentifier,
          },
        });
        eventListeners((data) => {
          callback(data);
        });
      }
    }
  } catch (error) {
    callback(error);
  }
}

export function eventListeners(callback: (data: any) => void) {
  socket?.on("connect", () => {
    if (socket?.id !== undefined) {
      console.log(`you are connected with socket:`, socket);
      const error = localStorage.getItem("widget-error");
      if (error) {
        callback({ type: "SOCKET_RECONNECTED", data: socket });
      } else {
        callback({ type: "SOCKET_CONNECTED", data: socket });
      }
    }
  });

  socket?.on("CHANNEL_SESSION_STARTED", (data) => {
    console.log(`Channel Session Started Data: `, data);
    callback({ type: "CHANNEL_SESSION_STARTED", data: data });
  });

  socket?.on("MESSAGE_RECEIVED", (message) => {
    console.log(`MESSAGE_RECEIVED received: `, message);
    callback({ type: "MESSAGE_RECEIVED", data: message });
  });

  socket?.on("disconnect", (reason) => {
    console.error(`Connection lost with the server: `, reason);
    callback({ type: "SOCKET_DISCONNECTED", data: reason });
  });

  socket?.on("connect_error", (error) => {
    console.log(
      `unable to establish connection with the server: `,
      error.message
    );
    localStorage.setItem("widget-error", "1");
    callback({ type: "CONNECT_ERROR", data: error });
  });

  socket?.on("CHAT_ENDED", (data) => {
    console.log(`CHAT_ENDED received: `, data);
    callback({ type: "CHAT_ENDED", data: data });
    socket?.disconnect();
  });

  socket?.on("ERRORS", (data) => {
    console.error(`ERRORS received: `, data);
    callback({ type: "ERRORS", data: data });
  });
}

interface WebChannelData {
  browserDeviceInfo: any;
  queue: any;
  locale: any;
  formData: any;
}

interface AdditionalAttributesData {
  key: string;
  type: string;
  value: WebChannelData;
}

interface ChatRequestData {
  channelCustomerIdentifier: string;
  serviceIdentifier: string;
  additionalAttributes: AdditionalAttributesData[];
}
export function chatRequest(data: any) {
  try {
    if (data) {
      const additionalAttributesData: AdditionalAttributesData[] = [];
      const webChannelDataObj: AdditionalAttributesData = {
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

      const obj: ChatRequestData = {
        channelCustomerIdentifier: data.data.channelCustomerIdentifier,
        serviceIdentifier: data.data.serviceIdentifier,
        additionalAttributes: additionalAttributesData,
      };

      if (socket) {
        socket.emit("CHAT_REQUESTED", obj);
        console.log(`SEND CHAT_REQUESTED DATA:`, obj);
      }
    }
  } catch (error) {
    throw error;
  }
}

export function voiceRequest(data: any) {
  try {
    if (data) {
      const additionalAttributesData: AdditionalAttributesData[] = [];
      const webChannelDataObj: AdditionalAttributesData = {
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

      const obj: ChatRequestData = {
        channelCustomerIdentifier: data.data.channelCustomerIdentifier,
        serviceIdentifier: data.data.serviceIdentifier,
        additionalAttributes: additionalAttributesData,
      };

      if (socket) {
        socket.emit("VOICE_REQUESTED", obj);
        console.log(`SEND VOICE_REQUESTED DATA:`, obj);
      }
    }
  } catch (error) {
    throw error;
  }
}

export function sendMessage(data: any) {
  data.timestamp = "";
  if (socket) {
    socket.emit("MESSAGE_RECEIVED", data, (res: any) => {
      console.log("[sendMessage] ", res);
      if (res.code !== 200) {
        console.log("message not sent");
      }
    });
  }
}

export function chatEnd(data: any) {
  // Chat Disconnection Socket Event
  if (socket) {
    socket.emit("CHAT_ENDED", data);
  }
}

/**
 *
 * @param {*} data
 */
export function resumeChat(data: any, callback: (res: any) => void) {
  if (socket) {
    socket.emit("CHAT_RESUMED", data, (res: any) => {
      if (res) {
        console.log(res, "resume chat response in sdk.");
        callback(res);
      }
    });
  }
}

/**
 *
 * @param {*} data
 */
export function sendJoinConversation(data: any) {
  socket?.emit("joinConversation", data, (res: any) => {
    console.log("[sendJoinConversation] ", data);
    return res;
  });
}
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
export function uploadToFileEngine(
  fileServerUrl: string,
  formData: any,
  callback: any
) {
  fetch(`${fileServerUrl}/api/uploadFileStream`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success: ", result);
      callback(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      callback(error);
    });
}
/**
 * Set Conversation Data Api
 */
export async function setConversationData(
  url: string,
  conversationId: string,
  data: any
) {
  const response = await fetch(`${url}/${conversationId}/conversation-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}
/**
 * Set Conversation Data Api By Customer Channel Identifier
 */
export async function setConversationDataByCustomerIdentifier(
  url: string,
  channelIdentifier: string,
  data: any,
  callback: any
) {
  try {
    const response = await fetch(
      `${url}/${channelIdentifier}/conversation-data-by-identifier`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 403) {
      console.error("Forbidden: The server returned a 403 Forbidden response.");
      callback(response);
    }

    if (!response.ok) {
      console.error("Network response was not ok");
      callback(response);
    }

    const result = await response.json();
    console.log("Success:", result);
    callback(result);
  } catch (error) {
    console.error("Error:", error);
    callback(error); // Re-throw the error for the caller to handle
  }
}

/**
 * Get Conversation Data Api By Customer Identifier
 */
export async function getConversationDataByCustomerIdentifier(
  url: string,
  channelIdentifier: string,
  callback: any
) {
  try {
    const response = await fetch(`${url}/get/${channelIdentifier}`, {
      method: "GET", // Specify the HTTP method as GET
      headers: {
        "Content-Type": "application/json", // Set appropriate headers if needed
      },
    });

    if (response.status === 403) {
      console.error("Forbidden: The server returned a 403 Forbidden response.");
      callback(response);
    } else if (!response.ok) {
      console.error(
        `Failed to fetch data from ${url}/get/${channelIdentifier}: ${response.status} ${response.statusText}`
      );
      callback(response);
    } else {
      const data = await response.json();
      callback(data);
    }
  } catch (error) {
    console.error("Error:", error);
    callback(error); // Re-throw the error for the caller to handle
  }
}

/**
 * Get Conversation Data Api
 */
export async function getConversationData(url: string, conversationId: string) {
  const response = await fetch(`${url}/${conversationId}/conversation-data`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${url}/${conversationId}/conversation-data: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
}

/**
 * Callback Request To ECM
 * @param {*} payload
 * @param {*} url
 */
export function callbackRequest(url: string, payload: any, callback: any) {
  try {
    // Make an API Call
    fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response here
        console.log("API response:", data);
        callback(data);
      })
      .catch((error) => {
        // Handle any errors that occur during the API call
        console.error("API Call Error", error);
        callback(error);
      });
  } catch (error) {
    console.error("API Function Error", error);
    callback(error);
  }
}

/**
 * Webhook Notifications Functions
 * @param {*} data
 */
export function webhookNotifications(url: string, data: any) {
  let notifications: {
    text: any;
  } = {
    text: undefined,
  };
  notifications["text"] = `${data}`;
  fetch(`${url}`, {
    method: "POST",
    body: JSON.stringify(notifications),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success: ", result);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}
/**
 *
 * @param {*} eventsCallback
 */

export function dialCall(eventsCallback: any) {
  getDynamicExt()
    .then((extension: any) => {
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
        let event = {
          event: "get_dynamic_ext",
          response: extension,
          cause: "",
        };
        eventsCallback(event);
      }

      userAgent.on("unregistered", function (response: any, cause: any) {
        register = false;
        if (typeof eventsCallback === "function") {
          let event = {
            event: "unregistered",
            response: response,
            cause: cause,
          };
          eventsCallback(event);
        }
      });

      userAgent.on("registered", function () {
        register = true;
        if (typeof eventsCallback === "function") {
          let event = {
            event: "registered",
            response: "",
            cause: "",
          };
          eventsCallback(event);
        }
      });

      userAgent.on("registrationFailed", function (response: any, cause: any) {
        if (typeof eventsCallback === "function") {
          let event = {
            event: "registrationFailed",
            response: response,
            cause: cause,
          };
          eventsCallback(event);
        }
      });
    })
    .catch((rej: any) => {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "get_dynamic_ext",
          response: "",
          cause: rej,
        };
        eventsCallback(event);
      }
    });
}
/**
 *
 * @param {*} mediaType
 * @param {*} videoName
 * @param {*} videoLocal
 * @param {*} userData
 * @param {*} eventsCallback
 * @returns
 */
export const sendInvite = (
  mediaType: any,
  videoName: any,
  videoLocal: any,
  userData: any,
  eventsCallback: any
) => {
  return new Promise((resolve, reject) => {
    let mediaConstraints = { audio: true, video: true };
    toggleVideo = "web_cam";
    mediaElement = document.getElementById(videoName);
    if (videoLocal === "") {
      mediaLocal = "";
    } else {
      mediaLocal = document.getElementById(videoLocal);
    }
    audio = "true";
    if (mediaType === "audio") {
      mediaConstraints = { audio: true, video: false };
      video = "false";
    } else {
      mediaConstraints = { audio: true, video: true };
      video = "true";
    }
    screen = "false";

    console.log("invite function has been triggered");
    if (userData !== null) {
      var extraHeaderString = [];
      var index = 0;
      for (const key in userData) {
        if (typeof userData[key] === "string") {
          var keyvalue = userData[key].trim();
          extraHeaderString.push(
            "X-variable" + index + ":" + key + "|" + keyvalue
          );
          index++;
        } else {
          console.warn(
            `Value for key ${key} is not a string and will be skipped.`
          );
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
      let event = {
        event: "Channel Creating",
        response: "",
        cause: "",
      };
      eventsCallback(event);
    }
    session.on("accepted", function () {
      // Assumes you have a media element on the DOM
      const remoteStream = new MediaStream();
      if (video === "false") {
        console.log("closing video");
      }
      session.sessionDescriptionHandler.peerConnection
        .getReceivers()
        .forEach((receiver: any) => {
          if (receiver.track) {
            console.log(receiver.track);
            remoteStream.addTrack(receiver.track);
          }
        });
      mediaElement.srcObject = remoteStream;
      if (mediaLocal !== "") {
        const localStream = new MediaStream();
        session.sessionDescriptionHandler.peerConnection
          .getSenders()
          .forEach((sender: any) => {
            if (sender.track.kind === "video") {
              console.log(sender.track);
              localStream.addTrack(sender.track);
            }
          });
        mediaLocal.srcObject = localStream;
      }
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-accepted",
          response: "",
          cause: "",
        };
        eventsCallback(event);
      }
    });
    session.on("progress", function (response: any) {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-progress",
          response: response,
          cause: "",
        };
        eventsCallback(event);
      }
    });
    session.on("rejected", function (response: any, cause: any) {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-rejected",
          response: response,
          cause: cause,
        };
        eventsCallback(event);
      }
    });

    session.on("failed", function (response: any, cause: any) {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-failed",
          response: response,
          cause: cause,
        };
        eventsCallback(event);
      }
      var options = {
        all: true,
      };

      userAgent.unregister(options);
    });
    session.on("terminated", function (message: any, cause: any) {
      closeSession(eventsCallback);
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-terminated",
          response: message,
          cause: cause,
        };
        eventsCallback(event);
      }
    });
    session.on("bye", function (request: any) {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-bye",
          response: request,
          cause: "",
        };
        eventsCallback(event);
      }
    });
    session.on("iceConnectionDisconnected", function () {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-iceConnectionDisconnected",
          response: "request",
          cause: "",
        };
        eventsCallback(event);
      }
    });
    session.on("SessionDescriptionHandler-created", function () {
      session.sessionDescriptionHandler.on(
        "getDescription",
        function (sdpWrapper: any) {
          if (typeof eventsCallback === "function") {
            let event = {
              event: "session-SessionDescriptionHandler-getDescription",
              response: sdpWrapper,
              cause: "",
            };
            eventsCallback(event);
          }
        }
      );
      session.sessionDescriptionHandler.on("Media acquire start", function () {
        mediaAcquire = "start";
        if (typeof eventsCallback === "function") {
          let event = {
            event: "session-SessionDescriptionHandler-Media acquire start",
            response: "",
            cause: "",
          };
          eventsCallback(event);
        }
      });
      session.sessionDescriptionHandler.on("Media acquire end", function () {
        if (endCallBtn === true) {
          terminateCurrentSession(() => {
            eventsCallback();
          });
          endCallBtn = false;
        }
        mediaAcquire = "end";
        if (typeof eventsCallback === "function") {
          let event = {
            event: "session-SessionDescriptionHandler-Media acquire end",
            response: "",
            cause: "",
          };
          eventsCallback(event);
        }
      });
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-SessionDescriptionHandler-created",
          response: "",
          cause: "",
        };
        eventsCallback(event);
      }
    });
    resolve("successful");
  });
};
/**
 * Close Video Function
 */
export function closeVideo() {
  let pc = session.sessionDescriptionHandler.peerConnection;
  pc.getSenders().find(function (s: any) {
    if (s.track.readyState == "live" && s.track.kind === "video") {
      s.track.stop();
    }
  });
}
/**
 *
 * @param {*} eventsCallback
 */
/**
 *
 * @param {*} eventsCallback
 */
export function terminateCurrentSession(eventsCallback: any) {
  promise1
    .then((value) => {
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
        let event = {
          event: "session-session_ended",
          response: "userAgent unregistered",
          cause: "",
        };
        eventsCallback(event);
      }
    })
    .catch(function (error) {
      if (typeof eventsCallback === "function") {
        let event = {
          event: "session-termination-failed",
          response: "An error occurred during session termination",
          cause: error.message,
        };
        eventsCallback(event);
      }
    });
}
/**
 * Promise
 * @param {resolve , reject}
 */
const promise1 = new Promise((resolve, reject) => {
  resolve("Success!");
});
/**
 *
 *
 * @param {*} eventsCallback
 */
export function closeSession(eventsCallback: any) {
  if (mediaAcquire === "start") {
    endCallBtn = true;
    if (typeof eventsCallback === "function") {
      let event = {
        event: "session-terminated",
        response: "Session terminated due to media acquire start",
        cause: "",
      };
      eventsCallback(event);
    }
  } else {
    terminateCurrentSession(eventsCallback);
  }
}
/**
 * Audio Call Control
 */
export function audioControl() {
  let pc = session.sessionDescriptionHandler.peerConnection;
  if (audio === "true") {
    pc.getSenders().find(function (s: any) {
      console.log(s.track.kind + "--------------" + s.track.readyState);
      if (s.track.readyState == "live" && s.track.kind === "audio") {
        s.track.stop();
      }
    });

    audio = "false";
  } else {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (stream) {
        let audioTrack = stream.getAudioTracks()[0];
        var sender = pc.getSenders().find(function (s: any) {
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
/**
 * Video Call Control
 */
export function videoControl() {
  let pc = session.sessionDescriptionHandler.peerConnection;
  if (video === "true") {
    pc.getSenders().find(function (s: any) {
      console.log(s.track.kind + "--------------" + s.track.readyState);
      if (s.track.readyState == "live" && s.track.kind === "video") {
        s.track.stop();
      }
    });
    video = "false";
  } else {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(function (stream) {
        let videoTrack = stream.getVideoTracks()[0];
        var sender = pc.getSenders().find(function (s: any) {
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
/**
 * ScreenControl
 */
function screenControl() {
  if (screen === "false") {
    screen = "true";
  } else {
  }
}

interface WindowWithFunctions extends Window {
  dialCall: Function;
  sendInvite: Function;
  closeSession: Function;
  videoControl: Function;
  audioControl: Function;
  screenControl: Function;
}

declare let window: WindowWithFunctions;

window.dialCall = dialCall;
window.sendInvite = sendInvite;
window.closeSession = closeSession;
window.videoControl = videoControl;
window.audioControl = audioControl;
window.screenControl = screenControl;
