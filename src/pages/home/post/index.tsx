import IeseEditor from "@/components/editor";

export default function page() {
  return (
    <div className="w-full flex flex-wrap gap-4">
      <div className="w-full">
        <IeseEditor />
      </div>
    </div>
  );
}
