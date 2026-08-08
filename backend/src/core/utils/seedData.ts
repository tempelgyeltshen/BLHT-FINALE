/**
 * Initial seed data for all CMS collections.
 * Matches frontend initialData.ts but without id/createdAt/updatedAt fields.
 * Mongo generates ObjectIds automatically on insert.
 */

export const seedPackages = [
  {
    slug: 'kingdom-in-the-clouds-luxury',
    title: 'Kingdom in the Clouds: Ultra-Luxury Journey',
    subtitle: '7 Days / 6 Nights across Paro, Thimphu, and Punakha in 5-Star Luxury Lodges',
    category: 'luxury',
    durationDays: 7,
    priceUSD: 8950,
    rating: 4.98,
    reviewsCount: 42,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immerse yourself in the world\'s most serene Kingdom with private helicopter transfers, personal butler service, private blessings by senior incarnate lamas, and exclusive stays at Six Senses and BLHT sanctuaries.',
    highlights: [
      'Private VIP arrival clearance at Paro International Airport with traditional scarf ceremony',
      'Helicopter flight over Himalayan peaks to Punakha Valley',
      'Private meditation and butter lamp lighting with Abbot at Chimi Lhakhang',
      'Champagne sunrise breakfast overlooking Paro Taktsang',
      'Traditional hot stone bath infused with wild Artemisia'
    ],
    included: [
      '5-Star Ultra-Luxury Accommodations',
      'Private SUV with dedicated senior guide and butler',
      'SDF Sustainable Development Fees included',
      'All gourmet farm-to-table meals',
      'All official visa processing and monastery entry permits'
    ],
    excluded: [
      'International flights into Paro',
      'Personal travel insurance',
      'Discretionary tips for guide and driver'
    ],
    destinations: ['Paro', 'Thimphu', 'Punakha'],
    hotelCategory: '5-Star Luxury',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paro and Drive to Thimphu Valley',
        location: 'Thimphu',
        description: 'Land in Paro where your personal host greets you. Enjoy a scenic private transfer to Six Senses Thimphu.',
        highlights: ['Private arrival reception', 'Six Senses Thimphu check-in', 'Welcome dinner']
      },
      {
        day: 2,
        title: 'Thimphu Cultural Immersion',
        location: 'Thimphu',
        description: 'Visit the Giant Buddha Dordenma, Tashichho Dzong, and experience traditional archery.',
        highlights: ['Buddha Dordenma', 'Tashichho Dzong', 'Archery experience']
      }
    ]
  },
  {
    slug: 'sacred-festivals-cultural-odyssey',
    title: 'Sacred Festivals Cultural Odyssey',
    subtitle: '10 Days of Tshechu mask dances, monastery blessings, and heritage immersion',
    category: 'cultural',
    durationDays: 10,
    priceUSD: 6500,
    rating: 4.92,
    reviewsCount: 28,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Experience the most sacred Tshechu festivals with VIP access to masked dances, ancient monastery ceremonies, and spiritual blessings across Bhutan.',
    highlights: [
      'VIP Tshechu festival seating',
      'Private monastery blessing ceremony',
      'Traditional costume fitting and photography',
      'Meet local artisans and weavers'
    ],
    included: [
      'Heritage hotel accommodations',
      'Private guide and driver',
      'Festival entry and VIP passes',
      'All meals'
    ],
    excluded: [
      'International flights',
      'Travel insurance'
    ],
    destinations: ['Paro', 'Thimphu', 'Bumthang'],
    hotelCategory: 'Heritage Suite',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paro',
        location: 'Paro',
        description: 'Welcome to Bhutan. Transfer to heritage hotel.',
        highlights: ['Airport greeting', 'Hotel check-in']
      }
    ]
  },
  {
    slug: 'dragon-kingdom-trans-bhutan-adventure',
    title: 'Dragon Kingdom Trans-Bhutan Adventure',
    subtitle: '12-Day guided trek and cultural adventure across all valleys',
    category: 'adventure',
    durationDays: 12,
    priceUSD: 5200,
    rating: 4.88,
    reviewsCount: 35,
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A comprehensive adventure spanning all of Bhutan\'s diverse landscapes from subtropical valleys to high Himalayan passes.',
    highlights: [
      'Tiger\'s Nest monastery trek',
      'Bumthang valley exploration',
      'Rafting on the Mo Chhu river',
      'Black-necked crane viewing'
    ],
    included: [
      'Mixed accommodations',
      'Guide and transport',
      'Trekking permits',
      'All meals during trek'
    ],
    excluded: [
      'International flights',
      'Personal gear'
    ],
    destinations: ['Paro', 'Punakha', 'Bumthang', 'Gangtey'],
    hotelCategory: 'Boutique Lodge',
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Orientation',
        location: 'Paro',
        description: 'Arrive in Paro and transfer to lodge. Evening orientation.',
        highlights: ['Airport transfer', 'Welcome briefing']
      }
    ]
  },
  {
    slug: 'bumthang-spiritual-heartland',
    title: 'Bumthang Spiritual Heartland Retreat',
    subtitle: '8 Days of meditation, temple visits, and wellness in central Bhutan',
    category: 'cultural',
    durationDays: 8,
    priceUSD: 4800,
    rating: 4.90,
    reviewsCount: 18,
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A deeply spiritual journey through the heartland of Bhutanese Buddhism, featuring meditation retreats and ancient temple visits.',
    highlights: [
      'Guided meditation at Kurjey Lhakhang',
      'Traditional hot stone bath ceremony',
      'Local cheese and honey farm visit',
      'Weaving workshop with local artisans'
    ],
    included: [
      'Boutique lodge accommodation',
      'Private guide',
      'Meditation sessions',
      'All meals'
    ],
    excluded: [
      'International flights',
      'Personal expenses'
    ],
    destinations: ['Bumthang'],
    hotelCategory: 'Boutique Lodge',
    itinerary: [
      {
        day: 1,
        title: 'Journey to Bumthang',
        location: 'Bumthang',
        description: 'Scenic flight or drive to the spiritual heartland of Bhutan.',
        highlights: ['Scenic arrival', 'Lodge check-in']
      }
    ]
  }
];

