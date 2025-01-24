interface Category {
  id: string;
  name: string;
  value: string;
}

export const accessoriesCategories: Category[] = [
  { id: "1", name: "Bags", value: "bags" },
  { id: "2", name: "Jewelry", value: "jewelry" },
  { id: "3", name: "Watches", value: "watches" },
  { id: "4", name: "Belts", value: "belts" },
  { id: "5", name: "Scarves", value: "scarves" },
  { id: "6", name: "Hats", value: "hats" },
  { id: "7", name: "Sunglasses", value: "sunglasses" },
  { id: "8", name: "Hair Accessories", value: "hair_accessories" },
  { id: "9", name: "Wallets", value: "wallets" },
  { id: "10", name: "Gloves", value: "gloves" },
  { id: "11", name: "Phone Cases", value: "phone_cases" },
  { id: "12", name: "Keychains", value: "keychains" },
  { id: "13", name: "Ties", value: "ties" },
  { id: "14", name: "Cufflinks", value: "cufflinks" },
  { id: "15", name: "Umbrella", value: "umbrella" },
];

export const clothingCategories: Category[] = [
  { id: "1", name: "Traditional Clothing", value: "traditional_clothing" },
  { id: "2", name: "Modern African Fashion", value: "modern_african_fashion" },
  { id: "3", name: "Ankara Prints", value: "ankara_prints" },
  { id: "4", name: "Kente Fabrics", value: "kente_fabrics" },
  { id: "5", name: "Dashikis", value: "dashikis" },
  { id: "7", name: "Headwraps & Scarves", value: "headwraps_scarves" },
  { id: "8", name: "Footwear", value: "footwear" },
  { id: "10", name: "Men's Wear", value: "men" },
  { id: "11", name: "Women's Wear", value: "women" },
  { id: "12", name: "Children's Wear", value: "childrens_wear" },
  { id: "13", name: "Wedding Attire", value: "wedding_attire" },
  { id: "14", name: "African Textiles", value: "african_textiles" },
  { id: "15", name: "Cultural Costumes", value: "cultural_costumes" },
];

// Function to find the category name by value
export function getCategoryNameByValue(value: string): string | undefined {
  // Combine the two arrays into one
  const allCategories = [...accessoriesCategories, ...clothingCategories];

  // Find the category where the value matches
  const category = allCategories.find((cat) => cat.value === value);

  // Return the name if found, otherwise undefined
  return category ? category.name : undefined;
}

export function getCategoryValueByName(name: string): string | undefined {
  const allCategories = [...accessoriesCategories, ...clothingCategories];
  const category = allCategories.find((cat) => cat.name === name);
  return category ? category.value : undefined;
}
