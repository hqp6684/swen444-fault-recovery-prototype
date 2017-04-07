

export interface HeartbeatSender {

    isAlive(hbReceiverUrl: string): boolean;

    /**
     * @param sendInterval time
     */
    send(sendInternal: number): void;


}