class DalleService {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.api.openai.base_url;
    this.apiKey = config.api.openai.api_key;
    this.model = config.api.openai.model;
    this.size = config.api.openai.size;
    this.quality = config.api.openai.quality;
    this.n = config.api.openai.n;
  }

  async generateImage(teamName, pickNumber, teamContext = '') {
    try {
      // Validate API key
      if (!this.apiKey || this.apiKey === "your-openai-api-key-here") {
        throw new Error("OpenAI API key not configured. Please update the api_key in config.yml");
      }

      // Create the prompt for DALL-E
      const prompt = this.createPrompt(teamName, pickNumber, teamContext);

      // Make the API request
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          size: this.size,
          quality: this.quality,
          n: this.n
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DALL-E API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error("No image generated from DALL-E API");
      }

      console.log(data)
      // Return the first generated image URL
      return data.data[0].url;

    } catch (error) {
      console.error('DALL-E API Error:', error);
      throw error;
    }
  }

  createPrompt(teamName, pickNumber, teamContext = '') {
    const pickPosition = this.getPickPosition(pickNumber);
    
    let contextAddition = '';
    if (teamContext && teamContext.trim() !== '') {
      contextAddition = ` ${teamContext}`;
    }
    
    return `${teamName}" is a fantasy football team name. Please make a cartoon visualization of what their mascot might be. ` + contextAddition;
  }

  getPickPosition(pickNumber) {
    if (pickNumber <= 3) {
      if (pickNumber === 1) return "This is the FIRST PICK - the most prestigious position!";
      if (pickNumber === 2) return "This is the SECOND PICK - still an excellent position!";
      if (pickNumber === 3) return "This is the THIRD PICK - a great position!";
    } else if (pickNumber <= 6) {
      return "This is a solid middle pick position.";
    } else {
      return "This is a late pick position - time to find those sleepers!";
    }
  }

  // Method to validate configuration
  validateConfig() {
    const errors = [];

    if (!this.apiKey || this.apiKey === "your-openai-api-key-here") {
      errors.push("OpenAI API key not configured");
    }

    if (!this.baseUrl) {
      errors.push("OpenAI base URL not configured");
    }

    if (!this.model) {
      errors.push("DALL-E model not configured");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Method to test API connection
  async testConnection() {
    try {
      const validation = this.validateConfig();
      if (!validation.isValid) {
        return {
          success: false,
          error: `Configuration errors: ${validation.errors.join(', ')}`
        };
      }

      // Make a simple test request
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `API connection failed: ${response.status} - ${response.statusText}`
        };
      }

      return {
        success: true,
        message: "DALL-E API connection successful"
      };

    } catch (error) {
      return {
        success: false,
        error: `Connection test failed: ${error.message}`
      };
    }
  }
}

export default DalleService;
