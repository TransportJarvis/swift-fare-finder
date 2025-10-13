import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Calculator, MessageSquare, Loader2, Clock, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingData {
  pointA: string;
  pointB: string;
  weight: string;
  productType: string;
  remarks: string;
  serviceLevel: 'express' | 'standard' | 'economy';
}

interface RouteResult {
  distance: number;
  duration: number;
  price: number;
  price_breakdown: {
    base: number;
    per_km: number;
    per_min: number;
    multiplier: number;
  };
  service_level: string;
}

export const BookingForm = () => {
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingData>({
    pointA: '',
    pointB: '',
    weight: '',
    productType: '',
    remarks: '',
    serviceLevel: 'standard'
  });

  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setRouteResult(null);

    try {
      console.log('Calculating route...', bookingData);
      
      const { data, error } = await supabase.functions.invoke('calculate-route', {
        body: {
          pointA: bookingData.pointA,
          pointB: bookingData.pointB,
          serviceLevel: bookingData.serviceLevel,
        },
      });

      if (error) throw error;

      console.log('Route calculated:', data);
      setRouteResult(data);
      
      toast({
        title: 'Devis calculé',
        description: `Distance: ${data.distance} km, Durée: ${data.duration} min`,
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de calculer le devis. Vérifiez les adresses.',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-medium">
        <CardHeader className="bg-gradient-hero text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            Réserver votre course
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Remplissez les informations pour obtenir un devis instantané
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleCalculateRoute} className="space-y-6">
            {/* Points de collecte et livraison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointA" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Point de collecte (A)
                </Label>
                <Input
                  id="pointA"
                  placeholder="Adresse de départ"
                  value={bookingData.pointA}
                  onChange={(e) => setBookingData(prev => ({ ...prev, pointA: e.target.value }))}
                  className="focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointB" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  Point de livraison (B)
                </Label>
                <Input
                  id="pointB"
                  placeholder="Adresse de destination"
                  value={bookingData.pointB}
                  onChange={(e) => setBookingData(prev => ({ ...prev, pointB: e.target.value }))}
                  className="focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Service Level */}
            <div className="space-y-2">
              <Label htmlFor="serviceLevel" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Niveau de service
              </Label>
              <Select 
                value={bookingData.serviceLevel} 
                onValueChange={(value: 'express' | 'standard' | 'economy') => 
                  setBookingData(prev => ({ ...prev, serviceLevel: value }))
                }
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">
                    <div className="flex flex-col">
                      <span className="font-semibold">Express</span>
                      <span className="text-xs text-muted-foreground">Livraison prioritaire, plus rapide</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex flex-col">
                      <span className="font-semibold">Standard</span>
                      <span className="text-xs text-muted-foreground">Livraison normale, bon rapport qualité/prix</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="economy">
                    <div className="flex flex-col">
                      <span className="font-semibold">Économique</span>
                      <span className="text-xs text-muted-foreground">Prix réduit, délai plus flexible</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Poids et type de produit */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids approximatif (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="ex: 5"
                  value={bookingData.weight}
                  onChange={(e) => setBookingData(prev => ({ ...prev, weight: e.target.value }))}
                  className="focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productType">Type de produits</Label>
                <Select 
                  value={bookingData.productType} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, productType: value }))}
                >
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="colis">Colis standard</SelectItem>
                    <SelectItem value="nourriture">Nourriture</SelectItem>
                    <SelectItem value="vetements">Vêtements</SelectItem>
                    <SelectItem value="electronique">Électronique</SelectItem>
                    <SelectItem value="fragile">Produits fragiles</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Remarques */}
            <div className="space-y-2">
              <Label htmlFor="remarks" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Remarques additionnelles
              </Label>
              <Textarea
                id="remarks"
                placeholder="Instructions spéciales, horaires préférés, informations importantes..."
                value={bookingData.remarks}
                onChange={(e) => setBookingData(prev => ({ ...prev, remarks: e.target.value }))}
                className="focus:ring-primary min-h-[80px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calcul en cours...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculer le prix
                </>
              )}
            </Button>
          </form>

          {/* Affichage du devis */}
          {routeResult && (
            <Card className="bg-gradient-card border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary text-center">Devis estimé</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary mb-2" />
                      <span className="text-xs text-muted-foreground">Distance</span>
                      <span className="text-lg font-bold">{routeResult.distance} km</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg">
                      <Clock className="w-5 h-5 text-primary mb-2" />
                      <span className="text-xs text-muted-foreground">Durée estimée</span>
                      <span className="text-lg font-bold">{routeResult.duration} min</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prix de base:</span>
                      <span className="font-medium">{routeResult.price_breakdown.base.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prix par km ({routeResult.price_breakdown.per_km}€/km):</span>
                      <span className="font-medium">{(routeResult.distance * routeResult.price_breakdown.per_km).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prix par minute ({routeResult.price_breakdown.per_min}€/min):</span>
                      <span className="font-medium">{(routeResult.duration * routeResult.price_breakdown.per_min).toFixed(2)} €</span>
                    </div>
                    {routeResult.price_breakdown.multiplier !== 1 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Multiplicateur service:</span>
                        <span className="font-medium">×{routeResult.price_breakdown.multiplier}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Prix total</span>
                      <div className="text-4xl font-bold text-primary mt-2">
                        {routeResult.price.toFixed(2)} €
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4 bg-success hover:bg-success/90"
                    size="lg"
                  >
                    Confirmer la réservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};