import * as React from 'react';
import { 
  Bug,
  Camera, 
  ShieldCheck, 
  FlaskConical, 
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const issues = [
  {
    id: 'blight',
    name: 'Early Blight',
    type: 'Fungal Disease',
    affects: 'Tomatoes, Potatoes',
    symptoms: 'Brown spots with concentric rings on older leaves.',
    prevention: 'Crop rotation, mulching, avoiding overhead irrigation.',
    treatment: 'Mancozeb or Copper-based fungicides.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/tomato-blight-12334a9e-1783242029560.webp',
    urgency: 'high'
  },
  {
    id: 'armyworm',
    name: 'Fall Armyworm',
    type: 'Pest',
    affects: 'Maize, Sorghum, Rice',
    symptoms: 'Large holes in leaves, ragged edges, sawdust-like droppings.',
    prevention: 'Early planting, hand-picking (small scale), push-pull technology.',
    treatment: 'Emamectin benzoate or Spinetoram.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/maize-streak-virus-82c53a4f-1783256121778.webp',
    urgency: 'critical'
  },
  {
    id: 'cassava-mosaic',
    name: 'Cassava Mosaic',
    type: 'Viral Disease',
    affects: 'Cassava',
    symptoms: 'Distorted and stunted leaves with yellow-green mosaic patterns.',
    prevention: 'Use resistant varieties, control whitefly population.',
    treatment: 'No cure; remove and destroy infected plants.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/cassava-mosaic-disease-3bbcf5e3-1783256121971.webp',
    urgency: 'high'
  },
  {
    id: 'black-pod',
    name: 'Black Pod Disease',
    type: 'Fungal Disease',
    affects: 'Cocoa',
    symptoms: 'Brown to black spots on pods that spread rapidly.',
    prevention: 'Proper pruning, regular harvesting, farm sanitation.',
    treatment: 'Copper-based fungicides.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/black-pod-disease-c88d8632-1783256121157.webp',
    urgency: 'high'
  }
];

export default function PestDiseaseGuide() {
  return (
    <div className="space-y-8">
      {/* AI Detection Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-primary rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md space-y-4">
          <Badge className="bg-secondary text-secondary-foreground border-none">AI Feature</Badge>
          <h2 className="text-3xl font-bold">Diagnose in Seconds</h2>
          <p className="text-slate-300">
            Having trouble with your crops? Take a photo and let our AI identify pests or diseases instantly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2">
              <Camera size={18} />
              <span>Upload Photo</span>
            </Button>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-800 p-6 rounded-2xl border border-white/10 flex items-center justify-center">
            <Bug size={64} className="text-secondary" />
          </div>
        </div>
      </div>

      {/* How it Works */}
      <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6 grid md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 text-primary font-bold p-3 rounded-lg">1</div>
                  <div>
                      <h4 className="font-bold">Upload a Photo</h4>
                      <p className="text-sm text-muted-foreground">Take a clear picture of the affected plant part.</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 text-primary font-bold p-3 rounded-lg">2</div>
                  <div>
                      <h4 className="font-bold">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">Our model analyzes the image against a vast database.</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 text-primary font-bold p-3 rounded-lg">3</div>
                  <div>
                      <h4 className="font-bold">Get Instant Solution</h4>
                      <p className="text-sm text-muted-foreground">Receive diagnosis and actionable treatment advice.</p>
                  </div>
              </div>
          </CardContent>
      </Card>

      {/* Visual Gallery */}
      <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight">Common Issues Gallery</h3>
          <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
              <CarouselContent className="-ml-4">
                  {issues.map((issue) => (
                      <CarouselItem key={issue.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                          <Card className="group overflow-hidden border-none shadow-sm bg-white hover:shadow-xl transition-all duration-300 rounded-2xl">
                              <div className="relative h-48 overflow-hidden">
                                  <img 
                                  src={issue.image} 
                                  alt={issue.name} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                  />
                                  <div className="absolute top-4 left-4">
                                    <Badge className={cn("border-none text-white", issue.urgency === 'critical' ? "bg-red-500" : "bg-amber-500")} >
                                      {issue.urgency} risk
                                    </Badge>
                                  </div>
                              </div>
                              <CardContent className="p-4">
                                  <h3 className="text-lg font-bold text-slate-800 truncate">{issue.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{issue.symptoms}</p>
                                  <Button variant="ghost" size="sm" className="text-primary gap-1 p-0 h-auto hover:bg-transparent hover:text-primary/80 text-xs mt-2">
                                      Learn More <ArrowRight size={14} />
                                  </Button>
                              </CardContent>
                          </Card>
                      </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
          </Carousel>
      </div>

      {/* Emergency Alert Section */}
      <div className="p-6 rounded-2xl bg-amber-50 border border-warning/20 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-warning/20 rounded-full text-warning-foreground">
          <AlertCircle size={32} />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-amber-900">Outbreak Alert</h4>
          <p className="text-sm text-amber-800/80">
            Increased Fall Armyworm activity reported in Kaduna and Gombe states. Monitor your maize crops daily.
          </p>
        </div>
        <Button className="bg-warning text-warning-foreground hover:bg-warning/80">
          Get Advisory
        </Button>
      </div>
    </div>
  );
}
