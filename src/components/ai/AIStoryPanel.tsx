import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Volume2, VolumeX, 
  Copy, Share2, BookOpen, Zap, Brain,
  ChevronDown, ChevronUp, Star, Heart
} from 'lucide-react';

interface AIStoryPanelProps {
  cropData: {
    name: string;
    farmer: string;
    location: string;
    harvestDate: string;
    farmingMethod: string;
    certifications: string[];
    soilType: string;
    climate: string;
    waterSource: string;
    nutrients: string;
    growingDays: number;
  };
  onStoryGenerated?: (story: string) => void;
}

const AIStoryPanel: React.FC<AIStoryPanelProps> = ({ cropData, onStoryGenerated }) => {
  const [story, setStory] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyRating, setStoryRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [generationStyle, setGenerationStyle] = useState<'narrative' | 'technical' | 'poetic'>('narrative');

  const storyStyles = [
    { id: 'narrative', name: 'Narrative', icon: BookOpen, description: 'Engaging story format' },
    { id: 'technical', name: 'Technical', icon: Brain, description: 'Detailed farming data' },
    { id: 'poetic', name: 'Poetic', icon: Sparkles, description: 'Artistic description' }
  ];

  const generateStory = async () => {
    setIsGenerating(true);
    
    // Simulate AI story generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const stories = {
      narrative: `Meet your ${cropData.name} - a remarkable journey from seed to harvest that spans ${cropData.growingDays} days of careful cultivation. 

This exceptional crop began its life in ${cropData.farmer}'s sustainable farm in ${cropData.location}, where the rich ${cropData.soilType} and perfect ${cropData.climate} climate created ideal growing conditions.

${cropData.farmer} employed ${cropData.farmingMethod} farming methods, ensuring that every plant received the finest care. The crops were nourished with ${cropData.nutrients} and sustained by ${cropData.waterSource}, creating the perfect environment for growth.

Throughout the growing season, the plants thrived under careful monitoring and sustainable practices. The ${cropData.certifications.join(', ')} certifications reflect the commitment to quality and environmental responsibility that defines this harvest.

When harvest time arrived on ${new Date(cropData.harvestDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, each crop was hand-selected at peak ripeness, ensuring maximum flavor and nutritional value. From our farm to your table, every step has been verified on the blockchain, guaranteeing authenticity and quality you can trust.`,

      technical: `Agricultural Production Report: ${cropData.name}

Producer: ${cropData.farmer}
Location: ${cropData.location}
Cultivation Period: ${cropData.growingDays} days
Harvest Date: ${new Date(cropData.harvestDate).toLocaleDateString()}

Soil Composition: ${cropData.soilType}
Climate Conditions: ${cropData.climate}
Irrigation Source: ${cropData.waterSource}
Nutrient Program: ${cropData.nutrients}

Farming Methodology: ${cropData.farmingMethod}
Quality Certifications: ${cropData.certifications.join(', ')}

This crop was cultivated using precision agriculture techniques with continuous monitoring of soil pH, moisture levels, and nutrient content. The ${cropData.farmingMethod} approach ensures minimal environmental impact while maximizing crop quality and yield.

All production data has been recorded on the blockchain, providing complete traceability and verification of farming practices, inputs used, and quality control measures implemented throughout the growing cycle.`,

      poetic: `In the fertile embrace of ${cropData.location}, where ${cropData.soilType} cradles seeds with ancient wisdom, your ${cropData.name} began its dance with time.

For ${cropData.growingDays} sun-kissed days, under ${cropData.farmer}'s watchful care, tender shoots reached toward the sky, drinking deeply from ${cropData.waterSource} and drawing strength from ${cropData.nutrients}.

The ${cropData.climate} whispered secrets of growth, while ${cropData.farmingMethod} practices honored the earth's natural rhythms. Each day brought new life, new promise, new connection between soil and soul.

Blessed with ${cropData.certifications.join(', ')} - nature's own seal of approval - these crops grew not just in size, but in story, in purpose, in the sacred bond between farmer and land.

On ${new Date(cropData.harvestDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, when the moment was perfect, when flavor and nutrition reached their peak, gentle hands gathered this gift from the earth.

Now, through the magic of blockchain, this story travels with your crop - a digital tapestry woven with trust, transparency, and the timeless art of growing food with love.`
    };

    const generatedStory = stories[generationStyle];
    setStory(generatedStory);
    setIsGenerating(false);
    onStoryGenerated?.(generatedStory);
  };

  const copyStory = async () => {
    await navigator.clipboard.writeText(story);
    // Could add a toast notification here
  };

  const shareStory = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${cropData.name} - Farm Story`,
        text: story,
        url: window.location.href
      });
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      // Stop audio
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start audio
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Generate initial story
    generateStory();
  }, [generationStyle]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl border border-indigo-100/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-indigo-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI-Generated Crop Story</h2>
              <p className="text-indigo-600 font-medium">Powered by agricultural intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-indigo-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Story Style Selector */}
        {isExpanded && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {storyStyles.map((style) => {
                const Icon = style.icon;
                const isSelected = generationStyle === style.id;
                
                return (
                  <button
                    key={style.id}
                    onClick={() => setGenerationStyle(style.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all hover:scale-105 whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/60 text-indigo-700 hover:bg-white/80 border border-indigo-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Story Content */}
          <div className="relative">
            {isGenerating ? (
              <div className="bg-white/60 rounded-2xl p-8 text-center border border-indigo-200">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <Zap className="h-6 w-6 text-indigo-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">AI is crafting your story...</h3>
                <p className="text-indigo-600">Analyzing crop data and generating personalized narrative</p>
              </div>
            ) : story ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200 shadow-lg">
                <div className="prose prose-indigo max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                    {story}
                  </div>
                </div>
                
                {/* Story Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-indigo-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleAudio}
                      className="flex items-center space-x-2 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
                    >
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      <span className="text-sm font-medium">
                        {isPlaying ? 'Stop' : 'Listen'}
                      </span>
                    </button>
                    
                    <button
                      onClick={copyStory}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="text-sm font-medium">Copy</span>
                    </button>
                    
                    <button
                      onClick={shareStory}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-lg transition-all hover:scale-110 ${
                        isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setStoryRating(rating)}
                          className={`transition-colors hover:scale-110 ${
                            rating <= storyRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className={`h-4 w-4 ${rating <= storyRating ? 'fill-yellow-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Regenerate Button */}
          <div className="text-center">
            <button
              onClick={generateStory}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating...' : 'Generate New Story'}</span>
            </button>
          </div>

          {/* AI Info */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800 text-sm">AI Story Generation</span>
            </div>
            <p className="text-purple-700 text-sm leading-relaxed">
              Our AI analyzes your crop's unique characteristics, farming methods, and environmental data to create personalized stories that connect consumers with the journey of their food.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStoryPanel;