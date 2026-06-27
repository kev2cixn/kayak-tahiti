import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Kayak-Tahiti-Delivery",
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-b border-slate-100 last:border-0">
      <div className="flex items-baseline gap-5 mb-5">
        <span
          className="font-black text-slate-100 leading-none select-none shrink-0"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          {num}
        </span>
        <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">{title}</h2>
      </div>
      <div className="space-y-4 text-slate-600 font-medium text-[15px] leading-relaxed pl-1">
        {children}
      </div>
    </section>
  );
}

function DataRow({ type, purpose, retention }: { type: string; purpose: string; retention: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 last:border-0 text-sm">
      <span className="font-bold text-slate-950">{type}</span>
      <span className="text-slate-600 font-medium">{purpose}</span>
      <span className="text-slate-400 font-semibold">{retention}</span>
    </div>
  );
}

function Right({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="text-[#192ee2] font-black text-lg leading-none shrink-0 mt-0.5">—</span>
      <div>
        <p className="font-black text-slate-950 text-sm tracking-tight">{title}</p>
        <p className="text-slate-500 text-sm font-medium mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function ConfidentialitePage() {
  return (
    <article>
      {/* Hero */}
      <div className="mb-14">
        <p className="text-[#192ee2] text-[9px] font-black tracking-[0.4em] uppercase mb-4">
          Protection des données
        </p>
        <h1
          className="font-black tracking-tighter leading-none text-slate-950 mb-5"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
        >
          POLITIQUE DE<br />CONFIDENTIALITÉ
        </h1>
        <p className="text-slate-400 text-sm font-semibold max-w-xl">
          Conformément à la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés
          (« Loi Informatique et Libertés »), applicable en Polynésie française, et au Règlement Général sur la
          Protection des Données (RGPD) dans la mesure de son applicabilité.
        </p>

        {/* Engagement central */}
        <div className="mt-8 bg-slate-950 px-6 py-6">
          <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-500 mb-3">
            Notre engagement
          </p>
          <p className="text-white font-black text-lg tracking-tight leading-snug">
            Vos données personnelles ne sont jamais vendues,<br className="hidden md:block" />
            revendues ou partagées avec des tiers, à Papeete ou ailleurs.
          </p>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Elles servent uniquement à assurer votre livraison de kayak.
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <Section num="01" title="Responsable du Traitement">
        <p>
          Le responsable du traitement des données personnelles est{" "}
          <strong className="text-slate-950">Kayak-Tahiti-Delivery — Kevin DECIAN</strong>,
          exploitant individuel domicilié en Polynésie française.
        </p>
        <p>
          Pour toute question relative à la protection de vos données ou pour exercer vos droits, contactez-nous à :{" "}
          <strong className="text-slate-950">kevindecian01@gmail.com</strong>
        </p>
      </Section>

      {/* Section 2 */}
      <Section num="02" title="Données Collectées">
        <p>
          Nous collectons uniquement les données strictement nécessaires à l'exécution de la prestation de
          livraison de kayak. Aucune donnée superflue n'est demandée, stockée ou conservée.
        </p>
        <div className="bg-slate-50 border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-slate-100">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">Donnée</span>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">Finalité</span>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">Conservation</span>
          </div>
          <div className="px-4 divide-y divide-slate-200">
            <DataRow type="Nom & Prénom"     purpose="Identification du client"              retention="3 ans" />
            <DataRow type="Téléphone"        purpose="Coordination de la livraison"          retention="3 ans" />
            <DataRow type="Adresse / Spot"   purpose="Livraison du kayak au bon endroit"     retention="3 ans" />
            <DataRow type="Email"            purpose="Confirmation de réservation"           retention="3 ans" />
            <DataRow type="Historique commandes" purpose="Gestion comptable & litiges éventuels" retention="5 ans (obligation légale)" />
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          Aucune donnée bancaire n'est collectée. Le paiement s'effectue exclusivement en espèces lors de la
          livraison physique du matériel.
        </p>
      </Section>

      {/* Section 3 */}
      <Section num="03" title="Base Légale du Traitement">
        <p>Le traitement de vos données repose sur les bases légales suivantes :</p>
        <ul className="space-y-3 pl-1">
          {[
            {
              base: "Exécution du contrat",
              desc: "Les données de livraison (téléphone, adresse) sont indispensables à la réalisation de la prestation que vous avez commandée.",
            },
            {
              base: "Intérêt légitime",
              desc: "La conservation de l'historique des réservations permet au loueur de gérer d'éventuels litiges relatifs aux dommages matériels (voir CGV, Art. 4).",
            },
            {
              base: "Obligation légale",
              desc: "Certaines données comptables sont conservées 5 ans conformément au Code de commerce applicable en Polynésie française.",
            },
          ].map(({ base, desc }) => (
            <li key={base} className="flex gap-3">
              <span className="text-[#192ee2] font-black shrink-0">—</span>
              <span>
                <strong className="text-slate-950">{base} :</strong> {desc}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Section 4 */}
      <Section num="04" title="Non-Partage des Données">
        <p>
          Vos données personnelles sont traitées exclusivement par l'équipe de{" "}
          <strong className="text-slate-950">Kayak-Tahiti-Delivery</strong> aux fins décrites ci-dessus.
        </p>
        <div className="bg-slate-50 border border-slate-200 space-y-0 divide-y divide-slate-200">
          {[
            { label: "Vente à des tiers",           value: "Jamais — aucune condition" },
            { label: "Partage commercial",          value: "Jamais" },
            { label: "Transfert hors UE/Polynésie", value: "Uniquement via Supabase (hébergement UE) avec garanties contractuelles" },
            { label: "Usage publicitaire",          value: "Jamais" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-4 px-4 py-3 text-sm">
              <span className="text-slate-500 font-semibold w-48 shrink-0">{label}</span>
              <span className="text-slate-950 font-bold">{value}</span>
            </div>
          ))}
        </div>
        <p>
          L'infrastructure technique (base de données) est hébergée par{" "}
          <strong className="text-slate-950">Supabase Inc.</strong> et l'application par{" "}
          <strong className="text-slate-950">Vercel Inc.</strong>, dans le strict cadre de la fourniture du
          service, sous contrat de traitement de données conforme aux exigences légales.
        </p>
      </Section>

      {/* Section 5 */}
      <Section num="05" title="Vos Droits">
        <p>
          Conformément à la Loi Informatique et Libertés et au RGPD, vous disposez des droits suivants,
          exerçables à tout moment et sans justification :
        </p>
        <div className="space-y-4 mt-2">
          <Right title="Droit d'accès" desc="Obtenir la liste complète des données personnelles que nous détenons vous concernant." />
          <Right title="Droit de rectification" desc="Corriger toute information inexacte ou incomplète vous concernant." />
          <Right title="Droit à l'effacement (droit à l'oubli)" desc="Exiger la suppression définitive de l'ensemble de vos données, sous réserve des obligations légales de conservation comptable." />
          <Right title="Droit à la portabilité" desc="Recevoir vos données dans un format structuré et lisible par machine." />
          <Right title="Droit d'opposition" desc="Vous opposer au traitement de vos données pour tout motif légitime." />
        </div>
        <div className="bg-slate-950 text-white px-5 py-4 mt-4">
          <p className="text-[9px] font-black tracking-[0.25em] uppercase text-slate-500 mb-2">
            Comment exercer vos droits
          </p>
          <p className="text-sm font-semibold text-slate-300 leading-relaxed">
            Envoyez votre demande par email à{" "}
            <strong className="text-white">kevindecian01@gmail.com</strong> en indiquant votre nom et le droit que
            vous souhaitez exercer. Nous nous engageons à répondre dans un délai de{" "}
            <strong className="text-white">30 jours ouvrés</strong>.
          </p>
        </div>
      </Section>

      {/* Section 6 */}
      <Section num="06" title="Cookies & Traceurs">
        <p>
          Cette application utilise uniquement des cookies techniques strictement nécessaires au fonctionnement
          du service (session de connexion, sécurité). Aucun cookie publicitaire, analytique tiers ou traceur de
          comportement n'est déposé sur votre appareil.
        </p>
      </Section>

      {/* Section 7 */}
      <Section num="07" title="Sécurité des Données">
        <p>
          Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos
          données contre tout accès non autorisé, perte ou altération : chiffrement en transit (TLS/HTTPS),
          authentification sécurisée, contrôle d'accès par rôle (Row Level Security — Supabase), et
          cloisonnement strict des données.
        </p>
      </Section>

      {/* Section 8 */}
      <Section num="08" title="Réclamation & Autorité de Contrôle">
        <p>
          Si vous estimez que le traitement de vos données n'est pas conforme à la réglementation applicable,
          vous pouvez introduire une réclamation auprès de la{" "}
          <strong className="text-slate-950">Commission Nationale de l'Informatique et des Libertés (CNIL)</strong>,
          autorité de contrôle compétente : <strong className="text-slate-950">cnil.fr</strong>
        </p>
      </Section>

      <p className="mt-12 text-slate-400 text-xs font-semibold text-right">
        Dernière mise à jour : juin 2026
      </p>
    </article>
  );
}
