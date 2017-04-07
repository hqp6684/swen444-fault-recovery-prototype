import { HeartbeatReceiver } from '../heartbeat/heartbeat-receiver';
import { HeartbeatSender } from '../heartbeat/heartbeat-sender';
import * as expressLib from 'express';
import { Express, Response, Request } from 'express';
import * as bodyParser from 'body-parser';
// import * as childProcess from 'child_process';
import * as path from 'path';
import { ChildProcess } from 'child_process';
// const spawn = require('child_process').spawn;

export class MainServer implements HeartbeatReceiver {
    checkingInterval: number;
    checkingTime: number;
    expireTime: number;
    lastUpdateTime: Date;

    // private primaryProcess: ChildProcess;
    // private secondaryProcess: ChildProcess;

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
        // Listen to POST request from child server at http://localhost:port/heartbeat
        this.app.post('/', this.processHeartBeatSignal)

    }

    private processHeartBeatSignal(req: Request, res: Response) {
        console.log(req.body);
    }


    private spawnChild() {
        const spawn = require('child_process').spawn;

        // const ls = spawn('ls', ['-lh', '/usr']);

        // ls.stdout.on('data', (data: any) => {
        //     console.log(`stdout: ${data}`);
        // });

        // ls.stderr.on('data', (data: any) => {
        //     console.log(`stderr: ${data}`);
        // });

        // ls.on('close', (code: any) => {
        //     console.log(`child process exited with code ${code}`);
        // });

        // spawn from import above
        // const ls2 = spawn('ls', ['-lh', '/usr']);

        // console.log(pathFIle);

        let ls3 = spawn('node', ['/Users/huypham/typescript/swen/444/wp2-backend-template/dist/child.bundle.js', '8081', '8000']);
        // let ls3 = spawn('node', [pathFIle, '8081', '8080']);
        console.log(ls3.pid);
        // this.primaryProcess = spawn('node',[ path.resolve(__dirname, './dist/child.bundle.js'),`${this.port + 1}`,this.port.toString()]);
        ls3.stdout.on('data', (data: any) => {
            console.log(`stdout: ${data}`);
        });
        // ls3.stdout.on('error', (err: any) => { console.log(err) });

        // let ls2: ChildProcess = spawn('node', [path.resolve(__dirname, './dist/child.bundle.js'), `${this.port + 1}`, this.port.toString()]);
        // console.log(ls2.pid);
        // // this.primaryProcess = spawn('node',[ path.resolve(__dirname, './dist/child.bundle.js'),`${this.port + 1}`,this.port.toString()]);
        // ls2.stdout.on('data', (data: any) => {
        //     console.log(`stdout: ${data}`);
        // })
        // primaryProcess.stderr.on('data', (data: any) => {
        //     // console.log('wat');
        //     console.log(data);
        // })
        // ls2.on('error', (error: any) => {
        //     console.log(`Error: ${error}`)
        // });

        // let secondaryProcess = spawn('node', [
        //     path.resolve(__dirname, 'dist/child.bundle.js'),
        //     `${this.port + 2}`,
        //     this.port.toString()
        // ])
        // secondaryProcess.stdout.on('data', (data: any) => {
        //     console.log(data);
        // })
        // this.secondaryProcess.stderr.on('data', (data) => {
        //     console.log(data);
        // })
        // secondaryProcess.on('error', (error: any) => {
        //     console.log(error);
        // })
    }



}