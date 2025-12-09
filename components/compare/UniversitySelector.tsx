"use client";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TurkishUniversity } from "@/lib/types";
import { X } from "lucide-react";

interface UniversitySelectorProps {
  universities: TurkishUniversity[];
  selectedIds: (string | null)[];
  onSelect: (index: number, id: string | null) => void;
  maxSelections?: number;
}

export function UniversitySelector({
  universities,
  selectedIds,
  onSelect,
  maxSelections = 3,
}: UniversitySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: maxSelections }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={`university-${index}`}>
            University {index + 1}
            {index === 0 && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="flex space-x-2">
            <Select
              id={`university-${index}`}
              value={selectedIds[index] || ""}
              onChange={(e) =>
                onSelect(index, e.target.value || null)
              }
              className="flex-1"
            >
              <option value="">
                {index === 0 ? "Select a university" : "None (optional)"}
              </option>
              {universities
                .filter(
                  (uni) =>
                    !selectedIds.includes(uni.id) ||
                    selectedIds[index] === uni.id
                )
                .map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
            </Select>
            {selectedIds[index] && (
              <button
                type="button"
                onClick={() => onSelect(index, null)}
                className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

