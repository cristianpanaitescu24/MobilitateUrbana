
export const getStreetNameFromCoords = async (
  [lon, lat]: [number, number]
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    if (!response.ok) throw new Error('Reverse geocoding failed');

    const data = await response.json();
    const address = data.address || {};
    const street = address.road || 'Stradă necunoscută';
    const number = address.house_number ? ` nr. ${address.house_number}` : '';

    return `${street}${number}`;
  } catch (error) {
    console.error('Error fetching street name:', error);
    return 'Stradă necunoscută';
  }
};