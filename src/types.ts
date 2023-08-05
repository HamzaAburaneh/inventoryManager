export interface Item {
    id: string;
    name: string;
    barcode: string;
    count: number;
    lowCount: null| number;
    cost: null| number;
  }
  
  export interface Transaction {
    id: string;
    itemId: string;
    type: 'add' | 'remove';
    count: number;
    timestamp: Date;
  }
  