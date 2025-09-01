import React, { useState } from 'react';
import { Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Note } from '../data/notes';

interface AdminPanelProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  notes,
  onDeleteNote,
  isVisible,
  onToggleVisibility,
}) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdminLogin = () => {
    // Simple password check - in production, use proper authentication
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin password');
    }
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${noteTitle}"? This action cannot be undone.`)) {
      onDeleteNote(noteId);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel
          </CardTitle>
          <Button
            onClick={onToggleVisibility}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto">
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
                <h3 className="text-lg font-semibold">Manage Notes ({notes.length} total)</h3>
                <Button
                  onClick={() => setIsAuthenticated(false)}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
              
              <Input
                placeholder="Search notes by title, subject, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{note.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {note.subject}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By {note.author} • {note.pages} pages • {note.downloads} downloads
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteNote(note.id, note.title)}
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {filteredNotes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No notes found matching your search.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};