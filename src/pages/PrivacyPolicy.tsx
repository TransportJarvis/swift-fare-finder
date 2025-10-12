import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-white/90 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-DZ')}
            </p>
            <p>
              AtlasExpress s'engage à protéger la confidentialité de vos données personnelles conformément à la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Responsable du traitement</h2>
            <p>
              <strong>AtlasExpress</strong><br />
              Adresse : Azazga, Tizi Ouzou, Algérie<br />
              Téléphone : 07 66 05 08 33<br />
              Email : contact@atlasexpress.dz
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informations de réservation :</strong> points de départ et d'arrivée, poids, type de produits, remarques</li>
              <li><strong>Données de contact :</strong> nom, email, numéro de téléphone</li>
              <li><strong>Données techniques :</strong> adresse IP, type de navigateur, données de connexion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Finalité du traitement</h2>
            <p>Vos données sont collectées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traiter vos demandes de réservation de transport</li>
              <li>Vous contacter concernant vos réservations</li>
              <li>Améliorer nos services</li>
              <li>Répondre à vos demandes de contact</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Base légale du traitement</h2>
            <p>
              Le traitement de vos données personnelles est fondé sur :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>L'exécution du contrat de prestation de service</li>
              <li>Votre consentement explicite</li>
              <li>Le respect de nos obligations légales</li>
              <li>Notre intérêt légitime à améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Données de réservation : 3 ans à compter de la dernière activité</li>
              <li>Données de contact : jusqu'à votre demande de suppression</li>
              <li>Données comptables : 10 ans conformément à la législation algérienne</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Vos droits</h2>
            <p>
              Conformément à la loi n° 18-07, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong>Droit d'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            </ul>
            <p className="mt-4">
              Pour exercer vos droits, contactez-nous à : contact@atlasexpress.dz
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Transfert de données</h2>
            <p>
              Vos données personnelles sont hébergées en Algérie et ne sont pas transférées en dehors du territoire national sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Cookies</h2>
            <p>
              Notre site utilise des cookies essentiels au fonctionnement du service. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter votre expérience utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Réclamation</h2>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l'Autorité Nationale de Protection des Données à Caractère Personnel (ANPDCP).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, contactez-nous :
            </p>
            <p className="mt-2">
              Email : contact@atlasexpress.dz<br />
              Téléphone : 07 66 05 08 33<br />
              Adresse : Azazga, Tizi Ouzou, Algérie
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
