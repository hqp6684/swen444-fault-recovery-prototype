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
            // console.log('send signal');

            let body: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
            console.log(JSON.stringify(body));



            let options: request.CoreOptions = {
                body: JSON.stringify(body)
            }
            // request.post(`http://localhost:${this.parentPort}`, options, (res) => {
            //     console.log(res);
            // });
            request.post(`http://localhost:${this.parentPort}`, { form: body }, (res) => {
                console.log(res);
            });
        }, sendInternal)
    }



    private setListeners() {

        this.app.get('/isPrimary', (req, res) => {
            console.log('iam not the primary');
            this.isPrimary = true;
            res.send('got it');
        });

        this.app.get('/isAlive', (req, res) => {
            // this.isPrimary = true;
            let body: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
            res.json(body);
        })
    }


    public criticalFunction() {
        setInterval(() => {
            if (!this.isPrimary) return;


            let myNumber = Math.floor((Math.random() * 15));
            // let myNumber = 0;

            while (this.doMath(myNumber)) {
                // myNumber = (Math.random() * 30);
                this.doMath(myNumber)
            }



        }, 1000)


    }

    private doMath(num: number) {

        setInterval(() => {
            num = num - 2;

            let result = Math.sqrt(num);
            console.log('alive');
            if (isNaN(result)) {
                console.log('err');
                throw Error('Cannot divide by NaN')
            }
            if (num === 0) {
                return true;
            } else {
                this.doMath(num);
            }
            return true;

        }, 1000)
    }





}