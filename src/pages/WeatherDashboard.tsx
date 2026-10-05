import * as React from 'react';
import { 
  Cloud, 
  CloudRain, 
  Droplets, 
  Wind, 
  Sun, 
  Sunrise, 
  Sunset, 
  AlertTriangle, 
  CheckCircle2, 
  Sprout,
  Waves,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const weatherData = {
  current: {
    temp: '31°C',
    condition: 'Partly Cloudy',
    location: 'Ikeja, Lagos',
    humidity: '65%',
    rainProb: '15%'
  },
  forecast: [
    { day: 'Mon', temp: '32°C', icon: Sun },
    { day: 'Tue', temp: '30°C', icon: Cloud },
    { day: 'Wed', temp: '28°C', icon: CloudRain },
    { day: 'Thu', temp: '31°C', icon: Sun },
    { day: 'Fri', temp: '33°C', icon: Sun },
  ],
  recommendations: [
    { title: 'Planting recommendations', text: 'Ideal soil moisture for Maize planting. Proceed in Northern sectors.', type: 'positive' },
    { title: 'Harvest warnings', text: 'Expect heavy rains in 48h. Secure drying cocoa beans.', type: 'warning' },
    { title: 'Irrigation advice', text: 'Soil moisture levels are adequate. Skip irrigation today.', type: 'info' }
  ]
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function WeatherDashboard() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5">Real-time Data</Badge>
          <h2 className="text-3xl font-bold tracking-tight">Weather Dashboard</h2>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin size={14} /> {weatherData.current.location} • Updated 5 mins ago
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-border/50">
          <div className="p-3 bg-secondary/20 rounded-lg text-primary">
            <Sun size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{weatherData.current.temp}</div>
            <div className="text-xs text-muted-foreground">{weatherData.current.condition}</div>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <WeatherMetricCard 
            title="Humidity" 
            value={weatherData.current.humidity} 
            icon={Droplets} 
            color="text-blue-500" 
            bgColor="bg-blue-50"
          />
        </motion.div>
        <motion.div variants={item}>
          <WeatherMetricCard 
            title="Rain Prob." 
            value={weatherData.current.rainProb} 
            icon={CloudRain} 
            color="text-cyan-500" 
            bgColor="bg-cyan-50"
          />
        </motion.div>
        <motion.div variants={item}>
          <WeatherMetricCard 
            title="Wind" 
            value="12 km/h" 
            icon={Wind} 
            color="text-slate-500" 
            bgColor="bg-slate-50"
          />
        </motion.div>
        <motion.div variants={item}>
          <WeatherMetricCard 
            title="UV Index" 
            value="High (8)" 
            icon={Sun} 
            color="text-orange-500" 
            bgColor="bg-orange-50"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5-Day Forecast */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-slate-50/50">
              <CardTitle className="text-base">5-Day Forecast</CardTitle>
              <Badge variant="outline" className="font-normal">Next week looks clear</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center overflow-x-auto gap-4 pb-2">
                {weatherData.forecast.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 min-w-[70px]">
                    <span className="text-sm font-medium text-muted-foreground">{f.day}</span>
                    <div className="p-3 bg-secondary/10 rounded-full text-primary">
                      <f.icon size={20} />
                    </div>
                    <span className="font-bold">{f.temp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sunrise/Sunset */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full border-none shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-base">Daylight Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-orange-500">
                  <Sunrise size={24} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sunrise</div>
                  <div className="text-xl font-bold">06:42 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600">
                  <Sunset size={24} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sunset</div>
                  <div className="text-xl font-bold">06:55 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Agricultural Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary p-6 rounded-3xl text-white relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Sprout size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Agricultural Insight</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Based on current humidity and temperature, there is a <span className="text-secondary font-bold">high risk of fungal growth</span> in Tomato crops. Consider applying preventive treatment today before the evening rain.
            </p>
          </div>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 rounded-xl font-bold">
            View Plan
          </Button>
        </div>
      </motion.div>

      {/* Recommendations Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherData.recommendations.map((rec, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-5 rounded-2xl border flex flex-col gap-3",
              rec.type === 'positive' ? "bg-secondary/10 border-secondary/20" : 
              rec.type === 'warning' ? "bg-warning/10 border-warning/20" : 
              "bg-blue-50 border-blue-100"
            )}
          >
            <div className="flex items-center justify-between">
              <h4 className={cn(
                "font-bold text-sm",
                rec.type === 'positive' ? "text-primary" : 
                rec.type === 'warning' ? "text-amber-700" : 
                "text-blue-700"
              )}>
                {rec.title}
              </h4>
              {rec.type === 'positive' ? <CheckCircle2 size={18} className="text-primary" /> : 
               rec.type === 'warning' ? <AlertTriangle size={18} className="text-amber-600" /> : 
               <Waves size={18} className="text-blue-500" />}
            </div>
            <p className="text-xs leading-relaxed text-slate-600">{rec.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WeatherMetricCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden group">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <div className={cn("p-3 rounded-xl transition-colors duration-300 group-hover:scale-110", bgColor, color)}>
          <Icon size={24} />
        </div>
      </CardContent>
    </Card>
  );
}
