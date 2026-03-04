export default function Spinner({ text = 'טוען...' }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="w-8 h-8 border-4 border-orange-200 border-t-[#E86A3E] rounded-full animate-spin" />
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}
