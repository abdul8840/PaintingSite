const SIZE_PRICES = {
  '8x10': { base: 79, multiplier: 1 },
  '11x14': { base: 109, multiplier: 1.3 },
  '12x16': { base: 129, multiplier: 1.5 },
  '16x20': { base: 169, multiplier: 1.8 },
  '18x24': { base: 199, multiplier: 2.1 },
  '20x24': { base: 229, multiplier: 2.3 },
  '24x30': { base: 279, multiplier: 2.7 },
  '24x36': { base: 319, multiplier: 3.0 },
  '30x40': { base: 399, multiplier: 3.5 },
  '36x48': { base: 499, multiplier: 4.2 },
  'custom': { base: 149, multiplier: 1.5 },
};

const STYLE_MULTIPLIERS = {
  'pencil-sketch': 1.0,
  'charcoal-sketch': 1.1,
  'watercolor': 1.3,
  'oil-painting': 1.6,
  'digital-illustration': 1.2,
  'line-art': 0.9,
  'pop-art': 1.3,
  'caricature': 1.1,
  'realistic': 1.5,
  'abstract': 1.2,
};

const FRAME_PRICES = {
  'no-frame': 0,
  'basic-black': 29,
  'basic-white': 29,
  'wooden-natural': 49,
  'wooden-dark': 49,
  'golden-classic': 79,
  'silver-modern': 69,
  'floating-frame': 59,
};

const SUBJECT_EXTRA_COST = 25; // per additional subject beyond 1
const RUSH_ORDER_MULTIPLIER = 1.5;
const TAX_RATE = 0.08;
const SHIPPING_BASE = 12;

export const calculateCustomOrderPrice = (options) => {
  const {
    canvasSize,
    customSize,
    sketchStyle,
    framingOption,
    numberOfSubjects = 1,
    isRushOrder = false,
  } = options;

  let sizeInfo = SIZE_PRICES[canvasSize] || SIZE_PRICES['custom'];
  let basePrice = sizeInfo.base;
  let sizeMultiplier = sizeInfo.multiplier;

  // Custom size calculation
  if (canvasSize === 'custom' && customSize) {
    const area = customSize.width * customSize.height;
    if (customSize.unit === 'cm') {
      const areaInches = area / 6.4516;
      sizeMultiplier = Math.max(1, areaInches / 80);
    } else {
      sizeMultiplier = Math.max(1, area / 80);
    }
  }

  const styleMultiplier = STYLE_MULTIPLIERS[sketchStyle] || 1.0;
  const framingCost = FRAME_PRICES[framingOption] || 0;
  const subjectsCost = Math.max(0, (numberOfSubjects - 1)) * SUBJECT_EXTRA_COST;

  let subtotal = (basePrice * sizeMultiplier * styleMultiplier) + framingCost + subjectsCost;

  let rushOrderCost = 0;
  if (isRushOrder) {
    rushOrderCost = subtotal * (RUSH_ORDER_MULTIPLIER - 1);
    subtotal += rushOrderCost;
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const shippingCost = SHIPPING_BASE + (sizeMultiplier > 2 ? 8 : 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  // Estimated days
  let estimatedDays = 14;
  if (sizeMultiplier > 3) estimatedDays = 21;
  if (sketchStyle === 'oil-painting' || sketchStyle === 'realistic') estimatedDays += 7;
  if (isRushOrder) estimatedDays = Math.ceil(estimatedDays / 2);

  return {
    basePrice,
    sizeMultiplier: Math.round(sizeMultiplier * 100) / 100,
    styleMultiplier,
    framingCost,
    subjectsCost,
    rushOrderCost: Math.round(rushOrderCost * 100) / 100,
    subtotal,
    shippingCost,
    tax,
    totalAmount,
    estimatedCompletionDays: estimatedDays,
  };
};

export const SIZE_OPTIONS = Object.keys(SIZE_PRICES);
export const STYLE_OPTIONS = Object.keys(STYLE_MULTIPLIERS);
export const FRAME_OPTIONS = Object.keys(FRAME_PRICES);