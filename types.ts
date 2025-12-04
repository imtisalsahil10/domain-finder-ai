export interface Source {
  title: string;
  uri: string;
}

export interface DomainResult {
  type: 'domain';
  domain: string;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  alternatives?: string[];
  sources?: Source[];
}

export interface EmailResult {
  type: 'email';
  email: string;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  pattern?: string;
  sources?: Source[];
}

export type SearchResult = DomainResult | EmailResult;

export interface CompanySearchParams {
  companyName: string;
  industry?: string;
  location?: string;
}

export interface PersonSearchParams {
  personName: string;
  companyName: string;
  jobTitle?: string;
  location?: string;
}

export interface FormErrors {
  companyName?: string;
  industry?: string;
  location?: string;
  personName?: string;
  jobTitle?: string;
}