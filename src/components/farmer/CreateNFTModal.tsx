import React, { useState, useCallback } from 'react';
import { 
  X, Upload, Camera, MapPin, Calendar, DollarSign,
  Sprout, Award, Leaf, Shield, CheckCircle, AlertCircle,
  Image as ImageIcon, FileText, Zap, Coins, Clock
} from 'lucide-react';

// Enhanced interface for NFT data
interface NFTFormData {
  cropName: string;
  variety: string;
  description: string;
  batchSize: string;
  price: string;
  farmLocation: string;
  coordinates: { lat: string; lng: string };
  plantedDate: string;
  harvestDate: string;
  farmingMethod: 'organic' | 'conventional' | 'hydroponic' | 'biodynamic';
  certifications: string[];
  images: File[];
  certificates: File[];
}

// Minting progress steps
interface MintingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface CreateNFTModalProps {
  onClose: () => void;
  onNFTCreated?: (nftData: NFTFormData & { tokenId: string; transactionHash: string }) => void;
  isOpen?: boolean;
  initialData?: Partial<NFTFormData>;
}

const CreateNFTModal: React.FC<CreateNFTModalProps> = ({ 
  onClose, 
  onNFTCreated,
  isOpen = true,
  initialData 
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mintingSteps, setMintingSteps] = useState<MintingStep[]>([
    { id: 'upload', label: 'Uploading media...', status: 'pending' },
    { id: 'metadata', label: 'Creating metadata...', status: 'pending' },
    { id: 'mint', label: 'Minting on blockchain...', status: 'pending' },
    { id: 'verify', label: 'Verifying transaction...', status: 'pending' }
  ]);
  
  const [formData, setFormData] = useState<NFTFormData>({
    cropName: initialData?.cropName || '',
    variety: initialData?.variety || '',
    description: initialData?.description || '',
    batchSize: initialData?.batchSize || '',
    price: initialData?.price || '',
    farmLocation: initialData?.farmLocation || '',
    coordinates: initialData?.coordinates || { lat: '', lng: '' },
    plantedDate: initialData?.plantedDate || '',
    harvestDate: initialData?.harvestDate || '',
    farmingMethod: initialData?.farmingMethod || 'organic',
    certifications: initialData?.certifications || [],
    images: initialData?.images || [],
    certificates: initialData?.certificates || []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NFTFormData, string>>>({});

  // Form validation
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Partial<Record<keyof NFTFormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.cropName.trim()) newErrors.cropName = 'Crop name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.batchSize.trim()) newErrors.batchSize = 'Batch size is required';
        if (!formData.farmLocation.trim()) newErrors.farmLocation = 'Farm location is required';
        if (!formData.plantedDate) newErrors.plantedDate = 'Planted date is required';
        if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';
        break;
      case 2:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 3:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = 'Valid price is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Configuration
  const steps = [
    { id: 1, title: 'Basic Info', icon: Sprout },
    { id: 2, title: 'Media & Docs', icon: ImageIcon },
    { id: 3, title: 'Pricing', icon: DollarSign },
    { id: 4, title: 'Review & Mint', icon: Zap }
  ];

  const farmingMethods = [
    { id: 'organic' as const, name: 'Organic', icon: Leaf, color: 'green' },
    { id: 'conventional' as const, name: 'Conventional', icon: Sprout, color: 'blue' },
    { id: 'hydroponic' as const, name: 'Hydroponic', icon: Shield, color: 'purple' },
    { id: 'biodynamic' as const, name: 'Biodynamic', icon: Award, color: 'amber' }
  ];

  const certificationOptions = [
    'USDA Organic', 'Fair Trade', 'Non-GMO', 'Rainforest Alliance',
    'Bird Friendly', 'Biodynamic', 'Local Grown', 'Pesticide-Free'
  ];

  // Event handlers
  const handleInputChange = useCallback(<K extends keyof NFTFormData>(
    field: K,
    value: NFTFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      return file.size <= 10 * 1024 * 1024 && file.type.startsWith('image/');
    });
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5)
    }));

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  }, [errors.images]);

  const handleCertificateUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      return file.size <= 5 * 1024 * 1024 && 
             (file.type === 'application/pdf' || file.type.startsWith('image/'));
    });
    
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, ...validFiles].slice(0, 3)
    }));
  }, []);

  const handleCertificationToggle = useCallback((cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const removeCertificate = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // NFT Minting Process
  const updateMintingStep = useCallback((stepId: string, status: MintingStep['status']) => {
    setMintingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const handleMintNFT = useCallback(async () => {
    if (!validateStep(4)) return;

    setIsProcessing(true);

    try {
      // Step 1: Upload media
      updateMintingStep('upload', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateMintingStep('upload', 'completed');

      // Step 2: Create metadata
      updateMintingStep('metadata', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateMintingStep('metadata', 'completed');

      // Step 3: Mint on blockchain
      updateMintingStep('mint', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateMintingStep('mint', 'completed');

      // Step 4: Verify transaction
      updateMintingStep('verify', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateMintingStep('verify', 'completed');

      // Simulate successful minting
      const mockTokenId = `AGR-${Date.now()}`;
      const mockTransactionHash = `0x${Math.random().toString(16).substring(2)}`;

      if (onNFTCreated) {
        onNFTCreated({
          ...formData,
          tokenId: mockTokenId,
          transactionHash: mockTransactionHash
        });
      }

      // Close modal after short delay
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Minting failed:', error);
      // Update last active step to error state
      const activeStep = mintingSteps.find(step => step.status === 'processing');
      if (activeStep) {
        updateMintingStep(activeStep.id, 'error');
      }
      setIsProcessing(false);
    }
  }, [formData, onNFTCreated, onClose, validateStep, updateMintingStep, mintingSteps]);

  // Helper functions
  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      green: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300',
      blue: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300',
      purple: isSelected ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300',
      amber: isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-amber-300'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const calculateEthPrice = (usdPrice: string): string => {
    const numPrice = parseFloat(usdPrice);
    return isNaN(numPrice) ? '0.000000' : (numPrice / 2000).toFixed(6);
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crop Name *
                </label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => handleInputChange('cropName', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                    errors.cropName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g. Organic Heirloom Tomatoes"
                />
                {errors.cropName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.cropName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Variety</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="e.g. Cherokee Purple"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Describe your crop, growing conditions, and unique qualities..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batch Size *
                </label>
                <input
                  type="text"
                  value={formData.batchSize}
                  onChange={(e) => handleInputChange('batchSize', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                    errors.batchSize ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g. 500kg"
                />
                {errors.batchSize && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.batchSize}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Farm Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.farmLocation}
                    onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.farmLocation ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Farm address or region"
                  />
                </div>
                {errors.farmLocation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.farmLocation}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Planted Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.plantedDate}
                    onChange={(e) => handleInputChange('plantedDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.plantedDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.plantedDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.plantedDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harvest Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.harvestDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.harvestDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.harvestDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Farming Method *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {farmingMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.farmingMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleInputChange('farmingMethod', method.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                        getColorClasses(method.color, isSelected)
                      }`}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium text-sm">{method.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Certifications</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {certificationOptions.map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleCertificationToggle(cert)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-105 ${
                      formData.certifications.includes(cert)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {cert}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Crop Images * (Max 5)
              </label>
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center hover:border-green-400 transition-colors ${
                errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Upload Crop Images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                </label>
              </div>
              
              {errors.images && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.images}
                </p>
              )}
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Crop ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Certificates & Documents (Max 3)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleCertificateUpload}
                  className="hidden"
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Upload Certificates</p>
                  <p className="text-sm text-gray-500">PDF, PNG, JPG up to 5MB each</p>
                </label>
              </div>

              {formData.certificates.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.certificates.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeCertificate(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-800 mb-4">NFT Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (USD) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                        errors.price ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="45.50"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Crypto Equivalent</label>
                  <div className="bg-gray-100 px-4 py-3 rounded-xl">
                    <div className="text-lg font-bold text-gray-800">
                      {calculateEthPrice(formData.price)} ETH
                    </div>
                    <div className="text-sm text-gray-600">Based on current rates</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h4 className="font-bold text-green-800 mb-4">Pricing Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Similar Organic Crops:</span>
                  <span className="font-semibold text-green-800">$40-50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Market Average:</span>
                  <span className="font-semibold text-green-800">$35-45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Premium Range:</span>
                  <span className="font-semibold text-green-800">$50-65</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-4">Fee Structure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Platform Fee (2.5%):</span>
                  <span className="font-semibold text-blue-800">
                    ${formData.price ? (parseFloat(formData.price) * 0.025).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Blockchain Gas Fee:</span>
                  <span className="font-semibold text-blue-800">~$5-15</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-blue-800">You'll Receive:</span>
                    <span className="text-blue-900">
                      ${formData.price ? (parseFloat(formData.price) * 0.975).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">Review Your NFT</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crop:</span>
                        <span className="font-medium">{formData.cropName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variety:</span>
                        <span className="font-medium">{formData.variety || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Batch Size:</span>
                        <span className="font-medium">{formData.batchSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium capitalize">{formData.farmingMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price (USD):</span>
                        <span className="font-bold text-lg">${formatPrice(formData.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price (ETH):</span>
                        <span className="font-medium">{calculateEthPrice(formData.price)} ETH</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Media & Documents</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Images:</span>
                        <span className="font-medium">{formData.images.length} uploaded</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificates:</span>
                        <span className="font-medium">{formData.certificates.length} uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.certifications.length > 0 ? (
                        formData.certifications.map((cert) => (
                          <span key={cert} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">None selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h4 className="font-bold text-blue-800">Blockchain Minting</h4>
              </div>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Your NFT will be minted on the Ethereum blockchain</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Immutable ownership and authenticity records</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Complete supply chain traceability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Automatic listing on marketplace</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Processing modal
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Minting Your NFT</h3>
          <p className="text-gray-600 mb-6">Creating your unique agricultural NFT on the blockchain...</p>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="space-y-3">
              {mintingSteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{step.label}</span>
                  {step.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {step.status === 'processing' && (
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  {step.status === 'pending' && (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create Agricultural NFT</h2>
              <p className="text-gray-600">Mint your crop as a unique blockchain asset</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              type="button"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm whitespace-nowrap">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            type="button"
          >
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all hover:scale-105 shadow-lg"
              type="button"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleMintNFT}
              disabled={isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Coins className="h-5 w-5" />
              <span>Mint NFT</span>
              <Zap className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNFTModal;