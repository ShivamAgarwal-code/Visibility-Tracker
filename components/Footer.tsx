export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} AI Search Tracker. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built for next-gen AI visibility</p>
      </div>
    </footer>
  );
}
