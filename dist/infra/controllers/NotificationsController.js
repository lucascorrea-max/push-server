import WebPush from "web-push";
import db from "../data/repository.js";
export class NotificationController {
    constructor(http) {
        this.http = http;
        WebPush.setVapidDetails('mailto:lucasdemoraesc@gmail.com', process.env.VAPID_PUBLICKEY || "", process.env.VAPID_PRIVATEKEY || "");
        this.useNotificationsEndpoints(http);
    }
    useNotificationsEndpoints(http) {
        http.route("get", "/notification/push/publickey", async (params, body) => {
            console.log("/notification/push/publickey - called");
            return { publicKey: process.env.VAPID_PUBLICKEY };
        });
        http.route("post", "/notification/push/subscribe", async (params, body) => {
            console.log("/notification/push/subscribe - called");
            console.log("New subscriber: " + body);
            if (!db.data.subscribers.includes(body))
                db.data.subscribers.push(body);
            await db.write();
            return db.data;
        });
        http.route("get", "/notification/push/subscribers", async (params, body) => {
            console.log("/notification/push/subscribers - called");
            return db.data.subscribers;
        });
        http.route("post", "/notification/push/send", async (params, body) => {
            console.log("/notification/push/send - called");
            const notification = body;
            db.data.subscribers.forEach(subscription => {
                WebPush.sendNotification(subscription, JSON.stringify({
                    icon: notification.icon || 'https://play-lh.googleusercontent.com/hVHBHdR3UmBijZUM_kWM72mFrJFbjzD3hZI3aaDj5n6pfm48V5jJ9kDIMS5_FT1-SQ',
                    title: notification.title,
                    body: notification.message,
                    imageUrl: notification.imageUrl
                }));
            });
            return "Ok";
        });
    }
}
