import { serverHealth } from "../types/routes.types";

export const ServerHealthy: serverHealth = {
  message: "Server is running",
};

export const ServerError: serverHealth = {
  message: "Server has Errored Out",
};

export const ServerInternalError: serverHealth = {
  message: "Internal Server Error",
};

