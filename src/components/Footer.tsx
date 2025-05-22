const links = [
  {
    title: "SIMULASI SKOR SPMB KOTA YOGYAKARTA 2025",
    url: "https://simulasi-skor-ppdb-kota-yogyakarta.job.web.id/",
  },
  {
    title: "SIMULASI SKOR SPMB SLEMAN 2025",
    url: "https://simulasi-skor-ppdb-sleman.job.web.id/",
  },
  {
    title: "LOKER",
    url: "https://job.web.id",
  },
];

export function Footer() {
  return (
    <footer className="mt-8 py-6 border-t">
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className="text-sm hover:text-blue-600"
          >
            {link.title}
          </a>
        ))}
      </div>
    </footer>
  );
}
