import type {
  ImageAttributes,
  Button,
  Heading,
  Paragraph,
  AccordionItem,
} from "./common";

export interface BaseContent {
  id: number;
  __component: string;
}

export interface AccordionContent extends BaseContent {
  __component: "content.accordion";
  heading: Heading;
  items: AccordionItem[];
}

export interface ImageTextContent extends BaseContent {
  __component: "content.image-text";
  textLeft: boolean;
  image: ImageAttributes;
  paragraph: Paragraph;
}

export interface TextContent extends BaseContent {
  __component: "content.text";
  hasBackground: boolean;
  isColumnView: boolean;
  paragraph: Paragraph;
}

export interface ImageContent extends BaseContent {
  __component: "content.image";
  caption: string;
  image: ImageAttributes;
  isNarrow?: boolean;
}

export interface Cta extends BaseContent {
  __component: "content.cta";
  ctaBlocks: Paragraph[];
}

export interface Quote extends BaseContent {
  __component: "content.quote";
  quote: string;
  author: string;
  image: ImageAttributes;
}

export interface Video extends BaseContent {
  __component: "content.video";
  video: {
    url: string;
    provider: string;
    providerUid: string;
  };
  placeholder: ImageAttributes;
  caption: string;
  isNarrow: boolean;
}

export type FlexContent =
  | AccordionContent
  | ImageTextContent
  | TextContent
  | ImageContent
  | Cta
  | Quote
  | Video;

export interface Page {
  title: string;
  hero: Hero;
  preFlexContent?: StaticContent[];
  flexContent?: FlexContent[];
  postFlexContent?: StaticContent[];
  seo?: any;
}

export interface StaticContent extends BaseContent {}

export interface GeneralData {
  header: { items?: MenuItem[]; topbar?: MenuItem[] };
  footer: {
    items?: Menu[];
    bottombar?: MenuItem[];
    socials?: Social[];
    addresses?: Address[];
  };
  seo?: GeneralSeo;
}

export interface GeneralSeo {
  googleTagManagerId?: string;
  affixMetaTitle?: string;
  fallbackMetaTitle?: string;
  fallbackMetaDescription?: string;
  fallbackKeywords?: string;
}
