import { useFooter } from "@/contexts";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { content } = useFooter();
  if (!content) return null;

  return (
    <footer className={cn("border-t border-border bg-background p-4 text-center text-xs text-muted-foreground", className)}>
      {content}
    </footer>
  );
}

export default Footer;
