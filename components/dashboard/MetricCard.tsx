import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
  subtitle?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  description,
  subtitle,
  loading = false,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 animate-pulse bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 animate-pulse bg-muted rounded mb-2" />
          {subtitle && (
            <div className="h-4 w-32 animate-pulse bg-muted rounded" />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <div className="text-2xl text-primary/80">{icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground truncate">
                {value}
              </div>
              {subtitle && (
                <p className="text-[10px] text-muted-foreground mt-1 truncate font-medium uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
              {trend !== undefined && (
                <div
                  className={`flex items-center gap-1 mt-2 text-xs font-semibold ${getTrendColor()}`}
                >
                  {getTrendIcon()}
                  <span>{Math.abs(trend)}% from last year</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p className="max-w-xs">{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
