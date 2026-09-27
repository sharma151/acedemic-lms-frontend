import { z } from "zod";

export const auditLogDetailsSchema = z.object({
  path: z.string(),
  method: z.string(),
  query: z.record(z.any()).optional(),
  params: z.record(z.any()).optional(),
  error: z.string().optional(),
  oldValue: z.record(z.any()).nullable(),
  newValue: z.record(z.any()).nullable(),
});

export const auditLogItemSchema = z.object({
  id: z.string(),
  tenantId: z.string().nullable(),
  tenantName: z.string().nullable().optional(),
  tenantSlug: z.string().nullable().optional(),
  userId: z.string().nullable(),
  actorName: z.string(),
  actorEmail: z.string(),
  actorRole: z.string().nullable(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().nullable(),
  description: z.string(),
  details: auditLogDetailsSchema,
  ipAddress: z.string(),
  userAgent: z.string(),
  status: z.enum(["SUCCESS", "FAILURE"]),
  statusCode: z.number(),
  executionDurationMs: z.number(),
  createdAt: z.string(),
});

export const auditLogMetadataSchema = z.object({
  totalPage: z.number(),
  totalData: z.number(),
  perPage: z.number(),
  currentPage: z.number(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
});

export const auditLogResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.array(auditLogItemSchema),
  metadata: auditLogMetadataSchema,
});

export const filterOptionsResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  data: z.object({
    entities: z.array(z.string()),
    actions: z.array(z.string()),
  }),
});

export const singleAuditLogResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  data: auditLogItemSchema,
});

export type AuditLogItem = z.infer<typeof auditLogItemSchema>;
export type AuditLogResponse = z.infer<typeof auditLogResponseSchema>;
export type FilterOptionsResponse = z.infer<typeof filterOptionsResponseSchema>;
export type SingleAuditLogResponse = z.infer<typeof singleAuditLogResponseSchema>;
export type AuditLogMetadata = z.infer<typeof auditLogMetadataSchema>;

export const auditLogQueryParamsSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  status: z.enum(["SUCCESS", "FAILURE"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export type AuditLogQueryParams = z.infer<typeof auditLogQueryParamsSchema>;
