import express, { Request, Response } from "express";
import { Http, HttpMethod } from "./Http.js";

export class ExpressAdapter implements Http {

    readonly app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use((req: Request, res: Response, next: any) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            next();
        });

    }

    route(method: HttpMethod, url: string, callback: Function): void {
        this.app[method](url, async (req: Request, res: Response) => {
            const output = await callback(req.params, req.body);
            res.json(output);
        });
    }

    listen(port: number): void {
        this.app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));
    }
}
