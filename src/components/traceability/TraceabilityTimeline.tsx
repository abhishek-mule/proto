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
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [locationHistory, setLocationHistory] = useState<GeoLocation[]>([]);
  const [cropStory, setCropStory] = useState<string>("");
  const [environmentalImpact, setEnvironmentalImpact] = useState<string>("");
  const [cookingSuggestions, setCookingSuggestions] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'story'>('timeline');

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

  // State for tracking data source and loading/error states
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'mock'>('live');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch location history and narrative data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Fetch location history with timeout for better error handling
        const locationPromise = Promise.race([
          geoLocationService.getLocationHistory(tokenId),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          )
        ]);
        
        try {
          const locations = await locationPromise;
          setLocationHistory(locations);
          setDataSource('live');
          
          // Cache successful results for future fallback
          localStorage.setItem(`locations_${tokenId}`, JSON.stringify(locations));
        } catch (error) {
          console.warn('Using cached location data due to API error:', error);
          // Fallback to cached data if available in localStorage
          const cachedLocations = localStorage.getItem(`locations_${tokenId}`);
          if (cachedLocations) {
            setLocationHistory(JSON.parse(cachedLocations));
            setDataSource('cached');
          } else {
            // If no cached data, use the events to create mock location data
            const mockLocations = events.map(event => ({
              _id: `mock_${event.id}`,
              tokenId: tokenId,
              locationName: event.location,
              coordinates: {
                latitude: Math.random() * 180 - 90, // Random coordinates as fallback
                longitude: Math.random() * 360 - 180
              },
              timestamp: event.date,
              stage: event.stage.toUpperCase() as GeoLocation['stage'],
              description: event.description,
              verifiedBy: 'SYSTEM',
              metadata: {}
            }));
            setLocationHistory(mockLocations);
            setDataSource('mock');
          }
        }

        // Create crop data for narrative generation
        const cropData = {
          cropType: cropType,
          variety: variety,
          farmerName: farmerName,
          farmingPractices: farmingPractices,
          certifications: certifications,
          plantingDate: events.find(e => e.stage === 'planted')?.date || new Date().toISOString(),
          harvestDate: events.find(e => e.stage === 'harvested')?.date,
          supplyChainEvents: events.map(event => ({
            timestamp: event.date,
            description: event.description,
            location: {
              locationName: event.location
            }
          }))
        };

        // Generate narratives with the updated service
        const [storyResponse, impactResponse, suggestionsResponse] = await Promise.allSettled([
          narrativeService.generateCropStory(cropData),
          narrativeService.generateEnvironmentalImpact(cropData),
          narrativeService.generateCookingSuggestions(cropData)
        ]);

        // Handle story response
        if (storyResponse.status === 'fulfilled') {
          setCropStory(storyResponse.value.toString());
        } else {
          console.warn('Error generating crop story:', storyResponse.reason);
          setCropStory('This crop was grown with care by local farmers using sustainable practices.');
        }

        // Handle impact response
        if (impactResponse.status === 'fulfilled') {
          setEnvironmentalImpact(impactResponse.value.toString());
        } else {
          console.warn('Error generating environmental impact:', impactResponse.reason);
          setEnvironmentalImpact('This crop was grown using sustainable farming practices that minimize environmental impact.');
        }

        // Handle suggestions response
        if (suggestionsResponse.status === 'fulfilled') {
          setCookingSuggestions(suggestionsResponse.value.toString());
        } else {
          console.warn('Error generating cooking suggestions:', suggestionsResponse.reason);
          setCookingSuggestions('This crop can be used in various recipes including salads, soups, and main dishes.');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    tokenId,
    cropType,
    variety, 
    farmerName,
    farmingPractices,
    certifications,
    events,
    dataSource, // Add dataSource as dependency
    setLocationHistory,
    setCropStory,
    setEnvironmentalImpact,
    setCookingSuggestions,
    setDataSource,
    setHasError,
    setErrorMessage,
    setIsLoading
  ]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-amber-100/50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Supply Chain Journey</h2>
            {/* Data source indicator */}
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-600 mr-2">Data Source:</span>
              {isLoading ? (
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : hasError ? (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                  Error
                </span>
              ) : dataSource === 'live' ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Live Data
                </span>
              ) : dataSource === 'cached' ? (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
                  </svg>
                  Cached Data
                </span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  Mock Data
                </span>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-xl border border-purple-200">
            <span className="text-purple-800 font-semibold text-sm">NFT #{tokenId}</span>
          </div>
        </div>
        <p className="text-gray-600 text-lg">{cropName} - Complete blockchain traceability</p>
        
        {/* Error message display */}
        {hasError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errorMessage || 'There was an error connecting to the database. Showing fallback data.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'timeline' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Clock size={18} />
          Timeline
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'map' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('map')}
        >
          <Map size={18} />
          Geo-Location
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'story' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('story')}
        >
          <BookOpen size={18} />
          Crop Story
        </button>
      </div>

      {/* Timeline Content */}
      {activeTab === 'timeline' && (
        <>
          <div className="relative">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-center mb-4">
                <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Connection Error</h3>
                <p className="mt-1 text-sm text-gray-500">{errorMessage || 'Unable to connect to the database. Showing fallback data.'}</p>
              </div>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setHasError(false);
                  // Trigger a re-fetch by forcing a re-render
                  setTimeout(() => {
                    const fetchData = async () => {
                      try {
                        const locations = await geoLocationService.getLocationHistory(tokenId);
                        setLocationHistory(locations);
                        setDataSource('live');
                        setHasError(false);
                      } catch (error) {
                        console.error('Retry failed:', error);
                        setHasError(true);
                        setErrorMessage('Connection retry failed. Please check your network connection.');
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    fetchData();
                  }, 1000);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 via-amber-200 to-blue-200 rounded-full"></div>

              {/* Timeline Events */}
              <div className="space-y-8">
                {events.map(event => {
                  const Icon = getStageIcon(event.stage);
                  const isExpanded = expandedEvent === event.id;
                
                  return (
                    <div key={event.id} className="relative">
                      {/* Timeline Node */}
                      <div className={`absolute left-4 w-8 h-8 rounded-full bg-gradient-to-r ${getStageColor(event.stage)} shadow-lg flex items-center justify-center z-10`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>

                      {/* Event Card */}
                      <div className="ml-16 md:ml-20">
                        <div 
                          className={`bg-gradient-to-r ${getStageBgColor(event.stage)} rounded-2xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                            isExpanded ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                          }`}
                          onClick={() => toggleEventExpansion(event.id)}
                        >
                          <div className="p-4 md:p-6">
                            {/* Event Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                              <div className="flex-1 mb-2 sm:mb-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{event.title}</h3>
                                  {event.verified && (
                                    <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                      <Shield className="h-3 w-3" />
                                      <span>Verified</span>
                                    </div>
                                  )}
                                  {/* Data source indicator */}
                                  {dataSource !== 'live' && (
                                    <div className={`flex items-center space-x-1 ${dataSource === 'cached' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'} px-2 py-1 rounded-full text-xs font-medium`}>
                                      <span>{dataSource === 'cached' ? 'Cached' : 'Mock'}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{event.description}</p>
                              </div>
                              <div className="text-left sm:text-right sm:ml-4">
                                <div className="text-sm font-semibold text-gray-600 mb-1">
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(event.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Event Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span>{event.actor}</span>
                              </div>
                              {event.data.batchId && (
                                <div className="flex items-center space-x-1">
                                  <Package className="h-4 w-4 flex-shrink-0" />
                                  <span>Batch: {event.data.batchId}</span>
                                </div>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="border-t border-white/50 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                {/* Environmental Data */}
                                {(event.data.temperature || event.data.humidity || event.data.soilPh) && (
                                  <div className="bg-white/60 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                      <Thermometer className="h-4 w-4" />
                                      <span>Environmental Conditions</span>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                      {event.data.temperature && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Temperature:</span>
                                          <span className="font-semibold">{event.data.temperature}</span>
                                        </div>
                                      )}
                                      {event.data.humidity && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Humidity:</span>
                                          <span className="font-semibold">{event.data.humidity}</span>
                                        </div>
                                      )}
                                      {event.data.soilPh && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Soil pH:</span>
                                          <span className="font-semibold">{event.data.soilPh}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Treatment Data */}
                                {(event.data.nutrients || event.data.pesticides) && (
                                  <div className="bg-white/60 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                      <Droplets className="h-4 w-4" />
                                      <span>Treatments Applied</span>
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {event.data.nutrients && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Nutrients:</span>
                                          <span className="font-semibold text-green-700">{event.data.nutrients}</span>
                                        </div>
                                      )}
                                      {event.data.pesticides && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Pesticides:</span>
                                          <span className="font-semibold text-red-700">{event.data.pesticides}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Quality Data */}
                                {(event.data.weight || event.data.quality) && (
                                  <div className="bg-white/60 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                      <Award className="h-4 w-4" />
                                      <span>Quality Metrics</span>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                      {event.data.weight && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Weight:</span>
                                          <span className="font-semibold">{event.data.weight}</span>
                                        </div>
                                      )}
                                      {event.data.quality && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Grade:</span>
                                          <span className="font-semibold text-green-700">{event.data.quality}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Certifications */}
                                {event.data.certifications && event.data.certifications.length > 0 && (
                                  <div className="bg-white/60 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                      <Leaf className="h-4 w-4" />
                                      <span>Certifications</span>
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {event.data.certifications.map((cert, index) => (
                                        <span 
                                          key={index}
                                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                                        >
                                          {cert}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Images */}
                                {event.images && event.images.length > 0 && (
                                  <div className="bg-white/60 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3">Documentation</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                      {event.images.map((image, index) => (
                                        <img
                                          key={index}
                                          src={image}
                                          alt={`${event.title} ${index + 1}`}
                                          className="w-full aspect-square object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                          onClick={() => setSelectedEvent(event)}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Expand Indicator */}
                            <div className="flex items-center justify-center mt-4">
                              <div className={`w-6 h-1 rounded-full transition-all duration-300 ${
                                isExpanded ? 'bg-green-500 w-12' : 'bg-gray-300'
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          
          {/* Summary Stats */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Journey Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                <div className="text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.verified).length}
                </div>
                <div className="text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.ceil((new Date(events[events.length - 1]?.date).getTime() - new Date(events[0]?.date).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-gray-600">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-gray-600">Traceable</div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Map Content */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Map size={20} className="text-blue-500" />
            Geo-Location Tracking
          </h3>
          
          {locationHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Journey Map</h4>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* Map would be integrated here with a mapping library */}
                  <p className="text-gray-500">Interactive map showing {locationHistory.length} tracked locations</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="font-medium text-gray-700">Location History</h4>
                {locationHistory.map((location, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="font-medium">{location.locationName || 'Location ' + (index + 1)}</div>
                      <div className="text-sm text-gray-600">
                        {location.timestamp ? format(new Date(location.timestamp), 'PPP') : 'Date not available'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                      </div>
                      {location.stage && (
                        <div className="mt-1 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {location.stage}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No location data available for this crop</p>
            </div>
          )}
        </div>
      )}

      {/* Story Content */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-xl p-4">
          <div className="space-y-6">
            {/* Crop Story */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
              <h3 className="text-xl font-semibold mb-3 text-amber-800 flex items-center gap-2">
                <BookOpen size={20} className="text-amber-600" />
                The Story of {cropName}
              </h3>
              {cropStory ? (
                <p className="text-gray-700 leading-relaxed">{cropStory}</p>
              ) : (
                <p className="text-gray-500 italic">Loading crop story...</p>
              )}
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h3 className="text-xl font-semibold mb-3 text-green-800 flex items-center gap-2">
                <Leaf size={20} className="text-green-600" />
                Environmental Impact
              </h3>
              {environmentalImpact ? (
                <p className="text-gray-700 leading-relaxed">{environmentalImpact}</p>
              ) : (
                <p className="text-gray-500 italic">Loading environmental impact data...</p>
              )}
            </div>

            {/* Cooking Suggestions */}
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <h3 className="text-xl font-semibold mb-3 text-purple-800 flex items-center gap-2">
                <Utensils size={20} className="text-purple-600" />
                Cooking Suggestions
              </h3>
              {cookingSuggestions ? (
                <p className="text-gray-700 leading-relaxed">{cookingSuggestions}</p>
              ) : (
                <p className="text-gray-500 italic">Loading cooking suggestions...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceabilityTimeline;
