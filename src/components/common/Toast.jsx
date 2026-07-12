export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 rounded-md bg-slate-800 px-4 py-2 text-sm shadow-lg">
      {message}
    </div>
  );
}
