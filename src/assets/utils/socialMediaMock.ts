import { SocialAccount, SocialMediaProfile, Platform } from '../types';

// Mock data generator for realistic social media profiles
export class SocialMediaMockAPI {
  
  private generateRealisticMetrics(platform: Platform, isBot: boolean = false) {
    const baseMetrics = {
      instagram: { minFollowers: 100, maxFollowers: 50000, engagementRate: 3.5 },
      tiktok: { minFollowers: 50, maxFollowers: 100000, engagementRate: 8.2 },
      youtube: { minFollowers: 500, maxFollowers: 25000, engagementRate: 2.1 },
      twitter: { minFollowers: 200, maxFollowers: 75000, engagementRate: 1.8 }
    };

    const base = baseMetrics[platform];
    
    if (isBot) {
      // Bot accounts typically have suspicious patterns
      return {
        followers: Math.floor(Math.random() * (base.maxFollowers - base.minFollowers)) + base.minFollowers,
        following: Math.floor(Math.random() * 5000) + 2000, // Bots often follow many accounts
        engagementRate: Math.random() * 0.5 + 0.1, // Very low engagement
        postsPerDay: Math.random() * 20 + 10, // Posting too frequently
        accountAge: Math.floor(Math.random() * 90) + 1, // Recent accounts
        profileCompleteness: Math.random() * 40 + 20 // Incomplete profiles
      };
    } else {
      // Legitimate accounts have more organic patterns
      return {
        followers: Math.floor(Math.random() * (base.maxFollowers - base.minFollowers)) + base.minFollowers,
        following: Math.floor(Math.random() * 1000) + 100,
        engagementRate: base.engagementRate + (Math.random() * 2 - 1),
        postsPerDay: Math.random() * 3 + 0.5,
        accountAge: Math.floor(Math.random() * 1800) + 180, // Older accounts
        profileCompleteness: Math.random() * 30 + 70 // More complete profiles
      };
    }
  }

  private generateBotPatterns(handle: string): boolean {
    // Simulate bot detection based on handle patterns
    const botIndicators = [
      /\d{4,}$/, // Ends with 4+ numbers
      /^[a-z]+\d+[a-z]+\d+/, // Mixed letters and numbers
      /[a-z]{2,3}\d{2,3}[a-z]{2,3}/, // Pattern like "ab12cd"
      /_\d+_/, // Underscores with numbers
      /^(user|account|profile)\d+/i, // Generic names with numbers
    ];

    return botIndicators.some(pattern => pattern.test(handle));
  }

  async fetchProfile(account: SocialAccount): Promise<SocialMediaProfile> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

    const isLikelyBot = this.generateBotPatterns(account.handle);
    const metrics = this.generateRealisticMetrics(account.platform, isLikelyBot);

