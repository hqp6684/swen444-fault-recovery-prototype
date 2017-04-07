import { HeartbeatReceiver } from '../heartbeat/heartbeat-receiver';
import { HeartbeatSender } from '../heartbeat/heartbeat-sender';
import * as expressLib from 'express';
import { Express, Response, Request } from 'express';
import * as bodyParser from 'body-parser';
import * as childProcess from 'child_process';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';


export class MainServer implements HeartbeatReceiver {
    checkingInterval: number;
    checkingTime: number;
    expireTime: number;
    lastUpdateTime: Date;

    private primaryProcess: ChildProcess;
    private secondaryProcess: ChildProcess;

    private port = 8080;
    checkAlive(hbSender: HeartbeatSender): boolean {
        throw new Error('Method not implemented.');
    }

    // http server
    private app: Express;

    constructor(port: number) {
        this.port = port;
        this.app = expressLib();
        // bodyParser is used to read body of HTTP request
        this.app.use(bodyParser.urlencoded());
        // this.setUpServer();
        this.setUpHeartBeat();
        this.runServer();
    }


    /**
     * Start server 
     */
    private runServer(): void {
        console.log('Main server is listening on port '.concat(this.port.toString()));
        this.app.listen(this.port);
        this.spawnChild();
    }


    private setUpHeartBeat() {
        this.lastUpdateTime = new Date();
        // origin of this server is : http://localhost:port
        // let receiverEndPoint = '/heartbeat';
        // Listen to POST request from child server at http://localhost:port/heartbeat
        this.app.post('/', this.processHeartBeatSignal)

    }

    private processHeartBeatSignal(req: Request, res: Response) {
        console.log(req.body);
    }


    private spawnChild() {
        // spawn from import above
        console.log('er');
        this.primaryProcess = spawn('node', [
            path.resolve(__dirname, './dist/child.bundle.js'),
            `${this.port + 1}`,
            this.port.toString()
        ]);
        this.primaryProcess.stdout.on('data', (data) => {
            console.log(data);
        })
        // this.primaryProcess.stderr.on('data', (data) => {
        //     // console.log('wat');
        //     console.log(data);
        // })
        this.primaryProcess.on('error', (err: any) => {
            console.log(err)
        });

        this.secondaryProcess = spawn('node', [
            path.resolve(__dirname, 'dist/child.bundle.js'),
            `${this.port + 2}`,
            this.port.toString()
        ])
        this.secondaryProcess.stdout.on('data', (data) => {
            console.log(data);
        })
        // this.secondaryProcess.stderr.on('data', (data) => {
        //     console.log(data);
        // })
        this.secondaryProcess.on('error', (err: any) => {
            console.log(err);
        })
    }



}