export const seedHotels = [
  {
    slug: 'paro-pine-sanctuary',
    name: 'BLHT Paro Pine Sanctuary',
    brand: 'BLHT Sanctuary',
    location: 'Balakha Village, Paro',
    region: 'Paro',
    starRating: 5,
    pricePerNightUSD: 2200,
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    tagline: 'A sanctuary tucked inside a blue pine forest beneath ruined Drukyel Dzong.',
    description: 'BLHT Paro Pine Sanctuary features 24 wood-panelled suites with king beds, traditional wood-burning stoves, and terrazzo baths. Surrounded by whispering pines, it offers unmatched tranquility and direct access to Tiger\'s Nest.',
    amenities: ['Spa & Steam Room', 'Bukhari Wood Fireplace', 'Fine Dining', 'Private Yoga Pavilion', 'Archery Range', 'Helipad Access'],
    featured: true
  },
  {
    slug: 'six-senses-thimphu',
    name: 'Six Senses Thimphu (Palace in the Sky)',
    brand: 'Six Senses',
    location: 'Chungdue, Thimphu',
    region: 'Thimphu',
    starRating: 5,
    pricePerNightUSD: 1950,
    heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    tagline: 'Perched high on the valley wall with panoramic views of the Buddha Dordenma.',
    description: 'Designed as a majestic sky palace with grand reflection ponds overlooking the capital valley. Features world-class wellness spa, heated indoor pool, and organic gardens.',
    amenities: ['Heated Indoor Pool', 'Wellness Spa', 'Reflection Ponds', 'Organic Garden Dining', 'Butler Service'],
    featured: true
  },
  {
    slug: 'como-uma-paro',
    name: 'COMO Uma Paro',
    brand: 'COMO',
    location: 'Paro Valley',
    region: 'Paro',
    starRating: 5,
    pricePerNightUSD: 1600,
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    tagline: 'Contemporary luxury nestled in a pristine pine forest setting.',
    description: 'COMO Uma Paro offers understated luxury with stunning valley views, COMO Shambhala wellness programs, and farm-to-table dining.',
    amenities: ['COMO Shambhala Spa', 'Valley View Restaurant', 'Yoga Deck', 'Library'],
    featured: false
  }
];

export const seedFestivals = [
  {
    slug: 'lhamoi-dromchhen-2027',
    name: 'Lhamoi Dromchhen',
    location: 'Trongsa',
    dzong: 'Trongsa Dzong',
    dates2027: '11th - 13th February 2027',
    month: 'February',
    description: 'Sacred protective deity ceremony dedicated to Palden Lhamo inside the majestic courtyards of Trongsa Dzong.',
    significance: 'Dispels spiritual obstacles for the new year and brings peace and protection across central Bhutan.',
    heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    durationDays: 3,
    featured: false,
    slNo: 1
  },
  {
    slug: 'punakha-dromchoe-2027',
    name: 'Punakha Dromchoe',
    location: 'Punakha',
    dzong: 'Punakha Dzong',
    dates2027: '13th - 15th February 2027',
    month: 'February',
    description: 'Dramatic theatrical reenactment of the 17th-century battle against Tibetan invaders led by Zhabdrung Ngawang Namgyal.',
    significance: 'Features the Pazaps throwing blessed oranges into the Mo Chhu river.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    durationDays: 3,
    featured: true,
    slNo: 2
  },
  {
    slug: 'punakha-tshechu-2027',
    name: 'Punakha Tshechu',
    location: 'Punakha',
    dzong: 'Punakha Dzong',
    dates2027: '16th - 18th February 2027',
    month: 'February',
    description: 'Grand annual religious mask dance festival held inside the Palace of Great Happiness at the confluence of two sacred rivers.',
    significance: 'Honors Guru Rinpoche through ancient sacred Cham dances performed by the monk body.',
    heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    durationDays: 3,
    featured: true,
    slNo: 3
  }
];

