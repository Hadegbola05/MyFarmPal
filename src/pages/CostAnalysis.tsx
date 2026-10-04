import * as React from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  PieChart as PieIcon, 
  ArrowRight,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const defaultCosts = [
  { id: 1, item: 'Land Preparation', cost: 45000 },
  { id: 2, item: 'Seeds', cost: 25000 },
  { id: 3, item: 'Fertilizer', cost: 65000 },
  { id: 4, item: 'Labor', cost: 80000 },
  { id: 5, item: 'Irrigation', cost: 15000 },
];

export default function CostAnalysis() {
  const [costs, setCosts] = React.useState(defaultCosts);
  const [expectedIncome, setExpectedIncome] = React.useState(450000);

  const totalInvestment = costs.reduce((sum, c) => sum + c.cost, 0);
  const netProfit = expectedIncome - totalInvestment;
  const roi = ((netProfit / totalInvestment) * 100).toFixed(1);

  const updateCost = (id: number, val: string) => {
    const num = parseInt(val) || 0;
    setCosts(costs.map(c => c.id === id ? { ...c, cost: num } : c));
  };

  const removeCost = (id: number) => {
    setCosts(costs.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cost Analysis</h2>
          <p className="text-muted-foreground">Interactive financial calculator for your farming projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calculator size={16} /> Save Analysis
          </Button>
          <Button className="bg-primary text-white gap-2">
            <Plus size={16} /> New Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Table */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-border/30">
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Expense Item</TableHead>
                  <TableHead>Cost (NGN)</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6">
                      <Input defaultValue={c.item} className="border-none bg-transparent hover:bg-slate-100 focus:bg-white h-8" />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₦</span>
                        <Input 
                          type="number" 
                          value={c.cost} 
                          onChange={(e) => updateCost(c.id, e.target.value)}
                          className="pl-5 h-8 border-none bg-transparent hover:bg-slate-100 focus:bg-white" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeCost(c.id)} className="h-8 w-8 text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-6 bg-slate-50/50 flex flex-col gap-4 border-t border-border/30">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-bold">Expected Income</Label>
                <div className="relative w-48">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-primary">₦</span>
                  <Input 
                    type="number" 
                    value={expectedIncome} 
                    onChange={(e) => setExpectedIncome(parseInt(e.target.value) || 0)}
                    className="pl-7 font-bold text-lg text-primary text-right h-12 rounded-xl" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-primary text-white p-6">
              <p className="text-xs uppercase font-bold tracking-widest opacity-80 mb-1">Financial Summary</p>
              <CardTitle className="text-3xl font-bold">₦{netProfit.toLocaleString()}</CardTitle>
              <CardDescription className="text-primary-foreground/70">Estimated Net Profit</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <SummaryItem label="Total Investment" value={`₦${totalInvestment.toLocaleString()}`} />
                <SummaryItem label="ROI (Return on Investment)" value={`${roi}%`} color="text-secondary-foreground" bgColor="bg-secondary" />
                <SummaryItem label="Break-even Point" value={`₦${(totalInvestment / 0.85).toFixed(0).toLocaleString()} Yield`} />
              </div>
              
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-secondary" />
                  <span className="font-bold text-sm">Profitability Rating</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
                  <div className="bg-primary w-[70%]" />
                  <div className="bg-secondary w-[20%]" />
                  <div className="bg-warning w-[10%]" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Based on current market trends and regional yield data.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50 p-6 flex gap-4">
            <Info className="text-blue-500 shrink-0" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-bold">Did you know?</span> Using organic mulch can reduce your irrigation costs by up to 30% and improve soil health over time.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color, bgColor }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge className={cn("px-2 py-1", bgColor || "bg-slate-100 text-slate-800", color || "")}>
        {value}
      </Badge>
    </div>
  );
}
