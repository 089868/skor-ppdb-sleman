import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

const links = [
  {
    title: "SIMULASI SKOR SPMB 2025 KOTA YOGYAKARTA",
    url: "https://simulasi-skor-ppdb-kota-yogyakarta.job.web.id/",
  },
  {
    title: "SIMULASI SKOR SPMB 2025 SLEMAN",
    url: "https://simulasi-skor-ppdb-sleman.job.web.id/",
  },
  {
    title: "LOKER",
    url: "https://job.web.id",
  },
];

export function Navigation() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  className="block px-2 py-1 text-lg hover:text-blue-600"
                >
                  {link.title}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <nav className="hidden md:flex gap-4">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className="text-sm hover:text-blue-600"
          >
            {link.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