export const seedBrochures = [
  {
    title: 'BLHT Official Luxury Collection 2026',
    subtitle: 'Ultra-luxury lodges, private helicopter itineraries, and heritage sanctuary experiences',
    category: 'Luxury Tours',
    fileSize: '14.8 MB',
    totalPages: 16,
    coverImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    downloadCount: 1420,
    year: '2026',
    featured: true,
    tableOfContents: [
      { page: 1, title: 'Welcome to the Kingdom of Happiness' },
      { page: 3, title: 'Why Travel with BLHT' },
      { page: 5, title: 'Lodge Circuit Details' }
    ]
  },
  {
    title: 'Sacred Tshechu Festivals Calendar',
    subtitle: 'Comprehensive guide to mask dances, dates, and customs for 2026-2027',
    category: 'Festivals & Culture',
    fileSize: '9.2 MB',
    totalPages: 12,
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    downloadCount: 980,
    year: '2026',
    featured: true,
    tableOfContents: [
      { page: 1, title: 'Introduction to Sacred Mask Dances' },
      { page: 4, title: 'Paro Tshechu Spring Itinerary' }
    ]
  }
];

export const seedGallery = [
  {
    title: 'Paro Taktsang (Tiger\'s Nest Monastery)',
    location: 'Paro Valley',
    category: 'monasteries',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    caption: 'Perched dramatically 900 meters above the valley floor, where Guru Rinpoche arrived on the back of a tigress.'
  },
  {
    title: 'Punakha Dzong at River Confluence',
    location: 'Punakha Valley',
    category: 'dzongs',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Palace of Great Happiness framing Jacaranda trees in spring bloom.'
  },
  {
    title: 'Masked Dancers at Tshechu Festival',
    location: 'Tashichho Dzong, Thimphu',
    category: 'festivals',
    imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sacred Cham mask dancers re-enacting victory over disharmony.'
  },
  {
    title: 'BLHT Paro Pine Sanctuary',
    location: 'Paro',
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    caption: 'Wood-burning bukhari fires and serene blue pine valley views.'
  },
  {
    title: 'Gangtey Glacial Valley',
    location: 'Phobjikha Valley',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Winter sanctuary for black-necked cranes framed by Gangtey Goemba.'
  }
];

export const seedVideos = [
  {
    title: 'Bhutan: Kingdom of Happiness - Official BLHT Film',
    duration: '04:15',
    youtubeId: 'b_P-QyGvI28',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    description: 'A visual journey through ancient fortresses, high mountain passes, and world-renowned 5-star lodges.',
    category: 'Overview'
  },
  {
    title: 'Inside Six Senses and BLHT Luxury Circuits',
    duration: '06:40',
    youtubeId: 'Xp_J3fG-uNE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore the architectural wonders of Six Senses Thimphu, Punakha, and Paro Pine Sanctuary.',
    category: 'Luxury Lodges'
  },
  {
    title: 'The Sacred Cham Dances of Paro Tshechu',
    duration: '03:50',
    youtubeId: 'gq3Z3v-mEPo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Experience the rhythm of horns, drums, and holy mask dances during Paro\'s spring celebration.',
    category: 'Festivals'
  }
];

export const seedHomepageConfig = {
  heroTitle: 'Experience the Last Shangri-La in Ultra-Luxury',
  heroSubtitle: 'Bespoke Himalayan journeys, 5-star lodge circuits, private helicopter transfers, and sacred festival clearances curated by Bhutan Luxury & Heritage Tours.',
  announcementText: 'Paro Tshechu 2026 VIP Booking Now Open - Limited VIP Pavilion Passes Available',
  announcementLink: '/festivals',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-foggy-pine-trees-in-the-mountains-41584-large.mp4',
  featuredPackagesCount: 3,
  statsHeading: 'Why Bhutan Luxury & Heritage Tours',
  stats: [
    { label: 'Certified Senior Guides', value: '100%', iconName: 'Award' },
    { label: 'GNH Sustainable Carbon Negative', value: '100%', iconName: 'Shield' },
    { label: 'Luxury Lodge Partnerships', value: 'Six Senses / COMO / BLHT', iconName: 'Star' },
    { label: 'Years of Bespoke Curation', value: '18+ Years', iconName: 'Calendar' }
  ]
};
