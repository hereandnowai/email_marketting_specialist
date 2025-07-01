export interface BrandingConfig {
  brand: {
    shortName: string;
    longName: string;
    website: string;
    email: string;
    mobile: string;
    slogan: string;
    colors: {
      primary: string;
      secondary: string;
    };
    logo: {
      title: string;
      favicon: string;
    };
    chatbot: {
      avatar: string;
      face: string;
    };
    socialMedia: {
      blog: string;
      linkedin: string;
      instagram: string;
      github: string;
      x: string;
      youtube: string;
    };
  };
}

export enum AppPage {
  Welcome = 'Welcome',
  AiAssistant = 'AI Assistant', // New AI Assistant page
  CustomerAnalysis = 'Customer Analysis',
  EmailGeneration = 'Email Generation',
  SendTimeOptimization = 'Send Time Optimization',
  PerformanceAnalysis = 'Performance Analysis',
  ProductRecommendation = 'Product Recommendation',
  EmailSequence = 'Email Sequence Builder',
}

// AI Assistant
export interface GeneralAiQueryInput {
  userQuery: string;
}
export interface GeneralAiResponse {
  responseText: string;
}

// Customer Data Analysis
export interface CustomerAnalysisInput {
  customerData: string; // Raw text data as described
}
export interface CustomerAnalysisResponse {
  profileSummary: string;
  segments: string[];
  personalizationOpportunities: string[];
  contentThemes: string[];
  productSuggestions: string[];
  optimalFrequency: string;
  optimalTiming: string;
}

// Email Content Generation
export interface EmailContentInput {
  segment: string;
  campaignGoal: string;
  productFocus: string;
  specialOffers: string;
  brandVoice: string;
  customerInsights: string; // From Customer Analysis
}
export interface SubjectLineVariation {
  text: string;
  emoji: boolean; // Indicates if an emoji suggestion is part of it
}
export interface CtaVariation {
  text: string;
  link: string; // Placeholder or example link
}
export interface EmailContentResponse {
  subjectLines: SubjectLineVariation[];
  previewText: string;
  emailBodyHtml: string; // HTML content for the email
  ctas: {
    primary: CtaVariation;
    secondary?: CtaVariation; // Optional secondary CTA
    urgencyDriven?: CtaVariation[]; // Optional urgency CTAs
  };
  personalizationNotes: string[];
}

// Send Time Optimization
export interface SendTimeOptimizationInput {
  historicalOpenTimes: string; // Could be list of timestamps or descriptive summary
  timeZone: string;
  deviceUsage: string; // Mobile/Desktop preferences
  industry?: string; // Optional B2B industry
  engagementPatterns: string; // Weekday vs weekend activity
  campaignType: string; // Newsletter/Promotional/Transactional
}
export interface SendTimeOptimizationResponse {
  optimalSendDayTime: string;
  reasoning: string;
  alternativeOptions: string[];
  timeZoneConsiderations: string;
  frequencyRecommendations: string;
  seasonalAdjustments?: string;
  preferenceBasedVariations?: string;
  testingStrategy: string;
  performanceTrackingMetrics: string[];
}

// Performance Analysis
export interface CampaignMetricsInput {
  openRate: string; // e.g., "25%"
  clickThroughRate: string; // e.g., "5%"
  conversionRate: string; // e.g., "2%"
  unsubscribeRate: string; // e.g., "0.5%"
  revenueGenerated: string; // e.g., "$1500"
  deliveryRate: string; // e.g., "99%"
  segmentPerformance?: string; // Optional: "High-Value: OR 30%, CTR 7% | At-Risk: OR 15%, CTR 3%"
  abTestResults?: {
    subjectLine?: string; // "A (22% OR) vs B (28% OR - Winner)"
    sendTime?: string;
    cta?: string;
  };
}
export interface PerformanceAnalysisResponse {
  performanceSummary: string;
  keyWins: string[];
  areasForImprovement: string[];
  benchmarkComparisons?: string;
  roiAnalysis?: string;
  optimizationRecommendations: {
    subjectLine?: string[];
    content?: string[];
    timing?: string[];
    segmentation?: string[];
  };
  nextCampaignStrategy: {
    winningElements: string[];
    newTestingOpportunities: string[];
    audienceExpansion?: string[];
  };
  automatedFollowUpSequences?: {
    converters?: string;
    nonOpeners?: string;
    engagedNonConverters?: string;
  };
}

// Product Recommendation
export interface ProductRecommendationInput {
  customerProfile: string; // Customer data summary
  availableProducts: string; // Catalog description
  currentInventory?: string; // Stock info
  businessGoals: string; // e.g., "Clear old stock", "Promote new arrivals"
}
export interface ProductRecommendation {
  name: string;
  reasoning: string;
  category?: string;
  price?: string; // e.g. "$29.99"
}
export interface ProductRecommendationResponse {
  primaryRecommendations: ProductRecommendation[];
  crossSellOpportunities?: ProductRecommendation[];
  seasonalTrendingItems?: ProductRecommendation[];
}

// Email Sequence
export interface EmailSequenceInput {
  sequenceType: 'Welcome Series' | 'Abandoned Cart' | 'Post-Purchase' | 'Re-engagement';
  customerTrigger: string;
  businessGoal: string;
  sequenceLength: string; // e.g., "3 emails over 5 days"
}
export interface EmailInSequence {
  timing: string; // e.g., "1 hour after trigger", "Day 3"
  subjectLine: string;
  contentFocus: string;
  cta: string;
  personalization?: string[];
  exitConditions?: string;
}
export interface EmailSequenceResponse {
  sequenceName: string;
  emails: EmailInSequence[];
}

// Ambient type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }

  interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    grammars: any; // Use 'any' or 'SpeechGrammarList' if defined
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    ennomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;

    abort(): void;
    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string; 
    readonly message: string;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  // Ensure these are available globally if not already provided by lib="dom"
  var SpeechRecognition: SpeechRecognitionStatic;
  var webkitSpeechRecognition: SpeechRecognitionStatic;
}

// If types.ts wasn't already a module, this would make it one.
// Since it already has exports, this is not strictly necessary but harmless.
export {};