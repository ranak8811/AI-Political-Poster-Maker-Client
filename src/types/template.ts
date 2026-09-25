export interface Template {
  _id: string;
  slug: string;
  title: string;
  occasionType: 'VICTORY_DAY' | 'CAMPAIGN' | 'MEMORIAL' | 'GREETINGS';
  thumbnailUrl: string;
  layoutConfig: {
    theme?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    textColor?: string;
    defaultHeadline?: string;
    subHeadline?: string;
    fontHeadline?: string;
    motifs?: string[];
    photoSlots?: Array<{
      id: string;
      role: string;
      shape: string;
      position: string;
      label: string;
    }>;
    borderStyle?: string;
  };
  isActive: boolean;
  createdAt: string;
}
