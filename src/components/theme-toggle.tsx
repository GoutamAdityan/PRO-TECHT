"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle({ isExpanded }: { isExpanded: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="outline"
      size={isExpanded ? "lg" : "icon"}
      className={isExpanded ? "w-full" : ""}
      onClick={toggleTheme}
    >
      {resolvedTheme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {isExpanded && <span className="ml-2">Theme</span>}

    </Button>
  )
}