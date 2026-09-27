import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAuditLogById } from "../queries";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

interface Props {
  auditLogId: string | null;
  onClose: () => void;
}

const JsonViewer = ({ data }: { data: any }) => {
  if (!data) return <div className="text-slate-500 italic">No data</div>;
  return (
    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export const AuditLogDetailSheet: React.FC<Props> = ({
  auditLogId,
  onClose,
}) => {
  const { data, isLoading, isError } = useAuditLogById(auditLogId);
  const log = data?.data;

  return (
    <Sheet open={!!auditLogId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Audit Log Details</SheetTitle>
          <SheetDescription>
            Detailed view of the action performed.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : isError || !log ? (
          <div className="text-red-500 text-center mt-10">
            Failed to load audit log details.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Action</p>
                <p>{log.action}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Entity</p>
                <p>{log.entity}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Actor</p>
                <p>
                  {log.actorName} <br />
                  <span className="text-xs text-slate-500">
                    ({log.actorEmail})
                  </span>
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Date & Time</p>
                <p>{dayjs(log.createdAt).format("MMM D, YYYY h:mm A")}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Status</p>
                <Badge
                  variant={log.status === "SUCCESS" ? "default" : "destructive"}
                >
                  {log.status} {log.statusCode}
                </Badge>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Duration</p>
                <p>{log.executionDurationMs} ms</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">IP Address</p>
                <p>{log.ipAddress}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">User Agent</p>
                <p className="truncate" title={log.userAgent}>
                  {log.userAgent}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Method & Path</p>
                <div className="mt-1 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {log.details.method}
                  </Badge>
                  <span className="break-all">{log.details.path}</span>
                </div>
              </div>
              {log.details.error && (
                <div className="col-span-2 p-3 bg-red-50 text-red-700 rounded-md">
                  <p className="font-semibold">Error Message</p>
                  <p>{log.details.error}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Old Value</h4>
                <JsonViewer data={log.details.oldValue} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">New Value</h4>
                <JsonViewer data={log.details.newValue} />
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
