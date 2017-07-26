import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const sales = [
  { id: 1, item: 'GTX 750', category: 'VideoCard',
   price: 300.00, quality: 'Perfect Condition', manufacturer: 'EVGA'},
  { id: 2, item: 'GTX 760', category: 'VideoCard', 
  price: 500.00, quality: 'Poor Condition', manufacturer: 'AMD'},
  { id: 3, item: 'GTX 780', category: 'VideoCard',
   price: 400.00, quality: 'Okay Condition', manufacturer: 'AMD'},
  { id: 4, item: 'GTX 970', category: 'VideoCard',
   price: 200.00, quality: 'Poor Condition', manufacturer: 'Gigabyte'},
  { id: 5, item: 'GTX 980', category: 'VideoCard',
   price: 100.00, quality: 'Perfect Condition', manufacturer: 'AMD'},
  { id: 6, item: 'GTX 950', category: 'VideoCard',
   price: 600.00, quality: 'Perfect Condition', manufacturer: 'Gigabyte'},
  { id: 7, item: 'GTX 1050', category: 'VideoCard',
   price: 700.00, quality: 'Perfect Condition', manufacturer: 'EVGA'},
  { id: 8, item: 'GTX 1060', category: 'VideoCard',
   price: 600.00, quality: 'Perfect Condition', manufacturer: 'AMD'},
  { id: 9, item: 'GTX 1070', category: 'VideoCard',
   price: 900.00, quality: 'Perfect Condition', manufacturer: 'Gigabyte'},
  { id: 10, item: 'GTX 1080', category: 'VideoCard',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'EVGA'},
  { id: 11, item: 'I7 7700k', category: 'CPU',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Intel'},
     { id: 12, item: 'I7 7700k', category: 'CPU',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Intel'},
     { id: 13, item: 'I7 7700k', category: 'CPU',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Intel'},
     { id: 14, item: 'I7 7700k', category: 'CPU',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Intel'},
     { id: 15, item: 'I7 7700k', category: 'CPU',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Intel'},
     { id: 16, item: 'I7 7700k', category: 'CPU',
   price: 800.00, quality: 'Perfect Condition', manufacturer: 'Intel'},
  
    ];
    return {sales};
  }
}
