export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Banarasi Cotton Saree 1',
    category: 'Banarasi',
    subcategory: 'Banarasi Cotton',
    price: 1200,
    image: '/sarees/saree1.jpg',
  },
  {
    id: '2',
    name: 'Banarasi Silk Saree 1',
    category: 'Banarasi',
    subcategory: 'Banarasi Silk',
    price: 3500,
    image: '/sarees/saree2.jpg',
  },
  {
    id: '3',
    name: 'Kanjeevaram Pure Silk Saree 1',
    category: 'Kanjeevaram',
    subcategory: 'Pure Silk',
    price: 8000,
    image: '/sarees/saree3.jpg',
  },
  {
    id: '4',
    name: 'Kanjeevaram Soft Silk Saree 1',
    category: 'Kanjeevaram',
    subcategory: 'Soft Silk',
    price: 4500,
    image: '/sarees/saree4.jpg',
  },
  {
    id: '5',
    name: 'Banarasi Cotton Saree 2',
    category: 'Banarasi',
    subcategory: 'Banarasi Cotton',
    price: 1500,
    image: '/sarees/saree1_1.jpg',
  },
  {
    id: '6',
    name: 'Banarasi Silk Saree 2',
    category: 'Banarasi',
    subcategory: 'Banarasi Silk',
    price: 4000,
    image: '/sarees/saree2_1.jpg',
  },
  {
    id: '7',
    name: 'Kanjeevaram Pure Silk Saree 2',
    category: 'Kanjeevaram',
    subcategory: 'Pure Silk',
    price: 9500,
    image: '/sarees/saree3_1.jpg',
  },
  {
    id: '8',
    name: 'Kanjeevaram Soft Silk Saree 2',
    category: 'Kanjeevaram',
    subcategory: 'Soft Silk',
    price: 5000,
    image: '/sarees/saree4_1.jpg',
  },
  {
    id: '9',
    name: 'Banarasi Cotton Saree 3',
    category: 'Banarasi',
    subcategory: 'Banarasi Cotton',
    price: 1350,
    image: '/sarees/saree1_2.jpg',
  },
  {
    id: '10',
    name: 'Banarasi Silk Saree 3',
    category: 'Banarasi',
    subcategory: 'Banarasi Silk',
    price: 3800,
    image: '/sarees/saree2_2.jpg',
  },
  {
    id: '11',
    name: 'Kanjeevaram Pure Silk Saree 3',
    category: 'Kanjeevaram',
    subcategory: 'Pure Silk',
    price: 8800,
    image: '/sarees/saree3_2.jpg',
  },
  {
    id: '12',
    name: 'Kanjeevaram Soft Silk Saree 3',
    category: 'Kanjeevaram',
    subcategory: 'Soft Silk',
    price: 4800,
    image: '/sarees/saree4_2.jpg',
  },
];
