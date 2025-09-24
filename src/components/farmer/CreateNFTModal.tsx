import React, { useState } from 'react';
import { 
  X, Upload, Camera, MapPin, Calendar, DollarSign,
  Sprout, Award, Leaf, Shield, CheckCircle, AlertCircle,
  Image as ImageIcon, FileText, Zap, Coins
} from 'lucide-react';

interface CreateNFTModalProps {
  onClose: () => void;
}

const CreateNFTModal: React.FC<CreateNFTModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    description: '',
    batchSize: '',
    price: '',
    farmLocation: '',
    coordinates: { lat: '', lng: '' },
    plantedDate: '',
    harvestDate: '',
    farmingMethod: 'organic',
    certifications: [] as string[],
    images: [] as File[],
    certificates: [] as File[]
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: Sprout },
    { id: 2, title: 'Media & Docs', icon: ImageIcon },
    { id: 3, title: 'Pricing', icon: DollarSign },
    { id: 4, title: 'Review & Mint', icon: Zap }
  ];

  const farmingMethods = [
    { id: 'organic', name: 'Organic', icon: Leaf, color: 'green' },
    { id: 'conventional', name: 'Conventional', icon: Sprout, color: 'blue' },
    { id: 'hydroponic', name: 'Hydroponic', icon: Shield, color: 'purple' },
    { id: 'biodynamic', name: 'Biodynamic', icon: Award, color: 'amber' }
  ];

  const certificationOptions = [
    'USDA Organic', 'Fair Trade', 'Non-GMO', 'Rainforest Alliance',
    'Bird Friendly', 'Biodynamic', 'Local Grown', 'Pesticide-Free'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Max 5 images
    }));
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, ...files].slice(0, 3) // Max 3 certificates
    }));
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleMintNFT = async () => {
    setIsProcessing(true);
    // Simulate NFT minting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Name *</label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="e.g. Organic Heirloom Tomatoes"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Variety</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({...formData, variety: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="e.g. Cherokee Purple"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                placeholder="Describe your crop, growing conditions, and unique qualities..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Size *</label>
                <input
                  type="text"
                  value={formData.batchSize}
                  onChange={(e) => setFormData({...formData, batchSize: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="e.g. 500kg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.farmLocation}
                    onChange={(e) => setFormData({...formData, farmLocation: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    placeholder="Farm address or region"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Planted Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.plantedDate}
                    onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Harvest Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Farming Method *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {farmingMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.farmingMethod === method.id;
                  const colorClasses = {
                    green: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300',
                    blue: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300',
                    purple: isSelected ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300',
                    amber: isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-amber-300'
                  };
                  
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({...formData, farmingMethod: method.id})}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${colorClasses[method.color as keyof typeof colorClasses]}`}
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">Crop Images * (Max 5)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 transition-colors">
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
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Certificates & Documents (Max 3)</label>
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
                        <span className="text-sm font-medium text-blue-800">{file.name}</span>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          certificates: prev.certificates.filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:text-red-700 transition-colors"
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
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      placeholder="45.50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Crypto Equivalent</label>
                  <div className="bg-gray-100 px-4 py-3 rounded-xl">
                    <div className="text-lg font-bold text-gray-800">
                      {formData.price ? (parseFloat(formData.price) / 2000).toFixed(6) : '0.000000'} ETH
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
                  <span className="text-green-700">Similar Organic Tomatoes:</span>
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
                        <span className="font-bold text-lg">${formData.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price (ETH):</span>
                        <span className="font-medium">
                          {formData.price ? (parseFloat(formData.price) / 2000).toFixed(6) : '0.000000'} ETH
                        </span>
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
                      {formData.certifications.map((cert) => (
                        <span key={cert} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {cert}
                        </span>
                      ))}
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

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Minting Your NFT</h3>
          <p className="text-gray-600 mb-6">Creating your unique agricultural NFT on the blockchain...</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uploading media...</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Creating metadata...</span>
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Minting on blockchain...</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{step.title}</span>
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
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleMintNFT}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all hover:scale-105 shadow-lg flex items-center space-x-2"
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