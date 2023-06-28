import WebPush from "web-push";
import { INotification } from "../../models/INotification.js";
import db from "../data/repository.js";
import { Http } from "../http/Http.js";

export class NotificationController {

    constructor(
        private readonly http: Http
    ) {
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
            db.data.subscribers.push(body);
            await db.write();
            return db.data;
        });

        http.route("post", "/notification/push/send", async (params: any, body: any) => {
            console.log("/notification/push/send - called");
            const notification = body as INotification;

            db.data.subscribers.forEach(subscription => {
                WebPush.sendNotification(
                    subscription,
                    JSON.stringify({
                        icon: notification.icon || 'https://play-lh.googleusercontent.com/hVHBHdR3UmBijZUM_kWM72mFrJFbjzD3hZI3aaDj5n6pfm48V5jJ9kDIMS5_FT1-SQ',
                        title: notification.title,
                        body: notification.message,
                        imageUrl: notification.imageUrl
                    }),
                );
            });

            return "Ok";
        });
    }
}