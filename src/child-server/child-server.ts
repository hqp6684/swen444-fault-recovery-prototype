import { HeartBeatMessage } from '../heartbeat/heartbeat-message';
import { HeartbeatReceiver } from '../heartbeat/heartbeat-receiver';
import { HeartbeatSender } from '../heartbeat/heartbeat-sender';
import * as expressLib from 'express';
import { Express, Response, Request } from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';
import { Observable } from 'rxjs';
import 'rxjs'


export class ChildServer implements HeartbeatSender {


    // http server
    private app: Express;

    private port: number;
    private isPrimary: boolean = false;
    private parentPort: number;
    // 1000 = 1sec
    private heartbeatInterval = 7000;

    private criticalFunction: Observable<any>;
    private isRunning = false;


    constructor(port: number, parentPort: number) {
        this.port = port;
        // this.isPrimary = isPrimary;
        this.parentPort = parentPort;

        this.app = expressLib();
        // bodyParser is used to read body of HTTP request
        this.app.use(bodyParser.urlencoded());

        this.setCriticalFunction()

        // start sending signal
        this.send(this.heartbeatInterval);

        this.setEndPoints();
        // start server
        this.app.listen(this.port);

    }


    /**
     * Start server 
     */
    private runServer(): void {
    }



    private processHeartBeatSignal(req: Request, res: Response) {

    }

    isAlive(): boolean {
        // check condition here
        return true;
    }

    /**
     * Send a signal to heartbeat receiver every @sendInternal
     */
    send(interval: number): void {

        setInterval(() => {
            let body: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
            request.post(`http://localhost:${this.parentPort}`, { form: body }, (err, res: request.RequestResponse, body) => {
                // console.log(res.body);
            });
        }, interval)
    }



    private setEndPoints() {

        this.app.get('/isPrimary', (req, res) => {
            this.isPrimary = true;
            let responseMessage: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
            res.json(responseMessage);
            console.log('');

            console.log(`PID : ${process.pid} is now the primary`);
            console.log('');
            console.log('Activating critical function');
            this.isRunning = true;

            this.criticalFunction.subscribe(value => {
                console.log('Critical function completed')
            })
        });



        this.app.get('/isAlive', (req, res) => {
            if (this.isAlive()) {
                let responseMessage: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true };
                res.json(responseMessage);
            } else {
                res.sendStatus(500);
            }

        })
        this.app.get('/isRunning', (req, res) => {

            let responseMessage: HeartBeatMessage = { PID: process.pid, isPrimary: this.isPrimary, isAlive: true, isRunning: this.isRunning };
            res.json(responseMessage);

        })
    }


    public setCriticalFunction() {
        // The sequence will push out the first value after 5 second has elapsed
        let source = Observable.timer(1800, 5000)
            .switchMap(() => {
                let num = Math.floor(Math.random() * 9);
                if (Math.sqrt(num - 1)) {
                    return Observable.of(true)
                } else {
                    throw Error('Bad input')
                }
            })
        this.criticalFunction = source;


    }






}