import { GeminiApiKey, ApiKeyManager } from '../types';

class GeminiApiKeyManager implements ApiKeyManager {
  private apiKeys: GeminiApiKey[] = [];
  private currentKeyIndex = 0;

  constructor() {
    this.initializeApiKeys();
  }

  private initializeApiKeys() {
    // Initialize with empty array - keys will be loaded from config
    this.apiKeys = [];
  }

  getNextAvailableKey(): GeminiApiKey | null {
    const activeKeys = this.apiKeys.filter(key => key.isActive);
    
    if (activeKeys.length === 0) {
      console.warn('No active API keys available');
      return null;
    }

    // Round-robin selection with usage balancing
    let selectedKey = activeKeys[this.currentKeyIndex % activeKeys.length];
    
    // Find the least recently used key to better distribute load
    const leastUsedKey = activeKeys.reduce((least, current) => 
      current.lastUsed < least.lastUsed ? current : least
    );

    // Use least used key if it hasn't been used in the last minute
    const oneMinuteAgo = new Date(Date.now() - 60000);
    if (leastUsedKey.lastUsed < oneMinuteAgo) {
      selectedKey = leastUsedKey;
    }

    this.currentKeyIndex = (this.currentKeyIndex + 1) % activeKeys.length;
    
    return selectedKey;
  }

  markKeyUsed(keyIndex: number): void {
    const key = this.apiKeys.find(k => k.index === keyIndex);
    if (key) {
      key.lastUsed = new Date();
      key.requestCount++;
    }
  }

  markKeyInactive(keyIndex: number, reason?: string): void {
    const key = this.apiKeys.find(k => k.index === keyIndex);
    if (key) {
      key.isActive = false;
      console.warn(`API key ${keyIndex} marked inactive: ${reason || 'Unknown reason'}`);
    }
  }

  reactivateKey(keyIndex: number): void {
    const key = this.apiKeys.find(k => k.index === keyIndex);
    if (key) {
      key.isActive = true;
      console.log(`API key ${keyIndex} reactivated`);
    }
  }

  getKeyStats() {
    const activeKeys = this.apiKeys.filter(key => key.isActive);
    const totalRequests = this.apiKeys.reduce((sum, key) => sum + key.requestCount, 0);
    
    return {
      totalKeys: this.apiKeys.length,
      activeKeys: activeKeys.length,
      totalRequests,
      averageRequestsPerKey: totalRequests / this.apiKeys.length,
      keyUsageDistribution: this.apiKeys.map(key => ({
        index: key.index,
        requests: key.requestCount,
        lastUsed: key.lastUsed,
        isActive: key.isActive
      }))
    };
  }

  // Method to replace placeholder keys with real keys
  updateApiKeys(newKeys: string[]): void {
    if (newKeys.length !== 100) {
      console.warn(`Expected 100 API keys, received ${newKeys.length}`);
    }

    this.apiKeys = newKeys.map((key, index) => ({
      key,
      index,
      lastUsed: new Date(0),
      requestCount: 0,
      isActive: true
    }));
    
    this.currentKeyIndex = 0;
    console.log(`Updated with ${newKeys.length} API keys`);
  }

  // Get usage statistics for monitoring
  getDetailedStats() {
    const stats = this.getKeyStats();
    const now = new Date();
    const recentlyUsed = this.apiKeys.filter(key => 
      now.getTime() - key.lastUsed.getTime() < 300000 // Last 5 minutes
    ).length;

    return {
      ...stats,
      recentlyUsedKeys: recentlyUsed,
      oldestLastUsed: Math.min(...this.apiKeys.map(key => key.lastUsed.getTime())),
      newestLastUsed: Math.max(...this.apiKeys.map(key => key.lastUsed.getTime())),
      healthScore: (stats.activeKeys / stats.totalKeys) * 100
    };
  }
}

// Singleton instance
export const geminiKeyManager = new GeminiApiKeyManager();

// Utility function to handle API key rotation
export const withApiKeyRetry = async <T>(
  operation: (apiKey: string) => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const keyInfo = geminiKeyManager.getNextAvailableKey();
    
    if (!keyInfo) {
      throw new Error('No available API keys');
    }

    try {
      geminiKeyManager.markKeyUsed(keyInfo.index);
      const result = await operation(keyInfo.key);
      return result;
    } catch (error) {
      lastError = error as Error;
      
      // If it's a quota/auth error, mark key as temporarily inactive
      if (error instanceof Error && 
          (error.message.includes('quota') || 
           error.message.includes('403') || 
           error.message.includes('401'))) {
        geminiKeyManager.markKeyInactive(keyInfo.index, error.message);
      }
      
      console.warn(`API key ${keyInfo.index} failed (attempt ${attempt + 1}):`, error);
      
      // Wait a bit before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError || new Error('All API key attempts failed');
};