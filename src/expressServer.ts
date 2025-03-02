import express from "express";
import http from "http";

const expressAppConfig = {} as StartServerOpts;

type ErrorBody = unknown;

type ExpressCustomizationPoint = (app: express.Application) => void;

interface StartServerOpts {
  express: {
    port: number;
    routes?: ExpressCustomizationPoint;
  };
}

async function setupExpressApp(options: StartServerOpts) {
  Object.assign(expressAppConfig, options);
  const startTime = new Date().getTime();

  try {
    await startExpressServer(options);
    const startDuration = new Date().getTime() - startTime;
    console.log(
      `Running HTTP server on port ${expressAppConfig.express.port} in ${startDuration}ms`
    );
  } catch (err) {
    console.error("An error occurred starting up the HTTP server", err);
    process.exit(-1);
  }
}

async function createExpressApp(cfg: StartServerOpts) {
  const app = express();

  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded({ extended: false }));

  cfg.express?.routes?.(app);

  return app;
}

async function startExpressServer(cfg: StartServerOpts) {
  const app = await createExpressApp(cfg);
  const server = http.createServer(app);

  // Start Server
  await new Promise((resolve) => {
    server.listen(expressAppConfig.express.port, function () {
      // resolve the promise, so the caller can wait on the server being ready
      resolve(server);
    });
  });
}

class AppError extends Error {
  // HTTP status code of the error
  statusCode: number;

  // Body of the error HTTP response
  data: ErrorBody;
  level: "warn" | "error" = "error";

  // Additional info associated with the error, that will be logged, but WILL NOT be sent back to the caller (unlike `data`)
  hiddenInfo: ({ body?: string } & Record<string, unknown>) | undefined;

  constructor(
    message: string,
    statusCode?: number,
    data?: ErrorBody,
    hiddenInfo?: AppError["hiddenInfo"]
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode || 500;
    this.data = data;
    this.hiddenInfo = hiddenInfo;
  }
}

export { setupExpressApp, AppError };
