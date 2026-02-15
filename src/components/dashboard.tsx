'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sprout, Wrench, Landmark, BarChart, Bell, Handshake, Repeat, Banknote } from 'lucide-react';
import { CropPlanner } from './crop-planner';
import { MarketAnalysis } from './market-analysis';
import { useToast } from '@/hooks/use-toast';
import { FarmerExchange } from './farmer-exchange';
import { SmartReminders } from './smart-reminders';
import { EquipmentRental } from './equipment-rental';
import { LandMarketplace } from './land-marketplace';
import { GovSchemeFinder } from './gov-scheme-finder';


type Feature = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  className: string;
  component: React.ElementType<{ onBack: () => void; }>;
};

export function Dashboard() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'crop-planner',
      title: 'Crop Planner',
      description: 'AI advice on what to plant and when for best yield.',
      icon: Sprout,
      className: 'text-chart-2 bg-chart-2/10',
      component: CropPlanner,
    },
    {
      id: 'equipment-rental',
      title: 'Equipment Rental',
      description: 'Find and rent agricultural tools and machinery nearby.',
      icon: Wrench,
      className: 'text-chart-4 bg-chart-4/10',
      component: EquipmentRental,
    },
    {
      id: 'land-marketplace',
      title: 'Land Marketplace',
      description: 'Buy, sell, or rent agricultural land in your area.',
      icon: Landmark,
      className: 'text-primary bg-primary/10',
      component: LandMarketplace,
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Discover the best markets to sell your produce for max profit.',
      icon: BarChart,
      className: 'text-chart-1 bg-chart-1/10',
      component: MarketAnalysis,
    },
    {
      id: 'smart-reminders',
      title: 'Smart Reminders',
      description: 'Get reminders for watering, fertilizing, and pest control.',
      icon: Bell,
      className: 'text-chart-5 bg-chart-5/10',
      component: SmartReminders,
    },
    {
        id: 'wholesale-connect',
        title: 'Wholesale Connect',
        description: 'Directly contact wholesale buyers for your crops.',
        icon: Handshake,
        className: 'text-chart-3 bg-chart-3/10',
        component: MarketAnalysis, // Also uses MarketAnalysis component
    },
    {
      id: 'farmer-exchange',
      title: 'Farmer to Farmer Exchange',
      description: 'Exchange or barter crops, like wheat for rice, directly with other farmers.',
      icon: Repeat,
      className: 'text-accent bg-accent/10',
      component: FarmerExchange,
    },
     {
      id: 'gov-schemes',
      title: 'Government Schemes',
      description: 'Find relevant government schemes and subsidies.',
      icon: Banknote,
      className: 'text-blue-500 bg-blue-500/10',
      component: GovSchemeFinder,
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
  };
  
  const handleBack = () => {
    setActiveFeature(null);
  };

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component;

  if (ActiveComponent) {
    return <ActiveComponent onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight">Welcome to KrishivSeth AI</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">Your all-in-one platform for smart agriculture, from crop planning to market sales.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <Card 
            key={feature.title} 
            className="bg-card/80 backdrop-blur-sm border-border/20 hover:border-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            onClick={() => handleFeatureClick(feature.id)}
          >
            <CardHeader className="p-6">
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.className}`}>
                    <feature.icon className="h-7 w-7" />
                </div>
              <CardTitle className="font-semibold text-xl">{feature.title}</CardTitle>
              <CardDescription className="pt-2">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
