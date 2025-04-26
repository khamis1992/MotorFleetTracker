import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Bike, 
  Plus, 
  Filter, 
  Search,
  FileDown,
  LayoutGrid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Vehicle, VehicleStatus } from "@/types";
import { apiRequest } from "@/lib/queryClient";

const VehiclesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch vehicles data
  const { data: vehicles, isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // Filter vehicles based on search and status
  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = searchQuery === "" ||
      vehicle.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate pagination
  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format status for display
  const formatStatus = (status: VehicleStatus) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get status badge style
  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Available</Badge>;
      case "in_use":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">In Use</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Maintenance</Badge>;
      case "service_due":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Service Due</Badge>;
      default:
        return <Badge variant="outline">{formatStatus(status)}</Badge>;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">Vehicle Management</h1>
        <Button size="sm" className="inline-flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="service_due">Service Due</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by ID</DropdownMenuItem>
              <DropdownMenuItem>Sort by Make</DropdownMenuItem>
              <DropdownMenuItem>Sort by Last Service</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredVehicles.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
          <Bike className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No vehicles found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && filteredVehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold">{vehicle.vehicleId}</CardTitle>
                  {getStatusBadge(vehicle.status)}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center h-32 bg-slate-100 dark:bg-slate-700 rounded-md mb-4">
                    <Bike className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium">{vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Year: {vehicle.year}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">License: {vehicle.licensePlate}</p>
                  </div>
                  <Button className="w-full mt-2" asChild>
                    <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && filteredVehicles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.vehicleId}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>{vehicle.assignedTo ? "Assigned" : "—"}</TableCell>
                  <TableCell>{vehicle.lastMaintenanceDate ? new Date(vehicle.lastMaintenanceDate).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/vehicles/${vehicle.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
