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
  { slug: 'lhamoi-dromchhen-2027', name: 'Lhamoi Dromchhen', location: 'Trongsa', dzong: 'Trongsa Dzong', dates2026: '22nd – 24th February 2026', dates2027: '11th – 13th February 2027', month: 'February', description: 'Sacred protective deity ceremony dedicated to Palden Lhamo inside the majestic courtyards of Trongsa Dzong.', significance: 'Dispels spiritual obstacles for the new year and brings peace and protection across central Bhutan.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 1 },
  { slug: 'punakha-dromchoe-2027', name: 'Punakha Dromchoe', location: 'Punakha', dzong: 'Punakha Dzong', dates2026: '24th – 26th February 2026', dates2027: '13th – 15th February 2027', month: 'February', description: 'Dramatic theatrical reenactment of the 17th-century battle against Tibetan invaders led by Zhabdrung Ngawang Namgyal.', significance: 'Features the Pazaps throwing blessed oranges into the Mo Chhu river.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: true, slNo: 2 },
  { slug: 'punakha-tshechu-2027', name: 'Punakha Tshechu', location: 'Punakha', dzong: 'Punakha Dzong', dates2026: '27th February – 1st March 2026', dates2027: '16th – 18th February 2027', month: 'February', description: 'Grand annual religious mask dance festival held inside the Palace of Great Happiness at the confluence of two sacred rivers.', significance: 'Honors Guru Rinpoche through ancient sacred Cham dances performed by the monk body.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: true, slNo: 3 },
  { slug: 'tharpaling-thongdrol-2027', name: 'Tharpaling Thongdrol', location: 'Chumi, Bumthang', dzong: 'Tharpaling Lhakhang', dates2026: '3rd March 2026', dates2027: '20th February 2027', month: 'February', description: 'One-day sacred unrolling of a giant silk Thongdrol tapestry at the hillside sanctuary of Longchen Rabjam.', significance: 'Looking upon the Throngdrel is said to liberate the viewer from negative karma.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: false, slNo: 4 },
  { slug: 'tangsibi-mani-2027', name: 'Tangsibi Mani', location: 'Ura, Bumthang', dzong: 'Tangsibi Lhakhang', dates2026: '4th – 6th March 2026', dates2027: '22nd – 24th February 2027', month: 'February', description: 'Ancient community festival with traditional chanting, fire blessings, and folk dances in rural Bumthang.', significance: 'Protects crops and livestock while invoking prosperity for rural mountain villages.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 5 },
  { slug: 'chhorten-kora-2027', name: 'Chhorten Kora Festival', location: 'Trashiyangtshe', dzong: 'Chorten Kora', dates2026: '3rd March & 19th March 2026', dates2027: '20th February & 8th March 2027', month: 'Feb / Mar', description: 'Sacred circumambulation around the magnificent white stupa modeled after Nepal Bodhnath Stupa.', significance: 'Attracts pilgrims from eastern Bhutan and Arunachal Pradesh (Dakpa community).', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 2, featured: false, slNo: 6 },
  { slug: 'gomphukora-2027', name: 'Gomphukora Festival', location: 'Trashiyangtshe', dzong: 'Gom Kora Lhakhang', dates2026: '26th – 28th March 2026', dates2027: '16th – 18th March 2027', month: 'March', description: 'Night circumambulation ritual around the sacred cave where Guru Rinpoche subdued a demon in the 8th century.', significance: 'Pilgrims circumambulate the cave all night singing courtship songs and receiving blessings.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 7 },
  { slug: 'talo-tshechu-2027', name: 'Talo Tshechu', location: 'Punakha', dzong: 'Talo Gonpa', dates2026: '26th – 28th March 2026', dates2027: '16th – 18th March 2027', month: 'March', description: 'Intimate hilltop festival famed for the graceful Mani Sum dance and classical monastic music.', significance: 'Celebrated in the ancestral home of Bhutanese queens overlooking Punakha Valley.', heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 8 },
  { slug: 'gasa-tshechu-2027', name: 'Gasa Tshechu', location: 'Gasa', dzong: 'Gasa Dzong', dates2026: '26th – 28th March 2026', dates2027: '16th – 18th March 2027', month: 'March', description: 'Remote Himalayan fortress festival attended by high-altitude Layap nomads wearing conical bamboo hats.', significance: 'Blend of sacred Cham dances and unique highlander cultural performances.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 9 },
  { slug: 'zhemgang-tshechu-2027', name: 'Zhemgang Tshechu', location: 'Zhemgang', dzong: 'Zhemgang Dzong', dates2026: '26th – 28th March 2026', dates2027: '16th – 18th March 2027', month: 'March', description: 'Southern rainforest fortress celebration with traditional mask dances and Khengpa ethnic folk art.', significance: 'Invokes protection over subtropical forests and biodiversity reserves.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 10 },
  { slug: 'paro-tshechu-2027', name: 'Paro Tshechu', location: 'Paro', dzong: 'Rinpung Dzong', dates2026: '29th March – 2nd April 2026', dates2027: '18th – 22nd March 2027', month: 'March', description: 'Bhutan’s most iconic spring festival culminating with the pre-dawn unfurling of the 350-year-old silk Throngdrel thangka.', significance: 'VIP access to sacred monk dances, silk dress tailoring, and spiritual cleansing blessings.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 5, featured: true, slNo: 11 },
  { slug: 'rhododendron-week-2027', name: 'Rhododendron Week', location: 'Merak, Trashigang', dzong: 'Shetemey, Merak', dates2027: '3rd – 9th April 2027', month: 'April', description: 'High alpine flower celebration amidst blooming wild rhododendron forests in Brokpa yak herder territory.', significance: 'Showcases nomad life, traditional felt garments, and pristine Himalayan flora.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 7, featured: false, slNo: 12 },
  { slug: 'domkhar-tshechu-2027', name: 'Domkhar Tshechu', location: 'Chumi, Bumthang', dzong: 'Domkhar Palace', dates2026: '26th – 28th April 2026', dates2027: '16th – 18th April 2027', month: 'April', description: 'Charming valley festival held at the historic royal residence of Domkhar Tashichholing.', significance: 'Features rare sacred mask dances performed exclusively by Bumthang villagers.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 13 },
  { slug: 'ura-yakchoe-2027', name: 'Ura Yakchoe', location: 'Ura, Bumthang', dzong: 'Ura Lhakhang', dates2026: '28th April – 2nd May 2026', dates2027: '18th – 22nd April 2027', month: 'April', description: 'Renowned spring festival in high Ura valley centered around the display of a holy relic brought by an old woman.', significance: 'Relic blessing and vibrant mask dances surrounded by cobblestone village houses.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 5, featured: true, slNo: 14 },
  { slug: 'rhododendron-festival-2027', name: 'Rhododendron Festival', location: 'Thimphu', dzong: 'Lamperi Botanical Park', dates2026: '13th – 14th April 2026', dates2027: '22nd – 23rd April 2027', month: 'April', description: 'Ecology and botanical celebration honoring 29 native species of wild rhododendron in full bloom.', significance: 'Nature walks, traditional music, forest food stalls, and conservation displays.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 2, featured: false, slNo: 15 },
  { slug: 'nimalung-tshechu-2027', name: 'Nimalung Tshechu', location: 'Chumi, Bumthang', dzong: 'Nimalung Dratshang', dates2026: '22nd – 24th June 2026', dates2027: '12th – 14th June 2027', month: 'June', description: 'Summer monastic gathering at Nimalung monastery featuring silk tapestry display and sacred chants.', significance: 'Promotes world peace and spiritual harmony through ancient tantric rituals.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 16 },
  { slug: 'kurjey-tshechu-2027', name: 'Kurjey Tshechu', location: 'Choekhor, Bumthang', dzong: 'Kurjey Lhakhang', dates2026: '24th June 2026', dates2027: '14th June 2027', month: 'June', description: 'Held at Guru Rinpoche’s body-imprint cave temple in Bumthang valley.', significance: 'Reenacts Guru Rinpoche subduing the demon Shelging Karpo to restore the health of King Sindhu Raja.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: true, slNo: 17 },
  { slug: 'tour-of-the-dragon-2027', name: 'Tour of the Dragon (Mountain Bike Race)', location: 'Bumthang to Thimphu', dzong: 'Himalayan Pass Circuit', dates2026: '5th September 2026', dates2027: '5th September 2027', month: 'September', description: 'One of the world’s toughest single-day ultra mountain bike races covering 268km across 4 high mountain passes.', significance: 'Celebrates endurance, Gross National Happiness, and pristine wilderness trails.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: false, slNo: 18 },
  { slug: 'thimphu-drubchen-2027', name: 'Thimphu Drubchen', location: 'Thimphu', dzong: 'Tashi Chhodzong', dates2026: '17th September 2026', dates2027: '5th October 2027', month: 'October', description: 'Pre-festival sacred dance of the deity Pelden Lhamo performed prior to the main Thimphu Tshechu.', significance: 'Instituted in the 17th century by Kuenga Gyeltshen for national protection.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: false, slNo: 19 },
  { slug: 'haa-tshechu-2027', name: 'Haa Tshechu', location: 'Haa', dzong: 'Lhakhang Karpo', dates2026: '19th – 21st September 2026', dates2027: '6th – 8th November 2027', month: 'November', description: 'Celebrated in the white temple of Haa valley featuring local highlander customs and sacred Cham.', significance: 'Invokes guardian deities Ap Chundu to safeguard the alpine frontier.', heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 20 },
  { slug: 'wangdue-tshechu-2027', name: 'Wangdue Tshechu', location: 'Wangduephodrang', dzong: 'Wangduephodrang Dzong', dates2026: '19th – 21st September 2026', dates2027: '8th – 10th October 2027', month: 'October', description: 'Historic autumn festival featuring the famous Raksha Mangcham (Dance of the Ox and Deities).', significance: 'Brings together communities across Punakha and Wangdue valleys.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 21 },
  { slug: 'tamshing-phala-chhoepa-2027', name: 'Tamshing Phala Chhoepa', location: 'Bumthang', dzong: 'Tamshing Lhakhang', dates2026: '21st – 23rd September 2026', dates2027: '10th – 12th October 2027', month: 'October', description: 'Festival founded by treasure revealer Pema Lingpa in 1501 featuring sacred dances he received in visions.', significance: 'Performs authentic Peling dances passed down unchanged for over 500 years.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 22 },
  { slug: 'thimphu-tshechu-2027', name: 'Thimphu Tshechu', location: 'Thimphu', dzong: 'Tashi Chhodzong', dates2026: '21st – 23rd September 2026', dates2027: '10th – 12th October 2027', month: 'October', description: 'Bhutan’s capital mega-festival where thousands gather in silk attires inside Tashichho Dzong courtyards.', significance: 'Features the Dance of the Black Hats and Eight Manifestations of Guru Rinpoche.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: true, slNo: 23 },
  { slug: 'gangtey-tshechu-2027', name: 'Gangtey Tshechu', location: 'Wangduephodrang', dzong: 'Gangtey Gonpa', dates2026: '24th – 26th September 2026', dates2027: '13th – 15th October 2027', month: 'October', description: 'Hilltop monastery festival in Phobjikha valley concluding with the unfurling of a grand Throngdrel thangka.', significance: 'Highlights the Nyingmapa Buddhist lineage in the winter home of black-necked cranes.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: true, slNo: 24 },
  { slug: 'jhomolhari-mountain-festival-2027', name: 'Jhomolhari Mountain Festival', location: 'Thimphu', dzong: 'Dangochong, Jhomolhari', dates2026: '14th – 15th October 2026', dates2027: '14th – 15th October 2027', month: 'October', description: 'High-altitude snow leopard and mountain conservation celebration at the base of sacred Mt. Jhomolhari.', significance: 'Nomad horse races, snow leopard conservation talks, and high-peak cultural dances.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 2, featured: false, slNo: 25 },
  { slug: 'thangbi-mewang-2027', name: 'Thangbi Mewang', location: 'Choekor, Bumthang', dzong: 'Thangbi Lhakhang', dates2026: '26th – 27th September 2026', dates2027: '15th – 16th October 2027', month: 'October', description: 'Famed Fire-Blessing festival where participants leap over twin burning archways of dry grass.', significance: 'The fire ritual purifies evil deeds and guarantees good health and bumper harvests.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 2, featured: true, slNo: 26 },
  { slug: 'pemagatshel-tshechu-2027', name: 'Pemagatshel Tshechu', location: 'Pemagatshel', dzong: 'Pemagatshel Dzong', dates2026: '18th – 21st October 2026', dates2027: '6th – 9th November 2027', month: 'November', description: 'Eastern Bhutanese festival celebrated with unique folk instruments and silk Throngdrel thangka unfurling on the final day.', significance: 'Celebrates rich eastern artisan traditions and monastic rituals.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 4, featured: false, slNo: 27 },
  { slug: 'chhukha-tshechu-2027', name: 'Chhukha Tshechu', location: 'Chhukha', dzong: 'Chhukha Dzong', dates2026: '19th – 21st October 2026', dates2027: '6th – 8th November 2027', month: 'November', description: 'Vibrant southwestern district gathering featuring sacred mask dances and cultural song competitions.', significance: 'Brings together hydroelectric valley workers and traditional farming communities.', heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 28 },
  { slug: 'dechenphu-tshechu-2027', name: 'Dechenphu Tshechu', location: 'Thimphu', dzong: 'Dechenphu Lhakhang', dates2026: '21st October 2026', dates2027: '8th November 2027', month: 'November', description: 'One-day annual festival dedicated to Gaynyen Jagpa Melen, the powerful protective deity of Thimphu valley.', significance: 'Deep local reverence with warrior dances and sacred armor offerings.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: false, slNo: 29 },
  { slug: 'jakar-tshechu-2027', name: 'Jakar Tshechu', location: 'Choekhor, Bumthang', dzong: 'Jakar Dzong', dates2026: '18th – 21st October 2026', dates2027: '6th – 9th November 2027', month: 'November', description: 'Held inside the "Fortress of the White Bird" overlooking central Bumthang valley.', significance: 'Features the dramatic Guru Tshengye (Eight Manifestations) and deity mask dances.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 4, featured: false, slNo: 30 },
  { slug: 'black-necked-crane-festival-2027', name: 'Black Necked Crane Festival', location: 'Phobjikha, Wangduephodrang', dzong: 'Gangtey Gonpa', dates2026: '11th November 2026', dates2027: '11th November 2027', month: 'November', description: 'Celebrates the arrival of endangered black-necked cranes migrating from Tibet to winter in Phobjikha valley.', significance: 'Children perform crane dance in handmade costumes alongside conservation awareness displays.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: true, slNo: 31 },
  { slug: 'jambay-lhakhang-drup-2027', name: 'Jambay Lhakhang Drup', location: 'Choekhor, Bumthang', dzong: 'Jambay Lhakhang', dates2026: '26th – 29th October 2026', dates2027: '14th – 17th November 2027', month: 'November', description: 'World-famous festival featuring the sacred midnight Tercham (Naked Dance) and Mewang (Fire Ceremony).', significance: 'Instituted in 7th century by King Songtsen Gampo to bless infertile women and purify negative energy.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 4, featured: true, slNo: 32 },
  { slug: 'prakhar-duchhoed-2027', name: 'Prakhar Duchhoed', location: 'Chumni, Bumthang', dzong: 'Prakar Lhakhang', dates2026: '27th – 29th October 2026', dates2027: '15th – 17th November 2027', month: 'November', description: 'Rural village festival honoring Pema Lingpa’s lineage in Chumi valley.', significance: 'Intimate setting with traditional songs, archers, and authentic home-brewed Ara toastings.', heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 33 },
  { slug: 'goenpai-drupchen-2027', name: 'Goenpai Drupchen', location: 'Trongsa', dzong: 'Trongsa Dzong', dates2026: '14th – 16th November 2026', dates2027: '3rd – 5th December 2027', month: 'December', description: 'Sacred winter tantric meditation and mask dance ritual held inside Trongsa Dzong.', significance: 'Protects central Bhutan’s high mountain passes during the onset of winter.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 34 },
  { slug: 'mongar-tshechu-2027', name: 'Mongar Tshechu', location: 'Mongar', dzong: 'Mongar Dzong', dates2026: '17th – 19th November 2026', dates2027: '6th – 8th December 2027', month: 'December', description: 'Eastern district festival attracting weavers and farmers from surrounding mountain villages.', significance: 'Features the sacred Dance of the Stags and Hounds alongside regional folk songs.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 35 },
  { slug: 'trashigang-tshechu-2027', name: 'Trashigang Tshechu', location: 'Trashigang', dzong: 'Trashigang Dzong', dates2026: '18th – 20th November 2026', dates2027: '7th – 9th December 2027', month: 'December', description: 'Largest festival in far eastern Bhutan perched on a cliffside fortress above Drangme Chhu river.', significance: 'Attracts Khengpas, Brokpa nomads from Merak & Sakteng, and pilgrims from eastern districts.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: true, slNo: 36 },
  { slug: 'phuntsholing-tshechu-2027', name: 'Phuntsholing Tshechu', location: 'Phuntsholing, Chhukha', dzong: 'Phuntsholing Sacred Ground', dates2026: '17th – 19th November 2026', dates2027: '6th – 8th December 2027', month: 'December', description: 'Southern border gateway festival blending Bhutanese spiritual traditions with diverse cultural audience.', significance: 'Fosters unity and harmony across southern trade corridors.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 37 },
  { slug: 'jambay-lhakhang-singye-cham-2027', name: 'Jambay Lhakhang Singye Cham', location: 'Choekhor, Bumthang', dzong: 'Jambay Lhakhang', dates2026: '24th November 2026', dates2027: '13th December 2027', month: 'December', description: 'Special Lion Dance (Singye Cham) performed at 7th-century Jambay Lhakhang.', significance: 'Invokes spiritual courage and subdues negative forces across the valley.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: false, slNo: 38 },
  { slug: 'nalakhar-tshechu-2027', name: 'Nalakhar Tshechu', location: 'Choekhor, Bumthang', dzong: 'Ngaa Lhakhang', dates2026: '24th – 26th November 2026', dates2027: '13th – 15th December 2027', month: 'December', description: 'Picturesque rural festival in Ngaa village invoking prosperity and health for winter.', significance: 'Village elders host visitors with hot meals and traditional songs.', heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 39 },
  { slug: 'druk-wangyel-tshechu-2027', name: 'Druk Wangyel Tshechu', location: 'Thimphu', dzong: 'Dochula Pass (3,100m)', dates2026: '13th December 2026', dates2027: '13th December 2027', month: 'December', description: 'Unique high-pass festival backdrop framed by 108 memorial chortens and snow-capped Himalayan peaks.', significance: 'Performed by the Royal Bhutan Army honoring military bravery and national sovereignty.', heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80', durationDays: 1, featured: true, slNo: 40 },
  { slug: 'trongsa-tshechu-2028', name: 'Trongsa Tshechu', location: 'Trongsa', dzong: 'Trongsa Dzong', dates2026: '17th – 21st December 2026', dates2027: '5th – 9th January 2028', month: 'Jan 2028', description: 'One of Bhutan’s oldest festivals held in the ancestral fortress of the Royal Wangchuck dynasty, concluding with Throngdrel unfurling.', significance: 'Unfurls a giant silk Throngdrel thangka on the 5th day at dawn.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', durationDays: 5, featured: true, slNo: 41 },
  { slug: 'lhuentse-tshechu-2028', name: 'Lhuentse Tshechu', location: 'Lhuentse', dzong: 'Lhuentse Dzong', dates2026: '17th – 21st December 2026', dates2027: '5th – 9th January 2028', month: 'Jan 2028', description: 'Sacred winter festival in northeastern Bhutan renowned for world-class Kishuthara silk weavers dressed in ancestral attire.', significance: 'Celebrates royal ancestry and intricate textile heritage with Throngdrel blessing on last day.', heroImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80', durationDays: 5, featured: false, slNo: 42 },
  { slug: 'samdrupjongkhar-tshechu-2028', name: 'Samdrupjongkhar Tshechu', location: 'Samdrupjongkhar', dzong: 'Samdrupjongkhar Fortress Ground', dates2026: '22nd – 24th December 2026', dates2027: '10th – 12th January 2028', month: 'Jan 2028', description: 'Southeastern border town celebration uniting diverse communities across eastern Bhutan.', significance: 'Sacred Cham dances and vibrant regional market stalls.', heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 43 },
  { slug: 'nabji-lhakhang-drup-2028', name: 'Nabji Lhakhang Drup', location: 'Nabji, Trongsa', dzong: 'Nabji Lhakhang', dates2026: '24th – 26th December 2026', dates2027: '12th – 14th January 2028', month: 'Jan 2028', description: 'Remote village festival in Monpa country commemorating the peace treaty mediated by Guru Rinpoche.', significance: 'Features the Fire Dance (Mewang) and Tercham (relic dance) in tranquil oak forests.', heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', durationDays: 3, featured: false, slNo: 44 }
];

export const seedBrochures = [
  {
    title: 'Thangka Painting & Sacred Art Collection 2026',
    subtitle: 'FINAL 26 Pages - Authentic traditional Bhutanese thangka masterpieces and sacred art heritage',
    category: 'Thangka Painting',
    pdfUrl: '/api/uploads/brochures/thangka-painting-brochure.pdf',
    fileSize: '17.6 MB',
    totalPages: 26,
    coverImage: '/api/uploads/images/thangka-showroom.webp',
    galleryImages: ['/api/uploads/images/thangka-showroom.webp'],
    downloadCount: 1420,
    year: '2026',
    featured: true
  },
  {
    title: 'HQ Car Rental Pamphlet',
    subtitle: 'High Quality Car Rental - official fleet pamphlet with vehicle options and rates',
    category: 'Car Rental',
    pdfUrl: '/api/uploads/brochures/car-rental-hq-pamphlet.pdf',
    fileSize: '1.0 MB',
    totalPages: 0,
    coverImage: '/api/uploads/images/carental1.jpg',
    galleryImages: ['/api/uploads/images/carental1.jpg'],
    downloadCount: 520,
    year: '2026',
    featured: false
  },
  {
    title: 'Amankora Car Rental Rate Sheet 2026',
    subtitle: 'Official 2026 rate card for Amankora guest transfers and private car hire',
    category: 'Car Rental',
    pdfUrl: '/api/uploads/brochures/car-rental-amankora-rates-2026.pdf',
    fileSize: '0.4 MB',
    totalPages: 0,
    coverImage: '/api/uploads/images/carental2.jpg',
    galleryImages: ['/api/uploads/images/carental2.jpg'],
    downloadCount: 380,
    year: '2026',
    featured: false
  },
  {
    title: 'New Car Rental Brochure',
    subtitle: 'Complete car rental guide - SUVs, Land Cruisers, buses and chauffeur services',
    category: 'Car Rental',
    pdfUrl: '/api/uploads/brochures/car-rental-new-brochure.pdf',
    fileSize: '1.3 MB',
    totalPages: 0,
    coverImage: '/api/uploads/images/carental3.jpg',
    galleryImages: ['/api/uploads/images/carental3.jpg'],
    downloadCount: 640,
    year: '2026',
    featured: false
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
    category: 'Documentary'
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
    category: 'Festivals & Culture'
  }
];

export const seedHomepageConfig = {
  heroTitle: 'Experience the Last Shangri-La in Ultra-Luxury',
  heroSubtitle: 'Bespoke Himalayan journeys, 5-star lodge circuits, private helicopter transfers, and sacred festival clearances curated by Bhutan Luxury & Heritage Tours.',
  announcementText: '',
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
