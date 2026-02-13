import type {
  Hero,
  MenuItem,
  Menu,
  Social,
  Address,
  ImageAttributes,
  Button,
  Heading,
  Paragraph,
  AccordionItem,
} from "~/types/common";
import type {
  Page,
  TextContent,
  ImageTextContent,
  AccordionContent,
  Cta,
  Quote,
  Video,
} from "~/types/schemas";

// Mock image for demo purposes - using a reliable placeholder service
const dummyImage: ImageAttributes = {
  name: "dummy-image",
  alternativeText: "Dummy image",
  caption: "A placeholder image",
  width: 1200,
  height: 800,
  formats: {
    thumbnail: {
      ext: ".jpg",
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='100'%3E%3Crect width='150' height='100' fill='%23ddd'/%3E%3Ctext x='75' y='50' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E150x100%3C/text%3E%3C/svg%3E",
      hash: "dummy",
      mime: "image/svg+xml",
      name: "dummy",
      path: null,
      size: 1000,
      width: 150,
      height: 100,
      sizeInBytes: 1000,
    },
  },
  hash: "dummy",
  ext: ".jpg",
  mime: "image/jpeg",
  size: 10000,
  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='1200' height='800' fill='%23e0e0e0'/%3E%3Ctext x='600' y='400' font-size='48' text-anchor='middle' dominant-baseline='middle' fill='%23999' font-family='Arial'%3E1200x800%3C/text%3E%3C/svg%3E",
  previewUrl: null,
  provider: "local",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  placeholder:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='1200' height='800' fill='%23f5f5f5'/%3E%3C/svg%3E",
};

// Header & Navigation
export const headerData = {
  items: [
    {
      label: "Home",
      link: { target: "_self" as const, href: "/" },
    },
    {
      label: "About",
      link: { target: "_self" as const, href: "/about" },
      subItems: [
        {
          label: "Team",
          link: { target: "_self" as const, href: "/about/team" },
        },
        {
          label: "Values",
          link: { target: "_self" as const, href: "/about/values" },
        },
      ],
    },
    {
      label: "Services",
      link: { target: "_self" as const, href: "/services" },
    },
    {
      label: "Contact",
      link: { target: "_self" as const, href: "/contact" },
    },
  ] as MenuItem[],
  topbar: [] as MenuItem[],
};

// Footer Data
export const footerData = {
  items: [
    {
      title: "Company",
      items: [
        {
          label: "About",
          link: { target: "_self" as const, href: "/about" },
        },
        {
          label: "Blog",
          link: { target: "_self" as const, href: "/blog" },
        },
        {
          label: "Careers",
          link: { target: "_self" as const, href: "/careers" },
        },
      ] as MenuItem[],
    },
    {
      title: "Resources",
      items: [
        {
          label: "Documentation",
          link: { target: "_blank" as const, href: "#" },
        },
        {
          label: "Support",
          link: { target: "_self" as const, href: "/support" },
        },
      ] as MenuItem[],
    },
  ] as Menu[],
  bottombar: [
    {
      label: "Privacy Policy",
      link: { target: "_self" as const, href: "/privacy" },
    },
    {
      label: "Terms of Service",
      link: { target: "_self" as const, href: "/terms" },
    },
  ] as MenuItem[],
  socials: [
    {
      channel: "twitter",
      url: "https://twitter.com",
    },
    {
      channel: "linkedin",
      url: "https://linkedin.com",
    },
    {
      channel: "github",
      url: "https://github.com",
    },
  ] as Social[],
  addresses: [
    {
      title: "Main Office",
      street: "Main Street",
      houseNumber: 123,
      postalCode: "1000 AA",
      city: "Amsterdam",
      email: "info@example.com",
      phone: {
        label: "+31 (0)20 123 4567",
        href: "tel:+31201234567",
      },
    },
  ] as Address[],
};

// Home Page Content
export const homePageData: Page = {
  title: "Home",
  hero: {
    title: "Welcome to Our Website",
    subtitle: "Build amazing things with us",
    text: "<p>This is a placeholder home page. Your content goes here.</p>",
    image: dummyImage,
    buttons: [
      {
        label: "Get Started",
        link: { target: "_self" as const, href: "/services" },
      },
      {
        label: "Learn More",
        link: { target: "_self" as const, href: "/about" },
      },
    ],
  },
  flexContent: [
    {
      id: 1,
      __component: "content.text",
      hasBackground: false,
      isColumnView: false,
      paragraph: {
        text: "<p>This is a text component with sample content to demonstrate the flex content system.</p>",
        heading: {
          id: 1,
          title: "About Us",
          subtitle: "Learn more about what we do",
        },
        buttons: [],
      },
    } as TextContent,
    {
      id: 2,
      __component: "content.image-text",
      textLeft: true,
      image: dummyImage,
      paragraph: {
        text: "<p>This is an image-text component demonstrating how images and text can be combined in different layouts.</p>",
        heading: {
          id: 2,
          title: "Our Services",
          subtitle: "What we offer",
        },
        buttons: [
          {
            label: "Explore",
            link: { target: "_self" as const, href: "/services" },
          },
        ],
      },
    } as ImageTextContent,
    {
      id: 3,
      __component: "content.accordion",
      heading: {
        id: 3,
        title: "FAQ",
        subtitle: "Frequently Asked Questions",
      },
      items: [
        {
          title: "What is this service?",
          text: "This is an accordion component that displays collapsible content sections.",
        },
        {
          title: "How do I get started?",
          text: "Simply follow the steps in the getting started guide.",
        },
        {
          title: "Is there support available?",
          text: "Yes, we provide 24/7 customer support for all our services.",
        },
      ] as AccordionItem[],
    } as AccordionContent,
  ],
};

// About Page
export const aboutPageData: Page = {
  title: "About Us",
  hero: {
    title: "About Our Company",
    subtitle: "Our Mission & Values",
    text: "<p>We are dedicated to building exceptional products and services.</p>",
    image: dummyImage,
  },
  flexContent: [
    {
      id: 1,
      __component: "content.text",
      hasBackground: true,
      isColumnView: true,
      paragraph: {
        text: "<p>Founded in 2024, our company focuses on delivering high-quality solutions to our clients.</p>",
        heading: {
          id: 1,
          title: "Our Story",
          subtitle: "How it all began",
        },
        buttons: [],
      },
    } as TextContent,
    {
      id: 2,
      __component: "content.accordion",
      heading: {
        id: 2,
        title: "Our Values",
        subtitle: "What we believe in",
      },
      items: [
        {
          title: "Innovation",
          text: "We constantly push the boundaries of what is possible.",
        },
        {
          title: "Quality",
          text: "We never compromise on the quality of our work.",
        },
        {
          title: "Customer Focus",
          text: "Our customers are at the heart of everything we do.",
        },
      ] as AccordionItem[],
    } as AccordionContent,
  ],
};

// Generic 404 Page
export const notFoundPageData: Page = {
  title: "Not Found",
  hero: {
    title: "404 - Page Not Found",
    subtitle: "Oops!",
    text: "<p>The page you are looking for could not be found.</p>",
    buttons: [
      {
        label: "Go Home",
        link: { target: "_self" as const, href: "/" },
      },
    ],
  },
};
