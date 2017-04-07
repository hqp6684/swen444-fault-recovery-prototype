import { HeartbeatSender } from './heartbeat-sender';
export interface HeartbeatReceiver {

    readonly checkingInterval: number;
    readonly checkingTime: number;
    readonly expireTime: number;
    readonly lastUpdateTime: Date;


    // private  checkingInterval;
    // private  checkingTime;
    // private  expireTime;
    // private  lastUpdateTime;
    // private Process process;

    // public HeartbeatReceiver(Process process, int checkingInterval, int checkingTime, int expireTime) {
    //     this.checkingInterval = checkingInterval;
    //     this.checkingTime = checkingTime;
    //     this.expireTime = expireTime;
    //     this.process = process;

    // }

    checkAlive(hbSender: HeartbeatSender): boolean;
    //if this.process returns Alive return true
    //else notify FaultMonitor
    // if (!this.process.isAlive()) {
    //     return true;
    // }
    // else {
    //     return false;
    // }


}
