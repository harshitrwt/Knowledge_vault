export default function FileCard({ file }: { file: { id: number; name: string; size: string } }) {
  return (
    <div className="neu-extruded flex items-center justify-between gap-4 rounded-2xl p-5 text-[#3D4852]">
      <div>
        <p className="font-display font-bold text-base text-[#3D4852]">{file.name}</p>
        <p className="text-sm font-medium text-[#6B7280]">{file.size}</p>
      </div>
      <button className="neu-btn-secondary !min-h-9 !rounded-xl px-4 py-1.5 text-xs font-bold">Download</button>
    </div>
  );
}

