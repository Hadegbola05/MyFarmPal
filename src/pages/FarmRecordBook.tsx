import * as React from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Search, 
  ChevronRight,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Record = {
  id: string;
  date: string;
  category: 'expense' | 'income';
  type: string;
  amount: number;
  description: string;
};

export default function FarmRecordBook() {
  const [records, setRecords] = React.useState<Record[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('agri_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      const initial: Record[] = [
        { id: '1', date: '2024-05-15', category: 'expense', type: 'Fertilizer', amount: 45000, description: '2 bags of NPK' },
        { id: '2', date: '2024-05-18', category: 'expense', type: 'Labor', amount: 12000, description: 'Clearing weeds' },
        { id: '3', date: '2024-06-02', category: 'income', type: 'Sales', amount: 150000, description: 'First maize harvest' },
      ];
      setRecords(initial);
      localStorage.setItem('agri_records', JSON.stringify(initial));
    }
  }, []);

  const totalExpense = records.filter(r => r.category === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const totalIncome = records.filter(r => r.category === 'income').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const addRecord = () => {
    toast.success('Record saved successfully!');
    // In a real app, this would open a form
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Farm Record Book</h2>
          <p className="text-muted-foreground">Securely track your expenses, income, and farm activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-white">
            <Download size={16} /> Export PDF
          </Button>
          <Button onClick={addRecord} className="bg-primary text-white gap-2">
            <Plus size={16} /> Add Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Total Income" 
          value={`₦${totalIncome.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-secondary-foreground" 
          bgColor="bg-secondary/20" 
        />
        <StatsCard 
          label="Total Expenses" 
          value={`₦${totalExpense.toLocaleString()}`} 
          icon={TrendingDown} 
          color="text-amber-600" 
          bgColor="bg-amber-50" 
        />
        <StatsCard 
          label="Net Profit" 
          value={`₦${netProfit.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-white" 
          bgColor="bg-primary" 
        />
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-border/30 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Activity Journal</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-9 w-[200px] h-9" />
              </div>
              <Button variant="outline" size="sm" className="gap-1 h-9">
                <Filter size={14} /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50/50">
                  <TableCell className="pl-6 font-medium text-slate-600">{record.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "capitalize border-none px-2",
                      record.category === 'income' ? "bg-secondary/20 text-primary" : "bg-amber-50 text-amber-600"
                    )}>
                      {record.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">{record.type}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{record.description}</TableCell>
                  <TableCell className={cn(
                    "text-right pr-6 font-bold",
                    record.category === 'income' ? "text-primary" : "text-slate-800"
                  )}>
                    {record.category === 'income' ? '+' : '-'}₦{record.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 flex items-center justify-center border-t">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Load more records</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color, bgColor }: any) {
  return (
    <Card className={cn("border-none shadow-sm overflow-hidden", bgColor)}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-wider opacity-80 mb-1", color.includes('text-white') ? 'text-white' : 'text-slate-500')}>
            {label}
          </p>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
        </div>
        <div className={cn("p-3 rounded-xl bg-white/20", color)}>
          <Icon size={24} />
        </div>
      </CardContent>
    </Card>
  );
}
