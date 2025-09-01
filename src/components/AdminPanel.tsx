import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Trash2, FileText, AlertTriangle, CheckCircle, Shield, EyeOff } from 'lucide-react';
import { departments, Note as DepartmentNote } from '../data/departments';
import { subjects, Note as SubjectNote } from '../data/subjects';

interface ExtendedNote extends DepartmentNote {
  subjectName?: string;
  branchName?: string;
  departmentName?: string;
  source: 'departments' | 'subjects';
}

interface AdminPanelProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isVisible,
  onToggleVisibility,
}) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allNotes, setAllNotes] = useState<ExtendedNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<ExtendedNote[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<ExtendedNote | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Flatten all notes from both data sources
  useEffect(() => {
    const notes: ExtendedNote[] = [];
    
    // Get notes from departments structure
    departments.forEach(department => {
      department.branches.forEach(branch => {
        branch.subjects.forEach(subject => {
          subject.notes.forEach(note => {
            notes.push({
              ...note,
              subjectName: subject.name,
              branchName: branch.name,
              departmentName: department.name,
              source: 'departments'
            });
          });
        });
      });
    });

    // Get notes from subjects structure
    subjects.forEach(subject => {
      subject.notes.forEach(note => {
        notes.push({
          ...note,
          subjectName: subject.name,
          source: 'subjects',
          fileType: 'markdown' // Default for subjects structure
        });
      });
    });
    
    setAllNotes(notes);
    setFilteredNotes(notes);
  }, []);

  // Filter notes based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotes(allNotes);
    } else {
      const filtered = allNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.subjectName && note.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.branchName && note.branchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.departmentName && note.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, allNotes]);

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin password');
    }
  };

  const handleDeleteNote = (note: ExtendedNote) => {
    setNoteToDelete(note);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!noteToDelete) return;

    // Remove note from the appropriate data structure
    if (noteToDelete.source === 'departments') {
      // Find and remove from departments structure
      departments.forEach(department => {
        department.branches.forEach(branch => {
          branch.subjects.forEach(subject => {
            subject.notes = subject.notes.filter(note => note.id !== noteToDelete.id);
          });
        });
      });
    } else if (noteToDelete.source === 'subjects') {
      // Find and remove from subjects structure
      subjects.forEach(subject => {
        subject.notes = subject.notes.filter(note => note.id !== noteToDelete.id);
      });
    }

    // Update local state
    const updatedNotes = allNotes.filter(note => note.id !== noteToDelete.id);
    setAllNotes(updatedNotes);
    setFilteredNotes(updatedNotes.filter(note =>
      !searchTerm.trim() || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.subjectName && note.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (note.branchName && note.branchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (note.departmentName && note.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
    ));

    setSuccessMessage(`Note "${noteToDelete.title}" has been successfully deleted.`);
    setDeleteConfirmOpen(false);
    setNoteToDelete(null);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setNoteToDelete(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    setSearchTerm('');
    setSuccessMessage('');
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggleVisibility}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Panel
              </CardTitle>
              <CardDescription>Manage notes across all subjects and departments</CardDescription>
            </div>
            <Button onClick={onToggleVisibility} variant="ghost" size="sm">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          
          {successMessage && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <Button onClick={handleAdminLogin} className="w-full">
                Login
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Demo password: admin123
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Manage Notes ({allNotes.length} total)</h3>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search notes by title, description, subject, department, or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {filteredNotes.length} of {allNotes.length} notes
              </div>

              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No notes found matching your search.' : 'No notes available.'}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredNotes.map((note) => (
                    <Card key={`${note.source}-${note.id}`} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <h3 className="font-semibold text-lg">{note.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {note.fileType?.toUpperCase() || 'MARKDOWN'}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{note.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              {note.departmentName && (
                                <Badge variant="secondary" className="text-xs">
                                  {note.departmentName}
                                </Badge>
                              )}
                              {note.branchName && (
                                <Badge variant="secondary" className="text-xs">
                                  {note.branchName}
                                </Badge>
                              )}
                              {note.subjectName && (
                                <Badge variant="secondary" className="text-xs">
                                  {note.subjectName}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {note.source}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-gray-500">
                              Created: {new Date(note.createdAt).toLocaleDateString()}
                              {note.updatedAt && ` • Updated: ${new Date(note.updatedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          
                          <Button
                            onClick={() => handleDeleteNote(note)}
                            variant="destructive"
                            size="sm"
                            className="ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {noteToDelete && (
            <div className="my-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold">{noteToDelete.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{noteToDelete.description}</p>
              <div className="flex space-x-2 mt-2">
                {noteToDelete.departmentName && (
                  <Badge variant="outline" className="text-xs">
                    {noteToDelete.departmentName}
                  </Badge>
                )}
                {noteToDelete.branchName && (
                  <Badge variant="outline" className="text-xs">
                    {noteToDelete.branchName}
                  </Badge>
                )}
                {noteToDelete.subjectName && (
                  <Badge variant="outline" className="text-xs">
                    {noteToDelete.subjectName}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={cancelDelete} variant="outline">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};