import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, DollarSign, Sprout } from 'lucide-react';

interface AddCropFormProps {
  onClose: () => void;
}

const AddCropForm = ({ onClose }: AddCropFormProps) => {
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    plantedDate: '',
    expectedHarvest: '',
    quantity: '',
    pricePerKg: '',
    farmLocation: '',
    description: '',
    certifications: '',
    farmingMethod: 'organic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add New Crop</h2>
              <p className="text-sm text-gray-600">Create an NFT for your crop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
              <input
                type="text"
                value={formData.cropName}
                onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g. Organic Tomatoes"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({...formData, variety: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g. Cherry Tomatoes"
              />
            </div>
          </div>

          {/* Farming Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Farming Method</label>
            <div className="grid grid-cols-3 gap-3">
              {['organic', 'conventional', 'hydroponic'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({...formData, farmingMethod: method})}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.farmingMethod === method
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="capitalize">{method}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Planted Date
              </label>
              <input
                type="date"
                value={formData.plantedDate}
                onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Expected Harvest
              </label>
              <input
                type="date"
                value={formData.expectedHarvest}
                onChange={(e) => setFormData({...formData, expectedHarvest: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Quantity (kg)</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Price per kg ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({...formData, pricePerKg: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="4.50"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline h-4 w-4 mr-1" />
              Farm Location
            </label>
            <input
              type="text"
              value={formData.farmLocation}
              onChange={(e) => setFormData({...formData, farmLocation: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Farm address or coordinates"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your crop, growing conditions, and any special practices..."
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
            <input
              type="text"
              value={formData.certifications}
              onChange={(e) => setFormData({...formData, certifications: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="USDA Organic, Fair Trade, etc."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Crop Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              <input type="file" multiple accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all"
            >
              Create NFT & List Crop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCropForm;