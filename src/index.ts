import * as dotenv from "dotenv";
import { NotificationController } from "./infra/controllers/NotificationsController";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";

dotenv.config({
    path: `${__dirname}\\.env`
});

const http = new ExpressAdapter();

new NotificationController(http);

http.listen(9000);
