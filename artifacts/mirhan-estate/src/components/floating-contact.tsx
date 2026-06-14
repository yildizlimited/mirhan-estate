import { useState } from "react";
import { X, Phone, PhoneCall, MessageCircle } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      label: "WhatsApp",
      icon: <SiWhatsapp className="w-6 h-6 text-white" />,
      bg: "bg-emerald-500 hover:bg-emerald-600",
      href: "https://wa.me/905321234567?text=Merhaba%2C%20bilgi%20almak%20istiyorum.",
    },
    {
      label: "Şimdi Arayın",
      icon: <Phone className="w-6 h-6 text-white" />,
      bg: "bg-blue-500 hover:bg-blue-600",
      href: "tel:+905321234567",
    },
    {
      label: "Telegram",
      icon: <SiTelegram className="w-6 h-6 text-white" />,
      bg: "bg-sky-400 hover:bg-sky-500",
      href: "https://t.me/+905321234567",
    },
    {
      label: "Ofisi Arayın",
      icon: <PhoneCall className="w-6 h-6 text-white" />,
      bg: "bg-red-500 hover:bg-red-600",
      href: "tel:+902121234567",
    },
    {
      label: "Canlı Destek",
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      bg: "bg-gray-600 hover:bg-gray-700",
      href: "mailto:info@mirhanestate.com?subject=Canlı%20Destek%20Talebi",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" data-testid="floating-contact">
      {open && (
        <div className="flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 group"
              data-testid={`floating-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className="bg-white dark:bg-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center shadow-lg transition-transform hover:scale-110`}>
                {item.icon}
              </div>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          open
            ? "bg-gray-700 hover:bg-gray-800 rotate-0"
            : "bg-primary hover:bg-primary/90"
        }`}
        data-testid="button-floating-contact"
      >
        {open ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}
