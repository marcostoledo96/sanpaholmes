import { Product } from '../types';

export const mockProducts: Product[] = [
  // MERIENDA - Bebidas
  {
    id: 'mer-beb-1',
    name: 'Café Americano',
    price: 350,
    category: 'merienda-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Café negro intenso'
  },
  {
    id: 'mer-beb-2',
    name: 'Café con Leche',
    price: 400,
    category: 'merienda-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Café con leche caliente'
  },
  {
    id: 'mer-beb-3',
    name: 'Té',
    price: 300,
    category: 'merienda-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Té caliente'
  },
  {
    id: 'mer-beb-4',
    name: 'Gaseosa',
    price: 450,
    category: 'merienda-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Coca-Cola / Sprite'
  },
  {
    id: 'mer-beb-5',
    name: 'Agua Mineral',
    price: 350,
    category: 'merienda-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Agua sin gas 500ml'
  },

  // MERIENDA - Dulces
  {
    id: 'mer-dul-1',
    name: 'Medialunas x3',
    price: 600,
    category: 'merienda-dulces',
    image: 'https://images.unsplash.com/photo-1642774692082-b876a1f3bda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raWVzJTIwZGVzc2VydHxlbnwxfHx8fDE3NjI5Nzk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Medialunas de manteca'
  },
  {
    id: 'mer-dul-2',
    name: 'Alfajor',
    price: 400,
    category: 'merienda-dulces',
    image: 'https://images.unsplash.com/photo-1642774692082-b876a1f3bda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raWVzJTIwZGVzc2VydHxlbnwxfHx8fDE3NjI5Nzk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Alfajor de chocolate'
  },
  {
    id: 'mer-dul-3',
    name: 'Brownie',
    price: 550,
    category: 'merienda-dulces',
    image: 'https://images.unsplash.com/photo-1642774692082-b876a1f3bda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raWVzJTIwZGVzc2VydHxlbnwxfHx8fDE3NjI5Nzk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Brownie de chocolate'
  },
  {
    id: 'mer-dul-4',
    name: 'Cookies x3',
    price: 500,
    category: 'merienda-dulces',
    image: 'https://images.unsplash.com/photo-1642774692082-b876a1f3bda9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raWVzJTIwZGVzc2VydHxlbnwxfHx8fDE3NjI5Nzk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Cookies con chips'
  },

  // MERIENDA - Salados
  {
    id: 'mer-sal-1',
    name: 'Tostado Jamón y Queso',
    price: 700,
    category: 'merienda-salados',
    image: 'https://images.unsplash.com/photo-1721980743519-01f627e7b4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZvb2R8ZW58MXx8fHwxNzYzMDMxODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Tostado clásico'
  },
  {
    id: 'mer-sal-2',
    name: 'Sándwich Milanesa',
    price: 900,
    category: 'merienda-salados',
    image: 'https://images.unsplash.com/photo-1721980743519-01f627e7b4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZvb2R8ZW58MXx8fHwxNzYzMDMxODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Milanesa con lechuga y tomate'
  },
  {
    id: 'mer-sal-3',
    name: 'Empanadas x2',
    price: 650,
    category: 'merienda-salados',
    image: 'https://images.unsplash.com/photo-1721980743519-01f627e7b4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZvb2R8ZW58MXx8fHwxNzYzMDMxODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Carne / Jamón y queso'
  },
  {
    id: 'mer-sal-4',
    name: 'Pizza Porción',
    price: 550,
    category: 'merienda-salados',
    image: 'https://images.unsplash.com/photo-1721980743519-01f627e7b4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZvb2R8ZW58MXx8fHwxNzYzMDMxODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Porción de muzzarella'
  },

  // CENA - Bebidas
  {
    id: 'cen-beb-1',
    name: 'Cerveza',
    price: 800,
    category: 'cena-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Cerveza 500ml'
  },
  {
    id: 'cen-beb-2',
    name: 'Vino Copa',
    price: 600,
    category: 'cena-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Copa de vino tinto/blanco'
  },
  {
    id: 'cen-beb-3',
    name: 'Gaseosa Grande',
    price: 550,
    category: 'cena-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '1.5L Coca-Cola / Sprite'
  },
  {
    id: 'cen-beb-4',
    name: 'Agua con Gas',
    price: 400,
    category: 'cena-bebidas',
    image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzYzMDY3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Agua mineralizada'
  },

  // CENA - Comidas
  {
    id: 'cen-com-1',
    name: 'Pizza Entera',
    price: 3500,
    category: 'cena-comidas',
    image: 'https://images.unsplash.com/photo-1694718950978-6e574ee95440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGRpbm5lcnxlbnwxfHx8fDE3NjMwNDk3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Pizza grande 8 porciones'
  },
  {
    id: 'cen-com-2',
    name: 'Milanesa con Papas',
    price: 2500,
    category: 'cena-comidas',
    image: 'https://images.unsplash.com/photo-1694718950978-6e574ee95440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGRpbm5lcnxlbnwxfHx8fDE3NjMwNDk3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Milanesa napolitana + papas fritas'
  },
  {
    id: 'cen-com-3',
    name: 'Hamburguesa Completa',
    price: 2200,
    category: 'cena-comidas',
    image: 'https://images.unsplash.com/photo-1694718950978-6e574ee95440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGRpbm5lcnxlbnwxfHx8fDE3NjMwNDk3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Hamburguesa con papas'
  },
  {
    id: 'cen-com-4',
    name: 'Tabla de Picada',
    price: 3000,
    category: 'cena-comidas',
    image: 'https://images.unsplash.com/photo-1694718950978-6e574ee95440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGRpbm5lcnxlbnwxfHx8fDE3NjMwNDk3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fiambres, quesos y aceitunas'
  },
  {
    id: 'cen-com-5',
    name: 'Empanadas x12',
    price: 3600,
    category: 'cena-comidas',
    image: 'https://images.unsplash.com/photo-1694718950978-6e574ee95440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGRpbm5lcnxlbnwxfHx8fDE3NjMwNDk3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Docena surtida'
  },
];
