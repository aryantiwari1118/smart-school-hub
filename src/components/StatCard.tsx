import { LucideIcon, Users, GraduationCap, BookOpen, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle,
};

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  className?: string;
}

const StatCard = ({ label, value, trend, icon, className }: StatCardProps) => {
  const Icon = iconMap[icon] || Users;
  const isPositive = trend?.startsWith("+");

  return (
    <div className={cn(
      "bg-card rounded-lg border p-5 shadow-sm animate-scale-in transition-shadow hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {trend && (
        <p className={cn(
          "mt-2 text-xs font-medium",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {trend} from last month
        </p>
      )}
    </div>
  );
};

export default StatCard;
