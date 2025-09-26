import React, { useState, useEffect } from 'react';
import { 
  Sprout, Droplets, Sun, Package, Truck, Store,
  Calendar, MapPin, User, Award, CheckCircle,
  Clock, Thermometer, Beaker, Leaf, Shield,
  BookOpen, Map, Utensils
} from 'lucide-react';
import { format } from 'date-fns';
import geoLocationService, { GeoLocation } from '../../services/geoLocationService';
import narrativeService from '../../services/narrativeService';

interface TimelineEvent {
  id: string;
  stage: 'planted' | 'growing' | 'harvested' | 'processed' | 'shipped' | 'delivered';
  title: string;
  description: string;
  date: string;
  location: string;
  actor: string;
  data: {
    temperature?: string;
    humidity?: string;
    soilPh?: string;
    nutrients?: string;
    pesticides?: string;
    certifications?: string[];
    batchId?: string;
    weight?: string;
    quality?: string;
  };
  verified: boolean;
  images?: string[];
}

interface TraceabilityTimelineProps {
  events: TimelineEvent[];
  cropName: string;
  tokenId: string;
  cropType?: string;
  variety?: string;
  farmerName?: string;
  farmingPractices?: string;
  certifications?: string;
}

const TraceabilityTimeline: React.FC<TraceabilityTimelineProps> = ({ 
  events, 
  cropName, 
  tokenId,
  cropType = "Crop",
  variety = "Standard",
  farmerName = "Local Farmer",
  farmingPractices = "Sustainable",
  certifications = "Organic"
}) => {
  // State declarations
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'story'>('timeline');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [locationHistory, setLocationHistory] = useState<GeoLocation[]>([]);
  const [cropStory, setCropStory] = useState<string>('');
  const [environmentalImpact, setEnvironmentalImpact] = useState<string>('');
  const [cookingSuggestions, setCookingSuggestions] = useState<string>('');

  // Load location data
  const loadLocationData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const locations = await geoLocationService.getLocationHistory(tokenId);
      setLocationHistory(locations);
    } catch (error) {
      console.error('Failed to load location data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load narrative content
  const loadNarrativeContent = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const story = await narrativeService.generateCropStory({
        cropName,
        cropType,
        variety,
        farmerName,
        farmingPractices,
        certifications,
        events
      });
      setCropStory(story.story);
      setEnvironmentalImpact(story.environmentalImpact);
      setCookingSuggestions(story.cookingSuggestions);
    } catch (error) {
      console.error('Failed to load narrative content:', error);
      setHasError(true);
      // Set fallback content
      setCropStory(`This ${cropName} has traveled an incredible journey from farm to your table. Grown with care using ${farmingPractices} practices by ${farmerName}, it represents a commitment to quality and sustainability.`);
      setEnvironmentalImpact(`This ${cropName} was produced using sustainable farming methods that minimize environmental impact and preserve soil health for future generations.`);
      setCookingSuggestions(`This fresh ${cropName} can be prepared in various delicious ways. Consider the seasonal flavors and local cooking traditions for the best culinary experience.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for loading data based on active tab
  useEffect(() => {
    if (activeTab === 'map') {
      loadLocationData();
    } else if (activeTab === 'story') {
      loadNarrativeContent();
    }
  }, [activeTab, tokenId, cropName, cropType, variety, farmerName, farmingPractices, certifications]);

  // Helper functions
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'planted': return Sprout;
      case 'growing': return Sun;
      case 'harvested': return Package;
      case 'processed': return Beaker;
      case 'shipped': return Truck;
      case 'delivered': return Store;
      default: return CheckCircle;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planted': return 'from-blue-500 to-blue-600';
      case 'growing': return 'from-yellow-500 to-amber-600';
      case 'harvested': return 'from-green-500 to-green-600';
      case 'processed': return 'from-purple-500 to-purple-600';
      case 'shipped': return 'from-orange-500 to-red-600';
      case 'delivered': return 'from-emerald-500 to-teal-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStageBgColor = (stage: string) => {
    switch (stage) {
      case 'planted': return 'from-blue-50 to-blue-100';
      case 'growing': return 'from-yellow-50 to-amber-100';
      case 'harvested': return 'from-green-50 to-green-100';
      case 'processed': return 'from-purple-50 to-purple-100';
      case 'shipped': return 'from-orange-50 to-red-100';
      case 'delivered': return 'from-emerald-50 to-teal-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-amber-100/50 p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {cropName} Journey
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Token ID: {tokenId}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User className="h-4 w-4" />
              {farmerName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4" />
              {certifications}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">Type: {cropType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">Variety: {variety}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700">Practices: {farmingPractices}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'timeline'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </div>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'map'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Journey
          </div>
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'story'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4" />
            Story
          </div>
        </button>
      </div>

      {/* Content Container */}
      <div>
        {/* Timeline Content */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {events.map((event, index) => {
              const Icon = getStageIcon(event.stage);
              const isExpanded = expandedEvent === event.id;
              const isLast = index === events.length - 1;

              return (
                <div key={event.id} className="relative">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                  
                  <div 
                    className={`relative bg-gradient-to-br ${getStageBgColor(event.stage)} rounded-2xl p-6 border-2 border-transparent hover:border-white/50 transition-all cursor-pointer`}
                    onClick={() => toggleEventExpansion(event.id)}
                  >
                    {/* Stage icon */}
                    <div className={`absolute -left-2 top-6 w-12 h-12 rounded-full bg-gradient-to-r ${getStageColor(event.stage)} flex items-center justify-center shadow-lg z-10`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Event content */}
                    <div className="ml-12">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        {event.verified && (
                          <div className="flex items-center gap-1 text-green-600 bg-white rounded-full px-3 py-1 shadow-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {event.actor}
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.data.temperature && (
                              <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                                <Thermometer className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Temperature: {event.data.temperature}</span>
                              </div>
                            )}
                            {event.data.humidity && (
                              <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">Humidity: {event.data.humidity}</span>
                              </div>
                            )}
                            {event.data.soilPh && (
                              <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                                <Beaker className="h-4 w-4 text-purple-500" />
                                <span className="text-sm">Soil pH: {event.data.soilPh}</span>
                              </div>
                            )}
                            {event.data.batchId && (
                              <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                                <Package className="h-4 w-4 text-orange-500" />
                                <span className="text-sm">Batch ID: {event.data.batchId}</span>
                              </div>
                            )}
                          </div>

                          {event.data.certifications && event.data.certifications.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications:</h4>
                              <div className="flex flex-wrap gap-2">
                                {event.data.certifications.map((cert, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                                    <Award className="h-3 w-3" />
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {event.images && event.images.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Images:</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {event.images.map((image, i) => (
                                  <img key={i} src={image} alt={`${event.title} ${i + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Map Content */}
        {activeTab === 'map' && (
          <div className="relative">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-center mb-4">
                  <Map className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Map Unavailable</h3>
                  <p className="mt-1 text-sm text-gray-500">Unable to load location data at this time.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Journey Overview</h3>
                  <div className="space-y-2">
                    {locationHistory.map((location, index) => (
                      <div key={location._id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getStageColor(location.stage.toLowerCase())} flex items-center justify-center flex-shrink-0`}>
                          {React.createElement(getStageIcon(location.stage.toLowerCase()), { className: 'h-4 w-4 text-white' })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {location.locationName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(location.timestamp), 'MMM d, yyyy h:mm a')}
                          </p>
                          {location.description && (
                            <p className="mt-1 text-sm text-gray-600">{location.description}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>Lat: {location.coordinates.latitude.toFixed(6)}</p>
                          <p>Long: {location.coordinates.longitude.toFixed(6)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Map visualization placeholder */}
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-gray-600">Map visualization coming soon...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Story Content */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-center mb-4">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Story Unavailable</h3>
                  <p className="mt-1 text-sm text-gray-500">Unable to load crop story at this time.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Crop Story */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-500" />
                    The Journey of Your Food
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {cropStory}
                  </p>
                </div>

                {/* Environmental Impact */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Environmental Impact
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {environmentalImpact}
                  </p>
                </div>

                {/* Cooking Suggestions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-purple-500" />
                    Culinary Inspiration
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {cookingSuggestions}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TraceabilityTimeline;