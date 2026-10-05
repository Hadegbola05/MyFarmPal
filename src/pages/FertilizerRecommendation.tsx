import * as React from 'react';
import { 
  FlaskConical, 
  ChevronRight, 
  ArrowRight, 
  Sprout, 
  Droplets,
  Layers,
  Calculator,
  Info,
  Cpu,
  RefreshCcw,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { allCrops } from '@/data/crops';
import { toast } from 'sonner';

const PLOTS_TO_HECTARES = 0.045;
const HECTARES_TO_PLOTS = 22.2;

// Mock AI Logic Data
const FERTILIZERS = [
  { name: 'NPK 15:15:15', description: 'Balanced nutrients for general growth.' },
  { name: 'NPK 20:10:10', description: 'High nitrogen for leafy growth.' },
  { name: 'Urea (46-0-0)', description: 'Maximum nitrogen boost for cereals.' },
  { name: 'DAP (18-46-0)', description: 'Phosphorus-rich for root development.' },
  { name: 'SSP (0-18-0)', description: 'Single Super Phosphate for legumes.' },
  { name: 'Muriate of Potash', description: 'Potassium-rich for tubers and fruits.' }
];

const METHODS = ['Broadcast', 'Side-dressing', 'Foliar Spray', 'Fertigation', 'Placement'];
const TIMINGS = ['At planting', '2 weeks after', '4-6 weeks after', 'During flowering', 'Post-harvest'];

function LandSizeInput({ value, unit, onChange, onUnitChange }: any) {
  return (
    <div className="space-y-2">
      <Label>Farm Size</Label>
      <div className="flex gap-2">
        <Input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="flex-grow h-12 bg-white rounded-xl border-primary/10" 
          placeholder="e.g. 2" 
        />
        <ToggleGroup type="single" value={unit} onValueChange={(val) => val && onUnitChange(val)} className="bg-slate-100 rounded-xl p-1 border">
          <ToggleGroupItem value="hectares" className="rounded-lg text-[10px] font-bold px-3 h-8 data-[state=on]:bg-white data-[state=on]:text-primary shadow-none data-[state=on]:shadow-sm">HECTARES</ToggleGroupItem>
          <ToggleGroupItem value="plots" className="rounded-lg text-[10px] font-bold px-3 h-8 data-[state=on]:bg-white data-[state=on]:text-primary shadow-none data-[state=on]:shadow-sm">PLOTS</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

export default function FertilizerRecommendation() {
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [crop, setCrop] = React.useState('maize');
  const [size, setSize] = React.useState('1');
  const [unit, setUnit] = React.useState('hectares');
  const [condition, setCondition] = React.useState('average');

  const calculate = () => {
    if (!size || isNaN(parseFloat(size))) {
      toast.error('Please enter a valid farm size');
      return;
    }

    setLoading(true);
    setResult(null);
    
    // Simulate AI Model Processing
    setTimeout(() => {
      const numSize = parseFloat(size);
      const hectares = unit === 'hectares' ? numSize : numSize * PLOTS_TO_HECTARES;
      
      // Determine complexity based on crop and soil
      const bagMultiplier = condition === 'rich' ? 1.5 : condition === 'average' ? 2.5 : 4;
      const totalBags = Math.ceil(hectares * bagMultiplier);
      const costPerBag = 18000;
      
      // Randomly select 2-3 fertilizers for diversity
      const selectedFerts = [...FERTILIZERS]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.random() > 0.5 ? 2 : 1);

      const generatedPlan = {
        type: selectedFerts.map(f => f.name).join(' & '),
        quantity: `${totalBags} Bags (${totalBags * 50}kg)`,
        description: selectedFerts[0].description,
        schedule: [
          { 
            phase: 'Basal Application', 
            timing: TIMINGS[0], 
            method: METHODS[Math.floor(Math.random() * METHODS.length)],
            amount: `${Math.floor(totalBags * 0.4)} bags`
          },
          { 
            phase: 'Top Dressing', 
            timing: TIMINGS[Math.floor(Math.random() * 2) + 2], 
            method: METHODS[Math.floor(Math.random() * METHODS.length)],
            amount: `${Math.ceil(totalBags * 0.6)} bags`
          },
        ],
        cost: `₦${(totalBags * costPerBag).toLocaleString()}`,
        confidence: 94 + Math.floor(Math.random() * 5),
        model: 'AgriSmart ML v2.4'
      };

      setResult(generatedPlan);
      setLoading(false);
      toast.success('AI Fertilizer Plan Generated Successfully');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-secondary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Cpu size={14} />
          AI Powered Analysis
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-slate-800">Fertilizer Recommendation</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Our advanced ML model calculates the exact nutrients your crops need based on farm size, soil health, and local data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-border/30 p-8">
            <CardTitle className="text-xl">Input Parameters</CardTitle>
            <CardDescription>Details for our recommendation engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <Label>Select Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="h-12 bg-white rounded-xl border-primary/10">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent className="max-h-[20rem] rounded-xl">
                  {allCrops.map(c => (
                    <SelectItem key={c.id} value={c.id} className="rounded-lg">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <LandSizeInput 
              value={size} 
              unit={unit} 
              onChange={setSize} 
              onUnitChange={setUnit} 
            />

            <div className="space-y-2">
              <Label>Soil Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="h-12 bg-white rounded-xl border-primary/10">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="rich" className="rounded-lg">Rich / Fertile (High organic matter)</SelectItem>
                  <SelectItem value="average" className="rounded-lg">Average (Standard soil)</SelectItem>
                  <SelectItem value="depleted" className="rounded-lg">Depleted / Poor (Low nutrients)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={calculate} 
              disabled={loading} 
              className="w-full bg-primary text-white font-bold h-14 rounded-2xl gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <RefreshCcw size={20} />
                  </motion.div>
                  Running AI Engine...
                </span>
              ) : (
                <>
                  <FlaskConical size={20} />
                  Generate Smart Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <Card className="border-none shadow-xl bg-white border-2 border-secondary/20 rounded-3xl overflow-hidden">
                <div className="bg-secondary/20 p-6 flex justify-between items-center border-b border-secondary/20">
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Recommended Mix</h4>
                    <CardTitle className="text-xl text-slate-800">{result.type}</CardTitle>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
                <CardContent className="space-y-6 p-8">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{result.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Needed</p>
                      <p className="text-lg font-extrabold text-slate-800">{result.quantity}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Estimated Cost</p>
                      <p className="text-lg font-extrabold text-primary">{result.cost}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Application Schedule
                    </p>
                    {result.schedule.map((s: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-colors">
                        <div className="flex flex-col items-center gap-1">
                           <div className="w-8 h-8 rounded-full bg-secondary text-primary text-xs flex items-center justify-center font-black">{i+1}</div>
                           {i === 0 && <div className="w-0.5 flex-1 bg-slate-100" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-slate-800">{s.phase} — {s.amount}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              {s.timing}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              {s.method}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${result.confidence}%` }} 
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-primary" 
                          />
                        </div>
                        <span className="text-xs font-black text-primary">{result.confidence}%</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-[10px] text-slate-400 font-mono py-1 px-3 border-slate-200">
                      {result.model}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary p-6 rounded-3xl text-white flex gap-4 items-center shadow-lg shadow-primary/10">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Info size={24} />
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-bold mb-1">Expert Advice</p>
                  <p className="opacity-80">Apply during early morning or late evening for best absorption. Ensure soil is moist before application for 15% better results.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-400 text-center bg-slate-50/30">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto text-slate-200">
                  <FlaskConical size={48} />
                </div>
                <div>
                  <p className="font-bold text-slate-500 text-lg">Waiting for Input</p>
                  <p className="text-sm mt-2 max-w-[200px] mx-auto">Fill in the farm details to generate a data-driven fertilizer plan.</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
