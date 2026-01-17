import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const periodLabels: Record<string, string> = {
  "7": "7 days",
  "30": "30 days",
  "90": "90 days",
};

export function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto gap-2 px-3 border-0 bg-muted/50 hover:bg-muted rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-200 focus:ring-0 focus:ring-offset-0">
        <Calendar className="h-3.5 w-3.5" />
        <SelectValue>
          {periodLabels[value] || "Select"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-card border border-border rounded-xl shadow-lg min-w-[140px]">
        <SelectItem value="7" className="text-xs rounded-lg cursor-pointer">
          Last 7 days
        </SelectItem>
        <SelectItem value="30" className="text-xs rounded-lg cursor-pointer">
          Last 30 days
        </SelectItem>
        <SelectItem value="90" className="text-xs rounded-lg cursor-pointer">
          Last 90 days
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
