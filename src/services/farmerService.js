const axios = require('axios');

class FarmerService {
  constructor() {
    this.apiUrl = process.env.API_URL || 'https://api.example.com';
  }

  async getFarmerData() {
    try {
      const response = await axios.get(`${this.apiUrl}/farmer/data`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch farmer data: ${error.message}`);
    }
  }
}

// Export an instance of the FarmerService class as the default export
export default new FarmerService();