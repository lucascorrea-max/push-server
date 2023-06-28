export interface INotification {
    notification: {
        badge: string,
        body: string,
        data: any,
        dir: "auto" | "ltr" | "rtl",
        icon: string,
        image: string,
        lang: string,
        renotify: boolean,
        requireInteraction: boolean,
        silent: boolean,
        tag: string,
        timestamp: Date,
        title: string,
        vibrate: number[];
    };
}
