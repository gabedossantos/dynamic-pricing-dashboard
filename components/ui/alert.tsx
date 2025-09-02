import React from "react";
import { cn } from "../../utils/cn";

export function Alert({ children }: { children: React.ReactNode }) {
	return <div className={cn("alert bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md")}>{children}</div>;
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
	return <div className={cn("text-yellow-800 text-sm", className)}>{children}</div>;
}
