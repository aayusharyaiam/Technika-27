export type NavChild = {
  label: string;
  href: string;
  /** Optional one-liner shown under the label in the dropdown */
  description?: string;
};

/**
 * A route is either a plain link (`href`) or a dropdown (`children`).
 * Add, remove or reorder freely – desktop and mobile both render from this array.
 */
export type NavRoute = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const NAV_ROUTES: NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "Marauder’s Map", href: "/marauders-map" },
  {
    label: "Registrations",
    children: [
      {
        label: "Event registry",
        href: "/events",
        description: "Competitions and shows",
      },
      {
        label: "Merchandise",
        href: "/merchandise",
        description: "The festival collection",
      },
      {
        label: "Accommodation",
        href: "/accommodation",
        description: "Stays and delegate kit",
      },
    ],
  },
  {
    label: "Members",
    children: [
      {
        label: "Core team",
        href: "/core",
        description: "The organising council",
      },
      {
        label: "Developers",
        href: "/devs",
        description: "The site crew",
      },
      {
        label: "Alumni",
        href: "/alumni",
        description: "Reunions and the network",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Right-hand side buttons. Change the hrefs/labels here. */
export const NAV_ACTIONS = {
  commonRoom: { label: "Common Room", href: "/common-room" },
  signInHref: "/login?next=%2Fcommon-room",
  register: { label: "Register now", href: "/register" },
  /** Where the signed-in user's profile button goes */
  profileHref: "/dashboard",
};
