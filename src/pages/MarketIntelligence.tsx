import * as React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Search,
  Globe,
  Ship,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const priceData = [
  { month: 'Jan', price: 12500 },
  { month: 'Feb', price: 13200 },
  { month: 'Mar', price: 12800 },
  { month: 'Apr', price: 14500 },
  { month: 'May', price: 16000 },
  { month: 'Jun', price: 15800 },
  { month: 'Jul', price: 17200 },
];

const cropPrices = [
  { name: 'Maize', price: '₦45,000', change: '+12%', trend: 'up', market: 'Bodija Market' },
  { name: 'Rice (50kg)', price: '₦72,000', change: '-2%', trend: 'down', market: 'Daleko Market' },
  { name: 'Cassava (Ton)', price: '₦120,000', change: '+5%', trend: 'up', market: 'Mile 12' },
  { name: 'Cocoa (Kg)', price: '₦3,800', change: '+25%', trend: 'up', market: 'Export' },
  { name: 'Palm Oil (25L)', price: '₦28,000', change: '+8%', trend: 'up', market: 'Onitsha' },
];

export default function MarketIntelligence() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market Intelligence</h2>
          <p className="text-muted-foreground">Real-time agricultural market data and price forecasts.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search crops..." 
              className="pl-9 w-full bg-white border-primary/20"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Historical Price Trends</CardTitle>
                <CardDescription>Average price per metric ton (NGN)</CardDescription>
              </div>
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Maize - Annual</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A3E635" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A3E635" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    tickFormatter={(value) => `₦${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2D5A27" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Export Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">Cocoa Demand</div>
                <Badge className="bg-secondary text-secondary-foreground">Very High</Badge>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                European markets are reporting a 15% supply gap. Predicted prices to rise by ₦200/kg next month.
              </p>
              <Button className="w-full mt-4 bg-white text-primary hover:bg-secondary">
                View Buyers
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <MarketStatCard 
              label="Major Buyer" 
              value="Olam" 
              icon={Users} 
            />
            <MarketStatCard 
              label="Peak Selling" 
              value="Oct-Nov" 
              icon={TrendingUp} 
            />
          </div>
        </div>
      </div>

      {/* Real-time Prices Table */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-border/30">
          <CardTitle className="text-lg">Real-time Commodity Prices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Crop Name</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Primary Market</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropPrices.map((crop) => (
                <TableRow key={crop.name} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 font-semibold">{crop.name}</TableCell>
                  <TableCell>{crop.price}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "flex items-center gap-1 font-medium",
                      crop.trend === 'up' ? "text-primary" : "text-amber-500"
                    )}>
                      {crop.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {crop.change}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{crop.market}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-secondary/20">
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MarketStatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-border/50 shadow-sm flex flex-col gap-2">
      <div className="p-2 bg-secondary/10 rounded-lg w-fit text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</p>
        <p className="font-bold text-sm">{value}</p>
      </div>
    </div>
  );
}
