/**
 * Pricing Engine Utility
 * Calculates service pricing based on base price, options, and modifiers
 */

/**
 * Calculate the total price for a service booking
 * @param {Object} service - Service object with basePrice
 * @param {Object} options - Selected service options
 * @param {Object} details - Booking details (homeSize, frequency, etc.)
 * @returns {Object} { basePrice, optionPrice, modifiers, total }
 */
export function calculateServicePrice(service, options = {}, details = {}) {
  // Start with base price (default to 0 if not set)
  let basePrice = service?.basePrice || 0;
  let optionPrice = 0;
  let modifiers = [];
  let total = basePrice;

  // If service has options, calculate option price
  if (service?.options && Array.isArray(service.options)) {
    const selectedOption = service.options.find(
      (opt) => opt.id === options.selectedOptionId || opt.name === options.selectedOption
    );

    if (selectedOption) {
      if (selectedOption.price !== null && selectedOption.price !== undefined) {
        // Fixed price for this option
        optionPrice = selectedOption.price;
        modifiers.push({
          type: 'option',
          name: selectedOption.name,
          amount: optionPrice,
        });
      } else if (selectedOption.priceModifier) {
        // Percentage modifier
        const modifierAmount = basePrice * (selectedOption.priceModifier - 1);
        optionPrice = modifierAmount;
        modifiers.push({
          type: 'modifier',
          name: selectedOption.name,
          percentage: ((selectedOption.priceModifier - 1) * 100).toFixed(0),
          amount: modifierAmount,
        });
      }
      total = basePrice + optionPrice;
    }
  }

  // Apply frequency discounts (if applicable)
  if (details.frequency) {
    const frequencyLower = details.frequency.toLowerCase();
    if (frequencyLower.includes('weekly') || frequencyLower.includes('bi-weekly')) {
      // Apply 10% discount for recurring services
      const discount = total * 0.1;
      total = total - discount;
      modifiers.push({
        type: 'discount',
        name: 'Recurring Service Discount',
        amount: -discount,
      });
    }
  }

  // Home size multipliers (if applicable)
  if (details.homeSize) {
    const sizeLower = details.homeSize.toLowerCase();
    if (sizeLower.includes('large') || sizeLower.includes('3+') || sizeLower.includes('4+')) {
      const multiplier = 1.2; // 20% increase
      const increase = total * (multiplier - 1);
      total = total * multiplier;
      modifiers.push({
        type: 'size',
        name: 'Large Home Surcharge',
        amount: increase,
      });
    } else if (sizeLower.includes('small') || sizeLower.includes('studio') || sizeLower.includes('1')) {
      const multiplier = 0.9; // 10% discount
      const decrease = total * (1 - multiplier);
      total = total * multiplier;
      modifiers.push({
        type: 'size',
        name: 'Small Home Discount',
        amount: -decrease,
      });
    }
  }

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    optionPrice: parseFloat(optionPrice.toFixed(2)),
    modifiers,
    total: parseFloat(total.toFixed(2)),
    currency: 'CAD', // Default currency
  };
}

/**
 * Format price for display
 * @param {number} price - Price amount
 * @param {string} currency - Currency code (default: CAD)
 * @returns {string} Formatted price string
 */
export function formatPrice(price, currency = 'CAD') {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Price on request';
  }

  const currencySymbols = {
    CAD: '$',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${parseFloat(price).toFixed(2)}`;
}

/**
 * Get price range for a service (min to max)
 * @param {Object} service - Service object
 * @returns {Object} { min, max, formatted }
 */
export function getServicePriceRange(service) {
  if (!service?.basePrice) {
    return { min: null, max: null, formatted: 'Price on request' };
  }

  let min = service.basePrice;
  let max = service.basePrice;

  // Check service options for price range
  if (service.options && Array.isArray(service.options)) {
    service.options.forEach((opt) => {
      if (opt.price) {
        min = Math.min(min, opt.price);
        max = Math.max(max, opt.price);
      } else if (opt.priceModifier) {
        const modifiedPrice = service.basePrice * opt.priceModifier;
        min = Math.min(min, modifiedPrice);
        max = Math.max(max, modifiedPrice);
      }
    });
  }

  // Apply size modifiers
  const largePrice = max * 1.2;
  const smallPrice = min * 0.9;

  return {
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(largePrice.toFixed(2)),
    formatted: min === max 
      ? formatPrice(min)
      : `${formatPrice(smallPrice)} - ${formatPrice(largePrice)}`,
  };
}