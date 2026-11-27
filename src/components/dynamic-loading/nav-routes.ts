export type NavRoute = {
  label: string;
  href: string;
};

/**
 * Add, remove or reorder routes here – the desktop bar and the
 * mobile menu both render from this array.
 */
export const NAV_ROUTES: NavRoute[] = [
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];
