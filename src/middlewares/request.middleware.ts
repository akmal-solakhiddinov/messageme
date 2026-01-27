import logger from "../utils/logger";

export const requestLogger = (req: any, res: any, next: any) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1_000_000;

    const level =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger.log({
      level,
      label: "HTTP",
      message: `${req.method} ${req.originalUrl}`,
      statusCode: res.statusCode,
      durationMs: Number(duration.toFixed(2)),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });

  next();
};
