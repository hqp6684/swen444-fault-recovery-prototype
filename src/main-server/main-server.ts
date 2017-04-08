import { HeartBeatMessage } from '../heartbeat/heartbeat-message';
import { HeartbeatReceiver } from '../heartbeat/heartbeat-receiver';
import { HeartbeatSender } from '../heartbeat/heartbeat-sender';
import * as expressLib from 'express';
import { Express, Response, Request } from 'express';
import * as bodyParser from 'body-parser';
// import * as childProcess from 'child_process';
import * as path from 'path';
import { ChildProcess } from 'child_process';
import * as request from 'request';
import 'rxjs';

import { AsyncSubject } from 'rxjs';

// Used to spawn child process
const spawn = require('child_process').spawn;

export class MainServer implements HeartbeatReceiver {
    // 10sec
    checkingInterval: number = 10000;
    checkingTime: number;
    expireTime: number;
    lastUpdateTime: Date;

    private primaryProcess: ChildProcess;
    private primaryProcessPort: number;
    private secondaryProcess: ChildProcess;
    private secondaryProcessPort: number;

    private port = 8080;
    static childProcessPortCounter: number;

    // http server
    private app: Express;

    constructor(port: number) {
        this.port = port;
        this.app = expressLib();
        // bodyParser is used to read body of HTTP request
        this.app.use(bodyParser.urlencoded({ extended: true }));
        // this.setUpServer();
        this.setUpListenerEndpoints();
        this.runServer();
    }


    /**
     * Start server 
     */
    private runServer(): void {
        console.log('Main server is listening on port '.concat(this.port.toString()));
        this.app.listen(this.port);
        MainServer.childProcessPortCounter = this.port;
        this.initChildren();
    }


    setUpListenerEndpoints() {
        this.lastUpdateTime = new Date();
        // origin of this server is : http://localhost:port
        // this.app.post('/', this.processHeartBeatSignal)
        this.app.post('/', (req, res) => {
            console.log('Heartbeat message received: ');
            console.log(req.body);
            console.log('');

        });


    }

    private processHeartBeatSignal(req: Request, res: Response) {
        // console.log(req.protocol);
        // console.log(req.rawHeaders);
        // console.log(req.)
        console.log(req.body);
        // res.send('received');
    }


    private initChildren() {
        this.spawnPrimaryProcess();
        this.spawnSecondaryProcess();

        this.setPrimary();
        this.checkAlive();
    }


    private spawnPrimaryProcess() {
        let childServerFilePath = path.resolve(__dirname, '../../', 'dist/child.bundle.js');

        MainServer.childProcessPortCounter = MainServer.childProcessPortCounter + 1;
        this.primaryProcessPort = MainServer.childProcessPortCounter;
        this.primaryProcess = spawn('node', [childServerFilePath, this.primaryProcessPort.toString(), this.port.toString()]);
        this.primaryProcess.stdout.on('data', (data: any) => {
            console.log(`Primary stdout: ${data}`);
        });

    }

    private spawnSecondaryProcess() {
        let childServerFilePath = path.resolve(__dirname, '../../', 'dist/child.bundle.js');
        MainServer.childProcessPortCounter = MainServer.childProcessPortCounter + 1;
        this.secondaryProcessPort = MainServer.childProcessPortCounter;
        this.secondaryProcess = spawn('node', [childServerFilePath, this.secondaryProcessPort.toString(), this.port.toString()]);
        this.secondaryProcess.stdout.on('data', (data: any) => {
            console.log(`Secondary stdout: ${data}`);
        });
    }



    setPrimary() {
        let url = `http://localhost:${this.primaryProcessPort}/isPrimary`;
        request.get(url, (error, res: request.RequestResponse, body) => {
            console.log(body);
        })

    }

    /**
     * Check if Primary process is alive every checkingInterval(defined above) seconds 
     * 
     * if(false)
     *  => kill primary => promote secondary to primary 
     * 
     */
    checkAlive() {
        setInterval(() => {
            console.log(`Last update time: `);
            console.log(this.lastUpdateTime);
            this.lastUpdateTime = new Date();

            console.log('Checking primary process:');

            let url = `http://localhost:${this.primaryProcessPort}/isAlive`;
            request.get(url, (error, res: request.RequestResponse, body) => {

                if (error) { // child process died
                    console.log('Primary Child Process dead')
                    // check secondary
                    this.checkSecondaryAlive()
                        .subscribe(isAlive => {
                            if (isAlive) {
                                console.log('');
                                console.log('Switching primary child process');
                                this.primaryProcessPort = this.secondaryProcessPort;

                                this.primaryProcess.kill();
                                this.primaryProcess = this.secondaryProcess;
                                // set primary
                                this.setPrimary();
                                // spawn new back up proces
                                this.spawnSecondaryProcess();

                            }
                        })
                } else {

                    console.log('Primary is alive');
                }

            })


        }, this.checkingInterval)
    }

    /**
     * Check secondary process 
     * @return 
     */
    private checkSecondaryAlive() {
        let result = new AsyncSubject<boolean>();

        console.log('Checking secondary process: ');

        let url = `http://localhost:${this.secondaryProcessPort}/isAlive`;
        request.get(url, (error, res: request.RequestResponse, body) => {

            if (error) { // child process died
                console.log('Secondary child Process dead')
                result.next(false);
                // check secondary
            } else {

                console.log('Secondadry child process is alive');
                result.next(true);
            }
            result.complete();

        })
        return result;

    }

}