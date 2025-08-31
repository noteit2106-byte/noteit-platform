import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { departments, Department } from '@/data/departments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, PencilLine, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { slugify } from '@/lib/utils';

export default function AdminDepartments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [departmentsCopy, setDepartmentsCopy] = useState<Department[]>([]);
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [isEditDepartmentDialogOpen, setIsEditDepartmentDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    imageUrl: ''
  });
  
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
    
    // Load departments from localStorage or use the default
    const storedDepartments = localStorage.getItem('departments');
    if (storedDepartments) {
      try {
        setDepartmentsCopy(JSON.parse(storedDepartments));
      } catch (error) {
        console.error('Failed to parse stored departments:', error);
        setDepartmentsCopy([...departments]);
      }
    } else {
      setDepartmentsCopy([...departments]);
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin()) {
    return null;
  }
  
  const handleAddDepartment = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      imageUrl: ''
    });
    setIsAddDepartmentDialogOpen(true);
  };
  
  const handleEditDepartment = (department: Department) => {
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description,
      imageUrl: department.imageUrl
    });
    setIsEditDepartmentDialogOpen(true);
  };
  
  const saveDepartment = () => {
    if (!formData.name || !formData.description || !formData.imageUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDepartments = [...departmentsCopy];
    
    // Creating a new department
    if (isAddDepartmentDialogOpen) {
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        imageUrl: formData.imageUrl,
        branches: []
      };
      
      updatedDepartments.push(newDepartment);
      setDepartmentsCopy(updatedDepartments);
      
      // In a real app, we would save to a database
      // For now, let's store in localStorage for demo purposes
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Success",
        description: `Department "${formData.name}" has been added`,
      });
      
      setIsAddDepartmentDialogOpen(false);
    } 
    // Updating an existing department
    else if (isEditDepartmentDialogOpen) {
      const departmentIndex = updatedDepartments.findIndex(d => d.id === formData.id);
      
      if (departmentIndex === -1) return;
      
      const updatedDepartment = {
        ...updatedDepartments[departmentIndex],
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        imageUrl: formData.imageUrl
      };
      
      updatedDepartments[departmentIndex] = updatedDepartment;
      setDepartmentsCopy(updatedDepartments);
      
      // In a real app, we would save to a database
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Success",
        description: `Department "${formData.name}" has been updated`,
      });
      
      setIsEditDepartmentDialogOpen(false);
    }
  };
  
  const handleDeleteDepartment = (departmentId: string) => {
    if (window.confirm('Are you sure you want to delete this department? This will also delete all branches, subjects, and notes in this department.')) {
      const updatedDepartments = [...departmentsCopy];
      const departmentIndex = updatedDepartments.findIndex(d => d.id === departmentId);
      
      if (departmentIndex === -1) return;
      
      const departmentName = updatedDepartments[departmentIndex].name;
      updatedDepartments.splice(departmentIndex, 1);
      setDepartmentsCopy(updatedDepartments);
      
      // In a real app, we would save to a database
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Department Deleted",
        description: `Department "${departmentName}" has been removed`,
      });
    }
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/admin')}
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Departments</h1>
            <p className="text-muted-foreground mt-2">
              Add, edit, or delete academic departments
            </p>
          </div>
          <Button onClick={handleAddDepartment}>
            <Plus className="h-4 w-4 mr-2" /> Add Department
          </Button>
        </div>
        
        {departmentsCopy.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Branches</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentsCopy.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.description}</TableCell>
                      <TableCell>{department.branches.length}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditDepartment(department)}>
                          <PencilLine className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDepartment(department.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No departments found.</p>
              <Button onClick={handleAddDepartment} className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add First Department
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Add Department Dialog */}
        <Dialog open={isAddDepartmentDialogOpen} onOpenChange={setIsAddDepartmentDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="E.g., Engineering"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this department"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a URL for the department cover image
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDepartmentDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveDepartment}>Save Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Department Dialog */}
        <Dialog open={isEditDepartmentDialogOpen} onOpenChange={setIsEditDepartmentDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Department Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDepartmentDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveDepartment}>Update Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}