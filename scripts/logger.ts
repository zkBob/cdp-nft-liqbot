import * as pino from "pino";

export const logger = pino.default({ level: process.env.LOG_LEVEL });