    // Generate realistic profile data
    const profile: SocialMediaProfile = {
      handle: account.handle,
      displayName: this.generateDisplayName(account.handle, isLikelyBot),
      bio: this.generateBio(isLikelyBot),
      profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.handle}`,
      isVerified: !isLikelyBot && Math.random() > 0.95, // Only 5% of legitimate accounts are verified
      followers: Math.floor(metrics.followers),
      following: Math.floor(metrics.following),
      posts: Math.floor(metrics.postsPerDay * metrics.accountAge),
      accountCreated: new Date(Date.now() - metrics.accountAge * 24 * 60 * 60 * 1000),
      lastPost: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      recentPosts: this.generateRecentPosts(account.platform, isLikelyBot, Math.floor(metrics.followers), metrics.engagementRate)
    };

    return profile;
  }

  private generateDisplayName(handle: string, isBot: boolean): string {
    if (isBot) {
      // Bots often have generic or copy-paste names
      const genericNames = [
        'Social User', 'Content Creator', 'Digital Marketer', 'Lifestyle Blogger',
        'Tech Enthusiast', 'Fashion Lover', 'Travel Addict', 'Fitness Guru'
      ];
      return Math.random() > 0.3 ? genericNames[Math.floor(Math.random() * genericNames.length)] : handle;
    } else {
      // Legitimate accounts have more personalized names
      const realNames = [
        'Sarah Johnson', 'Mike Chen', 'Emma Rodriguez', 'Alex Thompson',
        'Jordan Williams', 'Casey Miller', 'Taylor Davis', 'Morgan Lee'
      ];
      return Math.random() > 0.6 ? realNames[Math.floor(Math.random() * realNames.length)] : handle;
    }
  }

  private generateBio(isBot: boolean): string {
    if (isBot) {
      const botBios = [
        '🌟 Follow for daily motivation! Link in bio 👇',
        '💯 Entrepreneur | DM for collaboration',
        'Lifestyle content creator ✨ Check my latest post!',
        '🔥 Follow back guaranteed! Link below 👇',
        ''
      ];
      return botBios[Math.floor(Math.random() * botBios.length)];
    } else {
      const realBios = [
        'Coffee enthusiast ☕ | Dog mom 🐕 | Weekend hiker',
        'Software developer by day, photographer by weekend 📸',
        'Plant parent 🌱 | Bookworm 📚 | NYC',
        'Travel memories & food adventures 🌍✈️',
        'Yoga teacher | Mindfulness coach | Spreading good vibes ✨'
      ];
      return realBios[Math.floor(Math.random() * realBios.length)];
    }
  }

  private generateRecentPosts(platform: Platform, isBot: boolean, followers: number, engagementRate: number) {
    const postCount = Math.floor(Math.random() * 10) + 5;
    const posts = [];

    for (let i = 0; i < postCount; i++) {
      const dayOffset = i * Math.random() * 3;
      const likes = Math.floor(followers * (engagementRate / 100) * (Math.random() * 0.5 + 0.75));
      const comments = Math.floor(likes * 0.1 * Math.random());
      const shares = Math.floor(likes * 0.05 * Math.random());

      posts.push({
        id: `post_${Date.now()}_${i}`,
        content: this.generatePostContent(platform, isBot),
        likes: isBot ? Math.floor(likes * 0.1) : likes, // Bots get much less engagement
        comments: isBot ? Math.floor(comments * 0.1) : comments,
        shares: isBot ? Math.floor(shares * 0.1) : shares,
        timestamp: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000)
      });
    }

    return posts;
  }

  private generatePostContent(platform: Platform, isBot: boolean): string {
    if (isBot) {
      const botContent = [
        'Amazing opportunity! Check link in bio! 💰🔥',
        'Follow for more content like this! ⭐',
        'DM me for collaboration! 📩💯',
        'Link in bio for exclusive content! 👆✨',
        'Don\'t miss out! Follow now! 🚀'
      ];
      return botContent[Math.floor(Math.random() * botContent.length)];
    } else {
      const platforms = {
        instagram: [
          'Perfect Sunday morning vibes ☕️ #weekend',
          'Trying out this new recipe today! Wish me luck 👩‍🍳',
          'Beautiful sunset from my evening walk 🌅',
          'Coffee shop discoveries never get old ☕️📚'
        ],
        tiktok: [
          'When you finally nail that dance trend 💃',
          'POV: You\'re trying to be productive but...',
          'This life hack actually works! 🤯',
          'Rating viral food trends so you don\'t have to'
        ],
        youtube: [
          'New video is live! Thanks for all the support ❤️',
          'Behind the scenes of yesterday\'s shoot 🎬',
          'Q&A video coming next week! Drop your questions below',
          'Celebrating 10K subscribers! Thank you all! 🎉'
        ],
        twitter: [
          'Hot take: pineapple on pizza is actually good 🍍🍕',
          'Just finished an amazing book recommendation thread 📚',
          'Monday motivation: small progress is still progress',
          'Unpopular opinion but I actually love rainy days ☔'
        ]
      };
      
      const content = platforms[platform] || platforms.instagram;
      return content[Math.floor(Math.random() * content.length)];
    }
  }

  // Simulate rate limiting and errors
  async fetchWithRealism(account: SocialAccount): Promise<SocialMediaProfile> {
    // Simulate occasional API errors
    if (Math.random() < 0.05) { // 5% error rate
      throw new Error(`${account.platform} API rate limit exceeded`);
    }

    if (Math.random() < 0.02) { // 2% account not found
      throw new Error(`Account ${account.handle} not found on ${account.platform}`);
    }

    return this.fetchProfile(account);
  }
}

export const socialMediaAPI = new SocialMediaMockAPI();