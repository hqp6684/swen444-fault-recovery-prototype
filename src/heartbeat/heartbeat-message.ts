export interface HeartBeatMessage {
    PID: number;
    isPrimary: boolean;
    isAlive: boolean;
}