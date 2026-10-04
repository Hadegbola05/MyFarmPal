import * as React from 'react';
import { 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  Ship, 
  TrendingUp, 
  Package, 
  ShieldCheck,
  Globe,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const channels = [
  {
    title: 'Major Urban Markets',
    description: 'Sell directly to wholesalers in large cities like Lagos (Mile 12), Ibadan (Bodija), and Kano.',
    pros: ['High volume', 'Immediate cash'],
    cons: ['Transport costs', 'Negotiation pressure'],
    icon: Store
  },
  {
    title: 'Agro-Processors',
    description: 'Supply raw materials to flour mills, breweries, and food processing companies.',
    pros: ['Stable contracts', 'Large scale'],
    cons: ['Quality standards', 'Delayed payment'],
    icon: Package
  },
  {
    title: 'Export Markets',
    description: 'Access international buyers for crops like Cocoa, Ginger, and Cashew.',
    pros: ['Foreign exchange', 'Highest prices'],
    cons: ['Certifications', 'Strict logistics'],
    icon: Globe
  }
];

export default function SellingGuide() {
  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl bg-slate-900 p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <TrendingUp size={160} />
        </div>
        <div className="max-w-2xl space-y-4 relative z-10">
          <Badge className="bg-secondary text-secondary-foreground border-none">Profit Max</Badge>
          <h2 className="text-4xl font-bold">Selling & Marketing Guide</h2>
          <p className="text-slate-400 text-lg">
            Don't just farm—market! Learn where to sell, how to package, and how to negotiate for the best prices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((c, i) => (
          <Card key={i} className="border-none shadow-sm bg-white hover:shadow-lg transition-all group">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <c.icon size={24} />
              </div>
              <CardTitle className="text-xl font-bold">{c.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">{c.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Pros</p>
                {c.pros.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-secondary" />
                    <span className="text-xs">{p}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-secondary/10 group">
                View Opportunities <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        <Card className="border-none shadow-sm bg-white p-8 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-primary rounded-xl text-white">
               <ShieldCheck size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold">Quality & Grading</h3>
               <p className="text-sm text-muted-foreground">Command higher prices with better quality.</p>
             </div>
          </div>
          <div className="space-y-4">
             {[
               { title: 'Drying', desc: 'Ensure moisture content is below 13% for grains.' },
               { title: 'Cleaning', desc: 'Remove stones, chaff, and damaged seeds.' },
               { title: 'Sorting', desc: 'Grade by size and color for premium buyers.' },
               { title: 'Packaging', desc: 'Use new, branded bags for professional look.' },
             ].map((item, i) => (
               <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                 <span className="text-primary font-bold">0{i+1}</span>
                 <div>
                   <h4 className="text-sm font-bold">{item.title}</h4>
                   <p className="text-xs text-muted-foreground">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </Card>

        <Card className="border-none shadow-sm bg-secondary/10 border-2 border-secondary/20 p-8 flex flex-col justify-center text-center space-y-6">
           <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center text-primary mx-auto">
             <Ship size={40} />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-bold text-primary">Export Readiness</h3>
             <p className="text-sm text-slate-600 max-w-sm mx-auto">
               Your current Cocoa production volume meets the minimum threshold for export aggregation. 
               Would you like to connect with a certified exporter?
             </p>
           </div>
           <div className="flex gap-3 justify-center">
             <Button className="bg-primary text-white">Get Certified</Button>
             <Button variant="outline" className="border-primary/20 text-primary">Learn More</Button>
           </div>
        </Card>
      </div>
    </div>
  );
}
