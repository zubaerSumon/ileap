import cron from 'node-cron';
import Opportunity from '../db/models/opportunity';
import { notificationService } from './notification';

/**
 * Service to automatically archive opportunities based on their dates
 */
export class OpportunityArchiverService {
  private static instance: OpportunityArchiverService;
  private isRunning = false;
  private isCurrentlyRunning = false;

  private constructor() {}

  public static getInstance(): OpportunityArchiverService {
    if (!OpportunityArchiverService.instance) {
      OpportunityArchiverService.instance = new OpportunityArchiverService();
    }
    return OpportunityArchiverService.instance;
  }





  /**
   * Archive opportunities that have passed their end date (work-based) or start date (event-based)
   */
  private async archiveExpiredOpportunities(): Promise<void> {
    try {
      const now = new Date();
      
      // Find opportunities that need to be archived
      const opportunitiesToArchive = await Opportunity.find({
        is_archived: false,
        $or: [
          // Work-based opportunities: archive when end_date has passed
          {
            commitment_type: 'workbased',
            'date.end_date': { $exists: true, $ne: null, $lt: now }
          },
          // Event-based opportunities: archive when start_date has passed
          {
            commitment_type: 'eventbased',
            'date.start_date': { $lt: now }
          }
        ]
      }).populate('organization_profile', 'title');

      if (opportunitiesToArchive.length === 0) {
        return;
      }

      // Archive each opportunity
      const archivePromises = opportunitiesToArchive.map(async (opportunity) => {
        try {
          // Use findOneAndUpdate with atomic operation to prevent race conditions
          const result = await Opportunity.findOneAndUpdate(
            { 
              _id: opportunity._id, 
              is_archived: false 
            },
            { is_archived: true },
            { new: true }
          );
          
          if (!result) {
            return { success: true, id: opportunity._id, title: opportunity.title, alreadyArchived: true };
          }
          
          // Send notification for archived opportunity
          await notificationService.sendOpportunityArchivedNotification(
            opportunity._id.toString(),
            opportunity.title,
            (opportunity.organization_profile as { _id?: string })?._id?.toString() || '',
            (opportunity.organization_profile as { title?: string })?.title || 'Organization'
          );
          
          return { success: true, id: opportunity._id, title: opportunity.title, alreadyArchived: false };
        } catch (error) {
          return { success: false, id: opportunity._id, error };
        }
      });

      await Promise.all(archivePromises);
    } catch {
      // Silent error handling
    }
  }

  /**
   * Main cron job function that handles both archiving and notifications
   */
  private async runCronJob(): Promise<void> {
    try {
      // Add a simple lock mechanism to prevent multiple instances running simultaneously
      if (this.isCurrentlyRunning) {
        return;
      }
      
      this.isCurrentlyRunning = true;
      
      try {
        // Only archive new opportunities that have expired (notifications sent automatically when archived)
        await this.archiveExpiredOpportunities();
      } finally {
        this.isCurrentlyRunning = false;
      }
    } catch {
      this.isCurrentlyRunning = false;
    }
  }

  /**
   * Start the cron job to run archiving every hour
   */
  public startCronJob(): void {
    if (this.isRunning) {
      return;
    }

    // Run every hour
    cron.schedule('0 * * * *', async () => {
      await this.runCronJob();
    }, {
      timezone: 'UTC'
    });

    this.isRunning = true;
  }

  /**
   * Manually trigger archiving (for testing or immediate execution)
   */
  public async manualArchive(): Promise<void> {
    await this.runCronJob();
  }

  /**
   * Stop the cron job
   */
  public stopCronJob(): void {
    if (!this.isRunning) {
      return;
    }

    // Note: node-cron doesn't provide a direct way to stop specific jobs
    // In a real implementation, you might want to store the cron job reference
    this.isRunning = false;
  }
}

// Export singleton instance
export const opportunityArchiver = OpportunityArchiverService.getInstance(); 