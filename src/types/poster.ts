export interface PosterFormData {
  name: string;
  designation: string;
  party: string;
  locality?: string;
  headline: string;
  creditLine?: string;
}

export interface PosterTemplateMeta {
  _id: string;
  title: string;
  slug: string;
  occasionType: string;
  thumbnailUrl: string;
}

export interface PosterData {
  _id: string;
  userId: string;
  templateId: PosterTemplateMeta;
  formData: PosterFormData;
  uploadedPhotoUrls: string[];
  generatedImageUrl?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  regenerationCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
