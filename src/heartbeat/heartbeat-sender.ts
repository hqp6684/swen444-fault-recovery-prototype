

export interface HeartbeatSender {

    isAlive(args?: any): any;

    /**
     * @param sendInterval time
     */
    send(sendInternal: number): void;


}