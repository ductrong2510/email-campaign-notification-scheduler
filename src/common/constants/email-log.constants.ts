export const EmailLogStatus = {
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const
export type EmailLogStatusType = (typeof EmailLogStatus)[keyof typeof EmailLogStatus]
