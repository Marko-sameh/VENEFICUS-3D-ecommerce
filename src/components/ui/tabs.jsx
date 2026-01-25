"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col lg:flex-row gap-4", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // Mobile: horizontal bar
        "flex lg:flex-col w-full lg:w-1/4 bg-[var(--card-bg)] rounded-lg shadow-sm p-2 gap-2",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "w-full text-sm font-medium rounded-md px-4 py-2 transition-colors",
        // Default
        "text-[var(--text-secondary)] hover:bg-[var(--gray-light)] hover:text-[var(--text-primary)]",
        // Active state
        "data-[state=active]:bg-[var(--main-color)] data-[state=active]:text-[var(--text-white)]",
        // Desktop left border for active
        "lg:data-[state=active]:border-l-4 lg:data-[state=active]:border-l-[var(--main-color)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
