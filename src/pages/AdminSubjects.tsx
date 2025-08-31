import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { departments, Department, Branch, Subject } from '@/data/departments';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define slugify function
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');     // Replace multiple - with single -
};

export default function AdminSubjects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [departmentsCopy, setDepartmentsCopy] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isEditSubjectDialogOpen, setIsEditSubjectDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
    
    // Try to load any saved departments data from localStorage
    const savedDepartments = localStorage.getItem('departments');
    if (savedDepartments) {
      try {
        setDepartmentsCopy(JSON.parse(savedDepartments));
      } catch (e) {
        console.error('Failed to parse saved departments:', e);
        setDepartmentsCopy([...departments]);
      }
    } else {
      setDepartmentsCopy([...departments]);
    }
  }, [isAdmin, navigate]);
  
  // Reset branch selection when department changes
  useEffect(() => {
    setSelectedBranch('');
  }, [selectedDepartment]);
  
  if (!isAdmin()) {
    return null;
  }

  const selectedDeptObj = departmentsCopy.find(d => d.id === selectedDepartment);
  const branches = selectedDeptObj?.branches || [];
  const selectedBranchObj = branches.find(b => b.id === selectedBranch);
  const subjects = selectedBranchObj?.subjects || [];
  
  const handleAddSubject = () => {
    setFormData({
      id: '',
      name: '',
      description: ''
    });
    setIsAddSubjectDialogOpen(true);
  };
  
  const handleEditSubject = (subject: Subject) => {
    setFormData({
      id: subject.id,
      name: subject.name,
      description: subject.description
    });
    setIsEditSubjectDialogOpen(true);
  };
  
  const saveSubject = () => {
    if (!selectedDepartment || !selectedBranch) {
      toast({
        title: "Error",
        description: "Please select a department and branch first",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || !formData.description) {
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
    
    const branchIndex = updatedDepartments[departmentIndex].branches.findIndex(b => b.id === selectedBranch);
    
    if (branchIndex === -1) return;
    
    // Creating a new subject
    if (isAddSubjectDialogOpen) {
      const newSubject: Subject = {
        id: `subject-${Date.now()}`,
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        notes: []
      };
      
      updatedDepartments[departmentIndex].branches[branchIndex].subjects.push(newSubject);
      setDepartmentsCopy(updatedDepartments);
      
      // Save to localStorage for demo purposes
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Success",
        description: `Subject "${formData.name}" has been added successfully`,
      });
      
      setIsAddSubjectDialogOpen(false);
    } 
    // Updating an existing subject
    else if (isEditSubjectDialogOpen) {
      const subjectIndex = updatedDepartments[departmentIndex].branches[branchIndex].subjects.findIndex(s => s.id === formData.id);
      
      if (subjectIndex === -1) return;
      
      const updatedSubject = {
        ...updatedDepartments[departmentIndex].branches[branchIndex].subjects[subjectIndex],
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description
      };
      
      updatedDepartments[departmentIndex].branches[branchIndex].subjects[subjectIndex] = updatedSubject;
      setDepartmentsCopy(updatedDepartments);
      
      // Save to localStorage
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Success",
        description: `Subject "${formData.name}" has been updated`,
      });
      
      setIsEditSubjectDialogOpen(false);
    }
  };
  
  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also delete all notes in this subject.')) {
      const updatedDepartments = [...departmentsCopy];
      const departmentIndex = updatedDepartments.findIndex(d => d.id === selectedDepartment);
      
      if (departmentIndex === -1) return;
      
      const branchIndex = updatedDepartments[departmentIndex].branches.findIndex(b => b.id === selectedBranch);
      
      if (branchIndex === -1) return;
      
      const subjectIndex = updatedDepartments[departmentIndex].branches[branchIndex].subjects.findIndex(s => s.id === subjectId);
      
      if (subjectIndex === -1) return;
      
      const subjectName = updatedDepartments[departmentIndex].branches[branchIndex].subjects[subjectIndex].name;
      updatedDepartments[departmentIndex].branches[branchIndex].subjects.splice(subjectIndex, 1);
      setDepartmentsCopy(updatedDepartments);
      
      // Save to localStorage
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      toast({
        title: "Subject Deleted",
        description: `Subject "${subjectName}" has been removed`,
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
            <h1 className="text-3xl font-bold">Manage Subjects</h1>
            <p className="text-muted-foreground mt-2">
              Add, edit, or delete subjects within branches
            </p>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Department and Branch</CardTitle>
            <CardDescription>Choose where to manage subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full">
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
            </div>
            
            <div>
              <Label>Branch</Label>
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
                disabled={!selectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {selectedDepartment && selectedBranch && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Subjects in {selectedBranchObj?.name}
              </h2>
              <Button onClick={handleAddSubject}>
                <Plus className="h-4 w-4 mr-2" /> Add Subject
              </Button>
            </div>
            
            {subjects.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Notes Count</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>{subject.description}</TableCell>
                          <TableCell>{subject.notes.length}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
                              <PencilLine className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
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
                  <p className="text-muted-foreground">No subjects found for this branch.</p>
                  <Button onClick={handleAddSubject} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add First Subject
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Add Subject Dialog */}
        <Dialog open={isAddSubjectDialogOpen} onOpenChange={setIsAddSubjectDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="E.g., Data Structures"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this subject"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSubjectDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveSubject}>Save Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Subject Dialog */}
        <Dialog open={isEditSubjectDialogOpen} onOpenChange={setIsEditSubjectDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Subject Name</Label>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSubjectDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveSubject}>Update Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}