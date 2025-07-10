import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Target, Users, DollarSign, Settings, CheckCircle, AlertTriangle } from 'lucide-react';

interface Campaign {
  name: string;
  description: string;
  platforms: string[];
  budget: number;
  rewardPerCreator: number;
  targetCreators: number;
  requirements: {
    minFollowers: number;
    minEngagementRate: number;
    requireClippIntellCertification: boolean;
    contentType: string[];
    demographics: string[];
  };
  timeline: {
    applicationDeadline: string;
    campaignStart: string;
    campaignEnd: string;
  };
}

interface CampaignCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: Campaign) => void;
}

const CampaignCreationWizard: React.FC<CampaignCreationWizardProps> = ({
  isOpen,
  onClose,
  onCampaignCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaign, setCampaign] = useState<Campaign>({
    name: '',
    description: '',
    platforms: [],
    budget: 0,
    rewardPerCreator: 0,
    targetCreators: 0,
    requirements: {
      minFollowers: 1000,
      minEngagementRate: 2.0,
      requireClippIntellCertification: true,
      contentType: [],
      demographics: []
    },
    timeline: {
      applicationDeadline: '',
      campaignStart: '',
      campaignEnd: ''
    }
  });

  const steps = [
    { id: 1, title: 'Campaign Basics', icon: Target },
    { id: 2, title: 'Budget & Rewards', icon: DollarSign },
    { id: 3, title: 'Creator Requirements', icon: Users },
    { id: 4, title: 'Timeline & Settings', icon: Settings },
    { id: 5, title: 'Review & Launch', icon: CheckCircle }
  ];

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X'];
  const contentTypes = ['Posts', 'Stories', 'Reels', 'Videos', 'Live Streams', 'Reviews'];
  const demographics = ['Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'All Ages', 'Gaming', 'Fashion', 'Tech', 'Lifestyle'];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onCampaignCreated(campaign);
    onClose();
    // Reset form
    setCampaign({
      name: '',
      description: '',
      platforms: [],
      budget: 0,
      rewardPerCreator: 0,
      targetCreators: 0,
      requirements: {
        minFollowers: 1000,
        minEngagementRate: 2.0,
        requireClippIntellCertification: true,
        contentType: [],
        demographics: []
      },
      timeline: {
        applicationDeadline: '',
        campaignStart: '',
        campaignEnd: ''
      }
    });
    setCurrentStep(1);
  };

  const updateCampaign = (field: string, value: any) => {
    setCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateRequirements = (field: string, value: any) => {
    setCampaign(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value
      }
    }));
  };

  const updateTimeline = (field: string, value: any) => {
    setCampaign(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: value
      }
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const calculateFraudPrevention = () => {
    const totalBudget = campaign.budget;
    const estimatedBotRate = campaign.requirements.requireClippIntellCertification ? 0.05 : 0.15; // 5% vs 15% bot rate
    const potentialFraudLoss = totalBudget * estimatedBotRate;
    const preventedFraud = totalBudget * 0.10; // Assuming 10% fraud prevention with our system
    return { potentialFraudLoss, preventedFraud };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Campaign</h2>
              <p className="text-green-100">Set up your content creator campaign with bot protection</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isActive ? 'bg-white bg-opacity-20' : 
                    isCompleted ? 'bg-green-500 bg-opacity-30' : 'bg-white bg-opacity-10'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 mx-2 text-green-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Campaign Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Campaign Basics</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) => updateCampaign('name', e.target.value)}
                  placeholder="e.g., Summer Product Launch 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Description *
                </label>
                <textarea
                  value={campaign.description}
                  onChange={(e) => updateCampaign('description', e.target.value)}
                  rows={4}
                  placeholder="Describe your campaign goals, target audience, and content requirements..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Platforms *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => updateCampaign('platforms', toggleArrayItem(campaign.platforms, platform))}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        campaign.platforms.includes(platform)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Rewards */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Budget & Rewards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Campaign Budget *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={campaign.budget}
                      onChange={(e) => updateCampaign('budget', Number(e.target.value))}
                      placeholder="10000"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Per Creator *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={campaign.rewardPerCreator}
                      onChange={(e) => updateCampaign('rewardPerCreator', Number(e.target.value))}
                      placeholder="250"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Number of Creators
                </label>
                <input
                  type="number"
                  value={campaign.targetCreators}
                  onChange={(e) => updateCampaign('targetCreators', Number(e.target.value))}
                  placeholder="40"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Based on your budget: {campaign.budget && campaign.rewardPerCreator ? Math.floor(campaign.budget / campaign.rewardPerCreator) : 0} creators maximum
                </p>
              </div>

              {/* Fraud Prevention Preview */}
              {campaign.budget > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">💰 Fraud Prevention Estimate</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Potential fraud without protection:</span>
                      <div className="font-semibold text-red-600">${(campaign.budget * 0.15).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-blue-700">Fraud prevented with ClippIntell:</span>
                      <div className="font-semibold text-green-600">${(campaign.budget * 0.10).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Creator Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Creator Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Followers
                  </label>
                  <input
                    type="number"
                    value={campaign.requirements.minFollowers}
                    onChange={(e) => updateRequirements('minFollowers', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={campaign.requirements.minEngagementRate}
                    onChange={(e) => updateRequirements('minEngagementRate', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* ClippIntell Certification Requirement */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-2">ClippIntell Account Certification (Recommended)</h4>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={campaign.requirements.requireClippIntellCertification}
                        onChange={(e) => updateRequirements('requireClippIntellCertification', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-green-800">Require creators to have ClippIntell certification</span>
                    </label>
                    <p className="text-xs text-green-700 mt-1">
                      ✅ Reduces bot applications by 85% • ✅ Pre-verified authentic accounts • ✅ Faster campaign approval
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Types Required
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {contentTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => updateRequirements('contentType', toggleArrayItem(campaign.requirements.contentType, type))}
                      className={`p-2 border rounded-lg text-sm transition-colors ${
                        campaign.requirements.contentType.includes(type)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Demographics
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {demographics.map(demo => (
                    <button
                      key={demo}
                      onClick={() => updateRequirements('demographics', toggleArrayItem(campaign.requirements.demographics, demo))}
                      className={`p-2 border rounded-lg text-sm transition-colors ${
                        campaign.requirements.demographics.includes(demo)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {demo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Timeline & Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Timeline & Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    value={campaign.timeline.applicationDeadline}
                    onChange={(e) => updateTimeline('applicationDeadline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Start Date *
                  </label>
                  <input
                    type="date"
                    value={campaign.timeline.campaignStart}
                    onChange={(e) => updateTimeline('campaignStart', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign End Date *
                  </label>
                  <input
                    type="date"
                    value={campaign.timeline.campaignEnd}
                    onChange={(e) => updateTimeline('campaignEnd', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Campaign Timeline Tips</h4>
                    <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                      <li>• Allow 1-2 weeks for creator applications and screening</li>
                      <li>• ClippIntell certified creators are approved 3x faster</li>
                      <li>• Budget for additional time if not requiring certification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Launch */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Review & Launch Campaign</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Campaign Summary</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Campaign Name:</span>
                      <div className="font-medium">{campaign.name || 'Untitled Campaign'}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Platforms:</span>
                      <div className="font-medium">{campaign.platforms.join(', ') || 'None selected'}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Budget:</span>
                      <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Reward per Creator:</span>
                      <div className="font-medium">${campaign.rewardPerCreator.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Target Creators:</span>
                      <div className="font-medium">{campaign.targetCreators}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Min Followers:</span>
                      <div className="font-medium">{campaign.requirements.minFollowers.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ClippIntell Certification:</span>
                      <div className={`font-medium ${campaign.requirements.requireClippIntellCertification ? 'text-green-600' : 'text-red-600'}`}>
                        {campaign.requirements.requireClippIntellCertification ? '✅ Required' : '❌ Not Required'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Application Deadline:</span>
                      <div className="font-medium">{campaign.timeline.applicationDeadline || 'Not set'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fraud Prevention Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">🛡️ Fraud Protection Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-green-700">Estimated fraud prevention:</span>
                    <div className="text-xl font-bold text-green-800">
                      ${campaign.requirements.requireClippIntellCertification ? 
                        (campaign.budget * 0.10).toLocaleString() : 
                        (campaign.budget * 0.05).toLocaleString()
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-green-700">Bot reduction:</span>
                    <div className="text-xl font-bold text-green-800">
                      {campaign.requirements.requireClippIntellCertification ? '85%' : '50%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Launch Campaign</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationWizard;