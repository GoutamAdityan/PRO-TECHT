import Tesseract from 'tesseract.js';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { preprocessImage } from './image';
import { supabase } from '@/integrations/supabase/client';
import Fuse from 'fuse.js';

const wordsToNumbers: { [key: string]: number } = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

const parseAmountInWords = (text: string): number | null => {
  const amountInWordsMatch = text.match(/Amount in Words:\s*\[?(.+?)\]?\s*only/i);
  if (!amountInWordsMatch) return null;

  const words = amountInWordsMatch[1].toLowerCase().split(/[\s-]+/);
  let total = 0;
  let currentNumber = 0;

  for (const word of words) {
    if (wordsToNumbers[word] !== undefined) { currentNumber += wordsToNumbers[word]; } else if (word === 'hundred') { currentNumber *= 100; } else if (word === 'thousand') { total += currentNumber * 1000; currentNumber = 0; }
  }
  total += currentNumber;
  return total;
};

export const parseReceipt = async (image: File) => {
  const codeReader = new BrowserMultiFormatReader();
  const imageSrc = await preprocessImage(image);

  try {
    const result = await codeReader.decodeFromImage(undefined, imageSrc);
    console.log('Barcode found:', result.getText());
  } catch (err) {
    if (err instanceof NotFoundException) {
      console.log('No barcode found, proceeding with OCR');
    } else {
      console.error('Barcode scanning error:', err);
    }
  }

  console.log('Starting OCR...');
  const { data: { text } } = await Tesseract.recognize(image, 'eng', {
    logger: m => console.log(m),
  });
  console.log('OCR Result:', text);

  const cleanedText = text.replace(/[|~—]/g, ' ');
  const lines = cleanedText.split('\n');
  const extractedData: any = {};

  // --- Targeted parsing for the specific invoice format ---

  const dateRegex = /Order Date:\s*(\d{2}\.\d{2}\.\d{4})/i;
  const serialNumberRegex = /Order Number:[\s]*([\w-]+)/i;
  const retailerRegex = /amazon/i;

  lines.forEach(line => {
    const dateMatch = line.match(dateRegex);
    if (dateMatch && !extractedData.purchaseDate) {
      console.log('Date match found:', dateMatch[1]);
      const [day, month, year] = dateMatch[1].split('.');
      extractedData.purchaseDate = `${year}-${month}-${day}`;
    }

    const serialNumberMatch = line.match(serialNumberRegex);
    if (serialNumberMatch && !extractedData.serialNumber) {
      console.log('Serial number match found:', serialNumberMatch[1]);
      extractedData.serialNumber = serialNumberMatch[1];
    }
  });

  const amount = parseAmountInWords(cleanedText);
  if (amount) {
    console.log('Price match found:', amount);
    extractedData.purchasePrice = amount.toString();
  }

  const retailerMatch = cleanedText.match(retailerRegex);
  if (retailerMatch && !extractedData.retailer) {
    console.log('Retailer match found:', retailerMatch[0]);
    extractedData.retailer = retailerMatch[0];
  }

  // Fuzzy matching for product
  const { data: products, error } = await supabase.from('products').select('type, brand, model');
  if (error) {
    console.error('Error fetching products for fuzzy matching:', error);
  } else if (products) {
    const fuse = new Fuse(products, { keys: ['type', 'brand', 'model'], threshold: 0.4 });
    const result = fuse.search(cleanedText.toLowerCase().replace(/[^a-z0-9\s]/g, ''));
    if (result.length > 0) {
      const { type, brand, model } = result[0].item;
      extractedData.type = type;
      extractedData.brand = brand;
      extractedData.model = model;
    }
  }

  console.log('Extracted data:', extractedData);
  return extractedData;
};
