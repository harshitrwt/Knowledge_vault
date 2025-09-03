export default function FileCard({ file }: { file: { id: number; name: string; size: string } }) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg text-white flex justify-between items-center">
      <div>
        <p className="font-semibold">{file.name}</p>
        <p className="text-sm text-gray-400">{file.size}</p>
      </div>
      <button className="px-3 py-1 bg-blue-600 rounded">Download</button>
    </div>
  );
}
