import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales — Kayak Tahiti",
};

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-b border-slate-100 last:border-0">
      <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase mb-3">{label}</p>
      <h2 className="text-2xl font-black tracking-tight text-slate-950 mb-5">{title}</h2>
      <div className="space-y-2 text-slate-600 font-medium text-[15px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-slate-700 font-medium text-sm flex-1">{value}</span>
    </div>
  );
}

export default function MentionsLegalesPage() {
  return (
    <article>
      {/* Hero */}
      <div className="mb-14">
        <p className="text-[#192ee2] text-[9px] font-black tracking-[0.4em] uppercase mb-4">
          Informations légales
        </p>
        <h1
          className="font-black tracking-tighter leading-none text-slate-950 mb-5"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
        >
          MENTIONS<br />LÉGALES
        </h1>
        <p className="text-slate-400 text-sm font-semibold">
          Conformément aux articles L. 111-1 et suivants du Code de la consommation applicable en Polynésie française.
        </p>
      </div>

      {/* Éditeur */}
      <Section label="01 — Éditeur du site" title="Identité de l'éditeur">
        <div className="bg-slate-50 border border-slate-200 divide-y divide-slate-200">
          <Row label="Nom commercial"  value="KAYAK TAHITI ON-DEMAND — Kevin DECIAN" />
          <Row label="Statut"          value="Exploitant individuel — En cours d'immatriculation auprès de la CCISM de Papeete (Numéro TAHITI / TPI en attente de délivrance)" />
          <Row label="Domiciliation"   value="Tahiti, Polynésie française" />
          <Row label="Email"           value="kevindecian01@gmail.com" />
          <Row label="Téléphone"       value="+689 87 72 15 27" />
          <Row label="Responsable publication" value="Kevin DECIAN" />
        </div>
      </Section>

      {/* Hébergeur */}
      <Section label="02 — Hébergement" title="Hébergeur du service">
        <div className="bg-slate-50 border border-slate-200 divide-y divide-slate-200">
          <Row label="Société"  value="Vercel Inc." />
          <Row label="Adresse" value="340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis d'Amérique" />
          <Row label="Site web" value="vercel.com" />
        </div>
        <p className="mt-4 text-slate-500 text-sm">
          Les données sont hébergées sur des serveurs situés aux États-Unis dans le cadre des garanties prévues
          par les Clauses Contractuelles Types de la Commission Européenne.
        </p>
      </Section>

      {/* Propriété intellectuelle */}
      <Section label="03 — Propriété intellectuelle" title="Droits & contenus">
        <p>
          L'ensemble des éléments constituant ce site (structure, textes, visuels, logos, architecture logicielle)
          est la propriété exclusive de l'éditeur ou de ses concédants de licence. Toute reproduction,
          représentation ou diffusion, intégrale ou partielle, sans autorisation écrite préalable de l'éditeur,
          est strictement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants
          du Code de la propriété intellectuelle.
        </p>
      </Section>

      {/* Responsabilité */}
      <Section label="04 — Limitation de responsabilité" title="Disponibilité & exactitude">
        <p>
          L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site.
          Cependant, il ne peut garantir l'exactitude, la complétude ou l'actualité de ces informations.
          L'éditeur décline toute responsabilité pour tout préjudice direct ou indirect résultant de l'accès ou
          de l'utilisation de ce site, notamment en cas d'indisponibilité temporaire du service.
        </p>
      </Section>

      {/* Droit applicable */}
      <Section label="05 — Droit applicable" title="Juridiction compétente">
        <p>
          Le présent site et ses mentions légales sont soumis au droit applicable en Polynésie française.
          En cas de litige, et à défaut de résolution amiable, la compétence exclusive est attribuée au{" "}
          <strong className="text-slate-950">Tribunal de Première Instance de Papeete</strong>.
        </p>
      </Section>

      <p className="mt-12 text-slate-400 text-xs font-semibold text-right">
        Dernière mise à jour : juin 2026
      </p>
    </article>
  );
}
