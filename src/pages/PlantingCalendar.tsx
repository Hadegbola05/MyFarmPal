import * as React from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  CloudRain, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const recommendationByMonth: { [key: number]: any[] } = {
  0: [{ crop: 'Onions', action: 'Plant Now', status: 'success', advice: 'Ideal time for planting onions in irrigated northern areas.' }],
  1: [{ crop: 'Tomatoes', action: 'Nursery Prep', status: 'warning', advice: 'Start nursery for tomatoes for April transplanting.' }],
  2: [{ crop: 'Maize', action: 'Plant Now', status: 'success', advice: 'Early maize planting season begins in southern regions.' }],
  3: [{ crop: 'Rice', action: 'Plant Now', status: 'success', advice: 'Optimal time for upland rice planting.' }],
  4: [{ crop: 'Yam', action: 'Plant Now', status: 'success', advice: 'Peak yam planting season across the middle belt.' }],
  5: [{ crop: 'Cowpea', action: 'Plant Now', status: 'success', advice: 'Good for intercropping with maize.' }],
  6: [{ crop: 'Cassava', action: 'Plant Now', status: 'success', advice: 'Plant cassava stems now for harvest next year.' }],
  7: [{ crop: 'Sweet Potato', action: 'Harvest', status: 'info', advice: 'Harvest sweet potatoes planted earlier in the year.' }],
  8: [{ crop: 'Sorghum', action: 'Plant Now', status: 'success', advice: 'Late season planting for sorghum in the north.' }],
  9: [{ crop: 'Vegetables', action: 'Harvest', status: 'info', advice: 'Harvest various rain-fed vegetables.' }],
  10: [{ crop: 'Groundnut', action: 'Harvest', status: 'info', advice: 'Time to harvest and dry groundnuts.' }],
  11: [{ crop: 'Maize', action: 'Avoid Planting', status: 'danger', advice: 'Dry season setting in; only plant with irrigation.' }],
};

export default function PlantingCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const recommendations = recommendationByMonth[date?.getMonth() ?? new Date().getMonth()] || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planting Calendar</h2>
          <p className="text-muted-foreground">Personalized schedule based on your location and weather patterns.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="lagos">
            <SelectTrigger className="w-[140px] bg-white">
              <MapPin size={16} className="mr-2 text-primary" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="fct">Abuja (FCT)</SelectItem>
              <SelectItem value="rivers">Rivers</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="rainy">
            <SelectTrigger className="w-[140px] bg-white">
              <CloudRain size={16} className="mr-2 text-primary" />
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rainy">Rainy Season</SelectItem>
              <SelectItem value="dry">Dry Season</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2">
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-border/30">
            {recommendations.map((rec, i) => (
              <div 
                key={rec.crop} 
                className={cn(
                  "p-8 flex flex-col items-center text-center gap-4 border-r border-border/30 last:border-r-0 hover:bg-slate-50 transition-colors",
                  i >= 4 && "border-t md:border-t-0"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm",
                  rec.status === 'success' ? "bg-secondary/20 text-primary" :
                  rec.status === 'info' ? "bg-blue-50 text-blue-500" :
                  rec.status === 'warning' ? "bg-warning/20 text-yellow-600" :
                  "bg-red-50 text-red-500"
                )}>
                  {rec.status === 'success' ? <CheckCircle2 size={32} /> :
                   rec.status === 'info' ? <Clock size={32} /> :
                   rec.status === 'warning' ? <AlertCircle size={32} /> :
                   <XCircle size={32} />}
                </div>
                
                <div>
                  <h4 className="font-bold text-lg">{rec.crop}</h4>
                  <Badge className={cn(
                    "mt-1 border-none",
                    rec.status === 'success' ? "bg-secondary text-secondary-foreground" :
                    rec.status === 'info' ? "bg-blue-500 text-white" :
                    rec.status === 'warning' ? "bg-yellow-400 text-yellow-900" :
                    "bg-red-500 text-white"
                  )}>
                    {rec.action}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rec.advice}
                </p>

                <Button variant="ghost" size="sm" className="text-primary hover:bg-secondary/10 mt-2">
                  View Guide
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-primary text-white p-8">
           <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="flex-1 space-y-4">
               <h3 className="text-2xl font-bold">Preparation phase is starting</h3>
               <p className="opacity-80">
                 Data shows that {date ? format(date, 'MMMM') : 'this month'} is the peak time for land preparation in your region. 
                 Consider starting early to avoid labor shortages next month.
               </p>
               <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Labor High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Seed Prep</span>
                </div>
              </div>
            </div>
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <Sun size={64} className="text-secondary" />
            </div>
          </div>
        </Card>
        
        <Card className="border-none shadow-sm bg-white p-6 space-y-4">
          <h4 className="font-bold border-b pb-2">Action Checklist</h4>
          <div className="space-y-3">
            {[
              { text: 'Order Maize Seeds', done: true },
              { text: 'Check irrigation pumps', done: true },
              { text: 'Buy Fertilizer (NPK)', done: false },
              { text: 'Apply for Agro-loan', done: false },
              { text: 'Hire 2 extra hands', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                  item.done ? "bg-primary border-primary text-white" : "border-slate-300"
                )}>
                  {item.done && <CheckCircle2 size={12} />}
                </div>
                <span className={cn("text-sm", item.done ? "text-slate-400 line-through" : "text-slate-700")}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
            View All Tasks
          </Button>
        </Card>
      </div>
    </div>
  );
}
