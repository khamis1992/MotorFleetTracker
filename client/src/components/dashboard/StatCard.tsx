import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  viewAllLink?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  viewAllLink,
  colorClass = "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400",
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{value}</div>
          </div>
        </div>
      </CardContent>
      {viewAllLink && (
        <CardFooter className="bg-slate-50 dark:bg-slate-700 px-5 py-3">
          <div className="text-sm">
            <a href={viewAllLink} className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              View all
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default StatCard;
