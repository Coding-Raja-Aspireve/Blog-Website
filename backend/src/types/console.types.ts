export type LoggerStates = "info" | "warn" | "error"

export type Logger = (type: LoggerStates, message: string) => void;