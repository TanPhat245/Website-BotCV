import { startCloseExpiredJobsCron } from "./closeExpiredJobs.js";

export const startAllCrons = () => {
  startCloseExpiredJobsCron();
};