import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ExpandableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const ExpandableTabs = ({
  tabs,
  activeTab,
  onChange,
  className,
}: ExpandableTabsProps) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            layout
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center justify-center h-12 rounded-full border transition-colors",
              isActive
                ? "bg-foreground text-background border-transparent px-5"
                : "bg-secondary text-foreground border-border px-4 hover:bg-secondary/80"
            )}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          >
            <motion.div layout className="flex items-center gap-2">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              
              <AnimatePresence initial={false} mode="wait">
                {isActive && (
                  <motion.span
                    key="label"
                    layout
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, width: "auto", marginLeft: tab.icon ? 4 : 0 }}
                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap font-medium text-sm"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
};
