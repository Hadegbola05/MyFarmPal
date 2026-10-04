import * as React from 'react';
import { 
  Landmark, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Calendar,
  Users,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const grants = [
  {
    id: 1,
    title: 'NIRSAL Agricultural Loan Scheme',
    organization: 'CBN / NIRSAL',
    amount: 'Up to ₦10,000,000',
    deadline: 'July 30, 2024',
    status: 'Open',
    category: 'Loan',
    eligibility: 'SME Farmers, Cooperatives'
  },
  {
    id: 2,
    title: 'Ondo State Agri-Business Grant',
    organization: 'State Ministry of Agriculture',
    amount: '₦500,000 - ₦2,000,000',
    deadline: 'June 15, 2024',
    status: 'Closing Soon',
    category: 'Grant',
    eligibility: 'Registered Ondo Farmers'
  },
  {
    id: 3,
    title: 'Climate Smart Agriculture Fund',
    organization: 'Green Climate Fund / FMARD',
    amount: 'Equipment & Seeds',
    deadline: 'December 2024',
    status: 'Ongoing',
    category: 'Support',
    eligibility: 'Sustainable Farming Projects'
  },
];

export default function GrantInformation() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Government & Grant Information</h2>
          <p className="text-muted-foreground">Stay updated on agricultural loans, grants, and training programs.</p>
        </div>
        <Button className="bg-primary text-white gap-2">
          <Calendar size={16} /> My Applications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grants.map((g) => (
          <Card key={g.id} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className={cn(
              "h-2 w-full",
              g.status === 'Open' ? "bg-secondary" : 
              g.status === 'Closing Soon' ? "bg-warning" : 
              "bg-blue-500"
            )} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-bold">
                  {g.category}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                  <Clock size={12} />
                  <span>{g.deadline}</span>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {g.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium">{g.organization}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Funding</p>
                <p className="text-lg font-bold text-primary">{g.amount}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Eligibility</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-secondary" />
                  <span className="text-xs text-slate-700">{g.eligibility}</span>
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <Button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 gap-2 border-none">
                  <FileText size={16} /> Details
                </Button>
                <Button className="flex-1 bg-primary text-white gap-2">
                  Apply <ExternalLink size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <Landmark size={120} />
           </div>
           <CardContent className="p-8 space-y-4 relative z-10">
             <Badge className="bg-secondary text-secondary-foreground border-none">New Program</Badge>
             <h3 className="text-2xl font-bold">National Farmers Registration</h3>
             <p className="text-slate-400 leading-relaxed max-w-md">
               The Federal Government has launched a new portal for all farmers. 
               Registration is mandatory to access future subsidies and inputs.
             </p>
             <Button className="bg-white text-slate-900 hover:bg-secondary">
               Register Now
             </Button>
           </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white p-8">
           <div className="flex items-start gap-4">
             <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
               <Users size={32} />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl font-bold">Extension Service Workshop</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 Join our upcoming workshop on "Climate Resilience in Maize Farming" 
                 at the State Agricultural Research Institute.
               </p>
               <div className="flex items-center gap-4 pt-2">
                 <div className="text-xs font-bold text-primary">May 28th, 2024</div>
                 <div className="text-xs font-bold text-muted-foreground">Zaria, Kaduna</div>
               </div>
               <Button variant="link" className="text-primary p-0 h-auto font-bold flex items-center gap-1 mt-2">
                 Book Seat <ChevronRight size={16} />
               </Button>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
