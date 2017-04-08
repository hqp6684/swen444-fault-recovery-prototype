import { HeartbeatReceiver } from '../heartbeat/heartbeat-receiver';
import { HeartbeatSender } from '../heartbeat/heartbeat-sender';
import * as expressLib from 'express';
import { Express, Response, Request } from 'express';
import * as bodyParser from 'body-parser';
// import * as childProcess from 'child_process';
import * as path from 'path';
import { ChildProcess } from 'child_process';
import * as request from 'request';
// const spawn = require('child_process').spawn;

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
        this.app.use(bodyParser.urlencoded({ extended: true }));
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
        // Listen to POST request from child server at http://localhost:port/k
        // this.app.post('/', this.processHeartBeatSignal)
        this.app.post('/', (req, res) => {
            // console.log(req.body);
        })

    }

    private processHeartBeatSignal(req: Request, res: Response) {
        // console.log(req.protocol);
        // console.log(req.rawHeaders);
        // console.log(req.)
        // console.log(req.body);
        res.send('received');
    }


    private spawnChild() {
        const spawn = require('child_process').spawn;


        let childServerFilePath = '/Users/huypham/typescript/swen/444/wp2-backend-template/dist/child.bundle.js';

        this.primaryProcess = spawn('node', [childServerFilePath, `${this.port + 1}`, this.port.toString()]);
        this.primaryProcess.stdout.on('data', (data: any) => {

            console.log(`Primary stdout: ${data}`);
        });
        this.primaryProcess.on('error', (data: any) => {

            console.log(`Primary stdout: ${data}`);
        });
        //
        this.secondaryProcess = spawn('node', [childServerFilePath, `${this.port + 2}`, this.port.toString()]);
        this.secondaryProcess.stdout.on('data', (data: any) => {
            console.log(`Secondary stdout: ${data}`);
        });
        this.secondaryProcess.on('error', (data: any) => {

            console.log(`Primary stdout: ${data}`);
        });

        this.setPrimary();
    }



    setPrimary() {
        request.get('http://localhost:8081/isPrimary', (res) => {
            console.log(res.body);
        })

    }

}