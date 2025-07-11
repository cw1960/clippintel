# TikTok Bot Detection Service using TikTok-Api
# This service provides real TikTok data for bot detection

import asyncio
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import statistics
import re

# Install with: pip install TikTokApi
from TikTokApi import TikTokApi

class TikTokBotDetector:
    def __init__(self):
        """Initialize the TikTok bot detection service"""
        self.api = TikTokApi()
        
    async def analyze_account_and_videos(self, username: str) -> Dict[str, Any]:
        """
        Comprehensive TikTok analysis - both account and individual videos
        Returns data compatible with ClippIntell frontend
        """
        try:
            # Clean username
            clean_username = username.replace('@', '')
            
            # Get user object
            user = self.api.user(username=clean_username)
            user_info = await user.info()
            
            # Get user's videos (last 20 for analysis)
            videos = []
            async for video in user.videos(count=20):
                videos.append(video)
            
            # Analyze account-level bot indicators
            account_analysis = self._analyze_account_profile(user_info)
            
            # Analyze individual videos for bot indicators
            video_analyses = []
            for video in videos[:10]:  # Analyze top 10 videos
                video_analysis = self._analyze_individual_video(video.as_dict)
                video_analyses.append(video_analysis)
            
            # Calculate overall account bot probability
            account_bot_score = self._calculate_account_bot_score(
                user_info, videos, account_analysis
            )
            
            # Generate recommendation
            recommendation = self._generate_recommendation(
                account_bot_score, video_analyses
            )
            
            # Format response for ClippIntell frontend
            return {
                "platform": "tiktok",
                "username": clean_username,
                "displayName": user_info.get('nickname', clean_username),
                "analysis": {
                    "botProbability": account_bot_score,
                    "riskLevel": self._get_risk_level(account_bot_score),
                    "flags": account_analysis['flags'],
                    "recommendation": recommendation,
                    "metrics": {
                        "followers": user_info.get('followerCount', 0),
                        "following": user_info.get('followingCount', 0),
                        "videos": user_info.get('videoCount', len(videos)),
                        "likes": user_info.get('heartCount', 0),
                        "followerRatio": self._calculate_follower_ratio(user_info),
                        "engagementRate": self._calculate_overall_engagement_rate(videos)
                    },
                    "accountAnalysis": account_analysis,
                    "videoAnalyses": video_analyses[:10]  # Return top 10 video analyses
                }
            }
            
        except Exception as e:
            # Fallback to demo data if API fails
            return self._get_demo_data(username, str(e))
    
    def _analyze_account_profile(self, user_info: Dict) -> Dict[str, Any]:
        """Analyze account-level bot indicators"""
        flags = []
        indicators = []
        score = 0
        
        # Username pattern analysis
        username = user_info.get('uniqueId', '')
        if re.search(r'\d{4,}$', username):
            score += 20
            flags.append('Suspicious username pattern (4+ numbers at end)')
            indicators.append('numeric_suffix')
        
        if len(username) < 3:
            score += 15
            flags.append('Very short username')
            indicators.append('short_username')
        
        # Bio analysis
        bio = user_info.get('signature', '')
        if not bio or len(bio) < 5:
            score += 15
            flags.append('Missing or minimal bio')
            indicators.append('minimal_bio')
        
        # Follower pattern analysis
        follower_count = user_info.get('followerCount', 0)
        following_count = user_info.get('followingCount', 0)
        
        if following_count > 0:
            follower_ratio = follower_count / following_count
            
            if follower_ratio > 50 and follower_count > 10000:
                score += 25
                flags.append('Extremely high follower-to-following ratio')
                indicators.append('high_follower_ratio')
            elif follower_ratio < 0.1 and follower_count > 1000:
                score += 20
                flags.append('Low follower-to-following ratio for account size')
                indicators.append('low_follower_ratio')
        
        # Account verification and profile completeness
        if not user_info.get('verified', False) and follower_count > 100000:
            score += 10
            flags.append('High follower count but not verified')
        
        # Profile picture analysis
        if not user_info.get('avatarLarger'):
            score += 10
            flags.append('Missing or default profile picture')
        
        return {
            'score': score,
            'indicators': indicators,
            'flags': flags
        }
    
    def _analyze_individual_video(self, video_data: Dict) -> Dict[str, Any]:
        """Analyze individual video for bot indicators - KEY FEATURE!"""
        flags = []
        score = 0
        
        # Get video metrics
        stats = video_data.get('stats', {})
        play_count = stats.get('playCount', 0)
        like_count = stats.get('diggCount', 0)
        comment_count = stats.get('commentCount', 0)
        share_count = stats.get('shareCount', 0)
        
        # Engagement ratio analysis
        if play_count > 0:
            like_rate = like_count / play_count
            comment_rate = comment_count / play_count
            total_engagement_rate = (like_count + comment_count + share_count) / play_count
            
            # Suspicious engagement patterns
            if total_engagement_rate > 0.25:  # >25% engagement is very suspicious
                score += 30
                flags.append('Unusually high engagement rate (>25%)')
            
            if like_rate > 0.15:  # >15% like rate is suspicious
                score += 25
                flags.append('Extremely high like rate')
            
            if comment_rate < 0.001 and play_count > 10000:  # Very low comments for high views
                score += 20
                flags.append('Very low comment rate for view count')
            
            # Bot farm pattern: high likes, zero comments
            if like_count > 0 and comment_count == 0 and play_count > 5000:
                score += 15
                flags.append('High likes but zero comments (bot pattern)')
            
            # Unnatural ratios
            if like_count > 0 and comment_count > 0:
                like_comment_ratio = like_count / comment_count
                if like_comment_ratio > 1000:  # 1000:1 like to comment ratio is suspicious
                    score += 15
                    flags.append('Unnatural like-to-comment ratio')
        
        # Upload timing analysis
        create_time = video_data.get('createTime', 0)
        if create_time:
            upload_hour = datetime.fromtimestamp(create_time).hour
            if 2 <= upload_hour <= 5:  # 2-5 AM uploads (bot hours)
                score += 10
                flags.append('Posted during typical bot hours (2-5 AM)')
        
        # Description analysis
        desc = video_data.get('desc', '')
        if not desc or len(desc) < 5:
            score += 10
            flags.append('Minimal or missing description')
        
        # Hashtag analysis
        if desc and '#' not in desc:
            score += 5
            flags.append('No hashtags (unusual for TikTok)')
        
        video_bot_probability = min(score, 99)
        
        return {
            'videoId': video_data.get('id', ''),
            'title': desc[:50] + '...' if len(desc) > 50 else desc,
            'botProbability': video_bot_probability,
            'riskLevel': self._get_risk_level(video_bot_probability),
            'flags': flags,
            'metrics': {
                'views': play_count,
                'likes': like_count,
                'comments': comment_count,
                'shares': share_count,
                'engagementRate': f"{((like_count + comment_count + share_count) / max(play_count, 1) * 100):.2f}%"
            },
            'uploadTime': datetime.fromtimestamp(create_time).isoformat() if create_time else None
        }
    
    def _calculate_account_bot_score(self, user_info: Dict, videos: List, account_analysis: Dict) -> int:
        """Calculate overall account bot probability"""
        base_score = account_analysis['score']
        
        # Engagement consistency analysis
        if videos:
            view_counts = [v.as_dict.get('stats', {}).get('playCount', 0) for v in videos]
            if view_counts:
                # High variance in view counts can indicate bot manipulation
                mean_views = statistics.mean(view_counts)
                if mean_views > 0:
                    variance = statistics.variance(view_counts)
                    cv = (variance ** 0.5) / mean_views  # Coefficient of variation
                    
                    if cv > 5:  # Very high variance
                        base_score += 15
                        account_analysis['flags'].append('Highly inconsistent view counts')
        
        # Account age vs metrics analysis (if available)
        follower_count = user_info.get('followerCount', 0)
        video_count = user_info.get('videoCount', 0)
        
        if video_count > 0:
            followers_per_video = follower_count / video_count
            if followers_per_video > 10000:  # Unrealistic follower growth per video
                base_score += 20
                account_analysis['flags'].append('Unrealistic follower-to-video ratio')
        
        return min(base_score, 99)
    
    def _calculate_follower_ratio(self, user_info: Dict) -> float:
        """Calculate follower to following ratio"""
        followers = user_info.get('followerCount', 0)
        following = user_info.get('followingCount', 1)  # Avoid division by zero
        return followers / max(following, 1)
    
    def _calculate_overall_engagement_rate(self, videos: List) -> float:
        """Calculate overall engagement rate across videos"""
        if not videos:
            return 0.0
        
        total_views = 0
        total_engagement = 0
        
        for video in videos:
            stats = video.as_dict.get('stats', {})
            views = stats.get('playCount', 0)
            likes = stats.get('diggCount', 0)
            comments = stats.get('commentCount', 0)
            shares = stats.get('shareCount', 0)
            
            total_views += views
            total_engagement += (likes + comments + shares)
        
        if total_views == 0:
            return 0.0
        
        return round((total_engagement / total_views) * 100, 1)
    
    def _get_risk_level(self, bot_probability: int) -> str:
        """Convert bot probability to risk level"""
        if bot_probability < 30:
            return 'Low'
        elif bot_probability < 60:
            return 'Medium'
        elif bot_probability < 80:
            return 'High'
        else:
            return 'Critical'
    
    def _generate_recommendation(self, account_score: int, video_analyses: List) -> str:
        """Generate recommendation based on account and video analysis"""
        risk_level = self._get_risk_level(account_score)
        suspicious_videos = [v for v in video_analyses if v['riskLevel'] in ['High', 'Critical']]
        
        base_recommendations = {
            'Low': 'TikTok account appears legitimate with minimal bot indicators.',
            'Medium': 'Some suspicious TikTok patterns detected. Manual review recommended.',
            'High': 'Multiple TikTok bot indicators present. High risk - recommend rejection.',
            'Critical': 'Strong TikTok bot indicators detected. Account likely fake - immediate rejection recommended.'
        }
        
        recommendation = base_recommendations.get(risk_level, 'Unable to determine risk level.')
        
        if suspicious_videos:
            recommendation += f" Additionally, {len(suspicious_videos)} individual video(s) show high bot activity."
        
        return recommendation
    
    def _get_demo_data(self, username: str, error: str) -> Dict[str, Any]:
        """Fallback demo data when API fails"""
        clean_username = username.replace('@', '')
        
        return {
            "platform": "tiktok",
            "username": clean_username,
            "displayName": clean_username,
            "analysis": {
                "botProbability": 0,
                "riskLevel": "Unknown",
                "flags": [f"API Error: {error}", "Using demo data - retry for live analysis"],
                "recommendation": "Unable to analyze due to API issues. Please try again.",
                "metrics": {
                    "followers": 0,
                    "following": 0,
                    "videos": 0,
                    "likes": 0,
                    "followerRatio": 0,
                    "engagementRate": 0
                },
                "accountAnalysis": {"score": 0, "indicators": [], "flags": []},
                "videoAnalyses": []
            }
        }

# Flask server to integrate with Supabase Edge Function
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for Supabase integration

detector = TikTokBotDetector()

@app.route('/analyze-tiktok', methods=['POST'])
async def analyze_tiktok():
    """Endpoint for TikTok bot detection"""
    try:
        data = request.get_json()
        username = data.get('username', '')
        
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        # Perform analysis
        result = await detector.analyze_account_and_videos(username)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the service
    app.run(host='0.0.0.0', port=5001)