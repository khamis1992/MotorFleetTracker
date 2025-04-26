import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityLog } from "@/types";
import { formatDistanceToNow } from "date-fns";

// Map action types to icon backgrounds and icons
const actionStyles: Record<string, { bgClass: string, icon: string }> = {
  vehicle_checkout: {
    bgClass: "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400",
    icon: "key"
  },
  maintenance_complete: {
    bgClass: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    icon: "check"
  },
  fuel_reported: {
    bgClass: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400",
    icon: "gas-pump"
  },
  geofence_exit: {
    bgClass: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
    icon: "exclamation-circle"
  },
  vehicle_assigned: {
    bgClass: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    icon: "user-plus"
  },
  default: {
    bgClass: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
    icon: "info-circle"
  }
};

interface ActivityItemProps {
  activity: ActivityLog;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const style = actionStyles[activity.action] || actionStyles.default;
  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
  
  // Format the description text for display
  let mainText = activity.description;
  let subText = "";
  
  if (activity.user) {
    subText = `${activity.user.firstName} ${activity.user.lastName}`;
  }
  
  if (activity.vehicle) {
    if (subText) {
      subText += ` • Vehicle ${activity.vehicle.vehicleId}`;
    } else {
      subText = `Vehicle ${activity.vehicle.vehicleId}`;
    }
  }
  
  if (!subText) {
    subText = timeAgo;
  } else {
    subText += ` • ${timeAgo}`;
  }

  return (
    <li className="p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className={`h-8 w-8 rounded-full ${style.bgClass} flex items-center justify-center`}>
            <i className={`fas fa-${style.icon}`}></i>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {mainText}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subText}
          </p>
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;
