export interface Heading {
  id: number;
  title: string;
  subtitle: string;
}

export interface AccordionItem {
  title: string;
  text: string;
}

export interface Link {
  target: "_self" | "_blank";
  href: string;
}

export interface Button {
  label: string;
  link: Link;
}

export interface Paragraph {
  text: string;
  heading: Heading;
  buttons: Button[];
}

export interface Thumbnail {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface ImageAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: { thumbnail: Thumbnail };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
}

export interface Pagination {
  page: number;
  pageSize?: number;
  pageCount: number;
  total?: number;
}

export interface Hero {
  title: string;
  subtitle?: string;
  text: string;
  image?: ImageAttributes;
  buttons?: Button[];
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: ImageAttributes;
  metaRobots?: string;
  canonicalURL?: string;
  keywords?: string;
  structuredData?: object;
}

export interface MenuItem {
  label: string;
  link: Link;
  subItems?: MenuItem[];
}

export interface Menu {
  title?: string;
  items: MenuItem[];
}

export interface Address {
  title: string;
  street?: string;
  houseNumber?: number;
  houseNumberAddition?: string;
  postalCode?: string;
  city?: string;
  email?: string;
  phone?: {
    label: string;
    href: string;
  };
}

export interface Social {
  channel: string;
  url: string;
}
