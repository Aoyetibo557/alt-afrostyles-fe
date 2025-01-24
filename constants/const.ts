import { Animated } from "react-native";

export const ACCOUNT_TYPES = {
  DESIGNER: "designer",
  SHOPPER: "shopper",
};

export const MESSAGE_TYPES = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
};

interface Category {
  id: string;
  name: string;
  value: string;
}

export const categories: Category[] = [
  { id: "1", name: "Traditional Clothing", value: "traditional_clothing" },
  { id: "2", name: "Modern African Fashion", value: "modern_african_fashion" },
  { id: "3", name: "Ankara Prints", value: "ankara_prints" },
  { id: "4", name: "Kente Fabrics", value: "kente_fabrics" },
  { id: "5", name: "Dashikis", value: "dashikis" },
  { id: "6", name: "African Jewelry", value: "african_jewelry" },
  { id: "7", name: "Headwraps & Scarves", value: "headwraps_scarves" },
  { id: "8", name: "Footwear", value: "footwear" },
  { id: "9", name: "Bags & Accessories", value: "bags_accessories" },
  { id: "10", name: "Men's Wear", value: "mens_wear" },
  { id: "11", name: "Women's Wear", value: "womens_wear" },
  { id: "12", name: "Children's Wear", value: "childrens_wear" },
  { id: "13", name: "Wedding Attire", value: "wedding_attire" },
  { id: "14", name: "African Textiles", value: "african_textiles" },
  { id: "15", name: "Cultural Costumes", value: "cultural_costumes" },
];

export const areaCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
];

//for the stack header scroll logic
export const scrollY = new Animated.Value(0);

export const CATEGORY_FILTERS: Record<string, string[]> = {
  men: ["Shirts", "Pants", "Suits", "Shoes", "Traditional"],
  women: ["Dresses", "Tops", "Skirts", "Shoes", "Traditional"],
  accessories: ["Jewelry", "Bags", "Scarves", "Hats", "Belts"],
  unique: ["Handmade", "Limited Edition", "Customizable", "Vintage"],
};
