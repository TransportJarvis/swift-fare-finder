import { BookingForm } from '@/components/BookingForm';
import heroImage from '@/assets/hero-delivery.jpg';
import { Truck, Clock, Shield, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Service de livraison professionnel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/75"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AtlasExpress
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Réservez votre course en quelques clics. Rapide, fiable, transparent.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Livraison rapide</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Service sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>Prix transparents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Réservez votre course
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entrez vos informations et obtenez un devis instantané.
            </p>
          </div>
          
          <BookingForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Service fiable</h3>
              <p className="text-muted-foreground">
                Nos livreurs professionnels assurent un transport sécurisé de vos colis
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Livraison rapide</h3>
              <p className="text-muted-foreground">
                Réservation instantanée et livraison dans les meilleurs délais
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Prix transparents</h3>
              <p className="text-muted-foreground">
                Tarifs clairs et sans surprise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-foreground text-white">
        <div className="container mx-auto px-4 text-center space-y-3">
          <h4 className="text-xl font-semibold">AtlasExpress</h4>
          <p className="text-white/70">Votre service de livraison de confiance</p>
          <div className="text-sm text-white/80 space-y-1">
            <p>📍 Azazga, Tizi Ouzou</p>
            <p>📞 07 66 05 08 33</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;