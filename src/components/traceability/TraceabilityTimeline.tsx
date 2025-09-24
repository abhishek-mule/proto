import React, { useState } from 'react';
import { 
  Sprout, Droplets, Sun, Package, Truck, Store,
  Calendar, MapPin, User, Award, CheckCircle,
  Clock, Thermometer, Beaker, Leaf, Shield
} from 'lucide-react';

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
}

const TraceabilityTimeline: React.FC<TraceabilityTimelineProps> = ({ 
  events, 
  cropName, 
  tokenId 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Supply Chain Journey</h2>
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-xl border border-purple-200">
            <span className="text-purple-800 font-semibold text-sm">NFT #{tokenId}</span>
          </div>
        </div>
        <p className="text-gray-600 text-lg">{cropName} - Complete blockchain traceability</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 via-amber-200 to-blue-200 rounded-full"></div>

        {/* Timeline Events */}
        <div className="space-y-8">
          {events.map((event, index) => {
            const Icon = getStageIcon(event.stage);
            const isExpanded = expandedEvent === event.id;
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="relative">
                {/* Timeline Node */}
                <div className={`absolute left-4 w-8 h-8 rounded-full bg-gradient-to-r ${getStageColor(event.stage)} shadow-lg flex items-center justify-center z-10`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>

                {/* Event Card */}
                <div className="ml-20">
                  <div 
                    className={`bg-gradient-to-r ${getStageBgColor(event.stage)} rounded-2xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                      isExpanded ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                    }`}
                    onClick={() => toggleEventExpansion(event.id)}
                  >
                    <div className="p-6">
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                            {event.verified && (
                              <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                <Shield className="h-3 w-3" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{event.description}</p>
                        </div>
                        <div className="text-right ml-4">
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
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{event.actor}</span>
                        </div>
                        {event.data.batchId && (
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
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
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                              <div className="grid grid-cols-2 gap-4 text-sm">
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
      </div>

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
  );
};

export default TraceabilityTimeline;