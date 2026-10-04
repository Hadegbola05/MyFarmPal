import * as React from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Star, 
  Clock, 
  Navigation,
  Sprout,
  FlaskConical,
  Bug,
  Truck,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const suppliers = [
  {
    id: 1,
    name: 'Premier Seed Nigeria',
    category: 'seeds',
    address: 'Chikun LGA, Kaduna State',
    rating: 4.8,
    reviews: 124,
    status: 'Open',
    distance: '2.5 km'
  },
  {
    id: 2,
    name: 'Indorama Fertilizers',
    category: 'fertilizer',
    address: 'Eleme, Port Harcourt',
    rating: 4.9,
    reviews: 350,
    status: 'Open',
    distance: '5.8 km'
  },
  {
    id: 3,
    name: 'Agro-Chemical Solutions',
    category: 'pesticides',
    address: 'Ikorodu Road, Lagos',
    rating: 4.5,
    reviews: 82,
    status: 'Closing Soon',
    distance: '1.2 km'
  },
];

export default function InputFinder() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nearby Input Finder</h2>
          <p className="text-muted-foreground">Locate certified suppliers and services near your farm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-[600px]">
        {/* List side */}
        <div className="space-y-4 flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." className="pl-10 bg-white" />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white border border-border/50 p-1 w-full justify-start overflow-x-auto h-auto">
              <TabsTrigger value="all" className="rounded-lg text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="seeds" className="rounded-lg text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">Seeds</TabsTrigger>
              <TabsTrigger value="fertilizer" className="rounded-lg text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">Fertilizers</TabsTrigger>
              <TabsTrigger value="tractor" className="rounded-lg text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">Tractors</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {suppliers.map((s) => (
              <Card key={s.id} className="border-none shadow-sm bg-white hover:border-primary/20 border-2 transition-all cursor-pointer group">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold group-hover:text-primary transition-colors">{s.name}</h4>
                    <Badge variant="outline" className="text-[10px] h-5 border-primary/20 text-primary">
                      {s.distance}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    <span>{s.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold ml-1">{s.rating}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">({s.reviews} reviews)</span>
                    </div>
                    <Badge className={cn(
                      "text-[10px] h-5 px-1.5",
                      s.status === 'Open' ? "bg-secondary text-secondary-foreground" : "bg-warning text-warning-foreground"
                    )}>
                      {s.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1">
                      <Phone size={12} /> Call
                    </Button>
                    <Button size="sm" className="flex-1 h-8 text-xs gap-1 bg-primary text-white">
                      <Navigation size={12} /> Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-slate-200 border border-border/50">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] bg-slate-100 flex items-center justify-center">
             <div className="text-slate-400 flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-primary">
                 <MapPin size={32} />
               </div>
               <p className="font-bold">Map View Loading...</p>
             </div>
          </div>
          
          {/* Mock Pins */}
          <div className="absolute top-1/4 left-1/3 p-2 bg-white rounded-lg shadow-lg flex items-center gap-2 border border-primary/20 animate-bounce">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <Sprout size={16} />
            </div>
            <div className="text-[10px] font-bold">Premier Seeds</div>
          </div>

          <div className="absolute bottom-1/3 right-1/4 p-2 bg-white rounded-lg shadow-lg flex items-center gap-2 border border-secondary/20">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground">
              <FlaskConical size={16} />
            </div>
            <div className="text-[10px] font-bold">Indorama</div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <Button size="icon" className="bg-white text-slate-800 shadow-md hover:bg-slate-50 border border-border/50">
              <Plus size={20} />
            </Button>
            <Button size="icon" className="bg-white text-slate-800 shadow-md hover:bg-slate-50 border border-border/50">
              <Navigation size={20} className="text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
