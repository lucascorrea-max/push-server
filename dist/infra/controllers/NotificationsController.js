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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const web_push_1 = __importDefault(require("web-push"));
const repository_1 = require("../data/repository");
class NotificationController {
    constructor(http) {
        this.http = http;
        web_push_1.default.setVapidDetails('https://push-server-woad.vercel.app', process.env.VAPID_PUBLICKEY || "", process.env.VAPID_PRIVATEKEY || "");
        this.useNotificationsEndpoints(http);
    }
    useNotificationsEndpoints(http) {
        http.route("get", "/notification/push/publickey", (params, body) => __awaiter(this, void 0, void 0, function* () {
            console.log("/notification/push/publickey - called");
            return { publicKey: process.env.VAPID_PUBLICKEY };
        }));
        http.route("post", "/notification/push/subscribe", (params, body) => __awaiter(this, void 0, void 0, function* () {
            console.log("/notification/push/subscribe - called");
            console.log("New subscriber: " + body);
            if (!repository_1.db.data.subscribers.includes(body))
                repository_1.db.data.subscribers.push(body);
            return repository_1.db.data;
        }));
        http.route("get", "/notification/push/subscribers", (params, body) => __awaiter(this, void 0, void 0, function* () {
            console.log("/notification/push/subscribers - called");
            return repository_1.db.data.subscribers;
        }));
        http.route("post", "/notification/push/send", (params, body) => __awaiter(this, void 0, void 0, function* () {
            console.log("/notification/push/send - called");
            const notification = body;
            const notificationPayload = {
                icon: notification.icon || 'https://play-lh.googleusercontent.com/hVHBHdR3UmBijZUM_kWM72mFrJFbjzD3hZI3aaDj5n6pfm48V5jJ9kDIMS5_FT1-SQ',
                title: notification.title,
                body: notification.message,
                imageUrl: notification.imageUrl
            };
            let result = undefined;
            yield Promise.all(repository_1.db.data.subscribers.map(sub => web_push_1.default.sendNotification(sub, JSON.stringify(notificationPayload))))
                .then(() => result = { message: 'Notifications sended.' })
                .catch(err => {
                result = "Error sending notification, reason: ", err;
            });
            return result;
        }));
    }
}
exports.NotificationController = NotificationController;
