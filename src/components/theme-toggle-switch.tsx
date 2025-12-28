"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggleSwitch() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting until mounted
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 opacity-0">
        <Sun className="h-4 w-4" />
        <div className="h-5 w-9 rounded-full bg-muted animate-pulse" />
        <Moon className="h-4 w-4" />
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center space-x-2 bg-muted/50 p-1.5 rounded-full border border-border/50 shadow-sm transition-all hover:bg-muted">
      <div className={`p-1 rounded-full transition-colors ${!isDark ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>
        <Sun className="h-4 w-4" />
      </div>
      
      <Switch
        id="theme-mode"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      
      <div className={`p-1 rounded-full transition-colors ${isDark ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>
        <Moon className="h-4 w-4" />
      </div>
      
      <Label htmlFor="theme-mode" className="sr-only">
        Toggle {isDark ? "light" : "dark"} mode
      </Label>
    </div>
  )
}
