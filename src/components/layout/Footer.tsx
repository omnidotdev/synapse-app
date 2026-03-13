import {
  SiDiscord as DiscordIcon,
  SiX as XIcon,
} from "@icons-pack/react-simple-icons";

import { ExternalLink } from "@/components/core";
import app from "@/lib/config/app.config";

/**
 * Layout footer.
 */
const Footer = () => (
  <footer className="glass-surface flex w-full items-center justify-center gap-1 border-border/50 border-t p-4 text-muted-foreground">
    <span className="px-3 text-sm">
      Made with 🧠 by{" "}
      <a
        href="https://omni.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground transition-colors hover:text-primary dark:text-white"
      >
        {app.organization.name}
      </a>
    </span>

    <div className="h-4 w-px bg-muted-foreground/30" />

    <ExternalLink
      variant="ghost"
      href={app.docsUrl}
      className="dark:text-base-200"
    >
      Docs
    </ExternalLink>

    <div className="h-4 w-px bg-muted-foreground/30" />

    <div className="flex items-center gap-1">
      <ExternalLink variant="ghost" href={app.socials.discord}>
        <DiscordIcon className="size-5 transition-colors hover:text-primary" />
      </ExternalLink>

      <ExternalLink variant="ghost" href={app.socials.x}>
        <XIcon className="size-5 transition-colors hover:text-primary" />
      </ExternalLink>
    </div>
  </footer>
);

export default Footer;
