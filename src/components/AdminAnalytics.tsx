import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  BookOpen, 
  Building, 
  Calendar,
  Download,
  Eye,
  Clock,
  X
} from 'lucide-react';
import { departments } from '../data/departments';
import { subjects } from '../data/subjects';

interface AnalyticsData {
  totalNotes: number;
  totalDepartments: number;
  totalBranches: number;
  totalSubjects: number;
  notesByDepartment: { name: string; count: number; percentage: number }[];
  notesByFileType: { type: string; count: number; percentage: number }[];
  recentActivity: { action: string; item: string; date: string }[];
  popularSubjects: { name: string; noteCount: number; views: number }[];
}

interface AdminAnalyticsProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  isVisible,
  onToggleVisibility,
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and calculate analytics
    const calculateAnalytics = () => {
      setLoading(true);
      
      // Count notes from departments structure
      let departmentNotes = 0;
      const notesByDept: { [key: string]: number } = {};
      const notesByType: { [key: string]: number } = {};
      
      departments.forEach(dept => {
        notesByDept[dept.name] = 0;
        dept.branches.forEach(branch => {
          branch.subjects.forEach(subject => {
            departmentNotes += subject.notes.length;
            notesByDept[dept.name] += subject.notes.length;
            
            subject.notes.forEach(note => {
              const type = note.fileType || 'markdown';
              notesByType[type] = (notesByType[type] || 0) + 1;
            });
          });
        });
      });

      // Count notes from subjects structure
      let subjectNotes = 0;
      subjects.forEach(subject => {
        subjectNotes += subject.notes.length;
        subject.notes.forEach(note => {
          notesByType['markdown'] = (notesByType['markdown'] || 0) + 1;
        });
      });

      const totalNotes = departmentNotes + subjectNotes;
      const totalDepartments = departments.length;
      const totalBranches = departments.reduce((acc, dept) => acc + dept.branches.length, 0);
      const totalSubjects = departments.reduce((acc, dept) => 
        acc + dept.branches.reduce((branchAcc, branch) => branchAcc + branch.subjects.length, 0), 0
      ) + subjects.length;

      // Calculate percentages for departments
      const notesByDepartment = Object.entries(notesByDept).map(([name, count]) => ({
        name,
        count,
        percentage: totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0
      }));

      // Calculate percentages for file types
      const notesByFileType = Object.entries(notesByType).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        percentage: totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0
      }));

      // Mock recent activity
      const recentActivity = [
        { action: 'Note Added', item: 'Introduction to Algorithms', date: '2 hours ago' },
        { action: 'Note Updated', item: 'Calculus Basics', date: '5 hours ago' },
        { action: 'Note Deleted', item: 'Old Physics Notes', date: '1 day ago' },
        { action: 'Subject Created', item: 'Advanced Chemistry', date: '2 days ago' },
        { action: 'Note Added', item: 'Cell Biology Overview', date: '3 days ago' }
      ];

      // Mock popular subjects
      const popularSubjects = [
        { name: 'Computer Science', noteCount: 2, views: 1250 },
        { name: 'Mathematics', noteCount: 1, views: 890 },
        { name: 'Physics', noteCount: 1, views: 675 },
        { name: 'Data Structures', noteCount: 2, views: 540 },
        { name: 'Circuit Theory', noteCount: 1, views: 320 }
      ];

      setAnalyticsData({
        totalNotes,
        totalDepartments,
        totalBranches,
        totalSubjects,
        notesByDepartment,
        notesByFileType,
        recentActivity,
        popularSubjects
      });
      
      setLoading(false);
    };

    if (isVisible) {
      calculateAnalytics();
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  if (loading || !analyticsData) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Platform Analytics
              </CardTitle>
              <CardDescription>Comprehensive insights into your notes platform</CardDescription>
            </div>
            <Button onClick={onToggleVisibility} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[75vh] space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.totalNotes}</p>
                    <p className="text-sm text-muted-foreground">Total Notes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.totalDepartments}</p>
                    <p className="text-sm text-muted-foreground">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.totalSubjects}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.totalBranches}</p>
                    <p className="text-sm text-muted-foreground">Branches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notes by Department */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes by Department</CardTitle>
                <CardDescription>Distribution of notes across departments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.notesByDepartment.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <Badge variant="secondary">{dept.count} notes</Badge>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{dept.percentage}% of total</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notes by File Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes by File Type</CardTitle>
                <CardDescription>Breakdown of note formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.notesByFileType.map((type, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{type.type}</span>
                      <Badge variant="outline">{type.count} files</Badge>
                    </div>
                    <Progress value={type.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{type.percentage}% of total</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Popular Subjects and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Popular Subjects
                </CardTitle>
                <CardDescription>Most viewed subjects this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.popularSubjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.noteCount} notes • {subject.views} views
                        </p>
                      </div>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.action.includes('Added') && <FileText className="h-4 w-4 text-green-500 mt-0.5" />}
                        {activity.action.includes('Updated') && <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />}
                        {activity.action.includes('Deleted') && <X className="h-4 w-4 text-red-500 mt-0.5" />}
                        {activity.action.includes('Created') && <BookOpen className="h-4 w-4 text-purple-500 mt-0.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Performance</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-xs text-green-600 mt-1">↑ 12% this month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-xs text-green-600 mt-1">↑ 8% this month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">15,234</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-xs text-green-600 mt-1">↑ 15% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};