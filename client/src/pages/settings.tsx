import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";
import {
  User,
  Bell,
  Shield,
  Globe,
  Map,
  Settings as SettingsIcon,
  Users,
  Building,
  Key,
  Save,
  Upload,
  HelpCircle,
  Info,
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/use-auth";

const SettingsPage: React.FC = () => {
  const { user } = useProtectedRoute();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");

  // States for form values (in a real app these would be proper form management with react-hook-form)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme === "dark");
  const [mapDefaultLocation, setMapDefaultLocation] = useState("last-known");
  const [geofenceNotify, setGeofenceNotify] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [companyName, setCompanyName] = useState("RiderLink Fleet");
  const [businessType, setBusinessType] = useState("delivery");
  const [contactEmail, setContactEmail] = useState("admin@riderlink.com");
  const [contactPhone, setContactPhone] = useState("+1 (123) 456-7890");
  const [address, setAddress] = useState("123 Transport Ave, Fleet City, FC 12345");
  const [apiKey, setApiKey] = useState("••••••••••••••••");

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
    toggleTheme();
  };

  // Mock save changes function
  const saveChanges = () => {
    // In a real implementation, this would save to the backend
    console.log("Saving settings changes");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">
          Settings
        </h1>
        <Button size="sm" onClick={saveChanges}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "profile"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "notifications"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "appearance"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                Appearance
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "security"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("tracking")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "tracking"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Map className="mr-2 h-4 w-4" />
                GPS Tracking
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "users"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab("company")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "company"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Building className="mr-2 h-4 w-4" />
                Company Profile
              </button>
              <button
                onClick={() => setActiveTab("api")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === "api"
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Key className="mr-2 h-4 w-4" />
                API Access
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Main Settings Content */}
        <div className="md:col-span-3">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={user?.profileImage} 
                      alt={`${user?.firstName} ${user?.lastName}`} 
                    />
                    <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" /> Upload New Picture
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input 
                      id="first-name" 
                      defaultValue={user?.firstName || ""}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input 
                      id="last-name" 
                      defaultValue={user?.lastName || ""}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ""}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    defaultValue={user?.phone || ""}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language Preference</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Notifications</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Receive notifications about important system events
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Push Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Receive push notifications in the browser or mobile app
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="alert-notifications" checked disabled={!notificationsEnabled} />
                      <div>
                        <Label htmlFor="alert-notifications" className="font-medium">System Alerts</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Critical alerts about system status
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="vehicle-notifications" checked disabled={!notificationsEnabled} />
                      <div>
                        <Label htmlFor="vehicle-notifications" className="font-medium">Vehicle Updates</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Status changes to vehicles
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="maintenance-notifications" checked disabled={!notificationsEnabled} />
                      <div>
                        <Label htmlFor="maintenance-notifications" className="font-medium">Maintenance Reminders</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Upcoming and overdue maintenance
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="rider-notifications" checked disabled={!notificationsEnabled} />
                      <div>
                        <Label htmlFor="rider-notifications" className="font-medium">Rider Activity</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Updates on rider assignments and status
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="geofence-notifications" checked disabled={!notificationsEnabled} />
                      <div>
                        <Label htmlFor="geofence-notifications" className="font-medium">Geofence Alerts</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          When vehicles enter or exit geofences
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="finance-notifications" checked disabled={!notificationsEnabled} />
                      <div>
                        <Label htmlFor="finance-notifications" className="font-medium">Financial Updates</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Payment and invoice notifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={darkModeEnabled}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Theme Customization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3 cursor-pointer hover:border-primary-500 transition-colors">
                      <div className="h-24 bg-gradient-to-br from-blue-500 to-primary-600 rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-center">Default</p>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3 cursor-pointer hover:border-primary-500 transition-colors">
                      <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-center">Purple</p>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3 cursor-pointer hover:border-primary-500 transition-colors">
                      <div className="h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-center">Green</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sidebar-behavior">Sidebar Behavior</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue placeholder="Select behavior" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="expanded">Always Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="density">Layout Density</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input type="password" id="current-password" placeholder="Enter your current password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input type="password" id="new-password" placeholder="Enter new password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input type="password" id="confirm-password" placeholder="Confirm new password" />
                  </div>
                  
                  <Button className="mt-2">Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add an extra layer of security to your account
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable 2FA</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Require a verification code when logging in
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Session Management</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Current Session</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Chrome on Windows • Last active: Just now
                        </p>
                      </div>
                      <Badge>Current</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline">Sign Out All Other Sessions</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GPS Tracking Settings */}
          {activeTab === "tracking" && (
            <Card>
              <CardHeader>
                <CardTitle>GPS Tracking Settings</CardTitle>
                <CardDescription>
                  Configure GPS tracking and geofencing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="default-location">Default Map Location</Label>
                  <Select value={mapDefaultLocation} onValueChange={setMapDefaultLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-known">Last Known Location</SelectItem>
                      <SelectItem value="fleet-center">Fleet Center</SelectItem>
                      <SelectItem value="custom">Custom Coordinates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {mapDefaultLocation === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" placeholder="Enter latitude" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" placeholder="Enter longitude" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="tracking-interval">Tracking Interval (seconds)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="600">10 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    How frequently GPS locations are updated
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Geofencing</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Geofence Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get notified when vehicles enter or exit geofences
                      </p>
                    </div>
                    <Switch
                      checked={geofenceNotify}
                      onCheckedChange={setGeofenceNotify}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Default Geofence Radius</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Default radius when creating new geofences
                      </p>
                    </div>
                    <div className="w-[120px]">
                      <Input type="number" defaultValue={500} min={100} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Maintenance Tracking</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Maintenance Reminders</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get alerts for scheduled maintenance based on odometer readings
                      </p>
                    </div>
                    <Switch
                      checked={maintenanceReminders}
                      onCheckedChange={setMaintenanceReminders}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Reminder Days Before Due</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* User Management Settings */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Configure user permissions and roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Role Management</h3>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Role
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Super Admin</TableCell>
                      <TableCell>Full System Access</TableCell>
                      <TableCell>Complete control over all system functions</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Admin</TableCell>
                      <TableCell>Administrative</TableCell>
                      <TableCell>Access to operational functions except system settings</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fleet Supervisor</TableCell>
                      <TableCell>Operational</TableCell>
                      <TableCell>Manage fleet and maintenance functions</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Rider</TableCell>
                      <TableCell>Limited</TableCell>
                      <TableCell>Access to personal dashboard and assigned vehicles</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">User Permissions</h3>
                    <Button size="sm" variant="outline">
                      Manage Permissions
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Default User Role</h4>
                      <Select defaultValue="rider">
                        <SelectTrigger>
                          <SelectValue placeholder="Select default role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rider">Rider</SelectItem>
                          <SelectItem value="fleet_supervisor">Fleet Supervisor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Default role assigned to new users
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">User Activation</h4>
                      <Select defaultValue="auto">
                        <SelectTrigger>
                          <SelectValue placeholder="Select activation method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Automatic</SelectItem>
                          <SelectItem value="manual">Manual Approval</SelectItem>
                          <SelectItem value="email">Email Verification</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        How new user accounts are activated
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Company Profile Settings */}
          {activeTab === "company" && (
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  Update your organization's information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Building className="h-10 w-10 text-slate-400" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" /> Upload Logo
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input 
                      id="company-name" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">Delivery Service</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="courier">Courier Service</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email" 
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@company.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input 
                        id="contact-phone" 
                        type="tel" 
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter company address"
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Branding</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 bg-blue-500"></div>
                        <Input id="primary-color" defaultValue="#3b82f6" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 bg-amber-500"></div>
                        <Input id="secondary-color" defaultValue="#f59e0b" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* API Access Settings */}
          {activeTab === "api" && (
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Manage API keys and integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">API Keys</h3>
                    <Button size="sm" variant="outline">
                      <Key className="mr-2 h-4 w-4" /> Generate New Key
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Your API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="api-key" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="font-mono"
                        disabled
                      />
                      <Button variant="outline" size="sm">
                        Show
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Keep this key secure. Don't share it publicly.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Webhooks</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Configure webhook endpoints to receive real-time event notifications
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input 
                      id="webhook-url" 
                      placeholder="https://your-server.com/webhook"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook-events">Events to Send</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="event-vehicle-location" />
                        <Label htmlFor="event-vehicle-location">Vehicle Location Updates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="event-maintenance" />
                        <Label htmlFor="event-maintenance">Maintenance Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="event-rider" />
                        <Label htmlFor="event-rider">Rider Status Changes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="event-alert" />
                        <Label htmlFor="event-alert">System Alerts</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Webhook</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Third-Party Integrations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Mapbox</h4>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                          Used for GPS tracking and mapping
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Configure
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Payment Gateway</h4>
                          <Switch />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                          Process payments and invoices
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Configure
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Import for Checkbox component
import { Checkbox } from "@/components/ui/checkbox";

export default SettingsPage;
