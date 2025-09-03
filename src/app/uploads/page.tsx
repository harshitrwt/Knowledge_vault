import Sidebar from "@/components/Sidebar";
import FileCard from "@/components/FileCard";

export default function UploadsPage() {
  const mockFiles = [
    { id: 1, name: "Resume.pdf", size: "200KB" },
    { id: 2, name: "Notes.docx", size: "1.2MB" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 text-white bg-black">
        <h1 className="text-2xl font-bold mb-4">Your Uploads</h1>
        <div className="grid gap-4">
          {mockFiles.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </main>
    </div>
  );
}
