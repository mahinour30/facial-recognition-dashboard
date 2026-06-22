const COLOR_TOKENS = [
  // Primitives - Greens
  ['--color-primary-deloitte-green','Deloitte Green'],['--color-primary-green-4','Green 4'],['--color-primary-accessible-green','Accessible Green'],['--color-primary-tag-green','Tag Green'],
  // Blues
  ['--color-primary-accessible-blue','Accessible Blue'],['--color-primary-tag-blue','Tag Blue'],['--color-primary-accessible-teal','Accessible Teal'],
  // Grays
  ['--color-secondary-gray-cool-gray-0','Gray 0'],['--color-secondary-gray-cool-gray-2','Gray 2'],['--color-secondary-gray-cool-gray-4','Gray 4'],['--color-secondary-gray-cool-gray-7','Gray 7'],['--color-secondary-gray-cool-gray-10','Gray 10'],['--color-secondary-gray-cool-gray11','Gray 11'],['--color-secondary-gray-gray-12','Gray 12'],
  // Functional
  ['--color-functional-colors-red','Red'],['--color-functional-colors-orange','Orange'],['--color-functional-colors-yellow','Yellow'],
  // Tags
  ['--color-tag-green','Tag Green BG'],['--color-tag-blue','Tag Blue BG'],['--color-tag-red','Tag Red BG'],['--color-tag-orange','Tag Orange BG'],
]

const SEMANTIC_TOKENS = [
  ['--surface-primary','Surface Primary'],['--surface-secondary','Surface Secondary'],['--surface-tertiary','Surface Tertiary'],['--surface-quaternary','Surface Quaternary'],['--page-bg','Page BG'],
  ['--text-title-primary','Text Title Primary'],['--text-body-primary','Text Body Primary'],['--text-title-secondary','Text Title Secondary'],
  ['--button-primary','Button Primary'],['--link-primary','Link Primary'],
  ['--status-success','Status Success'],['--status-info','Status Info'],['--status-warning','Status Warning'],['--status-danger','Status Danger'],['--status-neutral','Status Neutral'],
  ['--tag-green-bg','Tag Green BG'],['--tag-green-fg','Tag Green FG'],['--tag-blue-bg','Tag Blue BG'],['--tag-blue-fg','Tag Blue FG'],
  ['--tag-red-bg','Tag Red BG'],['--tag-red-fg','Tag Red FG'],['--tag-orange-bg','Tag Orange BG'],['--tag-orange-fg','Tag Orange FG'],
  ['--chart-employees','Chart Employees'],['--chart-visitors','Chart Visitors'],['--chart-outsource','Chart Outsource'],['--chart-unidentified','Chart Unidentified'],
]

const TYPE_TOKENS = [
  { label: 'Heading 4', size: 'var(--type-heading-4-size)', weight: 'var(--type-heading-4-weight)', line: 'var(--type-heading-4-line)' },
  { label: 'Heading 5', size: 'var(--type-heading-5-size)', weight: 'var(--type-heading-5-weight)', line: 'var(--type-heading-5-line)' },
  { label: 'Body Regular', size: 'var(--type-body-regular-size)', weight: 'var(--type-body-regular-weight)', line: 'var(--type-body-regular-line)' },
  { label: 'Body Semibold', size: 'var(--type-body-semibold-size)', weight: 'var(--type-body-semibold-weight)', line: 'var(--type-body-semibold-line)' },
  { label: 'Label Regular', size: 'var(--type-label-regular-size)', weight: 'var(--type-label-regular-weight)', line: 'var(--type-label-regular-line)' },
  { label: 'Label Semibold', size: 'var(--type-label-semibold-size)', weight: 'var(--type-label-semibold-weight)', line: 'var(--type-label-semibold-line)' },
]

const SPACE_TOKENS = ['--space-1','--space-2','--space-3','--space-4','--space-5','--space-6','--space-7']
const RADIUS_TOKENS = ['--radius-sm','--radius-md','--radius-lg','--radius-pill']

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--stroke-default)' }}>{title}</h2>
      {children}
    </div>
  )
}

function ColorGrid({ tokens }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 'var(--space-3)' }}>
      {tokens.map(([token, label]) => (
        <div key={token} style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ height: 48, background: `var(${token})`, borderBottom: '1px solid var(--stroke-default)' }} />
          <div style={{ padding: 'var(--space-2)' }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-body-tertiary)', marginBottom: 2, wordBreak: 'break-all' }}>{token}</div>
            <div style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-title-primary)', fontWeight: 600 }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TokenSwatch() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-5)' }}>Design Token Swatch</h1>

      <Section title="Primitive Colors">
        <ColorGrid tokens={COLOR_TOKENS} />
      </Section>

      <Section title="Semantic Tokens">
        <ColorGrid tokens={SEMANTIC_TOKENS} />
      </Section>

      <Section title="Typography Scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--surface-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--stroke-default)' }}>
          {TYPE_TOKENS.map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-5)' }}>
              <span style={{ minWidth: 120, fontSize: 10, fontFamily: 'monospace', color: 'var(--text-body-tertiary)' }}>{t.label}</span>
              <span style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: t.line, fontFamily: 'var(--font-family)' }}>The quick brown fox</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing Scale">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          {SPACE_TOKENS.map(t => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: `var(${t})`, height: `var(${t})`, background: 'var(--button-primary)', borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-body-tertiary)' }}>{t}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border Radius">
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          {RADIUS_TOKENS.map(t => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 64, height: 40, background: 'var(--button-primary)', borderRadius: `var(${t})` }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-body-tertiary)' }}>{t}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
