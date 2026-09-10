"use client";

import React, { useState } from "react";
import { Link, Unlink, Phone, UserRound, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LinkedParent } from "../../types";
import { useUnlinkParent } from "../../api/students";
import { LinkParentDialog } from "../dialogs/LinkParentDialog";

interface ParentsTabProps {
  studentId: string;
  parents: LinkedParent[];
}

export const ParentsTab = ({ studentId, parents }: ParentsTabProps) => {
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [parentToUnlink, setParentToUnlink] = useState<LinkedParent | null>(null);
  const unlinkMutation = useUnlinkParent(studentId);

  const handleUnlink = () => {
    if (parentToUnlink) {
      unlinkMutation.mutate(
        { id: studentId, parentUserId: parentToUnlink.parentUserId },
        { onSuccess: () => setParentToUnlink(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-lg">
        <div>
          <h3 className="font-semibold text-slate-800">Linked Parents/Guardians</h3>
          <p className="text-sm text-slate-500">Manage family members associated with this student.</p>
        </div>
        <Button onClick={() => setIsLinkOpen(true)} className="bg-slate-800 hover:bg-slate-900">
          <Link className="h-4 w-4 mr-2" />
          Link Parent
        </Button>
      </div>

      {parents.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-lg">
          <UserRound className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No parents linked</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
            This student currently has no parents or guardians linked to their account.
          </p>
          <Button onClick={() => setIsLinkOpen(true)} variant="outline" className="mt-4">
            Link Parent Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parents.map((lp) => (
            <Card key={lp.id}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {lp.parent?.firstName} {lp.parent?.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Badge variant="secondary" className="mr-2">
                      {lp.relationship}
                    </Badge>
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2 -mr-2"
                  onClick={() => setParentToUnlink(lp)}
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm">
                <div className="flex items-center text-slate-600">
                  <Phone className="h-4 w-4 mr-2 shrink-0" />
                  {lp.parent?.email} {/* Or phone if parent user has it */}
                </div>
                
                <div className="flex flex-col gap-2 pt-2 border-t">
                  {lp.isEmergencyContact && (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Emergency Contact
                    </div>
                  )}
                  {lp.canPickup && (
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Authorized for Pickup
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!parentToUnlink}
        onClose={() => setParentToUnlink(null)}
        onConfirm={handleUnlink}
        title="Unlink Parent"
        description={<>Are you sure you want to unlink <strong>{parentToUnlink?.parent?.firstName} {parentToUnlink?.parent?.lastName}</strong> from this student? They will no longer have access to the student's academic records.</>}
        confirmText="Unlink"
        variant="destructive"
        isLoading={unlinkMutation.isPending}
      />

      <LinkParentDialog
        open={isLinkOpen}
        onOpenChange={setIsLinkOpen}
        studentId={studentId}
      />
    </div>
  );
};
