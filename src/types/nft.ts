export interface NFT {
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
  verificationStatus: 'verified' | 'pending' | 'rejected';
  certifications: string[];
  supplyChainStage: 'growing' | 'harvested' | 'processed' | 'shipped' | 'delivered';
  coordinates: {
    lat: number;
    lng: number;
  };
  batchSize: string;
  organicCertified: boolean;
  category: string;
}
