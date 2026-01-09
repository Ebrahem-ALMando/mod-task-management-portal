/**
 * Notifications feature exports
 */

export { useNotifications, useUnreadCount } from "./hooks/useNotifications"
export { useNotificationActions } from "./hooks/useNotificationActions"
export type {
  NotificationResource,
  NotificationMetadata,
  UnreadCountResponse,
} from "./types/notification.types"
export type {
  UseNotificationsParams,
  UseNotificationsReturn,
  UseUnreadCountReturn,
} from "./hooks/useNotifications"
export type { UseNotificationActionsReturn } from "./hooks/useNotificationActions"