export const cropCategories = [
  {
    name: 'Cereals',
    items: ['Maize', 'Rice', 'Sorghum', 'Millet', 'Wheat', 'Fonio', 'Barley', 'Oats', 'Rye', 'Triticale']
  },
  {
    name: 'Legumes',
    items: ['Cowpea', 'Soybean', 'Groundnut', 'Bambara Groundnut', 'Pigeon Pea', 'Green Gram', 'Black Gram', 'Lima Bean', 'Kidney Bean', 'Chickpea', 'Lentil', 'Velvet Bean', 'Jack Bean', 'Lablab Bean', 'Winged Bean']
  },
  {
    name: 'Root & Tuber Crops',
    items: ['Cassava', 'Yam', 'Sweet Potato', 'Irish Potato', 'Cocoyam', 'Taro', 'Ginger', 'Turmeric', 'Arrowroot', 'Jerusalem Artichoke']
  },
  {
    name: 'Vegetables',
    items: ['Tomato', 'Pepper', 'Bell Pepper', 'Chili Pepper', 'Okra', 'Garden Egg', 'Cucumber', 'Carrot', 'Cabbage', 'Lettuce', 'Spinach', 'Waterleaf', 'Fluted Pumpkin', 'Amaranthus', 'Bitter Leaf', 'Scent Leaf', 'Jute Mallow', 'Celosia', 'Kale', 'Celery', 'Spring Onion', 'Onion', 'Garlic', 'Leek', 'Radish', 'Beetroot', 'Broccoli', 'Cauliflower', 'Green Peas', 'French Beans']
  },
  {
    name: 'Fruits',
    items: ['Watermelon', 'Melon', 'Pumpkin', 'Pawpaw', 'Banana', 'Plantain', 'Pineapple', 'Mango', 'Orange', 'Lemon', 'Lime', 'Tangerine', 'Grapefruit', 'Guava', 'Avocado', 'Coconut', 'Cashew', 'African Star Apple', 'Soursop', 'Passion Fruit', 'Dragon Fruit', 'Apple', 'Pear', 'Strawberry', 'Grapes']
  },
  {
    name: 'Oil & Cash Crops',
    items: ['Cocoa', 'Oil Palm', 'Sesame', 'Cotton', 'Rubber', 'Sugarcane', 'Coffee', 'Tea', 'Tobacco', 'Sunflower', 'Castor', 'Jatropha']
  },
  {
    name: 'Spices & Herbs',
    items: ['Ginger', 'Turmeric', 'Garlic', 'Onion', 'Black Pepper', 'Clove', 'Cinnamon', 'Nutmeg', 'Thyme', 'Rosemary', 'Basil', 'Mint', 'Coriander', 'Parsley', 'Lemongrass', 'Curry Leaf']
  },
  {
    name: 'Tree Crops',
    items: ['Kola Nut', 'Breadfruit', 'African Pear', 'Almond', 'Moringa', 'Neem', 'Baobab', 'Locust Bean', 'African Walnut', 'Tamarind', 'Date Palm']
  },
  {
    name: 'Forage & Livestock Feed',
    items: ['Elephant Grass', 'Napier Grass', 'Guinea Grass', 'Rhodes Grass', 'Alfalfa', 'Stylo', 'Centrosema', 'Brachiaria']
  },
  {
    name: 'Medicinal & Industrial Crops',
    items: ['Aloe Vera', 'Hibiscus', 'Roselle', 'Henna', 'Artemisia', 'Stevia', 'Kenaf', 'Indigo', 'Vetiver Grass', 'Chamomile', 'Echinacea', 'Holy Basil', 'Fenugreek']
  }
];

const imageMap: { [key: string]: string } = {
  'Maize': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/maize-farm-34f930d2-1783242028816.webp',
  'Rice': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/rice-crop-144ab9fb-1783242029852.webp',
  'Sorghum': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/sorghum-field-a04f91d1-1783258246286.webp',
  'Cowpea': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/cowpea-plant-e4d4a494-1783258247707.webp',
  'Cassava': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/cassava-tuber-d0cb5f4e-1783258247323.webp',
  'Tomato': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/ripe-tomatoes-b4fa9c14-1783258247171.webp',
  'Yam': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/yam-973aef3c-1783259791956.webp',
  'Soybean': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/soybean-fb6a0e27-1783259792462.webp',
  'Onion': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/onion-59056e5f-1783259792195.webp',
  'Oil Palm': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/oil-palm-3652f878-1783259791708.webp',
  'Avocado': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/avocado-66877376-1783259792841.webp',
  'Watermelon': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/watermelon-slice-46f90b0b-1783258246364.webp',
  'Cocoa': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/cocoa-pod-a09a2af6-1783242028527.webp',
  'Cotton': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/cotton-bolls-581fde4a-1783258251490.webp',
  'Ginger': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/fresh-ginger-roots-a4553b92-1783258247519.webp',
  'Kola Nut': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/kola-nuts-91a16f7a-1783258248650.webp',
  'Default': 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c9059cb7-a079-489e-b2b4-15cab295a309/placeholder-image-33544e1d-1783256018824.webp',
}

export const allCrops = cropCategories.flatMap(category => 
  category.items.map(item => ({ 
    id: item.toLowerCase().replace(/ /g, '-'),
    name: item, 
    category: category.name, 
    image: imageMap[item] || imageMap['Default']
  }))
);
