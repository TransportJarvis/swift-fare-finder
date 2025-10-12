import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-white/90 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold">Conditions Générales d'Utilisation</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-DZ')}
            </p>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service de transport AtlasExpress, conformément à la législation algérienne en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Mentions légales</h2>
            <p>
              <strong>Raison sociale :</strong> AtlasExpress<br />
              <strong>Siège social :</strong> Azazga, Tizi Ouzou, Algérie<br />
              <strong>Téléphone :</strong> 07 66 05 08 33<br />
              <strong>Email :</strong> contact@atlasexpress.dz<br />
              <strong>Forme juridique :</strong> [À compléter]<br />
              <strong>Numéro d'immatriculation :</strong> [À compléter]<br />
              <strong>Numéro fiscal :</strong> [À compléter]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Objet</h2>
            <p>
              Les présentes CGU ont pour objet de définir les conditions d'utilisation du site web et des services de transport proposés par AtlasExpress.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Acceptation des conditions</h2>
            <p>
              L'utilisation du site et la réservation de nos services impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Services proposés</h2>
            <p>
              AtlasExpress propose des services de transport de marchandises entre différents points en Algérie. Les services incluent :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Transport de marchandises diverses</li>
              <li>Calcul automatique du tarif basé sur la distance</li>
              <li>Suivi de réservation</li>
              <li>Service client dédié</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Conditions de réservation</h2>
            <h3 className="text-xl font-semibold mb-2">5.1 Processus de réservation</h3>
            <p>
              Pour effectuer une réservation, vous devez fournir les informations suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Point de départ et point d'arrivée</li>
              <li>Poids approximatif de la marchandise</li>
              <li>Type de produits</li>
              <li>Remarques particulières si nécessaire</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Tarification</h3>
            <p>
              Les tarifs sont calculés selon une formule fixe. Le prix affiché lors de la réservation est le prix définitif, sauf mention contraire.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Confirmation</h3>
            <p>
              Toute réservation est soumise à confirmation par AtlasExpress. Nous nous réservons le droit de refuser une réservation en cas d'informations incomplètes ou d'impossibilité technique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Obligations du client</h2>
            <p>
              Le client s'engage à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations exactes et complètes</li>
              <li>Emballer correctement les marchandises</li>
              <li>Respecter les réglementations en vigueur concernant le transport de marchandises</li>
              <li>Ne pas confier de marchandises interdites ou dangereuses sans déclaration préalable</li>
              <li>Être présent aux horaires convenus pour la prise en charge et la livraison</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Marchandises interdites</h2>
            <p>
              Sont strictement interdits au transport :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les produits stupéfiants et substances illicites</li>
              <li>Les armes et munitions sans autorisation</li>
              <li>Les matières explosives ou inflammables sans déclaration</li>
              <li>Les produits périssables sans emballage approprié</li>
              <li>Tout article contraire à la législation algérienne</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Responsabilité</h2>
            <h3 className="text-xl font-semibold mb-2">8.1 Responsabilité d'AtlasExpress</h3>
            <p>
              AtlasExpress s'engage à transporter les marchandises avec le plus grand soin. Notre responsabilité est limitée conformément aux dispositions légales en vigueur en Algérie.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">8.2 Limitation de responsabilité</h3>
            <p>
              AtlasExpress ne pourra être tenue responsable en cas de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Force majeure (conditions météorologiques, catastrophes naturelles, etc.)</li>
              <li>Emballage inapproprié par le client</li>
              <li>Déclaration inexacte du contenu ou du poids</li>
              <li>Défaut de présence du client aux horaires convenus</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">8.3 Assurance</h3>
            <p>
              Il est fortement recommandé au client de souscrire une assurance pour ses marchandises. AtlasExpress peut proposer des options d'assurance additionnelles sur demande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Réclamations</h2>
            <p>
              Toute réclamation concernant le transport doit être formulée par écrit dans un délai de 7 jours suivant la livraison, à l'adresse : contact@atlasexpress.dz
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Annulation et modification</h2>
            <h3 className="text-xl font-semibold mb-2">10.1 Par le client</h3>
            <p>
              Toute annulation doit être notifiée au moins 24 heures avant la date prévue de transport. Des frais d'annulation peuvent s'appliquer.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">10.2 Par AtlasExpress</h3>
            <p>
              AtlasExpress se réserve le droit d'annuler ou de modifier une réservation en cas de circonstances exceptionnelles. Le client sera informé dans les plus brefs délais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Protection des données personnelles</h2>
            <p>
              Le traitement de vos données personnelles est régi par notre <Link to="/privacy-policy" className="text-primary hover:underline">Politique de Confidentialité</Link>, conforme à la loi algérienne n° 18-07 du 10 juin 2018.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Propriété intellectuelle</h2>
            <p>
              Tous les éléments du site (textes, images, logos, graphismes) sont la propriété exclusive d'AtlasExpress et sont protégés par le droit algérien de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont régies par le droit algérien. En cas de litige, et après tentative de règlement amiable, les tribunaux algériens seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Modification des CGU</h2>
            <p>
              AtlasExpress se réserve le droit de modifier les présentes CGU à tout moment. Les modifications seront publiées sur cette page et entreront en vigueur immédiatement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
            </p>
            <p className="mt-2">
              <strong>AtlasExpress</strong><br />
              Adresse : Azazga, Tizi Ouzou, Algérie<br />
              Téléphone : 07 66 05 08 33<br />
              Email : contact@atlasexpress.dz
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
