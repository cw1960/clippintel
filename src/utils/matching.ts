import { Opportunity, OpportunityMatchCriteria, OpportunityMatch } from '../types/opportunity';

export interface MatchingOptions {
  keywordWeight: number;
  categoryWeight: number;
  valueWeight: number;
  locationWeight: number;
  deadlineWeight: number;
  sourceWeight: number;
  minScore: number;
  maxResults: number;
  caseSensitive: boolean;
  useStopWords: boolean;
  useStemming: boolean;
}

export const defaultMatchingOptions: MatchingOptions = {
  keywordWeight: 0.4,
  categoryWeight: 0.25,
  valueWeight: 0.15,
  locationWeight: 0.1,
  deadlineWeight: 0.05,
  sourceWeight: 0.05,
  minScore: 0.3,
  maxResults: 100,
  caseSensitive: false,
  useStopWords: true,
  useStemming: true,
};

// Common stop words to filter out
const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
  'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers',
  'ours', 'theirs', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
]);

// Simple stemming function (basic implementation)
function stemWord(word: string): string {
  const suffixes = ['ing', 'ly', 'ed', 'ies', 'ied', 'ies', 'ied', 's', 'es'];
  for (const suffix of suffixes) {
    if (word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

// Text preprocessing function
function preprocessText(text: string, options: MatchingOptions): string[] {
  let processed = options.caseSensitive ? text : text.toLowerCase();
  
  // Remove special characters and split into words
  const words = processed.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
  
  // Apply filters
  let filteredWords = words;
  
  if (options.useStopWords) {
    filteredWords = filteredWords.filter(word => !stopWords.has(word));
  }
  
  if (options.useStemming) {
    filteredWords = filteredWords.map(stemWord);
  }
  
  return filteredWords;
}

// Calculate keyword similarity using Jaccard similarity
function calculateKeywordSimilarity(
  opportunityText: string,
  criteriaKeywords: string[],
  options: MatchingOptions
): { score: number; matchedKeywords: string[] } {
  const oppWords = new Set(preprocessText(opportunityText, options));
  const criteriaWords = new Set(
    criteriaKeywords.flatMap(keyword => preprocessText(keyword, options))
  );
  
  const intersection = new Set([...oppWords].filter(word => criteriaWords.has(word)));
  const union = new Set([...oppWords, ...criteriaWords]);
  
  const score = union.size > 0 ? intersection.size / union.size : 0;
  const matchedKeywords = Array.from(intersection);
  
  return { score, matchedKeywords };
}

// Calculate category similarity
function calculateCategorySimilarity(
  opportunityCategory: string,
  criteriaCategories: string[],
  options: MatchingOptions
): { score: number; matchedCategories: string[] } {
  if (criteriaCategories.length === 0) return { score: 0, matchedCategories: [] };
  
  const oppCategory = options.caseSensitive ? opportunityCategory : opportunityCategory.toLowerCase();
  const matchedCategories = criteriaCategories.filter(category => {
    const criteriaCategory = options.caseSensitive ? category : category.toLowerCase();
    return oppCategory === criteriaCategory || oppCategory.includes(criteriaCategory) || criteriaCategory.includes(oppCategory);
  });
  
  const score = matchedCategories.length / criteriaCategories.length;
  return { score, matchedCategories };
}

// Calculate value similarity
function calculateValueSimilarity(
  opportunityValue: number | undefined,
  criteriaMinValue: number | undefined,
  criteriaMaxValue: number | undefined
): number {
  if (!opportunityValue) return 0;
  if (!criteriaMinValue && !criteriaMaxValue) return 1;
  
  const min = criteriaMinValue || 0;
  const max = criteriaMaxValue || Infinity;
  
  if (opportunityValue >= min && opportunityValue <= max) {
    return 1;
  } else if (opportunityValue < min) {
    return opportunityValue / min;
  } else {
    return max / opportunityValue;
  }
}

// Calculate deadline urgency score
function calculateDeadlineScore(deadline: Date | undefined): number {
  if (!deadline) return 0;
  
  const now = new Date();
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDeadline <= 0) return 0; // Expired
  if (daysUntilDeadline <= 7) return 1; // Very urgent
  if (daysUntilDeadline <= 30) return 0.8; // Urgent
  if (daysUntilDeadline <= 90) return 0.6; // Moderate
  return 0.4; // Low urgency
}

// Calculate source preference score
function calculateSourceScore(source: string, preferredSources: string[] = []): number {
  if (preferredSources.length === 0) return 0.5; // Neutral if no preference
  
  const isPreferred = preferredSources.some(preferred => 
    source.toLowerCase().includes(preferred.toLowerCase())
  );
  
  return isPreferred ? 1 : 0.2;
}

// Main matching function
export function matchOpportunityToCriteria(
  opportunity: Opportunity,
  criteria: OpportunityMatchCriteria,
  options: MatchingOptions = defaultMatchingOptions
): OpportunityMatch | null {
  // Check if criteria is active
  if (!criteria.isActive) return null;
  
  // Check exclude filters first
  if (criteria.excludeKeywords && criteria.excludeKeywords.length > 0) {
    const excludeText = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    const hasExcludedKeywords = criteria.excludeKeywords.some(keyword => 
      excludeText.includes(keyword.toLowerCase())
    );
    if (hasExcludedKeywords) return null;
  }
  
  if (criteria.excludeCategories && criteria.excludeCategories.length > 0) {
    const isExcludedCategory = criteria.excludeCategories.some(category => 
      opportunity.category.toLowerCase().includes(category.toLowerCase())
    );
    if (isExcludedCategory) return null;
  }
  
  // Calculate individual scores
  const opportunityText = `${opportunity.title} ${opportunity.description}`;
  const keywordResult = calculateKeywordSimilarity(opportunityText, criteria.keywords, options);
  const categoryResult = calculateCategorySimilarity(opportunity.category, criteria.categories, options);
  const valueScore = calculateValueSimilarity(opportunity.value, criteria.minValue, criteria.maxValue);
  const deadlineScore = calculateDeadlineScore(opportunity.deadline);
  const sourceScore = calculateSourceScore(opportunity.source);
  
  // Calculate weighted total score
  const totalScore = 
    keywordResult.score * options.keywordWeight +
    categoryResult.score * options.categoryWeight +
    valueScore * options.valueWeight +
    deadlineScore * options.deadlineWeight +
    sourceScore * options.sourceWeight;
  
  // Check if score meets minimum threshold
  if (totalScore < options.minScore) return null;
  
  // Generate match reasons
  const reasons: string[] = [];
  if (keywordResult.score > 0.3) reasons.push(`Keyword match: ${keywordResult.matchedKeywords.join(', ')}`);
  if (categoryResult.score > 0.5) reasons.push(`Category match: ${categoryResult.matchedCategories.join(', ')}`);
  if (valueScore > 0.8) reasons.push(`Value within range`);
  if (deadlineScore > 0.6) reasons.push(`Approaching deadline`);
  if (sourceScore > 0.7) reasons.push(`Preferred source`);
  
  return {
    opportunityId: opportunity.id,
    criteriaId: criteria.id,
    score: Math.min(totalScore, 1), // Cap at 1.0
    matchedKeywords: keywordResult.matchedKeywords,
    matchedCategories: categoryResult.matchedCategories,
    reasons,
    createdAt: new Date(),
  };
}

// Batch matching function
export function matchOpportunityToMultipleCriteria(
  opportunity: Opportunity,
  criteriaList: OpportunityMatchCriteria[],
  options: MatchingOptions = defaultMatchingOptions
): OpportunityMatch[] {
  const matches: OpportunityMatch[] = [];
  
  for (const criteria of criteriaList) {
    const match = matchOpportunityToCriteria(opportunity, criteria, options);
    if (match) {
      matches.push(match);
    }
  }
  
  // Sort by score descending and limit results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, options.maxResults);
}

// Filter and rank opportunities based on criteria
export function filterAndRankOpportunities(
  opportunities: Opportunity[],
  criteria: OpportunityMatchCriteria,
  options: MatchingOptions = defaultMatchingOptions
): { opportunity: Opportunity; match: OpportunityMatch }[] {
  const results: { opportunity: Opportunity; match: OpportunityMatch }[] = [];
  
  for (const opportunity of opportunities) {
    const match = matchOpportunityToCriteria(opportunity, criteria, options);
    if (match) {
      results.push({ opportunity, match });
    }
  }
  
  // Sort by score descending and limit results
  return results
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, options.maxResults);
}

// Calculate overall match statistics
export function calculateMatchStatistics(
  opportunities: Opportunity[],
  criteriaList: OpportunityMatchCriteria[],
  options: MatchingOptions = defaultMatchingOptions
): {
  totalOpportunities: number;
  totalCriteria: number;
  totalMatches: number;
  averageScore: number;
  matchesByCriteria: Record<string, number>;
  matchesByCategory: Record<string, number>;
  topKeywords: { keyword: string; frequency: number }[];
} {
  const allMatches: OpportunityMatch[] = [];
  const matchesByCriteria: Record<string, number> = {};
  const matchesByCategory: Record<string, number> = {};
  const keywordFrequency: Record<string, number> = {};
  
  for (const opportunity of opportunities) {
    const matches = matchOpportunityToMultipleCriteria(opportunity, criteriaList, options);
    allMatches.push(...matches);
    
    for (const match of matches) {
      matchesByCriteria[match.criteriaId] = (matchesByCriteria[match.criteriaId] || 0) + 1;
      
      const category = opportunity.category;
      matchesByCategory[category] = (matchesByCategory[category] || 0) + 1;
      
      for (const keyword of match.matchedKeywords) {
        keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
      }
    }
  }
  
  const averageScore = allMatches.length > 0 
    ? allMatches.reduce((sum, match) => sum + match.score, 0) / allMatches.length 
    : 0;
  
  const topKeywords = Object.entries(keywordFrequency)
    .map(([keyword, frequency]) => ({ keyword, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20);
  
  return {
    totalOpportunities: opportunities.length,
    totalCriteria: criteriaList.length,
    totalMatches: allMatches.length,
    averageScore,
    matchesByCriteria,
    matchesByCategory,
    topKeywords,
  };
}

// Export utility functions
export const matchingUtils = {
  preprocessText,
  calculateKeywordSimilarity,
  calculateCategorySimilarity,
  calculateValueSimilarity,
  calculateDeadlineScore,
  calculateSourceScore,
  stemWord,
  stopWords,
}; 