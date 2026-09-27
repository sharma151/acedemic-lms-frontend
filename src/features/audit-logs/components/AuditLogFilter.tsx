import React from "react";
import { useAuditLogFilterOptions } from "../queries";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParam } from "@/hooks/use-query-params";
import useFilterSearch from "@/hooks/use-filter-search";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface Props {
  isSuperAdmin?: boolean;
}

export const AuditLogFilter: React.FC<Props> = ({ isSuperAdmin }) => {
  const { data } = useAuditLogFilterOptions();
  const options = data?.data;

  const { value: action, setQueryParams } = useQueryParam("action");
  const { value: entity } = useQueryParam("entity");
  const { value: status } = useQueryParam("status");
  const { value: tenantId } = useQueryParam("tenantId");

  const { renderSearch } = useFilterSearch({
    id: "audit-search",
    placeholder: "Search actor or description...",
    onSearchChange: (val) => {
      setQueryParams({ search: val || null, page: "1" });
    },
    initialValue:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("search") || ""
        : "",
  });

  const handleFilterChange = (key: string, val: string | null) => {
    setQueryParams({ [key]: val === "ALL" ? null : val, page: "1" });
  };

  const handleClearFilters = () => {
    setQueryParams({
      action: null,
      entity: null,
      status: null,
      tenantId: null,
      search: null,
      page: "1",
    });
    // The search input might not clear automatically without a ref, 
    // but the URL will clear and reloading/syncing handles it.
  };

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center flex-wrap">
      <div className="w-full md:w-60">{renderSearch()}</div>

      <Select
        value={action || "ALL"}
        onValueChange={(val) => handleFilterChange("action", val)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Actions</SelectItem>
          {options?.actions.map((act) => (
            <SelectItem key={act} value={act}>
              {act}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={entity || "ALL"}
        onValueChange={(val) => handleFilterChange("entity", val)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Entities</SelectItem>
          {options?.entities.map((ent) => (
            <SelectItem key={ent} value={ent}>
              {ent}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status || "ALL"}
        onValueChange={(val) => handleFilterChange("status", val)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="SUCCESS">Success</SelectItem>
          <SelectItem value="FAILURE">Failure</SelectItem>
        </SelectContent>
      </Select>

      {isSuperAdmin && (
        <Input
          placeholder="Tenant ID (UUID)"
          className="w-[200px] bg-white"
          value={tenantId || ""}
          onChange={(e) =>
            handleFilterChange("tenantId", e.target.value || null)
          }
        />
      )}

      <Button variant="outline" size="icon" onClick={handleClearFilters} title="Reset Filters">
        <RotateCcw className="h-4 w-4 text-slate-600" />
      </Button>
    </div>
  );
};
