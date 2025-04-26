import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Search,
  Filter,
  Plus,
  Check,
  X,
  MoreHorizontal,
  Mail,
  Phone,
  UserPlus,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole, User as UserType } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Extend the User type for display purposes
interface ExtendedUser extends UserType {
  assignedVehicle?: string;
  lastActive?: string;
}

const RidersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch users data
  const { data: users, isLoading } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
  });

  // Filter users based on search and role
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchQuery === "" ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) || [];

  // Extend users with mock vehicle and activity data for display
  const extendedUsers: ExtendedUser[] = filteredUsers.map(user => ({
    ...user,
    assignedVehicle: user.role === "rider" ? "MBK-1023" : undefined,
    lastActive: "2 hours ago"
  }));

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Format role for display
  const formatRole = (role: UserRole) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "rider":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Rider</Badge>;
      case "fleet_supervisor":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Fleet Supervisor</Badge>;
      case "admin":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Admin</Badge>;
      case "super_admin":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Super Admin</Badge>;
      default:
        return <Badge>{formatRole(role)}</Badge>;
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
      await apiRequest("PUT", `/api/users/${id}`, {
        active: !currentStatus
      });
      
      // Invalidate user data to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">
          Rider Management
        </h1>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Rider
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder="Search riders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="rider">Rider</SelectItem>
                <SelectItem value="fleet_supervisor">Fleet Supervisor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode("list")}>
                  <Check className={`h-4 w-4 mr-2 ${viewMode === "list" ? "opacity-100" : "opacity-0"}`} />
                  List View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("grid")}>
                  <Check className={`h-4 w-4 mr-2 ${viewMode === "grid" ? "opacity-100" : "opacity-0"}`} />
                  Grid View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Sort by Name
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Sort by Role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <span className="ml-2 text-slate-500 dark:text-slate-400">Loading riders...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && extendedUsers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
          <User className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No riders found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Rider
          </Button>
        </div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && extendedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riders ({extendedUsers.length})</CardTitle>
            <CardDescription>
              Manage riders and employees across your fleet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extendedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Last active: {user.lastActive}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>{user.assignedVehicle || "—"}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={user.active} 
                        onCheckedChange={() => toggleUserStatus(user.id, user.active)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" /> Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && extendedUsers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {extendedUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-2 text-center">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{user.firstName} {user.lastName}</CardTitle>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {user.phone}
                  </div>
                )}
                {user.assignedVehicle && (
                  <div className="mt-2 bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                    <span className="font-medium">Assigned:</span> {user.assignedVehicle}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Active</span>
                  <Switch 
                    checked={user.active} 
                    onCheckedChange={() => toggleUserStatus(user.id, user.active)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Rider Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Rider</DialogTitle>
            <DialogDescription>
              Enter the details of the new rider to add them to your fleet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rider">Rider</SelectItem>
                  <SelectItem value="fleet_supervisor">Fleet Supervisor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Initial Password</label>
              <Input id="password" type="password" placeholder="Enter initial password" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Would handle form submission here
              setIsAddDialogOpen(false);
            }}>
              Add Rider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RidersPage;
