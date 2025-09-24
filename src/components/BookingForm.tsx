import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Calculator, MessageSquare } from 'lucide-react';

interface BookingData {
  pointA: string;
  pointB: string;
  weight: string;
  productType: string;
  remarks: string;
}

export const BookingForm = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    pointA: '',
    pointB: '',
    weight: '',
    productType: '',
    remarks: ''
  });

  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);

  // Fonction pour calculer une distance approximative (simulation)
  const calculateDistance = () => {
    if (bookingData.pointA && bookingData.pointB) {
      // Simulation d'une distance entre 5 et 50 km
      const randomDistance = Math.floor(Math.random() * 45) + 5;
      setEstimatedDistance(randomDistance);
    }
  };

  // Calcul du prix : distance * 2 * 1.5
  const calculatePrice = () => {
    return estimatedDistance * 2 * 1.5;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateDistance();
    // Logique de soumission ici
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculer le prix
            </Button>
          </form>

          {/* Affichage du prix */}
          {estimatedDistance > 0 && (
            <Card className="bg-gradient-card border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Devis estimé</h3>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Distance estimée:</span>
                    <span className="font-medium">{estimatedDistance} km</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Calcul:</span>
                    <span className="font-medium">{estimatedDistance} × 2 × 1.5</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {calculatePrice().toFixed(2)} €
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