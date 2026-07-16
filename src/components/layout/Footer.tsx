import {
  SiDiscord as DiscordIcon,
  SiThreads as ThreadsIcon,
  SiX as XIcon,
} from "@icons-pack/react-simple-icons";

import { ExternalLink } from "@/components/core";
import app from "@/lib/config/app.config";

/**
 * Layout footer.
 */
const Footer = () => (
  <footer className="glass-surface flex w-full flex-col items-center justify-center gap-2 border-border/50 border-t p-4 text-muted-foreground sm:flex-row sm:gap-1">
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

    <div className="hidden h-4 w-px bg-muted-foreground/30 sm:block" />

    <ExternalLink
      variant="ghost"
      href={app.docsUrl}
      className="min-h-11 dark:text-base-200"
    >
      Docs
    </ExternalLink>

    <div className="hidden h-4 w-px bg-muted-foreground/30 sm:block" />

    <ExternalLink
      variant="ghost"
      href={app.legal.privacy}
      className="min-h-11 dark:text-base-200"
    >
      Privacy
    </ExternalLink>

    <ExternalLink
      variant="ghost"
      href={app.legal.terms}
      className="min-h-11 dark:text-base-200"
    >
      Terms
    </ExternalLink>

    <ExternalLink
      variant="ghost"
      href={app.legal.cookies}
      className="min-h-11 dark:text-base-200"
    >
      Cookies
    </ExternalLink>

    <div className="hidden h-4 w-px bg-muted-foreground/30 sm:block" />

    <div className="flex items-center gap-1">
      <ExternalLink
        variant="ghost"
        href={app.socials.discord}
        className="min-h-11 min-w-11"
      >
        <DiscordIcon className="size-5 transition-colors hover:text-primary" />
      </ExternalLink>

      <ExternalLink
        variant="ghost"
        href={app.socials.x}
        className="min-h-11 min-w-11"
      >
        <XIcon className="size-5 transition-colors hover:text-primary" />
      </ExternalLink>

      <ExternalLink
        variant="ghost"
        href={app.socials.threads}
        className="min-h-11 min-w-11"
      >
        <ThreadsIcon className="size-5 transition-colors hover:text-primary" />
      </ExternalLink>
    </div>
  </footer>
);

export default Footer;
