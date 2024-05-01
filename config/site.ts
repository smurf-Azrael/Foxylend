export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Foxylend",
  description:
    "Steik is of its kind staking platform with realtime points mechanism on Sei Network. Steik. Accumulate. Get rewarded.",
  mainNav: [
    {
      title: "Lend",
      href: "/lend",
    },
    {
      title: "My Offer",
      href: "/offer",
    },
    {
      title: "Borrow",
      href: "/borrow",
    },
    {
      title: "My loans",
      href: "/loans",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
