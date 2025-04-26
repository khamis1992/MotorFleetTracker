import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  FileText,
  Plus,
  CreditCard,
  Calendar,
  TrendingUp,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  RefreshCcw,
} from "lucide-react";
import { format, subDays, isAfter } from "date-fns";
import { Vehicle } from "@/types";

// Mock transaction types (this would be from the API in a real implementation)
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  vehicle?: string;
  status: 'pending' | 'completed';
}

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  // Fetch vehicles for selection in forms
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // Function to generate dates for demo data (would be replaced by real API calls)
  const getRecentDate = (daysAgo: number) => {
    return subDays(new Date(), daysAgo).toISOString();
  };

  // Mock transactions that would come from the API
  const transactions: Transaction[] = [
    { id: 1, date: getRecentDate(2), description: "Fuel purchase", amount: 45.23, type: 'expense', category: 'Fuel', vehicle: 'MBK-1023', status: 'completed' },
    { id: 2, date: getRecentDate(4), description: "Oil change service", amount: 120.00, type: 'expense', category: 'Maintenance', vehicle: 'MBK-1065', status: 'completed' },
    { id: 3, date: getRecentDate(6), description: "Tire replacement", amount: 250.50, type: 'expense', category: 'Maintenance', vehicle: 'MBK-1089', status: 'completed' },
    { id: 4, date: getRecentDate(7), description: "Delivery service", amount: 500.00, type: 'income', category: 'Service', status: 'completed' },
    { id: 5, date: getRecentDate(10), description: "Insurance premium", amount: 350.00, type: 'expense', category: 'Insurance', vehicle: 'MBK-1023', status: 'completed' },
    { id: 6, date: getRecentDate(12), description: "Registration renewal", amount: 75.00, type: 'expense', category: 'Administrative', vehicle: 'MBK-1075', status: 'pending' },
    { id: 7, date: getRecentDate(15), description: "Delivery service", amount: 450.00, type: 'income', category: 'Service', status: 'completed' },
    { id: 8, date: getRecentDate(18), description: "Parking fees", amount: 25.00, type: 'expense', category: 'Administrative', vehicle: 'MBK-1065', status: 'completed' },
    { id: 9, date: getRecentDate(20), description: "Brake repair", amount: 180.00, type: 'expense', category: 'Maintenance', vehicle: 'MBK-1089', status: 'completed' },
    { id: 10, date: getRecentDate(25), description: "Monthly rental", amount: 300.00, type: 'expense', category: 'Administrative', status: 'completed' },
  ];

  // Filter transactions based on search and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === "" || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.vehicle && transaction.vehicle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "" || transaction.category === categoryFilter;
    
    // Filter by date range
    const transactionDate = new Date(transaction.date);
    let dateMatches = true;
    
    if (dateRange === "week") {
      dateMatches = isAfter(transactionDate, subDays(new Date(), 7));
    } else if (dateRange === "month") {
      dateMatches = isAfter(transactionDate, subDays(new Date(), 30));
    } else if (dateRange === "quarter") {
      dateMatches = isAfter(transactionDate, subDays(new Date(), 90));
    }
    
    return matchesSearch && matchesCategory && dateMatches;
  });

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

  // Get categories for filter
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">
          Financial Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateInvoiceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</p>
                    <h3 className="text-2xl font-bold">${totalIncome.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
                    <h3 className="text-2xl font-bold">${totalExpenses.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Balance</p>
                    <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${netBalance.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Categories and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Expense distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* We'd use a chart library here, but for simplicity we'll show a text breakdown */}
                  {categories.map(category => {
                    const categoryExpenses = filteredTransactions
                      .filter(t => t.type === 'expense' && t.category === category)
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const percentage = totalExpenses > 0 
                      ? Math.round((categoryExpenses / totalExpenses) * 100) 
                      : 0;
                    
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-slate-500">${categoryExpenses.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 dark:bg-green-900' 
                            : 'bg-red-100 dark:bg-red-900'
                        } flex items-center justify-center mr-3`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className={`h-5 w-5 text-green-600 dark:text-green-400`} />
                          ) : (
                            <ArrowDownRight className={`h-5 w-5 text-red-600 dark:text-red-400`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {format(new Date(transaction.date), "MMM d, yyyy")} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="font-medium">
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-2 w-full text-sm" onClick={() => setActiveTab("transactions")}>
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-auto"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No transactions found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.vehicle || "—"}</TableCell>
                        <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Invoices</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button size="sm" onClick={() => setIsCreateInvoiceOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No Invoices Yet</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create your first invoice to start tracking payments
                </p>
                <Button className="mt-4" onClick={() => setIsCreateInvoiceOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports for your fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 text-primary-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Expense Report</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      View detailed breakdown of all expenses by category and vehicle.
                    </p>
                    <Button className="w-full">Generate</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <CreditCard className="h-8 w-8 text-primary-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Revenue Report</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Track income sources and revenue trends over time.
                    </p>
                    <Button className="w-full">Generate</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Calendar className="h-8 w-8 text-primary-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Monthly Summary</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Monthly financial overview with profit and loss statement.
                    </p>
                    <Button className="w-full">Generate</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Enter the invoice details to generate a new invoice.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="invoice-number" className="text-sm font-medium">Invoice #</label>
                <Input id="invoice-number" placeholder="INV-001" />
              </div>
              <div className="space-y-2">
                <label htmlFor="invoice-date" className="text-sm font-medium">Date</label>
                <Input id="invoice-date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">Client</label>
              <Input id="client" placeholder="Enter client name" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="vehicle" className="text-sm font-medium">Related Vehicle (Optional)</label>
              <Select>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select vehicle" />
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
              <label className="text-sm font-medium">Invoice Items</label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4">
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-6">
                    <Input placeholder="Item description" />
                  </div>
                  <div className="col-span-2">
                    <Input placeholder="Qty" type="number" />
                  </div>
                  <div className="col-span-2">
                    <Input placeholder="Price" type="number" />
                  </div>
                  <div className="col-span-2">
                    <Input placeholder="Total" disabled />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Input id="notes" placeholder="Add any additional notes" />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Subtotal: $0.00
              </div>
              <div className="text-lg font-semibold">
                Total: $0.00
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateInvoiceOpen(false)}>
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
