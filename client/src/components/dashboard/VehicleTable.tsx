import React, { useState } from "react";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, Filter } from "lucide-react";
import { Vehicle, VehicleStatus } from "@/types";
import { formatDistance } from "date-fns";
import Pagination from "@/components/common/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({ 
  vehicles,
  isLoading = false,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter vehicles based on selected status
  const filteredVehicles = statusFilter
    ? vehicles.filter(vehicle => vehicle.status === statusFilter)
    : vehicles;

  // Calculate pagination
  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge colors
  const getStatusBadgeClass = (status: VehicleStatus) => {
    switch (status) {
      case "in_use":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "available":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "maintenance":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "service_due":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    }
  };

  // Format status for display
  const formatStatus = (status: VehicleStatus) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Vehicle Status</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Select 
                value={statusFilter} 
                onValueChange={value => {
                  setStatusFilter(value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Vehicles</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="service_due">Service Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-700">
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Vehicle</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Last Maintenance</TableHead>
              <TableHead className="whitespace-nowrap">Rider</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading vehicles...
                </TableCell>
              </TableRow>
            ) : paginatedVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No vehicles found
                </TableCell>
              </TableRow>
            ) : (
              paginatedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.vehicleId}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vehicle.status)}`}>
                      {formatStatus(vehicle.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {vehicle.lastMaintenanceDate 
                      ? formatDistance(new Date(vehicle.lastMaintenanceDate), new Date(), { addSuffix: true }) 
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {vehicle.assignedTo ? "John Smith" : "--"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-600 dark:text-primary-400 hover:text-primary-500">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/vehicles/${vehicle.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 dark:text-amber-400 hover:text-amber-500">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default VehicleTable;
