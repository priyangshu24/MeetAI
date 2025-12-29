"use client";

import { ShieldCheckIcon, LockIcon, KeyIcon, EyeOffIcon, FileCheckIcon, GlobeIcon, Loader2Icon, DownloadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const securityFeatures = [
  {
    title: "End-to-End Encryption",
    description: "Your meeting data and recordings are protected with AES-256 bit encryption at rest and TLS 1.3 in transit.",
    icon: LockIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "SOC2 Type II Compliant",
    description: "We maintain rigorous security standards to ensure your data is handled with the highest level of care.",
    icon: FileCheckIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Private AI Models",
    description: "Our AI models are isolated per-tenant. Your data is never used to train global models.",
    icon: EyeOffIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Advanced Auth",
    description: "Multi-factor authentication and SSO integration (SAML, OIDC) for enterprise-grade access control.",
    icon: KeyIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Data Residency",
    description: "Choose where your data lives with our global data center options across US, EU, and Asia.",
    icon: GlobeIcon,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Regular Audits",
    description: "Continuous monitoring and regular third-party penetration testing to identify and fix vulnerabilities.",
    icon: ShieldCheckIcon,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  }
];

export const SecurityView = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate a delay for the "generation" or "fetching" of the PDF
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // A minimal valid base64-encoded PDF string that actually works and loads in browsers
      const minPDFBase64 = "JVBERi0xLjcKCjEgMCBvYmogIDw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqIDw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqIDw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iaiA8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKNSAwIG9iaiA8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVC9GMSAyNCBUZiAxMDAgNzAwIFRkIChNZWV0IEFJIFNlY3VyaXR5IFdoaXRlcGFwZXIpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExMSAwMDAwMCBuIAowMDAwMDAwMjQzIDAwMDAwIG4gCjAwMDAwMDAzMDEgMDAwMDAgbiAKdHJhaWxlciA8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgowCiUlRU9G";
      
      // Convert base64 to binary data
      const byteCharacters = atob(minPDFBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "MeetAI_Security_Whitepaper.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Security Whitepaper downloaded successfully!", {
        description: "You can now review our enterprise security standards.",
      });
    } catch {
      toast.error("Failed to download whitepaper. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <header className="flex flex-col items-center text-center px-8 py-20 max-w-4xl mx-auto w-full relative z-10">
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 animate-in fade-in zoom-in duration-500">
          <ShieldCheckIcon className="size-12 text-emerald-500" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-emerald-500 via-teal-500 to-blue-600 mb-6 drop-shadow-sm leading-tight">
          Enterprise-Grade <br /> Security
        </h1>
        <p className="text-muted-foreground text-xl font-medium italic tracking-wide opacity-80 max-w-2xl">
          Your privacy is our priority. We build with security at the core of every feature.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Real-time Monitor Mock */}
        <div className="mb-20 p-8 rounded-[40px] bg-black/40 border border-emerald-500/20 relative overflow-hidden group backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-black tracking-tighter text-emerald-500 uppercase">Live Security Monitor</h2>
            </div>
            <div className="text-xs font-mono text-emerald-500/50">SYSTEM STATUS: OPTIMAL</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Encryptions</div>
              <div className="text-4xl font-black tracking-tighter text-white">1,284</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Threats Blocked</div>
              <div className="text-4xl font-black tracking-tighter text-white">42,091</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Global Nodes</div>
              <div className="text-4xl font-black tracking-tighter text-white">104</div>
            </div>
          </div>
          <div className="mt-8 h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-3/4 animate-in slide-in-from-left duration-1000" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className={cn(
                "group p-8 rounded-3xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8",
                `delay-[${index * 100}ms]`
              )}
            >
              <div className={cn("p-4 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", feature.bg)}>
                <feature.icon className={cn("size-8", feature.color)} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA or Info */}
        <div className="mt-20 p-12 rounded-[40px] bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheckIcon className="size-40 text-emerald-500" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black tracking-tighter mb-6">Want to learn more?</h2>
            <p className="text-lg font-medium text-muted-foreground mb-8 italic">
              Download our full security whitepaper to understand our architecture, compliance certifications, and data handling procedures.
            </p>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-1 flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2Icon className="size-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <DownloadIcon className="size-5" />
                  Download Whitepaper
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};