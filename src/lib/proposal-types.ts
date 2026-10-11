export interface ProposalSection {
  id: string;
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  bulletsEn?: string[];
  startingPrice?: number;
  billing?: 'once' | 'annual' | 'monthly';
  optional?: boolean;
  imageUrl?: string;
  bullets?: string[];
}

export interface Proposal {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  passcode: string;
  summary: string;
  initialPrice: string;
  currency: string;
  deliveryTime?: string;
  validUntil?: string;
  status: 'draft' | 'active' | 'accepted' | 'expired';
  sections: ProposalSection[];
  createdAt: string;
  updatedAt: string;
}
