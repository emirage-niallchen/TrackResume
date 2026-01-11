import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Twitter,
  type LucideIcon,
} from "lucide-react";

export const callMeIconMap = {
  Mail,
  Phone,
  Github,
  MessageSquare,
  Linkedin,
  Globe,
  Twitter,
  Send,
} as const satisfies Record<string, LucideIcon>;

export type CallMeIconName = keyof typeof callMeIconMap;

export function getCallMeIcon(iconName: string): LucideIcon {
  return (callMeIconMap as Record<string, LucideIcon>)[iconName] ?? Send;
}

export const callMeIconNames = Object.keys(callMeIconMap) as CallMeIconName[];


