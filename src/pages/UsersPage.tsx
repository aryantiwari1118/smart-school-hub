import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { storage, exportToCSV, validateEmail, validateRequired } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, Download, X, Upload, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  class: string;
  status: "Active" | "Inactive";
  joinDate: string;
  isNew?: boolean;
}

const UsersPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Student", class: "", status: "Active" as const });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [importError, setImportError] = useState<string>("");
  
  const defaultUsers: User[] = [
    { id: 1, name: "Rajesh Kumar", email: "teacher@smartedu.com", role: "Teacher", class: "10-A", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Priya Sharma", email: "student1@smartedu.com", role: "Student", class: "10-A", status: "Active", joinDate: "2024-02-01" },
    { id: 3, name: "Amit Singh", email: "student2@smartedu.com", role: "Student", class: "9-B", status: "Active", joinDate: "2024-02-03" },
    { id: 4, name: "Sara Khan", email: "parent@smartedu.com", role: "Parent", class: "10-A", status: "Active", joinDate: "2024-02-05" },
    { id: 5, name: "John Doe", email: "teacher2@smartedu.com", role: "Teacher", class: "9-B", status: "Inactive", joinDate: "2024-01-20" },
  ];
  
  const [users, setUsers] = useState<User[]>(() => storage.get("users", defaultUsers) || defaultUsers);
  const [selectedNewUsers, setSelectedNewUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    storage.set("users", users);
  }, [users]);

  const newUsers = users.filter(u => u.isNew);
  const hasNewUsers = newUsers.length > 0;

  const toggleSelectNewUser = (userId: number) => {
    const newSelected = new Set(selectedNewUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedNewUsers(newSelected);
  };

  const handleDeleteNewUsers = () => {
    const userIdsToDelete = selectedNewUsers.size > 0 ? selectedNewUsers : new Set(newUsers.map(u => u.id));
    const usersToKeep = users.filter(u => !userIdsToDelete.has(u.id));
    setUsers(usersToKeep);
    setSelectedNewUsers(new Set());
    
    toast({
      title: "Users Deleted",
      description: `${userIdsToDelete.size} newly added user(s) have been removed.`,
      variant: "destructive" as const,
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!validateRequired(formData.name)) errors.name = "Name is required";
    if (!validateEmail(formData.email)) errors.email = "Valid email is required";
    if (!validateRequired(formData.role)) errors.role = "Role is required";
    
    // Check for duplicate email (excluding current user if editing)
    const emailExists = users.some(u => u.email === formData.email && u.id !== (editingUserId || -1));
    if (emailExists) errors.email = "Email already in use";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role as any, class: user.class, status: user.status });
      setEditingUserId(user.id);
    } else {
      setFormData({ name: "", email: "", role: "Student", class: "", status: "Active" });
      setEditingUserId(null);
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!validateForm()) return;

    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, ...formData } : u));
      toast({
        title: "User Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        isNew: true,
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    if (selectedNewUsers.has(userId)) {
      const newSelected = new Set(selectedNewUsers);
      newSelected.delete(userId);
      setSelectedNewUsers(newSelected);
    }
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system.`,
      variant: "destructive" as const,
    });
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    ));
  };

  const handleExport = () => {
    const exportData = users.map(({ id, name, email, role, class: cls, status, joinDate }) => ({
      ID: id,
      Name: name,
      Email: email,
      Role: role,
      Class: cls,
      Status: status,
      "Join Date": joinDate,
    }));
    exportToCSV("users", exportData);
    toast({
      title: "Export Complete",
      description: "User data exported to CSV successfully.",
    });
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error("CSV file is empty or contains only headers");
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data: Record<string, string>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;
      
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
    
    return data;
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError("");
    
    try {
      const text = await file.text();
      const importedData = parseCSV(text);
      
      if (importedData.length === 0) {
        throw new Error("No valid user data found in CSV");
      }

      const newUsers: User[] = [];
      const errors: string[] = [];
      let successCount = 0;

      importedData.forEach((row, index) => {
        const name = row.Name || row.name || "";
        const email = row.Email || row.email || "";
        const role = row.Role || row.role || "Student";
        const cls = row.Class || row.class || "";
        const status = (row.Status || row.status || "Active") as "Active" | "Inactive";

        if (!name || !email) {
          errors.push(`Row ${index + 2}: Missing name or email`);
          return;
        }

        if (!validateEmail(email)) {
          errors.push(`Row ${index + 2}: Invalid email format`);
          return;
        }

        const emailExists = users.some(u => u.email === email) || newUsers.some(u => u.email === email);
        if (emailExists) {
          errors.push(`Row ${index + 2}: Email already exists`);
          return;
        }

        newUsers.push({
          id: Math.max(...users.map(u => u.id), ...newUsers.map(u => u.id), 0) + 1 + newUsers.length,
          name,
          email,
          role,
          class: cls,
          status,
          joinDate: new Date().toISOString().split('T')[0],
          isNew: true,
        });
        successCount++;
      });

      if (successCount === 0) {
        throw new Error(errors.length > 0 ? errors[0] : "No valid users to import");
      }

      setUsers([...users, ...newUsers]);
      setIsImportDialogOpen(false);
      
      let message = `${successCount} user(s) imported successfully`;
      if (errors.length > 0) {
        message += ` (${errors.length} skipped)`;
      }
      
      toast({
        title: "Import Complete",
        description: message,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to import CSV file";
      setImportError(errorMessage);
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive" as const,
      });
    }
    
    event.target.value = "";
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
            <p className="text-sm text-muted-foreground">Manage all system users and permissions</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {hasNewUsers && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" className="gap-2">
                    <Trash className="h-4 w-4" /> Delete Recent Users
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recently Added Users</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedNewUsers.size > 0 ? selectedNewUsers.size : newUsers.length} recently added user(s)? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-2 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={handleDeleteNewUsers}
                    >
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" /> Add User
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUserId ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                  {editingUserId ? "Update user information" : "Enter details for the new user"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (formErrors.name) setFormErrors({...formErrors, name: ""});
                    }}
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (formErrors.email) setFormErrors({...formErrors, email: ""});
                    }}
                    className={formErrors.email ? "border-destructive" : ""}
                  />
                  {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class / Section</Label>
                  <Input
                    id="class"
                    placeholder="e.g., 10-A"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveUser}>{editingUserId ? "Update" : "Add"} User</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Total Users: {users.length}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" /> Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Users</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file with user data. Required columns: Name, Email. Optional columns: Role, Class, Status
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {importError && (
                      <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">
                        {importError}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="csv-file">CSV File</Label>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleImportFile}
                      />
                      <p className="text-xs text-muted-foreground">
                        CSV should have headers: Name, Email, Role, Class, Status
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} className="w-full">
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or role..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {hasNewUsers && <TableHead className="w-10"></TableHead>}
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={hasNewUsers ? 7 : 6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className={`hover:bg-muted/50 ${user.isNew ? 'bg-yellow-50/30 dark:bg-yellow-950/20' : ''}`}>
                        {hasNewUsers && (
                          <TableCell className="w-10">
                            {user.isNew ? (
                              <Checkbox
                                checked={selectedNewUsers.has(user.id)}
                                onCheckedChange={() => toggleSelectNewUser(user.id)}
                              />
                            ) : null}
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{user.class || "—"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "Active" ? "default" : "secondary"} 
                            className="text-xs cursor-pointer"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-2 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
