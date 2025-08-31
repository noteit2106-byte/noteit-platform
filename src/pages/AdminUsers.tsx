import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, UserPlus, Shield, UserX, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Mock users data - in a real app, this would come from a database
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin' as UserRole,
    lastLogin: new Date('2023-12-15T08:30:45Z').toISOString() // Example timestamp
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    password: 'student123', // In a real app, this would be hashed
    role: 'student' as UserRole,
    studentId: '2023CS001',
    lastLogin: new Date('2023-12-18T14:22:10Z').toISOString() // Example timestamp
  }
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState<typeof MOCK_USERS>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    role: 'student' as UserRole
  });
  
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
    
    // Load users from localStorage or use mock data
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers([...MOCK_USERS, ...parsedUsers]);
        } else {
          setUsers([...MOCK_USERS]);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers([...MOCK_USERS]);
      }
    };
    
    loadUsers();
  }, [isAdmin, navigate]);
  
  if (!isAdmin()) {
    return null;
  }

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      studentId: '',
      role: 'student'
    });
    setIsAddUserDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    const { name, email, password, confirmPassword, studentId, role } = formData;
    
    // Validation
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (role === 'student' && !studentId) {
      toast({
        title: "Error",
        description: "Student ID is required for student accounts",
        variant: "destructive"
      });
      return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In a real app, this would be hashed
      role,
      ...(role === 'student' && { studentId })
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Save to localStorage (excluding built-in mock users)
    const registeredUsers = updatedUsers.filter(
      u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
    );
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    toast({
      title: "Success",
      description: `User "${name}" has been added successfully`,
    });
    
    setIsAddUserDialogOpen(false);
  };
  
  const toggleUserRole = (userId: string, currentRole: UserRole) => {
    // Don't allow changing your own role (to prevent locking yourself out)
    if (userId === user?.id) {
      toast({
        title: "Permission Denied",
        description: "You cannot change your own administrative status",
        variant: "destructive"
      });
      return;
    }
    
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: currentRole === 'admin' ? 'student' as UserRole : 'admin' as UserRole
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    
    // Save to localStorage (excluding built-in mock users)
    const registeredUsers = updatedUsers.filter(
      u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
    );
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    toast({
      title: "Role Updated",
      description: `User role has been ${currentRole === 'admin' ? 'revoked from' : 'granted to'} admin`,
    });
  };
  
  const deleteUser = (userId: string, userName: string) => {
    // Don't allow deleting your own account
    if (userId === user?.id) {
      toast({
        title: "Permission Denied",
        description: "You cannot delete your own account",
        variant: "destructive"
      });
      return;
    }
    
    // Don't allow deleting built-in mock users
    if (MOCK_USERS.some(u => u.id === userId)) {
      toast({
        title: "Permission Denied",
        description: "Cannot delete system default accounts",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      // Save to localStorage
      const registeredUsers = updatedUsers.filter(
        u => !MOCK_USERS.some(mockUser => mockUser.id === u.id)
      );
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      toast({
        title: "User Deleted",
        description: `User "${userName}" has been removed`,
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
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground mt-2">
              Add new users and manage admin permissions
            </p>
          </div>
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" /> Add New User
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>Manage user accounts and admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.studentId || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? "default" : "outline"}>
                        {user.role === 'admin' ? 'Administrator' : 'Student'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? 
                        new Date(user.lastLogin).toLocaleString() : 
                        <span className="text-muted-foreground italic">Never</span>
                      }
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant={user.role === 'admin' ? "secondary" : "outline"} 
                        size="sm"
                        onClick={() => toggleUserRole(user.id, user.role)}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" /> Is Admin
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" /> Not Admin
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteUser(user.id, user.name)}
                        disabled={MOCK_USERS.some(u => u.id === user.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Add User Dialog */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">User Role</Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="roleStudent"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={() => setFormData({...formData, role: 'student'})}
                      className="mr-2"
                    />
                    <Label htmlFor="roleStudent">Student</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="roleAdmin"
                      name="role"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={() => setFormData({...formData, role: 'admin'})}
                      className="mr-2"
                    />
                    <Label htmlFor="roleAdmin">Administrator</Label>
                  </div>
                </div>
              </div>
              {formData.role === 'student' && (
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    placeholder="Student ID (e.g., 2023CS001)"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}