import WebPush from "web-push";
import { INotification } from "../../models/INotification";
import { db } from "../data/repository";
import { Http } from "../http/Http";

export class NotificationController {

    constructor(
        private readonly http: Http
    ) {
        WebPush.setVapidDetails(
            'mailto:lucasdemoraesc@gmail.com',
            process.env.VAPID_PUBLICKEY || "",
            process.env.VAPID_PRIVATEKEY || ""
        );
        this.useNotificationsEndpoints(http);
    }

    private useNotificationsEndpoints(http: Http) {

        http.route("get", "/notification/push/publickey", async (params: any, body: any) => {
            console.log("/notification/push/publickey - called");
            return { publicKey: process.env.VAPID_PUBLICKEY };
        });

        http.route("post", "/notification/push/subscribe", async (params: any, body: any) => {
            console.log("/notification/push/subscribe - called");
            console.log("New subscriber: " + body);
            if (!db.data.subscribers.includes(body))
                db.data.subscribers.push(body);
            return db.data;
        });

        http.route("get", "/notification/push/subscribers", async (params: any, body: any) => {
            console.log("/notification/push/subscribers - called");
            return db.data.subscribers;
        });

        http.route("post", "/notification/push/send", async (params: any, body: any) => {
            console.log("/notification/push/send - called");
            const notification = body as INotification;
            const notificationPayload = {
                icon: notification.icon || 'https://play-lh.googleusercontent.com/hVHBHdR3UmBijZUM_kWM72mFrJFbjzD3hZI3aaDj5n6pfm48V5jJ9kDIMS5_FT1-SQ',
                title: notification.title,
                body: notification.message,
                imageUrl: notification.imageUrl
            };

            let result = undefined;
            await Promise.all(db.data.subscribers.map(sub => WebPush.sendNotification(
                sub, JSON.stringify(notificationPayload))))
                .then(() => result = { message: 'Notifications sended.' })
                .catch(err => {
                    result = "Error sending notification, reason: ", err;
                });

            return result;
        });
    }
}
