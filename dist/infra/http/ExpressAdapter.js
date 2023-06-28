import express from "express";
export class ExpressAdapter {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            next();
        });
    }
    route(method, url, callback) {
        this.app[method](url, async (req, res) => {
            const output = await callback(req.params, req.body);
            res.json(output);
        });
    }
    listen(port) {
        this.app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));
    }
}
