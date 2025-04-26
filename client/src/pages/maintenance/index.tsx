import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Drill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Maintenance, Vehicle } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { format, addDays, isBefore } from "date-fns";

const MaintenancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch maintenance records
  const { data: maintenanceRecords, isLoading: isLoadingMaintenance } = useQuery<Maintenance[]>({
    queryKey: ['/api/maintenance'],
  });

  // Fetch vehicles for selection
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // Filter maintenance records based on search, status, and vehicle selection
  const filteredRecords = maintenanceRecords?.filter(record => {
    const matchesSearch = searchQuery === "" ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "" || 
      (statusFilter === "completed" && record.completedDate) ||
      (statusFilter === "pending" && !record.completedDate);
    
    const matchesVehicle = selectedVehicle === null || record.vehicleId.toString() === selectedVehicle;
    
    return matchesSearch && matchesStatus && matchesVehicle;
  }) || [];

  // Calculate summary stats
  const completedCount = maintenanceRecords?.filter(r => r.completedDate).length || 0;
  const upcomingCount = maintenanceRecords?.filter(r => !r.completedDate).length || 0;
  const overdueCount = maintenanceRecords?.filter(r => 
    !r.completedDate && isBefore(new Date(r.scheduledDate), new Date())
  ).length || 0;

  // Mark maintenance as complete
  const markAsComplete = async (id: number) => {
    try {
      await apiRequest("PUT", `/api/maintenance/${id}/complete`, {
        completedDate: new Date().toISOString(),
        notes: "Marked as completed from maintenance dashboard"
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/summary'] });
    } catch (error) {
      console.error("Error marking maintenance as complete:", error);
    }
  };

  // Helper to get vehicle name by ID
  const getVehicleName = (id: number) => {
    const vehicle = vehicles?.find(v => v.id === id);
    return vehicle ? `${vehicle.vehicleId} (${vehicle.make} ${vehicle.model})` : `Vehicle #${id}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">
          Maintenance Management
        </h1>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Schedule Maintenance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
                <h3 className="text-2xl font-bold">{completedCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upcoming</p>
                <h3 className="text-2xl font-bold">{upcomingCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overdue</p>
                <h3 className="text-2xl font-bold">{overdueCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder="Search maintenance records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedVehicle || ""} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Vehicles</SelectItem>
                {vehicles?.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.vehicleId} ({vehicle.make})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
          <CardDescription>
            A complete list of all scheduled and completed maintenance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingMaintenance ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Loading maintenance records...</p>
            </div>
          ) : !filteredRecords.length ? (
            <div className="text-center py-8">
              <Drill className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400">No maintenance records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Maintenance Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const isOverdue = !record.completedDate && 
                    isBefore(new Date(record.scheduledDate), new Date());

                  return (
                    <TableRow key={record.id}>
                      <TableCell>{getVehicleName(record.vehicleId)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.type}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {record.description.length > 50 
                              ? `${record.description.substring(0, 50)}...` 
                              : record.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(record.scheduledDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {record.completedDate ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </Badge>
                        ) : isOverdue ? (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Overdue
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            Scheduled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.completedDate 
                          ? format(new Date(record.completedDate), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {!record.completedDate && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsComplete(record.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Create a new maintenance task for a vehicle
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="vehicle" className="text-sm font-medium">Vehicle</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles?.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.vehicleId} ({vehicle.make} {vehicle.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Maintenance Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil_change">Oil Change</SelectItem>
                  <SelectItem value="tire_replacement">Tire Replacement</SelectItem>
                  <SelectItem value="brake_service">Brake Service</SelectItem>
                  <SelectItem value="general_service">General Service</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input id="description" placeholder="Enter maintenance details" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Scheduled Date</label>
              <Input id="date" type="date" defaultValue={format(addDays(new Date(), 7), "yyyy-MM-dd")} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              // Would normally submit the form here
              setIsDialogOpen(false);
            }}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenancePage;
