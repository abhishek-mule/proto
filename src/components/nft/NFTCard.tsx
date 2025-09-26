import React, { useState } from 'react';
import { 
  MapPin, Calendar, Shield, Star, Eye, Heart, 
  Verified, Leaf, Award, TrendingUp, Clock,
  ChevronRight, QrCode, Share2
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

  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-amber-100/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-amber-50">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={nft.cropImage}
          alt={nft.cropName}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg"
          >
            <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg">
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg">
            <QrCode className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* NFT Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
            NFT #{nft.tokenId}
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
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors leading-tight">
              {nft.cropName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{nft.farmerName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${nft.price}</div>
            <div className={`text-sm font-medium flex items-center ${
              nft.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${nft.priceChange < 0 ? 'rotate-180' : ''}`} />
              {nft.priceChange >= 0 ? '+' : ''}{nft.priceChange}%
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
            onClick={() => onViewDetails(nft.id)}
            className="flex-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 py-3 px-4 rounded-xl font-semibold hover:from-amber-200 hover:to-yellow-200 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPurchase(nft.id)}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>Purchase NFT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;

export default NFTCard;