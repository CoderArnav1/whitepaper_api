import logger from "./logger";

export function logAction({
  message,
  action,
  status,
  user_id,
  doc_id,
}: {
  message: string;
  action?: string;
  status?: string;
  user_id?: number;
  doc_id?: number;
}) {
  logger.info({
    message,
    action,
    status,
    user_id,
    doc_id,
  });
}
