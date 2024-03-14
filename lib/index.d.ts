export declare function widgetConfigs(ccmUrl: string, widgetIdentifier: string, callback: (data: any) => void): void;
export declare function getPreChatForm(formUrl: string, formId: string, callback: (data: any) => void): void;
export declare function formValidation(formUrl: string, callback: (data: any) => void): void;
export declare function establishConnection(socket_url: string, serviceIdentifier: string, channelCustomerIdentifier: string, callback: (data: any) => void): void;
export declare function eventListeners(callback: (data: any) => void): void;
export declare function chatRequest(data: any): void;
export declare function voiceRequest(data: any): void;
export declare function sendMessage(data: any): void;
export declare function chatEnd(data: any): void;
/**
 *
 * @param {*} data
 */
export declare function resumeChat(data: any, callback: (res: any) => void): void;
/**
 *
 * @param {*} data
 */
export declare function sendJoinConversation(data: any): void;
/**
 *
 * @param {*} customer
 */
/**
 * File Upload to File Engine Function
 * @param {*} formData
 * @param {*} callback
 */
export declare function uploadToFileEngine(fileServerUrl: string, formData: any, callback: any): void;
/**
 * Set Conversation Data Api
 */
export declare function setConversationData(url: string, conversationId: string, data: any): Promise<Response>;
/**
 * Set Conversation Data Api By Customer Channel Identifier
 */
export declare function setConversationDataByCustomerIdentifier(url: string, channelIdentifier: string, data: any, callback: any): Promise<void>;
/**
 * Get Conversation Data Api By Customer Identifier
 */
export declare function getConversationDataByCustomerIdentifier(url: string, channelIdentifier: string, callback: any): Promise<void>;
/**
 * Get Conversation Data Api
 */
export declare function getConversationData(url: string, conversationId: string): Promise<any>;
/**
 * Callback Request To ECM
 * @param {*} payload
 * @param {*} url
 */
export declare function callbackRequest(url: string, payload: any, callback: any): void;
/**
 * Webhook Notifications Functions
 * @param {*} data
 */
export declare function webhookNotifications(url: string, data: any): void;
/**
 *
 * @param {*} eventsCallback
 */
export declare function dialCall(eventsCallback: any): void;
/**
 *
 * @param {*} mediaType
 * @param {*} videoName
 * @param {*} videoLocal
 * @param {*} userData
 * @param {*} eventsCallback
 * @returns
 */
export declare const sendInvite: (mediaType: any, videoName: any, videoLocal: any, userData: any, eventsCallback: any) => Promise<unknown>;
/**
 * Close Video Function
 */
export declare function closeVideo(): void;
/**
 *
 * @param {*} eventsCallback
 */
/**
 *
 * @param {*} eventsCallback
 */
export declare function terminateCurrentSession(eventsCallback: any): void;
/**
 *
 *
 * @param {*} eventsCallback
 */
export declare function closeSession(eventsCallback: any): void;
/**
 * Audio Call Control
 */
export declare function audioControl(): void;
/**
 * Video Call Control
 */
export declare function videoControl(): void;
/**
 * ScreenControl
 */
export declare function screenControl(): void;
/**
 * Webhook Notifications Functions
 * @param {*} data
 */
export declare function authenticateRequest(authenticatorUrl: string, authData: any, callback: any): void;
export declare function postMessages(obj: any, callback: () => void): void;
export declare function getBrowserInfo(apiKey: any, callback: any): void;
