const axios = require('axios');

class NarrativeService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  /**
   * Generate a narrative story for a crop based on its data
   * @param {Object} cropData - Data about the crop
   * @returns {Promise<string>} Generated narrative
   */
  async generateCropStory(cropData) {
    try {
      const prompt = this.createCropStoryPrompt(cropData);

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a storyteller specializing in agricultural narratives that connect consumers to the origins of their food. Create engaging, factual stories about crops based on their data.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      throw new NarrativeError('Error generating crop story', error);
    }
  }

  /**
   * Create a prompt for the LLM based on crop data
   * @param {Object} cropData - Data about the crop
   * @returns {string} Formatted prompt
   */
  createCropStoryPrompt(cropData) {
    return `
Create an engaging story about this crop:

Crop Type: ${cropData.cropType}
Variety: ${cropData.variety}
Farmer: ${cropData.farmerName || 'A local farmer'}
Farm Location: ${cropData.farmLocation || 'A rural farm'}
Planting Date: ${new Date(cropData.plantingDate).toLocaleDateString()}
${cropData.harvestDate ? `Harvest Date: ${new Date(cropData.harvestDate).toLocaleDateString()}` : ''}
Farming Practices: ${cropData.farmingPractices || 'Sustainable farming methods'}
Certifications: ${cropData.certifications || 'None'}

Supply Chain Journey:
${this.formatSupplyChainEvents(cropData.supplyChainEvents)}

Write a first-person narrative from the perspective of the crop, describing its journey from seed to consumer. Include details about the farmer, growing conditions, and how blockchain technology ensures its authenticity. Keep the story engaging, educational, and around 300-400 words.
`;
  }

  /**
   * Format supply chain events for the prompt
   * @param {Array} events - Supply chain events
   * @returns {string} Formatted events
   */
  formatSupplyChainEvents(events) {
    if (!events || events.length === 0) {
      return 'The crop was planted and is being carefully tended to by the farmer.';
    }

    return events.map(event => {
      const date = new Date(event.timestamp).toLocaleDateString();
      return `- ${date}: ${event.description} at ${event.location?.locationName || 'farm location'}`;
    }).join('\n');
  }

  /**
   * Generate a narrative about the environmental impact
   * @param {Object} cropData - Data about the crop
   * @returns {Promise<string>} Generated narrative
   */
  async generateEnvironmentalImpact(cropData) {
    try {
      const prompt = `
Create a short narrative about the environmental impact of this crop:

Crop Type: ${cropData.cropType}
Farming Methods: ${cropData.farmingPractices || 'Traditional'}
Water Usage: ${cropData.waterUsage || 'Unknown'}
Carbon Footprint: ${cropData.carbonFootprint || 'Unknown'}
Pesticide Use: ${cropData.pesticideUse || 'Minimal'}
Certifications: ${cropData.certifications || 'None'}

Write a 150-200 word narrative explaining the environmental impact of growing this crop, highlighting sustainable practices used and comparing to conventional methods.
`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an environmental expert who explains the ecological impact of agricultural practices in an informative way.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.6
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      throw new NarrativeError('Error generating environmental impact', error);
    }
  }

  /**
   * Generate cooking suggestions based on the crop
   * @param {Object} cropData - Data about the crop
   * @returns {Promise<string>} Generated suggestions
   */
  async generateCookingSuggestions(cropData) {
    try {
      const prompt = `
Suggest 3 simple recipes or cooking methods for this crop:

Crop Type: ${cropData.cropType}
Variety: ${cropData.variety}

Provide 3 easy recipe ideas or cooking methods that highlight the natural flavors of this crop. Each suggestion should be 2-3 sentences only, focusing on simple preparation methods that average home cooks can use.
`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a chef who specializes in simple, delicious recipes that highlight fresh ingredients.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      throw new NarrativeError('Error generating cooking suggestions', error);
    }
  }
}

function NarrativeError(message, cause) {
  Error.call(this, message);
  this.name = 'NarrativeError';
  this.cause = cause;
}
NarrativeError.prototype = Object.create(Error.prototype);
NarrativeError.prototype.constructor = NarrativeError;

module.exports = NarrativeService;