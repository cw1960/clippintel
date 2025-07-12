import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PYTHON_SERVICE_URL = 'https://clippintell-tiktok-api-9916def0b4e0.herokuapp.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    const { username } = JSON.parse(requestBody);
    console.log('TikTok bot detection request for:', username);

    if (!username) {
      return new Response(JSON.stringify({ error: 'Missing username' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('Calling Heroku TikTok service...');
    
    const pythonResponse = await fetch(`${PYTHON_SERVICE_URL}/analyze-tiktok`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.replace('@', '') })
    });

    console.log('Python response status:', pythonResponse.status);
    
    if (!pythonResponse.ok) {
      const errorText = await pythonResponse.text();
      console.error('Python service error:', errorText);
      throw new Error(`Python service error: ${pythonResponse.status}`);
    }

    const responseText = await pythonResponse.text();
    console.log('Raw Python response:', responseText);
    
    const result = JSON.parse(responseText);
    console.log('TikTok analysis complete for', username);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('TikTok bot detection error:', error);
    
    return new Response(JSON.stringify({
      platform: 'tiktok',
      username: 'error',
      analysis: {
        botProbability: 0,
        riskLevel: 'Unknown',
        flags: [`Error: ${error.message}`],
        recommendation: 'Analysis failed - check logs',
        metrics: {}
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
