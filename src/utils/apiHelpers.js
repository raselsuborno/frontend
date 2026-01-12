/**
 * Safely extract data from API responses that might be in Supabase format
 * Supabase returns: { data: [...], error: null }
 * Regular API might return: [...] directly or { data: [...] }
 */
export function extractArrayData(responseData) {
  // If responseData is null/undefined, return empty array
  if (!responseData) {
    return [];
  }

  // If it's already an array, return it
  if (Array.isArray(responseData)) {
    return responseData;
  }

  // If it's an object with a data property
  if (typeof responseData === 'object' && responseData !== null) {
    // Check if it's a Supabase-style response: { data: [...], error: ... }
    if ('data' in responseData) {
      const { data, error } = responseData;
      
      // If there's an error, log it and return empty array
      if (error) {
        console.error('API response error:', error);
        return [];
      }
      
      // If data is an array, return it
      if (Array.isArray(data)) {
        return data;
      }
      
      // If data is not an array, return empty array
      console.warn('API returned non-array data:', data);
      return [];
    }
    
    // If it's an object without data property, return empty array
    console.warn('API returned object without data property:', responseData);
    return [];
  }

  // For any other type, return empty array
  console.warn('API returned unexpected data type:', typeof responseData);
  return [];
}

/**
 * Safely extract a single object from API responses
 */
export function extractObjectData(responseData) {
  if (!responseData) {
    return null;
  }

  // If it's already an object (not array), return it
  if (typeof responseData === 'object' && !Array.isArray(responseData) && responseData !== null) {
    // Check if it's wrapped in a data property
    if ('data' in responseData && !('error' in responseData)) {
      return responseData.data;
    }
    // Check if it's a Supabase-style response
    if ('data' in responseData && 'error' in responseData) {
      const { data, error } = responseData;
      if (error) {
        console.error('API response error:', error);
        return null;
      }
      return data;
    }
    return responseData;
  }

  return responseData;
}
