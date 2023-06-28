import * as dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { NotificationController } from "./infra/controllers/NotificationsController.js";
import { ExpressAdapter } from "./infra/http/ExpressAdapter.js";
dotenv.config({
    path: `${dirname(fileURLToPath(import.meta.url))}\\.env`
});
const http = new ExpressAdapter();
new NotificationController(http);
http.listen(9000);
