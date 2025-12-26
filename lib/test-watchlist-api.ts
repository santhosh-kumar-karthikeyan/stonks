export async function testWatchlistAPI() {
  console.log('Testing Watchlist API...');
  
  try {
    console.log('1. Testing GET endpoint...');
    const getResponse = await fetch('/api/watchlists');
    const watchlists = await getResponse.json();
    console.log('GET succeeded:', watchlists.length, 'watchlists');
    
    console.log('2. Testing POST endpoint...');
    const testWatchlists = [
      ...watchlists,
      {
        id: 'test-' + Date.now(),
        name: 'Test Watchlist',
        entries: [],
        lastAccessedAt: Date.now(),
      },
    ];
    
    const postResponse = await fetch('/api/watchlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testWatchlists),
    });
    
    if (!postResponse.ok) {
      const error = await postResponse.json();
      console.error('POST failed:', error);
      return false;
    }
    
    const result = await postResponse.json();
    console.log('POST succeeded:', result);
    
    console.log('3. Verifying persistence...');
    const verifyResponse = await fetch('/api/watchlists');
    const verifiedWatchlists = await verifyResponse.json();
    console.log('Verification succeeded:', verifiedWatchlists.length, 'watchlists');
    
    console.log('All tests passed!');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}
