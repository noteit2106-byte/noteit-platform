import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments } from '@/data/departments';
import { useToast } from '@/components/ui/use-toast';
// No need for FileUploader component as we're using the native Input
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function AdminUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [departmentId, setDepartmentId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [uploadType, setUploadType] = useState<'markdown' | 'file'>('markdown');
  const [fileType, setFileType] = useState<'pdf' | 'doc' | 'ppt' | 'image' | 'other'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [isHandwritten, setIsHandwritten] = useState(false);
  const [batch, setBatch] = useState('');
  
  const selectedDepartment = departments.find(d => d.id === departmentId);
  const branches = selectedDepartment?.branches || [];
  
  const selectedBranch = branches.find(b => b.id === branchId);
  const subjects = selectedBranch?.subjects || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-detect file type based on extension
      const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      if (['pdf'].includes(extension)) {
        setFileType('pdf');
      } else if (['doc', 'docx'].includes(extension)) {
        setFileType('doc');
      } else if (['ppt', 'pptx'].includes(extension)) {
        setFileType('ppt');
      } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
        setFileType('image');
      } else {
        setFileType('other');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!departmentId || !branchId || !subjectId || !title || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Additional validation for upload type
    if (uploadType === 'markdown' && !content) {
      toast({
        title: "Error",
        description: "Please provide content for the note",
        variant: "destructive",
      });
      return;
    }
    
    if (uploadType === 'file' && !file) {
      toast({
        title: "Error",
        description: "Please upload a file",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would upload the file and send the data to a server
    // For this demo, we'll just show a success message
    toast({
      title: "Note Uploaded",
      description: "Your note has been successfully uploaded.",
    });
    
    // Navigate back to the subject page
    const department = departments.find(d => d.id === departmentId);
    const branch = department?.branches.find(b => b.id === branchId);
    const subject = branch?.subjects.find(s => s.id === subjectId);
    
    if (department && branch && subject) {
      navigate(`/departments/${department.slug}/branches/${branch.slug}/subjects/${subject.slug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Note</CardTitle>
            <CardDescription>
              Create a new note for students to access. Only administrators can upload notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={departmentId}
                    onValueChange={(value) => {
                      setDepartmentId(value);
                      setBranchId('');
                      setSubjectId('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={branchId}
                    onValueChange={(value) => {
                      setBranchId(value);
                      setSubjectId('');
                    }}
                    disabled={!departmentId}
                  >
                    <SelectTrigger>
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

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={subjectId}
                    onValueChange={setSubjectId}
                    disabled={!branchId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Note Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter the title of the note"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the note"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Academic Year/Batch</Label>
                  <Select
                    value={batch}
                    onValueChange={setBatch}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Batch (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2021-2022">2021-2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 border p-4 rounded-md">
                  <Label>Content Type</Label>
                  <RadioGroup 
                    value={uploadType} 
                    onValueChange={(value) => setUploadType(value as 'markdown' | 'file')}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="markdown" id="markdown" />
                      <Label htmlFor="markdown">Markdown Text</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="file" />
                      <Label htmlFor="file">File Upload (PDF, Doc, PPT, Images, etc.)</Label>
                    </div>
                  </RadioGroup>

                  {uploadType === 'markdown' ? (
                    <div className="pt-3">
                      <Label htmlFor="content">Content (Markdown)</Label>
                      <Textarea
                        id="content"
                        placeholder="Enter the note content using Markdown format"
                        className="h-64 font-mono"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="pt-3 space-y-4">
                      <div>
                        <Label htmlFor="file-upload">Upload File</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          className="mt-1"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="isHandwritten"
                          checked={isHandwritten}
                          onCheckedChange={(checked) => setIsHandwritten(checked === true)}
                        />
                        <Label htmlFor="isHandwritten">This is a handwritten note</Label>
                      </div>
                      
                      {file && (
                        <div className="border p-3 rounded-md bg-gray-50">
                          <p className="text-sm font-medium">Selected File:</p>
                          <p className="text-sm">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit">Upload Note</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}