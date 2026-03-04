export const CampaignStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const
export type CampaignStatusType = (typeof CampaignStatus)[keyof typeof CampaignStatus]
