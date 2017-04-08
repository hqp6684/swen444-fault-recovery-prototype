import { HeartbeatSender } from './heartbeat-sender';
export interface HeartbeatReceiver {

    readonly checkingInterval: number;
    readonly checkingTime: number;
    readonly expireTime: number;
    readonly lastUpdateTime: Date;

    checkAlive(args?: any): any;


}
