export interface CraneSpec {
  label: string;
  value: string;
  subtext?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  clientOrType: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
  specs: string[];
}

export interface TermSection {
  id: string;
  number: string;
  title: string;
  content: string[];
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  kvk: string;
  btw: string;
  address: string;
  workingRadius: string;
  statusBadge: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  craneModel: string;
  heroImageUrl: string;
  badgeText: string;
  specs: CraneSpec[];
}

export interface WebsiteData {
  company: CompanyInfo;
  hero: HeroData;
  projects: ProjectItem[];
  terms: TermSection[];
  lastUpdated?: string;
}
