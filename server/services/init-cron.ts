import { opportunityArchiver } from './opportunity-archiver';

/**
 * Initialize all cron jobs when the server starts
 */
export function initializeCronJobs(): void {
  try {
    // Start the opportunity archiver cron job
    opportunityArchiver.startCronJob();
  } catch {
    // Silent error handling
  }
}

/**
 * Cleanup cron jobs when the server shuts down
 */
export function cleanupCronJobs(): void {
  try {
    opportunityArchiver.stopCronJob();
  } catch {
    // Silent error handling
  }
} 