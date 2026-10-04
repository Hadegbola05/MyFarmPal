import * as React from 'react';
import { 
  Play, 
  BookOpen, 
  FileText, 
  Clock, 
  Star, 
  ChevronRight,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const courses = [
  {
    id: 1,
    title: 'Modern Poultry Management',
    instructor: 'Dr. Samuel Adeyemi',
    duration: '4h 30m',
    lessons: 12,
    rating: 4.9,
    category: 'Livestock',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/maize-farm-34f930d2-1783242028816.webp'
  },
  {
    id: 2,
    title: 'Precision Irrigation Systems',
    instructor: 'Engr. Fatima Bello',
    duration: '2h 15m',
    lessons: 8,
    rating: 4.7,
    category: 'Engineering',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/rice-crop-144ab9fb-1783242029852.webp'
  },
  {
    id: 3,
    title: 'Organic Fertilizer Production',
    instructor: 'Chief Okonkwo',
    duration: '3h 45m',
    lessons: 10,
    rating: 4.8,
    category: 'Sustainability',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/cocoa-pod-a09a2af6-1783242028527.webp'
  },
];

export default function LearningAcademy() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Learning Academy</h2>
          <p className="text-muted-foreground">Expert-led courses, tutorials, and guides to scale your farm.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white">My Progress</Button>
          <Button className="bg-primary text-white">Join Academy</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for courses, guides, or skills..." className="pl-10 h-12 bg-white" />
        </div>
        <Tabs defaultValue="all">
          <TabsList className="bg-white h-12 border border-border/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">All</TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">Videos</TabsTrigger>
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">PDF Guides</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
              <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-300">
                   <Play size={24} fill="currentColor" />
                 </div>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-primary border-none">{course.category}</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">{course.rating}</span>
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Clock size={12} />
                  <span>{course.duration}</span>
                </div>
              </div>
              <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{course.title}</h4>
              <p className="text-xs text-muted-foreground mb-4">Instructor: {course.instructor}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">{course.lessons} Lessons</span>
                <Button variant="ghost" size="sm" className="text-primary gap-1 p-0 h-auto font-bold">
                  Start Learning <ChevronRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured PDF Resources */}
      <div className="space-y-4 pt-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" />
          Featured Guides & Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Seasonal Planting Guide 2024', size: '2.4 MB', type: 'PDF' },
            { title: 'Organic Pesticide Handbook', size: '1.8 MB', type: 'PDF' },
            { title: 'Farm Record Keeping Spreadsheet', size: '0.5 MB', type: 'Excel' },
            { title: 'Global Cocoa Market Analysis', size: '4.2 MB', type: 'PDF' },
          ].map((file) => (
            <div key={file.title} className="bg-white p-4 rounded-xl border border-border/50 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/20 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm">{file.title}</h5>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{file.type} • {file.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                <Download size={18} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
