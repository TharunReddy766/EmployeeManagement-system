import { useState } from "react";
import { Employee } from "@/types/employee";
import { EmployeeTable } from "@/components/EmployeeTable";
import { EmployeeDialog } from "@/components/EmployeeDialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      position: "Software Engineer",
      department: "Engineering",
      salary: 85000,
      hireDate: "2023-01-15",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@company.com",
      position: "Product Manager",
      department: "Product",
      salary: 95000,
      hireDate: "2022-08-20",
      phone: "+1 (555) 234-5678",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(query) ||
      employee.lastName.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query)
    );
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));
      toast({
        title: "Employee deleted",
        description: "The employee has been removed successfully.",
      });
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, "id"> | Employee) => {
    if ("id" in employeeData) {
      setEmployees(
        employees.map((emp) =>
          emp.id === employeeData.id ? employeeData : emp
        )
      );
      toast({
        title: "Employee updated",
        description: "Employee information has been updated successfully.",
      });
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Employee added",
        description: "New employee has been added successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-[hsl(241,81%,64%)] shadow-glass">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-[hsl(241,81%,64%)] bg-clip-text text-transparent">
                Employee Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your team members and their information
            </p>
          </div>
          <Button
            onClick={handleAddEmployee}
            size="lg"
            className="bg-gradient-to-r from-primary to-[hsl(241,81%,64%)] hover:opacity-90 transition-opacity shadow-glass"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Employee
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, position, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-card/50 backdrop-blur-xl border-border/50 shadow-glass"
          />
        </div>

        {/* Employee Table */}
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />

        {/* Dialogs */}
        <EmployeeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
        />
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default Index;
