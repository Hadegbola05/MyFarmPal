import * as React from 'react';
import { 
  Search, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { cropCategories, allCrops } from '@/data/crops';

export default function CropLearningCenter() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredCrops = allCrops.filter(c => 
    (selectedCategory === 'All' || c.category === selectedCategory) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-primary p-8 text-white min-h-[240px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400C120 400 280 280 400 0V400H0Z" fill="white" />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-xl"
        >
          <Badge className="mb-4 bg-secondary text-secondary-foreground border-none">Knowledge Hub</Badge>
          <h2 className="text-4xl font-bold mb-2">Crop Learning Center</h2>
          <p className="text-primary-foreground/80 text-lg">
            A comprehensive knowledge base for every crop in the Nigerian ecosystem. Master your harvest with AI insights.
          </p> 
        </motion.div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder={`Search ${selectedCategory === 'All' ? 'all crops' : selectedCategory.toLowerCase()}...`} 
              className="pl-10 h-12 bg-white border-primary/10 rounded-xl focus-visible:ring-primary shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-primary/10 bg-white gap-2 text-primary hover:bg-secondary/10">
            <Filter size={18} />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="All" onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="bg-slate-100/50 border border-slate-200 p-1 h-14 rounded-2xl w-full justify-start overflow-x-auto no-scrollbar scroll-smooth">
            <TabsTrigger value="All" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">All Crops</TabsTrigger>
            {cropCategories.map(cat => (
              <TabsTrigger key={cat.name} value={cat.name} className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 whitespace-nowrap">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Crop Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCrops.map((crop, idx) => (
            <motion.div
              key={crop.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: (idx % 10) * 0.03 }}
            >
              <Card className="group overflow-hidden border-none shadow-sm bg-white hover:shadow-xl transition-all duration-500 rounded-3xl">
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={crop.image} 
                    alt={crop.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 backdrop-blur-md text-primary hover:bg-white border-none text-[10px] font-bold uppercase tracking-wider">
                      {crop.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 truncate mb-4">{crop.name}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Learn More</span>
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCrops.length === 0 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-slate-400" />
          </div>
          <p className="font-bold text-slate-600 text-lg">No crops found for "{searchTerm}"</p>
          <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">Try checking your spelling or select a different category to browse our database.</p>
          <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedCategory('All')}} className="mt-4 text-primary font-bold">Clear all filters</Button>
        </motion.div>
      )}
    </div>
  );
}
