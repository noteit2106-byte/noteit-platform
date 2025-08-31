import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { departments, Department, Branch } from '@/data/departments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, PencilLine, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { slugify } from '@/lib/utils';

// Import missing utils/slugify function
const slugifyFn = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');     // Replace multiple - with single -
};

export default function AdminBranches() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [departmentsCopy, setDepartmentsCopy] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
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

  const selectedDeptObj = departmentsCopy.find(d => d.id === selectedDepartment);
  const branches = selectedDeptObj?.branches || [];
  
  const handleAddBranch = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      imageUrl: ''
    });
    setIsAddBranchDialogOpen(true);
  };
  
  const handleEditBranch = (branch: Branch) => {
    setFormData({
      id: branch.id,
      name: branch.name,
      description: branch.description,
      imageUrl: branch.imageUrl
    });
    setIsEditBranchDialogOpen(true);
  };
  
  const saveBranch = () => {
    if (!selectedDepartment) {
      toast({
        title: "Error",
        description: "Please select a department first",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || !formData.description || !formData.imageUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDepartments = [...departmentsCopy];
    const departmentIndex = updatedDepartments.findIndex(d => d.id === selectedDepartment);
    
    if (departmentIndex === -1) return;
    
    // Creating a new branch
    if (isAddBranchDialogOpen) {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        name: formData.name,
        slug: slugifyFn(formData.name),
        description: formData.description,
        imageUrl: formData.imageUrl,
        subjects: []
      };
      
      updatedDepartments[departmentIndex].branches.push(newBranch);
      setDepartmentsCopy(updatedDepartments);
      
      // In a real app, we would save to a database
      // For now, let's store in localStorage for demo purposes
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Success",
        description: `Branch "${formData.name}" has been added to ${updatedDepartments[departmentIndex].name}`,
      });
      
      setIsAddBranchDialogOpen(false);
    } 
    // Updating an existing branch
    else if (isEditBranchDialogOpen) {
      const branchIndex = updatedDepartments[departmentIndex].branches.findIndex(b => b.id === formData.id);
      
      if (branchIndex === -1) return;
      
      const updatedBranch = {
        ...updatedDepartments[departmentIndex].branches[branchIndex],
        name: formData.name,
        slug: slugifyFn(formData.name),
        description: formData.description,
        imageUrl: formData.imageUrl
      };
      
      updatedDepartments[departmentIndex].branches[branchIndex] = updatedBranch;
      setDepartmentsCopy(updatedDepartments);
      
      // In a real app, we would save to a database
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Success",
        description: `Branch "${formData.name}" has been updated`,
      });
      
      setIsEditBranchDialogOpen(false);
    }
  };
  
  const handleDeleteBranch = (branchId: string) => {
    if (window.confirm('Are you sure you want to delete this branch? This will also delete all subjects and notes in this branch.')) {
      const updatedDepartments = [...departmentsCopy];
      const departmentIndex = updatedDepartments.findIndex(d => d.id === selectedDepartment);
      
      if (departmentIndex === -1) return;
      
      const branchIndex = updatedDepartments[departmentIndex].branches.findIndex(b => b.id === branchId);
      
      if (branchIndex === -1) return;
      
      const branchName = updatedDepartments[departmentIndex].branches[branchIndex].name;
      updatedDepartments[departmentIndex].branches.splice(branchIndex, 1);
      setDepartmentsCopy(updatedDepartments);
      
      // In a real app, we would save to a database
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Branch Deleted",
        description: `Branch "${branchName}" has been removed`,
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
            <h1 className="text-3xl font-bold">Manage Branches</h1>
            <p className="text-muted-foreground mt-2">
              Add, edit, or delete branches within departments
            </p>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Department</CardTitle>
            <CardDescription>Choose a department to manage its branches</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsCopy.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {selectedDepartment && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedDeptObj?.name} Branches
              </h2>
              <Button onClick={handleAddBranch}>
                <Plus className="h-4 w-4 mr-2" /> Add Branch
              </Button>
            </div>
            
            {branches.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches.map((branch) => (
                        <TableRow key={branch.id}>
                          <TableCell className="font-medium">{branch.name}</TableCell>
                          <TableCell>{branch.description}</TableCell>
                          <TableCell>{branch.subjects.length}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditBranch(branch)}>
                              <PencilLine className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteBranch(branch.id)}>
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
                  <p className="text-muted-foreground">No branches found for this department.</p>
                  <Button onClick={handleAddBranch} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add First Branch
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Add Branch Dialog */}
        <Dialog open={isAddBranchDialogOpen} onOpenChange={setIsAddBranchDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="E.g., Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this branch"
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
                  Enter a URL for the branch cover image
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBranchDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveBranch}>Save Branch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Branch Dialog */}
        <Dialog open={isEditBranchDialogOpen} onOpenChange={setIsEditBranchDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Branch Name</Label>
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
              <Button variant="outline" onClick={() => setIsEditBranchDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveBranch}>Update Branch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}