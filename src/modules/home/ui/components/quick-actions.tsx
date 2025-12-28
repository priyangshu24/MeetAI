import { Video, Bot, Star, Hand } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuickActionsProps {
  onNewMeeting?: () => void;
  onNewAgent?: () => void;
}

export function QuickActions({ onNewMeeting, onNewAgent }: QuickActionsProps) {
  const actions = [
    { 
      label: "New Meeting", 
      icon: Video, 
      href: "/meetings", 
      variant: "default" as const, 
      hoverColor: "hover:bg-emerald-600",
      onClick: onNewMeeting
    },
    { 
      label: "Create Agent", 
      icon: Bot, 
      href: "/agents", 
      variant: "secondary" as const, 
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      onClick: onNewAgent
    },
    { 
      label: "Upgrade Pro", 
      icon: Star, 
      href: "/upgrade", 
      variant: "outline" as const, 
      hoverColor: "hover:bg-amber-50 dark:hover:bg-amber-900/20" 
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {actions.map((action) => {
        const content = (
          <div className="flex items-center gap-2 relative z-10">
            <action.icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
            {action.label}
            {action.label === "New Meeting" && (
              <Hand className="size-4 absolute -right-6 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-emerald-400 rotate-12" />
            )}
          </div>
        );

        if (action.onClick) {
          return (
            <Button
              key={action.label}
              variant={action.variant}
              size="lg"
              className={`group relative rounded-full gap-2 px-8 transition-all duration-300 ease-in-out cursor-pointer ${action.hoverColor} active:scale-95 will-change-transform`}
              onClick={action.onClick}
            >
              {content}
            </Button>
          );
        }

        return (
          <Button
            key={action.label}
            variant={action.variant}
            size="lg"
            className={`group relative rounded-full gap-2 px-8 transition-all duration-300 ease-in-out cursor-pointer ${action.hoverColor} active:scale-95 will-change-transform`}
            asChild
          >
            <Link href={action.href}>
              {content}
            </Link>
          </Button>
        );
      })}
    </div>
  )
}
