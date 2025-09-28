import React, { useState, useRef } from 'react';
import { 
  MapPin, Calendar, Shield, Star, Eye, Heart, 
  Verified, Leaf, Award, TrendingUp, Clock,
  ChevronRight, QrCode, Share2, Sparkles
} from 'lucide-react';

interface NFTCardProps {
  nft: {
    id: string;
    tokenId: string;
    cropName: string;
    cropImage: string;
    farmerName: string;
    farmLocation: string;
    harvestDate: string;
    price: number;
    priceChange: number;
    rating: number;
    reviews: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
    certifications: string[];
    supplyChainStage: 'planted' | 'growing' | 'harvested' | 'processed' | 'shipped' | 'delivered';
    coordinates: { lat: number; lng: number };
    batchSize: string;
    organicCertified: boolean;
  };
  onViewDetails: (nftId: string) => void;
  onPurchase: (nftId: string) => void;
}

export type { NFTCardProps };

export type { NFTCardProps };

export type { NFTCardProps };

const NFTCard: React.FC<NFTCardProps> = ({ nft, onViewDetails, onPurchase }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
 
  const getStageColor = (stage: string) => {
    const colors = {
      planted: 'bg-blue-100 text-blue-800 border-blue-200',
      growing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      harvested: 'bg-green-100 text-green-800 border-green-200',
      processed: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStageProgress = (stage: string) => {
    const progress = {
      planted: 16,
      growing: 33,
      harvested: 50,
      processed: 66,
      shipped: 83,
      delivered: 100
    };
    return progress[stage as keyof typeof progress] || 0;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: nft.cropName,
          text: `Check out this ${nft.cropName} NFT from ${nft.farmerName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div 
      ref={cardRef}
      className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-soft hover:shadow-hard border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer focus-within:ring-4 focus-within:ring-forest-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`NFT: ${nft.cropName} by ${nft.farmerName}`}
      tabIndex={0}
      onKeyPress={(e) => handleKeyPress(e, () => onViewDetails(nft.id))}
    >
      {/* Shimmer Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer z-10 pointer-events-none" />
      )}
      
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-forest-50 to-harvest-50 dark:from-gray-700 dark:to-gray-600">
        {/* Loading shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-forest-400 animate-pulse" />
            </div>
          </div>
        )}
        <img
          src={nft.cropImage || '/api/placeholder/400/400'}
          alt={`${nft.cropName} grown by ${nft.farmerName} in ${nft.farmLocation}`}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/400';
            setImageLoaded(true);
          }}
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all shadow-lg border border-white/20"
            aria-label={isLiked ? 'Unlike this NFT' : 'Like this NFT'}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-300 ${
                isLiked 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
              }`} 
            />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all shadow-lg border border-white/20"
            aria-label="Share this NFT"
            title="Share"
          >
            <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // QR code functionality can be added here
            }}
            className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all shadow-lg border border-white/20"
            aria-label="Show QR code"
            title="QR Code"
          >
            <QrCode className="h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-forest-500 transition-colors" />
          </button>
        </div>

        {/* NFT Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
            <span className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>NFT #{nft.tokenId}</span>
            </span>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="absolute bottom-4 left-4">
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
            nft.verificationStatus === 'verified' 
              ? 'bg-green-500/90 text-white' 
              : nft.verificationStatus === 'pending'
              ? 'bg-yellow-500/90 text-white'
              : 'bg-gray-500/90 text-white'
          }`}>
            {nft.verificationStatus === 'verified' ? (
              <Verified className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            <span className="capitalize">{nft.verificationStatus}</span>
          </div>
        </div>

        {/* Organic Badge */}
        {nft.organicCertified && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-green-600/90 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center space-x-1">
              <Leaf className="h-3 w-3" />
              <span>Organic</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors leading-tight truncate">
              {nft.cropName}
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-6 h-6 bg-gradient-to-br from-forest-100 to-forest-200 dark:from-forest-800 dark:to-forest-700 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-gradient-to-br from-forest-500 to-forest-600 rounded-full animate-pulse-soft"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{nft.farmerName}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${nft.price.toFixed(2)}</div>
            <div className={`text-sm font-medium flex items-center justify-end transition-colors ${
              nft.priceChange >= 0 
                ? 'text-forest-600 dark:text-forest-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              <TrendingUp className={`h-3 w-3 mr-1 transition-transform ${
                nft.priceChange < 0 ? 'rotate-180' : ''
              }`} />
              {nft.priceChange >= 0 ? '+' : ''}{nft.priceChange.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Location & Date */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="font-medium">{nft.farmLocation}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-amber-600" />
            <span>{new Date(nft.harvestDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Supply Chain Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Supply Chain Progress</span>
            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStageColor(nft.supplyChainStage)}`}>
              {nft.supplyChainStage.charAt(0).toUpperCase() + nft.supplyChainStage.slice(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${getStageProgress(nft.supplyChainStage)}%` }}
            ></div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(nft.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{nft.rating}</span>
            <span className="text-sm text-gray-500">({nft.reviews})</span>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Batch: {nft.batchSize}
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-2">
          {nft.certifications.slice(0, 3).map((cert, index) => (
            <span 
              key={cert}
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                index % 3 === 0 
                  ? 'bg-green-100 text-green-800' 
                  : index % 3 === 1
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {cert}
            </span>
          ))}
          {nft.certifications.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              +{nft.certifications.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(nft.id);
            }}
            className="flex-1 bg-gradient-to-r from-harvest-100 to-harvest-200 dark:from-harvest-800 dark:to-harvest-700 text-harvest-800 dark:text-harvest-200 py-3 px-4 rounded-xl font-semibold hover:from-harvest-200 hover:to-harvest-300 dark:hover:from-harvest-700 dark:hover:to-harvest-600 transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-medium flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-harvest-500/50"
            aria-label={`View details for ${nft.cropName}`}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase(nft.id);
            }}
            className="flex-1 bg-gradient-primary text-white py-3 px-4 rounded-xl font-semibold hover:shadow-glow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-forest-500/50 relative overflow-hidden group"
            aria-label={`Purchase ${nft.cropName} NFT for $${nft.price}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-forest-600 to-forest-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Shield className="h-4 w-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">Purchase</span>
            <span className="relative z-10 sm:hidden">${nft.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;