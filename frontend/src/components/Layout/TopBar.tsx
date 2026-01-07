export default function TopBar({ title }) {
  return (
    <div className="w-full h-14 bg-gray-100 border-b flex items-center px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
