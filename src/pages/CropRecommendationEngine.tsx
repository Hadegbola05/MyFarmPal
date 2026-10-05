import * as React from 'react';
import { 
  Sprout, 
  ChevronRight, 
  ChevronLeft, 
  DollarSign, 
  Calendar, 
  Compass, 
  CheckCircle2,
  AlertTriangle,
  History,
  Info,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Budget & Land', 'Soil & Season', 'Experience'];

const PLOTS_TO_HECTARES = 0.045;
const HECTARES_TO_PLOTS = 22.2;

const currencies = [
  { code: 'NGN', symbol: '₦', rate: 1, name: 'Naira' },
  { code: 'USD', symbol: '$', rate: 0.00065, name: 'Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.0006, name: 'Euro' },
  { code: 'CNY', symbol: '¥', rate: 0.0047, name: 'Yuan' },
];

function formatCurrency(amount: number, currency: typeof currencies[0]) {
  const converted = amount * currency.rate;
  return `${currency.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function LandSizeInput({ value, unit, onChange, onUnitChange }: any) {
  return (
    <div className="space-y-2">
      <Label className="flex justify-between">
        Land Size
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          {unit === 'hectares' ? 'approx. 22 plots' : 'approx. 0.045 hectares'}
        </span>
      </Label>
      <div className="flex gap-2">
        <Input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="flex-grow h-12 bg-white rounded-xl border-primary/10" 
          placeholder="e.g. 5" 
        />
        <ToggleGroup type="single" value={unit} onValueChange={(val) => val && onUnitChange(val)} className="bg-slate-100 rounded-xl p-1 border">
          <ToggleGroupItem value="hectares" className="rounded-lg text-[10px] font-bold px-3 h-8 data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm transition-all">HECTARES</ToggleGroupItem>
          <ToggleGroupItem value="plots" className="rounded-lg text-[10px] font-bold px-3 h-8 data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm transition-all">PLOTS</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

export default function CropRecommendationEngine() {
  const [step, setStep] = React.useState(0);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [selectedCurrency, setSelectedCurrency] = React.useState(currencies[0]);
  
  // Form State
  const [budget, setBudget] = React.useState('250000');
  const [landSize, setLandSize] = React.useState('1');
  const [landUnit, setLandUnit] = React.useState('hectares');
  const [yieldUnit, setYieldUnit] = React.useState('hectares');

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Mock result data in NGN
      setResult({
        bestCrops: [
          { 
            name: 'Maize (Hybrid)', 
            profit: 450000, 
            cost: 120000, 
            yieldValue: 4.5, 
            risk: 'Low', 
            time: '110 days',
            laymanYield: 'approx. 45 big bags' 
          },
          { 
            name: 'Soybeans', 
            profit: 380000, 
            cost: 95000, 
            yieldValue: 2.8, 
            risk: 'Low', 
            time: '90 days',
            laymanYield: 'approx. 28 big bags' 
          },
          { 
            name: 'Cassava (TME 419)', 
            profit: 620000, 
            cost: 180000, 
            yieldValue: 25, 
            risk: 'Moderate', 
            time: '12 months',
            laymanYield: 'approx. 5 pickup truck loads' 
          },
        ]
      });
      setIsCalculating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Crop Recommendation Engine</h2>
          <p className="text-muted-foreground max-w-lg">
            Input your farm details and our AI will recommend the most profitable crops for your specific conditions.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-primary/10 shadow-sm">
          <div className="p-2 bg-secondary/20 rounded-xl text-primary">
            <Globe size={18} />
          </div>
          <Select 
            value={selectedCurrency.code} 
            onValueChange={(val) => setSelectedCurrency(currencies.find(c => c.code === val) || currencies[0])}
          >
            <SelectTrigger className="w-[120px] border-none focus:ring-0 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {currencies.map(c => (
                <SelectItem key={c.code} value={c.code} className="rounded-lg">{c.code} ({c.symbol})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!result ? (
        <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
          <CardHeader className="bg-slate-50/50 border-b border-border/30 p-8">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {steps.map((s, i) => (
                  <div 
                    key={s} 
                    className={cn(
                      "w-12 h-1.5 rounded-full transition-all duration-500",
                      i <= step ? "bg-primary" : "bg-slate-200"
                    )} 
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Step {step + 1} of 3</span>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {step === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label>Estimated Budget ({selectedCurrency.code})</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">{selectedCurrency.symbol}</span>
                        <Input 
                          placeholder="e.g. 250,000" 
                          className="pl-10 h-12 bg-white rounded-xl border-primary/10" 
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </div>
                    <LandSizeInput 
                      value={landSize} 
                      unit={landUnit} 
                      onChange={setLandSize} 
                      onUnitChange={setLandUnit} 
                    />
                    <div className="space-y-2 md:col-span-2">
                      <Label>Waiting Period (Maximum time for harvest)</Label>
                      <Select defaultValue="3">
                        <SelectTrigger className="h-12 bg-white rounded-xl border-primary/10">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="3" className="rounded-lg">Short term (3 - 4 Months)</SelectItem>
                          <SelectItem value="6" className="rounded-lg">Medium term (5 - 8 Months)</SelectItem>
                          <SelectItem value="12" className="rounded-lg">Long term (12+ Months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label>Soil Type</Label>
                      <Select defaultValue="loamy">
                        <SelectTrigger className="h-12 bg-white rounded-xl border-primary/10">
                          <SelectValue placeholder="Select soil" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="sandy" className="rounded-lg">Sandy Soil</SelectItem>
                          <SelectItem value="loamy" className="rounded-lg">Loamy Soil (Ideal)</SelectItem>
                          <SelectItem value="clay" className="rounded-lg">Clay Soil</SelectItem>
                          <SelectItem value="silty" className="rounded-lg">Silty Soil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Season</Label>
                      <Select defaultValue="rainy">
                        <SelectTrigger className="h-12 bg-white rounded-xl border-primary/10">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="rainy" className="rounded-lg">Rainy Season</SelectItem>
                          <SelectItem value="dry" className="rounded-lg">Dry Season (Irrigation needed)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>State / LGA</Label>
                      <Input placeholder="e.g. Kaduna North" className="h-12 bg-white rounded-xl border-primary/10" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <Label>Farming Experience Level</Label>
                      <Select defaultValue="beginner">
                        <SelectTrigger className="h-12 bg-white rounded-xl border-primary/10">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="beginner" className="rounded-lg">Beginner (First time)</SelectItem>
                          <SelectItem value="intermediate" className="rounded-lg">Intermediate (2-5 years)</SelectItem>
                          <SelectItem value="expert" className="rounded-lg">Expert (5+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-6 bg-secondary/10 rounded-2xl border border-secondary/20 flex items-start gap-4">
                      <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                        <Compass size={20} />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-primary mb-1">Smart Recommendation logic active</p>
                        <p className="text-slate-600 leading-relaxed">The system considers your experience level to suggest crops that are easier to manage for beginners vs high-yield expert varieties.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-12 pt-8 border-t border-border/30">
              <Button 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={step === 0}
                className="gap-2 h-12 px-6 rounded-xl hover:bg-slate-100"
              >
                <ChevronLeft size={18} /> Back
              </Button>
              {step < 2 ? (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 gap-2 h-12 px-8 rounded-xl font-bold shadow-md">
                  Continue <ChevronRight size={18} />
                </Button>
              ) : (
                <Button 
                  onClick={calculate} 
                  disabled={isCalculating}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-12 px-10 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  {isCalculating ? (
                    <span className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Sprout size={18} />
                      </motion.div>
                      Analyzing Conditions...
                    </span>
                  ) : "Generate Recommendations"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-slate-800">Top Recommendations</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border">
                <span className="text-[10px] font-bold text-muted-foreground ml-3 mr-1 uppercase">Yield per:</span>
                <ToggleGroup type="single" value={yieldUnit} onValueChange={(val) => val && setYieldUnit(val)} className="h-8">
                  <ToggleGroupItem value="hectares" className="rounded-lg text-[10px] font-bold px-3 h-full data-[state=on]:bg-white data-[state=on]:text-primary shadow-none data-[state=on]:shadow-sm">HECTARE</ToggleGroupItem>
                  <ToggleGroupItem value="plots" className="rounded-lg text-[10px] font-bold px-3 h-full data-[state=on]:bg-white data-[state=on]:text-primary shadow-none data-[state=on]:shadow-sm">PLOT</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Button variant="outline" size="sm" onClick={() => setResult(null)} className="gap-2 h-10 px-4 rounded-xl border-primary/10 hover:bg-primary/5">
                <History size={16} /> Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {result.bestCrops.map((crop: any, i: number) => (
              <Card key={crop.name} className="border-none shadow-sm overflow-hidden bg-white hover:shadow-xl transition-all duration-500 group rounded-3xl">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="md:w-1/4 bg-slate-50/50 p-8 flex flex-col justify-center items-center text-center border-r border-border/30">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 duration-500">
                      <Sprout size={32} />
                    </div>
                    <h4 className="font-bold text-xl text-slate-800">{crop.name}</h4>
                    <Badge className={cn(
                      "mt-3 border-none px-4 py-1 rounded-full",
                      crop.risk === 'Low' ? "bg-secondary text-secondary-foreground" : "bg-warning text-warning-foreground"
                    )}>
                      {crop.risk} Risk
                    </Badge>
                  </div>
                  <div className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Est. Cost</p>
                      <p className="text-xl font-bold text-slate-800">{formatCurrency(crop.cost, selectedCurrency)}</p>
                      <p className="text-[10px] text-muted-foreground italic">Total needed</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Est. Profit</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(crop.profit, selectedCurrency)}</p>
                      <p className="text-[10px] text-primary/60 font-medium">After expenses</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Yield / {yieldUnit.slice(0, -1)}</p>
                      <p className="text-xl font-bold text-slate-800">
                        {yieldUnit === 'hectares' ? crop.yieldValue : (crop.yieldValue / HECTARES_TO_PLOTS).toFixed(2)}
                        <span className="text-xs ml-1 text-muted-foreground">units</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">{crop.laymanYield}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Time to Harvest</p>
                      <p className="text-xl font-bold text-slate-800">{crop.time}</p>
                      <p className="text-[10px] text-muted-foreground italic">Approx. duration</p>
                    </div>
                  </div>
                  <div className="bg-slate-50/30 p-6 flex md:flex-col justify-center gap-3">
                    <Button className="bg-primary text-white font-bold rounded-xl h-10 px-6 shadow-md hover:bg-primary/90">Full Plan</Button>
                    <Button variant="ghost" className="font-bold text-primary hover:bg-secondary/10 rounded-xl h-10">Save</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm">
              <Info size={20} />
            </div>
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">Understanding layman terms:</p>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>1 Ton is roughly 10 big bags of 100kg each.</li>
                <li>Hectare is roughly the size of 2 standard football fields.</li>
                <li>Profit is calculated based on current average market prices in your selected currency.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
