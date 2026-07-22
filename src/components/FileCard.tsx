export default function FileCard({ file }: { file: { id: number; name: string; size: string } }) {
  return (
    <div className="vault-panel-solid flex items-center justify-between gap-4 p-4 text-[var(--vault-ink)]">
      <div>
        <p className="font-extrabold">{file.name}</p>
        <p className="text-sm font-semibold text-[var(--vault-muted)]">{file.size}</p>
      </div>
      <button className="vault-button-secondary min-h-9 px-3 py-1.5 text-sm">Download</button>
    </div>
  );
}
