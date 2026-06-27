import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Kayak-Tahiti-Delivery",
};

function Article({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
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

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-[#192ee2] bg-blue-50/50 px-5 py-4 text-slate-700 font-semibold text-sm">
      {children}
    </div>
  );
}

function PriceRow({ item, price }: { item: string; price: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-700 font-semibold text-sm">{item}</span>
      <span className="text-slate-950 font-black text-base tracking-tight">{price} XPF</span>
    </div>
  );
}

export default function ConditionsGeneralesPage() {
  return (
    <article>
      {/* Hero */}
      <div className="mb-14">
        <p className="text-[#192ee2] text-[9px] font-black tracking-[0.4em] uppercase mb-4">
          Réservation & Location
        </p>
        <h1
          className="font-black tracking-tighter leading-none text-slate-950 mb-5"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
        >
          CONDITIONS<br />GÉNÉRALES
        </h1>
        <p className="text-slate-400 text-sm font-semibold max-w-xl">
          En validant une réservation sur cette plateforme, le client reconnaît avoir lu, compris et accepté
          sans réserve l'intégralité des présentes Conditions Générales de Vente et de Réservation (CGVR).
        </p>

        {/* Champ d'application */}
        <div className="mt-8 bg-slate-950 text-white px-6 py-5">
          <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400 mb-2">
            Champ d'application
          </p>
          <p className="text-sm font-semibold leading-relaxed text-slate-300">
            Les présentes CGVR régissent l'ensemble des prestations de location et de livraison de kayak solo
            proposées par <strong className="text-white">Kayak-Tahiti-Delivery — Kevin DECIAN</strong>, exploitant individuel basé à Tahiti,
            Polynésie française. Toute réservation en ligne vaut acceptation expresse et irrévocable des présentes conditions.
          </p>
        </div>
      </div>

      {/* Article 1 */}
      <Article num="01" title="Condition Stricte d'Aptitude">
        <p>
          En cochant la case de confirmation lors de la réservation, le client certifie sur l'honneur, sous sa
          responsabilité pleine et entière, que <strong className="text-slate-950">chaque utilisateur du kayak solo</strong>{" "}
          satisfait cumulativement aux trois conditions suivantes :
        </p>
        <ul className="space-y-2 pl-4">
          <li className="flex gap-3">
            <span className="text-[#192ee2] font-black shrink-0">—</span>
            <span>Être âgé de <strong className="text-slate-950">7 ans révolus minimum</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#192ee2] font-black shrink-0">—</span>
            <span>Savoir nager <strong className="text-slate-950">25 mètres minimum</strong> en eau libre sans assistance</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#192ee2] font-black shrink-0">—</span>
            <span>Être capable de <strong className="text-slate-950">s'immerger et de se remettre à la surface</strong> seul</span>
          </li>
        </ul>
        <Alert>
          Le loueur décline toute responsabilité civile et pénale si ces conditions ne sont pas réunies au moment
          de la mise à l'eau, que le client ait ou non coché la case de certification. La déclaration du client
          engage sa responsabilité exclusive.
        </Alert>
      </Article>

      {/* Article 2 */}
      <Article num="02" title="Obligation de Sécurité & Livraison">
        <p>
          Le loueur s'engage à livrer, pour chaque réservation de kayak solo, le pack de sécurité complet et
          réglementaire suivant :
        </p>
        <div className="bg-slate-50 border border-slate-200 divide-y divide-slate-200 text-sm">
          {[
            { item: "Gilet d'aide à la flottabilité conforme CE", note: "50 Newtons minimum, norme EN ISO 12402-5" },
            { item: "Pagaie ergonomique adaptée", note: "Réglée à la taille du pratiquant" },
            { item: "Sac étanche", note: "Mise à disposition gratuite" },
            { item: "Bout de remorquage flottant polypropylène", note: "Conforme Division 240 — réglementation maritime" },
          ].map(({ item, note }) => (
            <div key={item} className="px-4 py-3">
              <p className="font-bold text-slate-950">{item}</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">{note}</p>
            </div>
          ))}
        </div>
        <p>
          Le client s'engage formellement à <strong className="text-slate-950">porter le gilet de flottabilité en permanence</strong>{" "}
          durant toute la durée de la location, dès lors qu'il se trouve sur l'eau.
        </p>
        <Alert>
          La livraison du matériel étant effectuée en main propre, le loueur ne peut être tenu responsable des
          infractions commises par le client à la réglementation maritime, ni du refus délibéré de porter les
          équipements de sécurité fournis après remise du matériel.
        </Alert>
      </Article>

      {/* Article 3 */}
      <Article num="03" title="Responsabilité & Exclusion de Garantie">
        <p>
          À compter de la remise en main propre du matériel, le client acquiert la qualité de{" "}
          <strong className="text-slate-950">gardien juridique au sens de l'article 1242 du Code civil</strong>. Il
          assume seul l'entière responsabilité de la garde, de l'usage et de la conservation du matériel et des
          personnes qui en font usage.
        </p>
        <p>
          Le sac étanche est mis à la disposition du client à titre gratuit et accessoire. Le loueur ne garantit
          pas l'étanchéité absolue de celui-ci en cas de fermeture incorrecte, d'immersion forcée ou de mauvaise
          manipulation imputable au client.
        </p>
        <Alert>
          <strong>Exclusion formelle de responsabilité :</strong> Le loueur décline toute responsabilité pour la
          détérioration, la noyade, la perte ou le vol de tout objet personnel du client (smartphones, clés
          électroniques de véhicule, appareils photos, montres, bijoux, documents d'identité, espèces, etc.),
          qu'il soit placé ou non dans le sac étanche fourni. Le client est seul responsable de la sécurisation
          de ses effets personnels.
        </Alert>
      </Article>

      {/* Article 4 */}
      <Article num="04" title="Dégradation & Perte de Matériel">
        <p>
          En cas de perte, de vol ou de dégradation du matériel mis à disposition, le client s'engage à régler
          au loueur les frais fixes de remplacement suivants, non négociables et dus de plein droit :
        </p>
        <div className="bg-slate-950 px-4 divide-y divide-slate-800">
          <PriceRow item="Perte ou destruction totale du Kayak Solo" price="80 000" />
          <PriceRow item="Perte ou destruction de la Pagaie" price="6 000" />
          <PriceRow item="Perte ou destruction du Gilet de Flottabilité CE" price="5 000" />
          <PriceRow item="Perte ou destruction du Sac Étanche" price="3 000" />
        </div>
        <p>
          Ces montants sont exigibles dès constatation de la perte ou de la dégradation lors de la restitution
          du matériel. Tout matériel restitué dégradé (hors usure normale) fera l'objet d'une évaluation
          contradictoire dont le coût de réparation sera intégralement facturé au client.
        </p>
      </Article>

      {/* Article 5 */}
      <Article num="05" title="Annulation & Force Majeure">
        <p>
          Toute réservation est annulable sans frais et avec remboursement intégral jusqu'à{" "}
          <strong className="text-slate-950">24 heures avant l'horaire de livraison prévu</strong>.
          Passé ce délai, aucun remboursement ne sera effectué sauf cas de force majeure dûment justifié.
        </p>
        <p>
          Constituent des cas de force majeure autorisant le loueur à annuler ou reporter la prestation sans
          indemnité :
        </p>
        <ul className="space-y-2 pl-4">
          <li className="flex gap-3">
            <span className="text-[#192ee2] font-black shrink-0">—</span>
            <span>
              Toute <strong className="text-slate-950">alerte météo officielle</strong> émise par{" "}
              <strong className="text-slate-950">Météo-France Polynésie</strong> (forte houle, vigilance lagon,
              vent violent, passage dépressionnaire ou cyclonique)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#192ee2] font-black shrink-0">—</span>
            <span>Décision administrative de fermeture du plan d'eau</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#192ee2] font-black shrink-0">—</span>
            <span>Tout événement imprévisible, irrésistible et extérieur rendant la prestation impossible</span>
          </li>
        </ul>
        <Alert>
          En cas d'annulation par le loueur pour motif météorologique, la prestation est intégralement
          remboursée ou reportée à une date convenue d'un commun accord. Le client ne peut réclamer aucune
          indemnité supplémentaire de quelque nature que ce soit.
        </Alert>
      </Article>

      {/* Article 6 */}
      <Article num="06" title="Droit Applicable & Juridiction Compétente">
        <p>
          Les présentes Conditions Générales de Vente et de Réservation sont soumises au droit applicable en
          Polynésie française, incluant notamment le Code civil français tel qu'applicable dans la collectivité,
          le Code de la consommation et la réglementation maritime locale.
        </p>
        <p>
          En cas de litige relatif à l'interprétation, la validité ou l'exécution des présentes conditions,
          et à défaut de résolution amiable dans un délai de 30 jours à compter de la notification du litige,
          la compétence exclusive est attribuée au{" "}
          <strong className="text-slate-950">Tribunal de Première Instance de Papeete</strong>,
          nonobstant pluralité de défendeurs ou appel en garantie.
        </p>
      </Article>

      <p className="mt-12 text-slate-400 text-xs font-semibold text-right">
        Dernière mise à jour : juin 2026
      </p>
    </article>
  );
}
