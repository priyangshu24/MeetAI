import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "AI Agents", href: "/agents" },
      { label: "Meetings", href: "/meetings" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "API Docs", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
               <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                 M
               </div>
               <span className="text-xl font-bold tracking-tight">Meet AI</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Empowering global communication with advanced AI-powered virtual assistants and real-time meeting transcription.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Mail className="size-4" />
                <span>support@meetai.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <MapPin className="size-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-foreground">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground order-2 md:order-1">
            © 2025 Meet AI Inc. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2 order-1 md:order-2">
            {SOCIAL_LINKS.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                className="size-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                asChild
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <social.icon className="size-4" />
                  <span className="sr-only">{social.label}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
