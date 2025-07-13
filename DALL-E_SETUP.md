# DALL-E 3 Setup Guide

## Getting Your OpenAI API Key

1. **Visit OpenAI**: Go to [https://platform.openai.com/](https://platform.openai.com/)
2. **Sign up/Login**: Create an account or log in
3. **Get API Key**: 
   - Go to "API Keys" section
   - Click "Create new secret key"
   - Copy the generated key (starts with `sk-`)

## Configuration

1. **Open `config.yml`** in your project root
2. **Replace the API key**:
   ```yaml
   api:
     openai:
       base_url: "https://api.openai.com/v1"
       model: "dall-e-3"
       size: "1024x1024"
       quality: "standard"
       n: 1
       api_key: "sk-your-actual-api-key-here"
   ```

3. **Save the file**

## Testing the Setup

1. **Start the app**: `npm run dev`
2. **Check console**: Look for "DALL-E API connection successful"
3. **Spin the wheel**: Generate a pick to test image generation

## Troubleshooting

### Common Issues:

1. **"OpenAI API key not configured"**
   - Make sure you've updated the `api_key` in `config.yml`
   - Ensure the key starts with `sk-`

2. **"API connection failed"**
   - Check your internet connection
   - Verify your API key is correct
   - Ensure you have credits in your OpenAI account

3. **"DALL-E API Error: 401"**
   - Your API key is invalid or expired
   - Generate a new API key

4. **"DALL-E API Error: 429"**
   - Rate limit exceeded
   - Wait a few minutes and try again

### Fallback Behavior

If DALL-E API fails, the app will:
- Use a placeholder image
- Continue working normally
- Log the error to console
- Still save the placeholder image locally

## API Costs

- **DALL-E 3**: ~$0.04 per image (1024x1024)
- **10 picks**: ~$0.40 total
- **Monitor usage**: Check your OpenAI dashboard

## Security Notes

- **Never commit your API key** to version control
- **Add `config.yml` to `.gitignore`** if it contains sensitive data
- **Use environment variables** for production deployments

## Advanced Configuration

You can customize the DALL-E settings in `config.yml`:

```yaml
api:
  openai:
    base_url: "https://api.openai.com/v1"
    model: "dall-e-3"
    size: "1024x1024"        # Options: 1024x1024, 1792x1024, 1024x1792
    quality: "standard"       # Options: standard, hd
    n: 1                     # Number of images to generate
    api_key: "your-key-here"
``` 