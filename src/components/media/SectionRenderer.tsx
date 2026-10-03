import type { Block, Item, Section } from '@/data/projects';

const Items = ({ items }: { items: Item[] }) => (
  <ul className="space-y-3">
    {items.map((it, i) => (
      <li key={i} className="flex gap-3 text-lg leading-relaxed text-paper/80">
        <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
        <span>
          {it.label && <strong className="font-medium text-paper">{it.label}: </strong>}
          {it.text}
        </span>
      </li>
    ))}
  </ul>
);

const BlockView = ({ block }: { block: Block }) => {
  switch (block.type) {
    case 'p':
      return <p className="max-w-3xl text-lg leading-relaxed text-paper/80">{block.text}</p>;
    case 'list':
      return <Items items={block.items} />;
    case 'group':
      return (
        <div>
          <h3 className="mb-3 text-xl font-medium">{block.title}</h3>
          <Items items={block.items} />
        </div>
      );
  }
};

/** Renders a project's write-up exactly as stored in `projects.ts`. */
export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-12">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="micro mb-4 text-mute">{s.heading}</h2>
          <div className="space-y-6">
            {s.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
