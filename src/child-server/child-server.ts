import { HeartBeatMessage } from '../heartbeat/heartbeat-message';
import { HeartbeatReceiver } from '../heartbeat/heartbeat-receiver';
import { HeartbeatSender } from '../heartbeat/heartbeat-sender';
import * as expressLib from 'express';
import { Express, Response, Request } from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';


export class ChildServer implements HeartbeatSender {


    // http server
    private app: Express;

    private port: number;
    private isPrimary: boolean = false;
    private parentPort: number;


    constructor(port: number, parentPort: number) {
        this.port = port;
        // this.isPrimary = isPrimary;
        this.parentPort = parentPort;

        this.app = expressLib();
        // bodyParser is used to read body of HTTP request
        this.app.use(bodyParser.urlencoded());


        this.send(2222);
        this.setListeners();
        // start server
        this.app.listen(this.port);

        this.criticalFunction();

    }


    /**
     * Start server 
     */
    private runServer(): void {
    }



    private processHeartBeatSignal(req: Request, res: Response) {

    }

    isAlive(hbReceiverUrl: string): boolean {
        throw new Error('Method not implemented.');
    }
    send(sendInternal: number): void {
        // throw new Error('Method not implemented.');a
        setInterval(() => {
            console.log('send signal');

            let body: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
            let options: request.CoreOptions = {
                body: JSON.stringify(body)
            }
            request.post(`http://localhost:${this.parentPort}`, options, (res) => { });
        }, sendInternal)
    }



    private setListeners() {

        this.app.put('/isPrimary', (req, res) => {
            this.isPrimary = true;
        });

        this.app.get('/isAlive', (req, res) => {
            // this.isPrimary = true;
            let body: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
            res.json(body);
        })
    }


    public criticalFunction() {
        let myNumber = (Math.random() * 30);
        setInterval(() => {
            myNumber = myNumber - 1;
            if (myNumber < 0) {
                console.log('Crashing!!!');
                throw Error('ahhhhh')
            }
        }, 1000)


    }





}