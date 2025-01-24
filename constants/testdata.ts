import { IProduct } from "../types/index";

export const testProducts: IProduct[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    designer_id: "2",
    price: 19.99,
    images: [
      "https://example.com/tshirt1.jpg",
      "https://example.com/tshirt1b.jpg",
    ],
    type: "clothing",
    categories: ["t-shirt", "casual"],
    quantity: 100,
    is_draft: false,
    is_published: true,
  },
  {
    id: "2",
    name: "Silver Necklace",
    description: "Elegant silver necklace with pendant",
    designer_id: "3",
    price: 79.99,
    images: ["https://example.com/necklace1.jpg"],
    type: "accessory",
    categories: ["jewelry", "necklace"],
    quantity: 50,
    is_draft: false,
    is_published: true,
  },
  {
    id: "3",
    name: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots",
    designer_id: "4",
    price: 45.0,
    images: [
      "https://example.com/wallet1.jpg",
      "https://example.com/wallet1b.jpg",
    ],
    type: "accessory",
    categories: ["wallet", "leather goods"],
    quantity: 75,
    is_draft: false,
    is_published: true,
  },
  {
    id: "4",
    name: "Denim Jeans",
    description: "Classic blue denim jeans with straight fit",
    designer_id: "2",
    price: 59.99,
    images: ["https://example.com/jeans1.jpg"],
    type: "clothing",
    categories: ["jeans", "denim", "casual"],
    quantity: 80,
    is_draft: false,
    is_published: true,
  },
  {
    id: "5",
    name: "Sunglasses",
    description: "UV protection sunglasses with polarized lenses",
    designer_id: "5",
    price: 129.99,
    images: [
      "https://example.com/sunglasses1.jpg",
      "https://example.com/sunglasses1b.jpg",
    ],
    type: "accessory",
    categories: ["eyewear", "summer"],
    quantity: 60,
    is_draft: false,
    is_published: true,
  },
];

export const topPicks: IProduct[] = [
  {
    id: "6",
    name: "Smart Watch",
    description: "Feature-packed smartwatch with health tracking",
    designer_id: "6",
    price: 199.99,
    images: [
      "https://qwdvmzyutqayvblxsblj.supabase.co/storage/v1/object/public/afrostyles/profile_pictures/5c6ec2e3-e800-43bd-b6d5-e44695d475e9/5c6ec2e3-e800-43bd-b6d5-e44695d475e9_PROFILE_PICTURE_76248823-f810-4718-826b-dd055483e0e4.jpg",
      "https://qwdvmzyutqayvblxsblj.supabase.co/storage/v1/object/public/afrostyles/profile_pictures/5c6ec2e3-e800-43bd-b6d5-e44695d475e9/5c6ec2e3-e800-43bd-b6d5-e44695d475e9_PROFILE_PICTURE_76248823-f810-4718-826b-dd055483e0e4.jpg",
    ],
    type: "electronics",
    categories: ["wearable", "tech"],
    quantity: 40,
    is_draft: false,
    is_published: true,
  },
  {
    id: "7",
    name: "Running Shoes",
    description: "Lightweight running shoes with superior cushioning",
    designer_id: "7",
    price: 89.99,
    images: [
      "https://qwdvmzyutqayvblxsblj.supabase.co/storage/v1/object/public/afrostyles/store_images/b597c3eb-3768-471a-92b9-7713aca274b1/b597c3eb-3768-471a-92b9-7713aca274b1_PROFILE_PICTURE_b8d16c22-a1b5-42e1-bad4-ec4df27f2be1.jpg",
      "https://qwdvmzyutqayvblxsblj.supabase.co/storage/v1/object/public/afrostyles/profile_pictures/5c6ec2e3-e800-43bd-b6d5-e44695d475e9/5c6ec2e3-e800-43bd-b6d5-e44695d475e9_PROFILE_PICTURE_76248823-f810-4718-826b-dd055483e0e4.jpg",
    ],
    type: "footwear",
    categories: ["sports", "running"],
    quantity: 65,
    is_draft: false,
    is_published: true,
  },
  {
    id: "8",
    name: "Laptop Backpack",
    description: "Water-resistant backpack with padded laptop compartment",
    designer_id: "8",
    price: 69.99,
    images: [
      "https://example.com/backpack1.jpg",
      "https://example.com/backpack1b.jpg",
    ],
    type: "accessory",
    categories: ["bag", "travel"],
    quantity: 55,
    is_draft: false,
    is_published: true,
  },
  {
    id: "9",
    name: "Wireless Earbuds",
    description: "True wireless man earbuds with noise cancellation",
    designer_id: "6",
    price: 149.99,
    images: ["https://example.com/earbuds1.jpg"],
    type: "electronics",
    categories: ["audio", "wireless"],
    quantity: 70,
    is_draft: false,
    is_published: true,
  },
  {
    id: "10",
    name: "Leather Jacket",
    description: "Classic leather jacket with zip front",
    designer_id: "9",
    price: 249.99,
    images: [
      "https://example.com/leatherjacket1.jpg",
      "https://example.com/leatherjacket1b.jpg",
    ],
    type: "clothing",
    categories: ["outerwear", "leather"],
    quantity: 30,
    is_draft: false,
    is_published: true,
  },
];

export const testData = [...testProducts, ...topPicks];
