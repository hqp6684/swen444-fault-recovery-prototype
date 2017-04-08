export interface HeartBeatMessage {
    PID: number;
    isPrimary: boolean;
    isAlive: boolean;
    isRunning?: boolean;
}