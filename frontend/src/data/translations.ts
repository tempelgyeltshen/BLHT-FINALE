import { TourPackage, Hotel, Festival, Brochure } from '../types';

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.packages': 'Tour Packages',
    'nav.hotels': 'Luxury Lodges',
    'nav.festivals': 'Festivals',
    'nav.brochures': 'E-Brochure',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.planJourney': 'Plan Journey',
    'nav.bookTour': 'Book Tour',
    'nav.searchPlaceholder': 'Search packages, lodges, festivals...',
    'nav.selectLanguage': 'Select Portal Language',
    'nav.portalLanguage': 'Portal Language',

    'hero.license': 'TOUR OPERATOR LICENSE #BLHT-8842',
    'hero.title': 'Bhutan Land Of Happiness Tourism',
    'hero.subtitle': 'Immerse yourself in the world’s first carbon-negative Kingdom. Guided by the Gross National Happiness philosophy, we orchestrate bespoke journeys across Bhutan’s sacred valleys, 5-star sanctuaries, and authentic cultural celebrations.',
    'hero.circuits': 'Bespoke Circuits & Experiences',
    'hero.discoverItineraries': 'Discover our curated itineraries across Paro, Thimphu, Punakha, Gangtey, and Bumthang. Plan your journey with Bhutan Land Of Happiness Tourism for an unmatched spiritual and cultural renewal.',

    'home.circuit1Title': 'The Himalayan Kingdom Circuit',
    'home.circuit1Desc': 'Traverse Paro, Thimphu, Punakha, Gangtey, and Bumthang across iconic 5-star sanctuary suites with private monastic blessings and helicopter transfers.',
    'home.circuit2Title': 'Sacred Mask Dances & Tshechus 2026',
    'home.circuit2Desc': 'VIP pavilion seating at Paro and Thimphu Tshechu festivals with custom silk Gho and Kira attire tailoring and private lama guided tours.',
    'home.serviceTitle': 'Bhutan Land Of Happiness Travel Service',
    'home.serviceDesc': 'Traveling to the Kingdom is effortless with direct flight coordination via Drukair and Bhutan Airlines from Bangkok, Singapore, and New Delhi. Bhutan Land Of Happiness Tourism handles all visa processing, flight tickets, and personal concierge services.',
    'home.sanctuaries': '5-Star Sanctuaries',
    'home.exploreItineraries': 'Explore Bespoke Itineraries',
    'home.festivalsTitle': 'Cultural Celebrations',
    'home.brochureTitle': 'Official E-Brochure & Travel Manual',

    'luxury.badge': '5-Star Six Senses & BLHT Circuits',
    'luxury.title': 'Luxury Tour Collection',
    'luxury.subtitle': 'Curated journeys combining private helicopter transfers, personal butler service, private monastic blessings, and world-renowned 5-star lodge suites across Bhutan’s pristine valleys.',
    'luxury.readBrochure': 'Read Official Luxury PDF Brochure',
    'luxury.filterDuration': 'Filter Duration:',
    'luxury.allDurations': 'All Durations',
    'luxury.shortDuration': '1 - 7 Days',
    'luxury.longDuration': '8+ Days',
    'luxury.showing': 'Showing',
    'luxury.journeys': 'Ultra-Luxury Journeys',

    'modal.duration': 'Duration',
    'modal.startingTariff': 'Starting Tariff',
    'modal.valleysVisited': 'Valleys Visited',
    'modal.officialPdf': 'Official PDF Guide',
    'modal.viewPdf': 'View Brochure PDF',
    'modal.tabItinerary': 'Detailed Itinerary',
    'modal.tabHighlights': 'Highlights & Experience',
    'modal.tabInclusions': 'Inclusions & Luxury Services',
    'modal.includedInTariff': 'What is Included in Tariff',
    'modal.excludedInTariff': 'Not Included',
    'modal.day': 'Day',
    'modal.accommodation': 'Accommodation',
    'modal.meals': 'Meals & Dining',
    'modal.bookCustom': 'Book / Custom Proposal',

    'button.explore': 'Explore Packages',
    'button.planCustom': 'Plan Your Journey',
    'button.bookNow': 'Book Tour Now',
    'button.viewDetails': 'More Details & Itinerary',
    'button.downloadBrochure': 'Download Brochure',
    'button.close': 'Close',
    'button.submit': 'Submit Request',
    'button.filter': 'Filter',

    'footer.quickLinks': 'Quick Links',
    'footer.contactUs': 'Contact Us',
    'footer.approved': 'Govt Approved Tour Operator',
    'footer.copyright': '© 2026 Bhutan Land of Happiness Tours. All rights reserved.',
  },

  de: {
    'nav.home': 'Startseite',
    'nav.packages': 'Reiseangebote',
    'nav.hotels': 'Luxus-Lodges',
    'nav.festivals': 'Festivals',
    'nav.brochures': 'E-Broschüre',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.planJourney': 'Reise planen',
    'nav.bookTour': 'Tour buchen',
    'nav.searchPlaceholder': 'Angebote, Lodges, Feste suchen...',
    'nav.selectLanguage': 'Sprache auswählen',
    'nav.portalLanguage': 'Sprache',

    'hero.license': 'LIZENZ DER KÖNIGLICHEN REISEAGENTUR #BLHT-8842',
    'hero.title': 'Bhutan Land des Glücks Tourismus',
    'hero.subtitle': 'Tauchen Sie ein in das erste kohlenstoffnegative Königreich der Welt. Geführt von der Philosophie des Bruttonationalglücks organisieren wir maßgeschneiderte Reisen durch die heiligen Täler Bhutans, 5-Sterne-Sanctuaries und authentische Kulturfeste.',
    'hero.circuits': 'Maßgeschneiderte Routen & Erlebnisse',
    'hero.discoverItineraries': 'Entdecken Sie unsere kuratierten Reiserouten durch Paro, Thimphu, Punakha, Gangtey und Bumthang. Planen Sie Ihre Reise für eine unvergleichliche spirituelle und kulturelle Erneuerung.',

    'home.circuit1Title': 'Die Himalaja-Königreich-Route',
    'home.circuit1Desc': 'Durchqueren Sie Paro, Thimphu, Punakha, Gangtey und Bumthang in ikonischen 5-Sterne-Suiten mit privaten Klostersegnungen und Helikopter-Transfers.',
    'home.circuit2Title': 'Heilige Maskentänze & Tshechus 2026',
    'home.circuit2Desc': 'VIP-Sitzplätze im königlichen Pavillon bei den Tshechu-Festivals in Paro und Thimphu mit maßgeschneiderter Gho- und Kira-Kleidung sowie privaten Lama-Führungen.',
    'home.serviceTitle': 'Bhutan Land des Glücks Reiseservice',
    'home.serviceDesc': 'Reisen ins Königreich ist mühelos mit direkter Flugkoordination via Drukair und Bhutan Airlines von Bangkok, Singapur und Neu-Delhi. Wir kümmern uns um Visum, Flugtickets und persönlichen Concierge-Service.',
    'home.sanctuaries': '5-Sterne-Lodges & Sanctuaries',
    'home.exploreItineraries': 'Maßgeschneiderte Routen entdecken',
    'home.festivalsTitle': 'Königliche Kulturfeste',
    'home.brochureTitle': 'Offizielle E-Broschüre & Reisehandbuch',

    'luxury.badge': '5-Sterne Six Senses & BLHT Routen',
    'luxury.title': 'Königliche Luxusreise-Kollektion',
    'luxury.subtitle': 'Kuratierte Reisen mit privaten Hubschrauber-Transfers, persönlichem Butler-Service, klösterlichen Segnungen und weltrenommierten 5-Sterne-Lodges.',
    'luxury.readBrochure': 'Offizielle Luxus-PDF-Broschüre lesen',
    'luxury.filterDuration': 'Dauer filtern:',
    'luxury.allDurations': 'Alle Reisedauern',
    'luxury.shortDuration': '1 - 7 Tage',
    'luxury.longDuration': '8+ Tage',
    'luxury.showing': 'Anzeige von',
    'luxury.journeys': 'Ultra-Luxusreisen',

    'modal.duration': 'Reisedauer',
    'modal.startingTariff': 'Starttarif',
    'modal.valleysVisited': 'Besuchte Täler',
    'modal.officialPdf': 'Offizieller PDF-Leitfaden',
    'modal.viewPdf': 'Broschüre als PDF ansehen',
    'modal.tabItinerary': 'Detaillierter Reiseverlauf',
    'modal.tabHighlights': 'Highlights & Erlebnisse',
    'modal.tabInclusions': 'Inklusivleistungen & Luxusservices',
    'modal.includedInTariff': 'Im Tarif enthaltene Leistungen',
    'modal.excludedInTariff': 'Nicht enthalten',
    'modal.day': 'Tag',
    'modal.accommodation': 'Unterkunft',
    'modal.meals': 'Verpflegung & Kulinarik',
    'modal.bookCustom': 'Tour Buchen / Angebot anfordern',

    'button.explore': 'Angebote entdecken',
    'button.planCustom': 'Reise planen',
    'button.bookNow': 'Tour jetzt buchen',
    'button.viewDetails': 'Mehr Details & Reiseverlauf',
    'button.downloadBrochure': 'Broschüre herunterladen',
    'button.close': 'Schließen',
    'button.submit': 'Anfrage senden',
    'button.filter': 'Filtern',

    'footer.quickLinks': 'Quicklinks',
    'footer.contactUs': 'Kontaktieren Sie uns',
    'footer.approved': 'Vom Königlichen Reiseamt zugelassener Veranstalter',
    'footer.copyright': '© 2026 Bhutan Land of Happiness Tours. Alle Rechte vorbehalten.',
  },

  dz: {
    'nav.home': 'གཙོ་ངོས།',
    'nav.packages': 'ལྟ་སྐོར་ལས་རིམ།',
    'nav.hotels': ' Luxury མགྲོན་ཁང་།',
    'nav.festivals': 'ཚེས་བཅུ།',
    'nav.brochures': 'གནས་བཤད་དེབ་ཆུང་།',
    'nav.about': 'ང་བཅས་ཀྱི་ཡིག་ཚང་།',
    'nav.contact': 'ཁ་པར་དང་ཡིག་འཕྲིན།',
    'nav.planJourney': 'ལམ་སྟོན་བཟོ་བ།',
    'nav.bookTour': 'མངགས་ཆ་བཟོ་བ།',
    'nav.searchPlaceholder': 'འཚོལ་བ།...',
    'nav.selectLanguage': 'སྐད་ཡིག་གདམ་ཁ།',
    'nav.portalLanguage': 'སྐད་ཡིག',

    'hero.license': 'གཞུང་འབྲེལ་ལྟ་སྐོར་ལས་བྱེད་ཆོག་ཐམས་ #BLHT-8842',
    'hero.title': 'འབྲུག་སྐྱིད་པའི་གླིང་ལྟ་སྐོར་ལས་སྡེ།',
    'hero.subtitle': 'རྒྱལ་ཡོངས་དགའ་སྐྱིད་དཔལ་ཛོངས་ཀྱི་ལམ་སྟོན་ཐོག་ལས་ འབྲུག་རྒྱལ་ཁབ་ནང་ དམིགས་བསལ་ལྟ་སྐོར་དང་ མགྲོན་ཁང་ ཚེས་བཅུ་ལས་རིམ།',
    'hero.circuits': 'དམིགས་བསལ་ལྟ་སྐོར་ལས་རིམ།',
    'hero.discoverItineraries': 'སྤ་རོ་ ཐིམ་ཕུག་ སྤུ་ན་ཁ་ སྒང་སྟེང་ བུམ་ཐང་ ལུང་པའི་ལྟ་སྐོར་ལས་རིམ།',

    'home.circuit1Title': 'ཧི་མ་ལ་ཡའི་རྒྱལ་ཁབ་ལྟ་སྐོར།',
    'home.circuit1Desc': 'སྤ་རོ་ ཐིམ་ཕུག་ སྤུ་ན་ཁ་ སྒང་སྟེང་ བུམ་ཐང་ སྐྱིད་པའི་མགྲོན་ཁང་དང་ ཧེ་ལི་ཀོབ་ཊར་ལྟ་སྐོར།',
    'home.circuit2Title': 'དད་ལྡན་ཚེས་བཅུ་དང་འཆམ་ ༢༠༢༦',
    'home.circuit2Desc': 'སྤ་རོ་དང་ཐིམ་ཕུག་ཚེས་བཅུའི་ VIP བཞུགས་གྲལ་དང་ བགོ་ལ་གྱོན་ནི་ བླ་མའི་ལམ་སྟོན།',
    'home.serviceTitle': 'འབྲུག་སྐྱིད་པའི་གླིང་ སྐྱེལ་འདྲེན་ཞབས་ཏོག',
    'home.serviceDesc': 'འབྲུག་མཁའ་འགྲུལ་དང་ འབྲུག་ཡུལ་མཁའ་འགྲུལ་ གནམ་གྲུའི་ཊི་ཀེཊ་ མཐོང་མཆན་  concierge ཞབས་ཏོག',
    'home.sanctuaries': 'སྐྱིད་པའི་མགྲོན་ཁང་།',
    'home.exploreItineraries': 'ལས་རིམ་གདམ་ཁ།',
    'home.festivalsTitle': 'རྒྱལ་ཡོངས་ཚེས་བཅུ།',
    'home.brochureTitle': 'གཞུང་འབྲེལ་དེབ་ཆུང་།',

    'luxury.badge': '5-Star Six Senses & BLHT',
    'luxury.title': 'རྒྱལ་པོའི་མཆོག་གྱུར་ལྟ་སྐོར།',
    'luxury.subtitle': 'ཧེ་ལི་ཀོབ་ཊར་དང་ སྐུ་སྲུང་ བླ་མའི་བྱིན་རླབས་ 5-Star མགྲོན་ཁང་།',
    'luxury.readBrochure': 'དེབ་ཆུང་ཕབ་ལེན།',
    'luxury.filterDuration': 'ཉིན་གྲངས་གདམ་ཁ།:',
    'luxury.allDurations': 'ཆང་མ།',
    'luxury.shortDuration': 'ཉིནམ་ ༡ - ༧',
    'luxury.longDuration': 'ཉིནམ་ ༨+',
    'luxury.showing': 'སྟོན་དོ།',
    'luxury.journeys': 'མཆོག་གྱུར་ལྟ་སྐོར།',

    'modal.duration': 'ཉིན་གྲངས།',
    'modal.startingTariff': 'གོང་ཚད།',
    'modal.valleysVisited': 'ལུང་པ།',
    'modal.officialPdf': 'PDF དེབ་ཆུང་།',
    'modal.viewPdf': 'PDF ལྟ་བ།',
    'modal.tabItinerary': 'ཉིན་རེའི་ལས་རིམ།',
    'modal.tabHighlights': 'གཙོ་བོའི་ལས་རིམ།',
    'modal.tabInclusions': 'ཚུད་ཡོད་པའི་ཞབས་ཏོག',
    'modal.includedInTariff': 'གོང་ཚད་ནང་ཚུད་ཡོད་པ།',
    'modal.excludedInTariff': 'མ་ཚུད་པ།',
    'modal.day': 'ཉིནམ།',
    'modal.accommodation': 'བཞུགས་སྡེབ།',
    'modal.meals': 'བཞེས་སྒོ།',
    'modal.bookCustom': 'མངགས་ཆ་བཟོ་བ།',

    'button.explore': 'ལས་རིམ་ལྟ་བ།',
    'button.planCustom': 'ལམ་སྟོན་བཟོ་བ།',
    'button.bookNow': 'ད་ལྟོ་མངགས་ཆ་བཟོ་བ།',
    'button.viewDetails': 'ཞིབ་ཕྲ་ལྟ་བ།',
    'button.downloadBrochure': 'དེབ་ཆུང་ཕབ་ལེན།',
    'button.close': 'ཁ་བསྡམས།',
    'button.submit': 'ཕུལ།',
    'button.filter': 'གདམ་ཁ།',

    'footer.quickLinks': 'མགྱོགས་ལིངྐ།',
    'footer.contactUs': 'འབྲེལ་བ་འཐབ་ས།',
    'footer.approved': 'གཞུང་འབྲེལ་ངོས་ལེན་ཡོད་པའི་ལྟ་སྐོར་ལས་སྡེ།',
    'footer.copyright': '© ༢༠༢༦ འབྲུག་སྐྱིད་པའི་གླིང་ལྟ་སྐོར་ལས་སྡེ།',
  },

  fr: {
    'nav.home': 'Accueil',
    'nav.packages': 'Circuits',
    'nav.hotels': 'Lodges de Luxe',
    'nav.festivals': 'Festivals',
    'nav.brochures': 'Brochure',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.planJourney': 'Planifier',
    'nav.bookTour': 'Réserver',
    'nav.searchPlaceholder': 'Rechercher circuits, lodges, festivals...',
    'nav.selectLanguage': 'Choisir la langue',
    'nav.portalLanguage': 'Langue',

    'hero.license': 'LICENCE D\'OPÉRATEUR DE TOURISME #BLHT-8842',
    'hero.title': 'Bhoutan Terre de Bonheur Tourisme',
    'hero.subtitle': 'Immergez-vous dans le premier Royaume à bilan carbone négatif au monde. Guidés par la philosophie du Bonheur National Brut, nous orchestrons des voyages sur mesure à travers les vallées sacrées du Bhoutan.',
    'hero.circuits': 'Circuits & Expériences Sur Mesure',
    'hero.discoverItineraries': 'Découvrez nos itinéraires organisés à Paro, Thimphu, Punakha, Gangtey et Bumthang. Planifiez votre voyage pour un renouveau spirituel et culturel inégalé.',

    'home.circuit1Title': 'Le Circuit du Royaume Himalayen',
    'home.circuit1Desc': 'Traversez Paro, Thimphu, Punakha, Gangtey et Bumthang dans des suites 5 étoiles avec bénédictions monastiques privées et transferts en hélicoptère.',
    'home.circuit2Title': 'Danses Masquées Sacrées & Tshechus 2026',
    'home.circuit2Desc': 'Places VIP au pavillon des festivals Tshechu de Paro et Thimphu avec tenues sur mesure Gho et Kira et visites guidées privées par des lamas.',
    'home.serviceTitle': 'Service de Voyage Bhoutan Terre de Bonheur',
    'home.serviceDesc': 'Voyager dans le Royaume est simple avec la coordination directe des vols Drukair et Bhutan Airlines depuis Bangkok, Singapour et New Delhi.',
    'home.sanctuaries': 'Sanctuaires 5 Étoiles',
    'home.exploreItineraries': 'Explorer les Itinéraires',
    'home.festivalsTitle': 'Célébrations Culturelles',
    'home.brochureTitle': 'Brochure Officielle & Manuel de Voyage',

    'luxury.badge': 'Circuits 5 Étoiles Six Senses & BLHT',
    'luxury.title': 'Collection de Voyages de Luxe',
    'luxury.subtitle': 'Des voyages organisés combinant transferts privés en hélicoptère, service de majordome personnel et bénédictions privées dans des lodges 5 étoiles.',
    'luxury.readBrochure': 'Lire la Brochure de Luxe Officielle',
    'luxury.filterDuration': 'Filtrer par durée :',
    'luxury.allDurations': 'Toutes les durées',
    'luxury.shortDuration': '1 - 7 Jours',
    'luxury.longDuration': '8+ Jours',
    'luxury.showing': 'Affichage de',
    'luxury.journeys': 'Voyages d\'Ultra-Luxe',

    'modal.duration': 'Durée',
    'modal.startingTariff': 'Tarif de départ',
    'modal.valleysVisited': 'Vallées visitées',
    'modal.officialPdf': 'Guide PDF Officiel',
    'modal.viewPdf': 'Voir la brochure PDF',
    'modal.tabItinerary': 'Itinéraire Détaillé',
    'modal.tabHighlights': 'Points Forts & Expérience',
    'modal.tabInclusions': 'Inclusions & Services de Luxe',
    'modal.includedInTariff': 'Inclus dans le tarif',
    'modal.excludedInTariff': 'Non inclus',
    'modal.day': 'Jour',
    'modal.accommodation': 'Hébergement',
    'modal.meals': 'Repas & Gastronomie',
    'modal.bookCustom': 'Réserver / Proposition Sur Mesure',

    'button.explore': 'Explorer les circuits',
    'button.planCustom': 'Planifier votre voyage',
    'button.bookNow': 'Réserver maintenant',
    'button.viewDetails': 'Plus de détails & itinéraire',
    'button.downloadBrochure': 'Télécharger la brochure',
    'button.close': 'Fermer',
    'button.submit': 'Envoyer la demande',
    'button.filter': 'Filtrer',

    'footer.quickLinks': 'Liens rapides',
    'footer.contactUs': 'Contactez-nous',
    'footer.approved': 'Opérateur agréé par le Gouvernement',
    'footer.copyright': '© 2026 Bhutan Land of Happiness Tours. Tous droits réservés.',
  },

  ja: {
    'nav.home': 'ホーム',
    'nav.packages': 'ツアーパッケージ',
    'nav.hotels': '高級ロッジ',
    'nav.festivals': 'お祭り・ツェチュ',
    'nav.brochures': '電子パンフレット',
    'nav.about': '会社概要',
    'nav.contact': 'お問い合わせ',
    'nav.planJourney': '旅を計画する',
    'nav.bookTour': 'ツアー予約',
    'nav.searchPlaceholder': 'パッケージ、ロッジ、お祭りを検索...',
    'nav.selectLanguage': '言語を選択',
    'nav.portalLanguage': '言語設定',

    'hero.license': 'ブータン王室政府公認ライセンス #BLHT-8842',
    'hero.title': 'ブータン・ランド・オブ・ハピネス・ツーリズム',
    'hero.subtitle': '世界初のカーボンネガティブ国ブータンへ。国民総幸福量（GNH）の理念に基づき、聖なる谷、5つ星ロッジ、伝統的な祭りを巡るオーダーメイドの旅をご提供します。',
    'hero.circuits': 'オーダーメイドの旅＆体験',
    'hero.discoverItineraries': 'パロ、ティンプー、プナカ、ガンテ、ブムタンを巡る厳選旅日程。ブータン・ランド・オブ・ハピネスで特別な精神的・文化的再生を。',

    'home.circuit1Title': 'ヒマラヤ王国周遊サーキット',
    'home.circuit1Desc': 'ヘリコプター移動や高僧による私的祈祷とともに、パロ、ティンプー、プナカ、ガンテ、ブムタンの最高級5つ星ロッジに滞在。',
    'home.circuit2Title': '神聖な仮面舞踊とツェチュ祭 2026',
    'home.circuit2Desc': 'パロおよびティンプーのツェチュ祭にて、王室パビリオンVIP席、オーダーメイドのゴとキラ着用、ラマ僧による特別ガイドツアーをご用意。',
    'home.serviceTitle': 'ブータン・ランド・オブ・ハピネス・トラベルサービス',
    'home.serviceDesc': 'バンコク、シンガポール、ニューデリーからのドゥルック航空およびブータンエアラインズの直行便手配、ビザ申請、フライト手配、コンシェルジュサービスを一元対応。',
    'home.sanctuaries': '5つ星ロッジ＆サンクチュアリ',
    'home.exploreItineraries': '厳選パッケージを見る',
    'home.festivalsTitle': '王室・伝統文化のお祭り',
    'home.brochureTitle': '公式電子パンフレット＆旅行マニュアル',

    'luxury.badge': '5つ星シックスセンシズ＆BLHTサーキット',
    'luxury.title': 'ロイヤルラグジュアリーツアーコレクション',
    'luxury.subtitle': '専用ヘリコプター移動、専属バトラー、私的祈祷、世界最高峰の5つ星ロッジを組み合わせた最高級ツアーコレクション。',
    'luxury.readBrochure': '公式ラグジュアリーパンフレット（PDF）を見る',
    'luxury.filterDuration': '日数で絞り込み:',
    'luxury.allDurations': '全期間',
    'luxury.shortDuration': '1〜7日間',
    'luxury.longDuration': '8日間以上',
    'luxury.showing': '表示中:',
    'luxury.journeys': 'ウルトララグジュアリーの旅',

    'modal.duration': '所要日数',
    'modal.startingTariff': '基本料金',
    'modal.valleysVisited': '訪問する谷',
    'modal.officialPdf': '公式PDFガイド',
    'modal.viewPdf': 'パンフレットPDFを見る',
    'modal.tabItinerary': '旅日程（詳細）',
    'modal.tabHighlights': 'ハイライト＆体験',
    'modal.tabInclusions': '含まれるサービス＆特典',
    'modal.includedInTariff': '旅行代金に含まれるもの',
    'modal.excludedInTariff': '代金に含まれないもの',
    'modal.day': '日目',
    'modal.accommodation': '宿泊施設',
    'modal.meals': 'お食事',
    'modal.bookCustom': 'ツアー予約・カスタム見積もり',

    'button.explore': 'パッケージを見る',
    'button.planCustom': '旅を計画する',
    'button.bookNow': '今すぐツアーを予約',
    'button.viewDetails': '詳細と日程を見る',
    'button.downloadBrochure': 'パンフレットをダウンロード',
    'button.close': '閉じる',
    'button.submit': 'リクエストを送信',
    'button.filter': '絞り込み',

    'footer.quickLinks': 'クイックリンク',
    'footer.contactUs': 'お問い合わせ',
    'footer.approved': 'ブータン王室政府公認ツアーオペレーター',
    'footer.copyright': '© 2026 Bhutan Land of Happiness Tours. All rights reserved.',
  },

  es: {
    'nav.home': 'Inicio',
    'nav.packages': 'Paquetes Turísticos',
    'nav.hotels': 'Lodges de Lujo',
    'nav.festivals': 'Festivales',
    'nav.brochures': 'Folleto Digital',
    'nav.about': 'Sobre Nosotros',
    'nav.contact': 'Contacto',
    'nav.planJourney': 'Planificar Viaje',
    'nav.bookTour': 'Reservar Tour',
    'nav.searchPlaceholder': 'Buscar paquetes, lodges, festivales...',
    'nav.selectLanguage': 'Seleccionar Idioma',
    'nav.portalLanguage': 'Idioma del Portal',

    'hero.license': 'LICENCIA REAL DE OPERADOR TURÍSTICO #BLHT-8842',
    'hero.title': 'Turismo Bután Tierra de Felicidad',
    'hero.subtitle': 'Sumérjase en el primer Reino con huella de carbono negativa del mundo. Guiados por la filosofía de la Felicidad Nacional Bruta, diseñamos viajes a medida por los valles sagrados de Bután.',
    'hero.circuits': 'Circuitos & Experiencias A Medida',
    'hero.discoverItineraries': 'Descubra nuestros itinerarios seleccionados por Paro, Thimphu, Punakha, Gangtey y Bumthang para una renovación espiritual y cultural incomparable.',

    'home.circuit1Title': 'El Circuito del Reino del Himalaya',
    'home.circuit1Desc': 'Recorra Paro, Thimphu, Punakha, Gangtey y Bumthang en suites de lujo de 5 estrellas con bendiciones monásticas privadas y traslados en helicóptero.',
    'home.circuit2Title': 'Danzas de Máscaras Sagradas & Tshechus 2026',
    'home.circuit2Desc': 'Asientos VIP en el pabellón real en los festivales Tshechu de Paro y Thimphu con trajes de seda Gho y Kira a medida y tours guiados por lamas.',
    'home.serviceTitle': 'Servicio de Viajes Bután Tierra de Felicidad',
    'home.serviceDesc': 'Viajar al Reino es sencillo con la coordinación directa de vuelos a través de Drukair y Bhutan Airlines desde Bangkok, Singapur y Nueva Delhi.',
    'home.sanctuaries': 'Santuarios de 5 Estrellas',
    'home.exploreItineraries': 'Explorar Itinerarios',
    'home.festivalsTitle': 'Celebraciones Culturales Reales',
    'home.brochureTitle': 'Folleto Digital Oficial & Manual',

    'luxury.badge': 'Circuitos de 5 Estrellas Six Senses & BLHT',
    'luxury.title': 'Colección Real de Tours de Lujo',
    'luxury.subtitle': 'Viajes diseñados que combinan traslados privados en helicóptero, servicio de mayordomo personal y bendiciones monásticas en lodges de 5 estrellas.',
    'luxury.readBrochure': 'Leer Folleto Oficial de Lujo en PDF',
    'luxury.filterDuration': 'Filtrar por duración:',
    'luxury.allDurations': 'Todas las duraciones',
    'luxury.shortDuration': '1 - 7 Días',
    'luxury.longDuration': '8+ Días',
    'luxury.showing': 'Mostrando',
    'luxury.journeys': 'Viajes de Ultra Lujo',

    'modal.duration': 'Duración',
    'modal.startingTariff': 'Tarifa desde',
    'modal.valleysVisited': 'Valles visitados',
    'modal.officialPdf': 'Guía Oficial en PDF',
    'modal.viewPdf': 'Ver Folleto PDF',
    'modal.tabItinerary': 'Itinerario Detallado',
    'modal.tabHighlights': 'Puntos Destacados & Experiencia',
    'modal.tabInclusions': 'Inclusiones & Servicios de Lujo',
    'modal.includedInTariff': 'Incluido en la tarifa',
    'modal.excludedInTariff': 'No incluido',
    'modal.day': 'Día',
    'modal.accommodation': 'Alojamiento',
    'modal.meals': 'Comidas & Gastronomía',
    'modal.bookCustom': 'Reservar / Propuesta Personalizada',

    'button.explore': 'Explorar Paquetes',
    'button.planCustom': 'Planificar Su Viaje',
    'button.bookNow': 'Reservar Tour Ahora',
    'button.viewDetails': 'Más Detalles e Itinerario',
    'button.downloadBrochure': 'Descargar Folleto',
    'button.close': 'Cerrar',
    'button.submit': 'Enviar Solicitud',
    'button.filter': 'Filtrar',

    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.contactUs': 'Contáctenos',
    'footer.approved': 'Operador Aprobado por el Gobierno Real',
    'footer.copyright': '© 2026 Bhutan Land of Happiness Tours. Todos los derechos reservados.',
  },

  zh: {
    'nav.home': '首页',
    'nav.packages': '旅游套餐',
    'nav.hotels': '奢华酒店',
    'nav.festivals': '不丹节庆',
    'nav.brochures': '电子手册',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.planJourney': '规划行程',
    'nav.bookTour': '预订行程',
    'nav.searchPlaceholder': '搜索套餐、酒店、节庆...',
    'nav.selectLanguage': '选择语言',
    'nav.portalLanguage': '语言设置',

    'hero.license': '不丹皇家政府认证许可证 #BLHT-8842',
    'hero.title': '不丹幸福之地旅游公司',
    'hero.subtitle': '走进全球首个负碳排放王国。在国民幸福总值（GNH）理念指导下，为您量身定制穿行于神圣山谷、五星级奢华酒店与传统节庆的尊享之旅。',
    'hero.circuits': '定制线路与精选体验',
    'hero.discoverItineraries': '探索我们为您精心策划的帕罗、廷布、普那卡、冈提与布姆唐行程，开启一段心灵与文化的非凡焕新之旅。',

    'home.circuit1Title': '喜马拉雅王国环线',
    'home.circuit1Desc': '搭乘私人直升机，入住标志性五星级奢华酒店，尊享高僧私享祈福，贯穿帕罗、廷布、普那卡、冈提与布姆唐。',
    'home.circuit2Title': '神圣面具舞与2026不丹节庆',
    'home.circuit2Desc': '尊享帕罗与廷布戒楚节皇家看台VIP席位，量身定制传统国服Gho与Kira，高僧全程陪同讲解。',
    'home.serviceTitle': '不丹幸福之地出行服务',
    'home.serviceDesc': '从曼谷、新加坡和新德里乘不丹皇家航空直飞，我们全权负责签证办理、机票预订与私人管家随行服务。',
    'home.sanctuaries': '五星级奢华酒店',
    'home.exploreItineraries': '探索精选套餐',
    'home.festivalsTitle': '皇家文化盛典',
    'home.brochureTitle': '官方电子手册与旅行指南',

    'luxury.badge': '六善与BLHT五星级尊享环线',
    'luxury.title': '皇家奢华旅行系列',
    'luxury.subtitle': '融合私人直升机接送、私人管家服务、寺庙祈福与世界顶级五星级酒店的定制之旅。',
    'luxury.readBrochure': '阅读官方奢华PDF手册',
    'luxury.filterDuration': '按天数筛选：',
    'luxury.allDurations': '全部天数',
    'luxury.shortDuration': '1 - 7 天',
    'luxury.longDuration': '8天以上',
    'luxury.showing': '正在显示',
    'luxury.journeys': '奢华之旅套餐',

    'modal.duration': '行程天数',
    'modal.startingTariff': '起拍费用',
    'modal.valleysVisited': '途经山谷',
    'modal.officialPdf': '官方PDF指南',
    'modal.viewPdf': '查看手册PDF',
    'modal.tabItinerary': '详细每日行程',
    'modal.tabHighlights': '行程亮点与体验',
    'modal.tabInclusions': '费用包含与尊享服务',
    'modal.includedInTariff': '费用包含项目',
    'modal.excludedInTariff': '费用不含项目',
    'modal.day': '第',
    'modal.accommodation': '精选住宿',
    'modal.meals': '餐饮安排',
    'modal.bookCustom': '预订行程 / 索取定制方案',

    'button.explore': '探索套餐',
    'button.planCustom': '规划您的行程',
    'button.bookNow': '立即预订行程',
    'button.viewDetails': '查看详情与行程',
    'button.downloadBrochure': '下载手册',
    'button.close': '关闭',
    'button.submit': '提交申请',
    'button.filter': '筛选',

    'footer.quickLinks': '快速链接',
    'footer.contactUs': '联系我们',
    'footer.approved': '不丹政府认证旅行社',
    'footer.copyright': '© 2026 不丹幸福之地旅游公司 版权所有',
  }
};

// Map package titles & details to German and other target languages
const PACKAGE_TRANSLATIONS: Record<string, Record<string, any>> = {
  de: {
    'Kingdom in the Clouds: Ultra-Luxury Journey': {
      title: 'Königreich in den Wolken: Ultra-Luxusreise',
      subtitle: '7 Tage / 6 Nächte in Paro, Thimphu und Punakha in 5-Sterne-Luxuslodges',
      description: 'Tauchen Sie ein in das friedvollste Königreich der Welt mit privaten Hubschrauber-Transfers, persönlichem Butler-Service, privaten Segnungen durch hochrangige Lamas und exklusiven Aufenthalten in Six Senses- und BLHT-Sanctuaries.',
      highlights: [
        'Private VIP-Ankunftabwicklung am internationalen Flughafen Paro mit traditioneller Schal-Zeremonie (Khadhar)',
        'Helikoptermagischer Flug über Himalaja-Gipfel ins Punakha-Tal',
        'Private Meditation & Butterlampen-Entzündung mit dem Abt im Chimi Lhakhang',
        'Champagner-Frühstück bei Sonnenaufgang mit Blick auf Paro Taktsang (Tiger-Nest)',
        'Traditionelles Hot-Stone-Kräuterbad (Menchu) mit wilder Artemisia'
      ],
      included: [
        '5-Sterne Ultra-Luxusunterkünfte (Six Senses / BLHT Sanctuaries)',
        'Privater Geländewagen mit eigenem Reiseleiter & Butler',
        'SDF-Nachhaltigkeitsgebühren (100 USD/Nacht enthalten)',
        'Alle Gourmet-Mahlzeiten (Farm-to-Table) & feine Weinbegleitung',
        'Alle Visagebühren & Genehmigungen für Klosterbesuche'
      ]
    },
    'Sacred Tshechu Festivals & Spiritual Odyssey': {
      title: 'Heilige Tshechu-Festivals & Spirituelle Odyssee',
      subtitle: '10 Tage / 9 Nächte während der heiligen Maskentanz-Feierlichkeiten in Paro oder Thimphu',
      description: 'Erleben Sie Bhutans größte spirituelle Festspiele (Tshechus) mit reservierten Sitzplätzen im Pavillon, maßgeschneiderter Gho- & Kira-Kleidung und Begegnungen mit den Mönchstänzern.',
      highlights: [
        'VIP-Sitzplätze im Innenhof des Paro- oder Thimphu-Tshechu',
        'Maßgeschneiderter Gho (für Herren) oder Kira (für Damen) als Geschenk',
        'Feierliche Enthüllung des heiligen Throngdrel-Seidenbildes in der Morgendämmerung',
        'Abendessen mit einem Historiker und Kultur bewahrer',
        'Exklusive nächtliche Kloster-Gesangssession'
      ]
    },
    'Trans-Bhutan Trail & Himalayan Wilderness Expedition': {
      title: 'Trans-Bhutan Trail & Himalaja-Wildnis-Expedition',
      subtitle: '12 Tage / 11 Nächte Heli-Trekking, Hochgebirgspässe & abgelegene Täler',
      description: 'Wandern Sie auf restaurierten Abschnitten des alten Trans-Bhutan Trails, der seit Jahrhunderten Festungen verbindet. Genießen Sie Luxus-Glamping, Mountainbiking und Helikopter-Rundflüge.',
      highlights: [
        'Privater Hubschrauberflug über die Eisfelder des Berges Jomolhari',
        'Luxus-Glamping in der Wildnis mit beheizten Betten und persönlichem Koch',
        'Mountainbiking vom Chele-La-Pass (3.988m) hinab ins Tal',
        'Wildwasser-Rafting auf dem Pho Chhu Fluss vorbei am Punakha Dzong'
      ]
    },
    'Bumthang Valley Sacred Heartland & Wellness Sanctuary': {
      title: 'Bumthang-Tal: Heiliges Herzland & Wellness-Sanctuary',
      subtitle: '9 Tage / 8 Nächte in Ost-Bhutans Tal der Klöster & Kräuterbäder',
      description: 'Reisen Sie nach Bumthang, dem spirituellen Zentrum Bhutans, wo Guru Rinpoche heilige Körperabdrücke hinterließ. Erleben Sie ganzheitliche buddhistische Meditation, Kräuterheilkunde und unberührte Kiefernwälder.',
      highlights: [
        'Private Meditationssitzungen in der Kurjey Lhakhang Höhle',
        'Verkostung von Bio-Buchweizenhonig & handwerklichem Käse in Jakar',
        'Heiße Steinbäder mit Himalaja-Kiefern und Wermutkraut',
        'Panorama-Inlandsflug zwischen Paro und dem Flughafen Bumthang'
      ]
    }
  },
  dz: {
    'Kingdom in the Clouds: Ultra-Luxury Journey': {
      title: 'སྤྲིན་གྱི་དཀྱིལ་གྱི་རྒྱལ་ཁབ། མཆོག་གྱུར་ལྟ་སྐོར།',
      subtitle: 'ཉིནམ་ ༧ / ཞག་ ༦ སྤ་རོ་ ཐིམ་ཕུག་ སྤུ་ན་ཁ་ 5-Star མགྲོན་ཁང་།',
      description: 'འཛམ་གླིང་ནང་གི་ཞི་བདེ་མཆོག་ཏུ་གྱུར་པའི་རྒྱལ་ཁབ་ནང་ ཧེ་ལི་ཀོབ་ཊར་དང་ སྐུ་སྲུང་ བླ་མའི་བྱིན་རླབས་ འཕྲོད་བསྟེན་སྤྲོ་གསེང་།',
      highlights: [
        'སྤ་རོ་གནམ་ཐང་ VIP ཕེབས་སྐྱེལ་དང་ ཁ་དར་ཕུལ་ནི།',
        'ཧེ་ལི་ཀོབ་ཊར་ཐོག་ལས་ སྤུ་ན་ཁ་ ལུང་པ་ལུ་ ཕེབས་ནི།',
        'ཁྱི་མེད་ལྷ་ཁང་ལུ་ སྒོམ་རྒྱག་ནི་དང་ མར་མེ་ཕུལ་ནི།',
        'སྤ་རོ་སྟག་ཚང་ལུ་ དྲོ་པའི་གསོལ་ཇ་ བཞེས་ནི།',
        'གསོ་བ་རིག་པའི་ རྡོ་ཚན་ ཁྲུས་གནང་ནི།'
      ]
    }
  },
  fr: {
    'Kingdom in the Clouds: Ultra-Luxury Journey': {
      title: 'Royaume dans les Nuages: Voyage Ultra-Luxe',
      subtitle: '7 Jours / 6 Nuits à Paro, Thimphu et Punakha dans des Lodges 5 Étoiles',
      description: 'Immergez-vous dans le Royaume le plus serein au monde avec transferts privés en hélicoptère, service de majordome personnel, bénédictions privées et séjours exclusifs.',
      highlights: [
        'Accueil VIP à l’aéroport de Paro avec cérémonie du écharpe traditionnelle (Khadhar)',
        'Vol en hélicoptère au-dessus des sommets de l’Himalaya vers la vallée de Punakha',
        'Méditation privée avec le Vénérable Abbot au temple Chimi Lhakhang',
        'Petit-déjeuner au champagne face au monastère de Paro Taktsang (Nid de la Tigresse)'
      ]
    }
  }
};

// Dynamic helper to translate any text string or return fallback
export function translateText(text: string, langCode: string): string {
  if (!text || langCode === 'en') return text;
  
  // Direct dictionary lookup
  if (TRANSLATIONS[langCode] && TRANSLATIONS[langCode][text]) {
    return TRANSLATIONS[langCode][text];
  }

  // Common pattern replacements for German
  if (langCode === 'de') {
    return text
      .replace(/Kingdom in the Clouds: Ultra-Luxury Journey/g, 'Königreich in den Wolken: Ultra-Luxusreise')
      .replace(/Bumthang Valley Sacred Heartland & Wellness Sanctuary/g, 'Bumthang-Tal: Heiliges Herzland & Wellness-Sanctuary')
      .replace(/Sacred Tshechu Festivals & Spiritual Odyssey/g, 'Heilige Tshechu-Festivals & Spirituelle Odyssee')
      .replace(/Trans-Bhutan Trail & Himalayan Wilderness Expedition/g, 'Trans-Bhutan Trail & Himalaja-Wildnis-Expedition')
      .replace(/Grand Bhutan Photography & Sacred Monasteries Tour/g, 'Große Bhutan-Fotoreise & Heilige Klöster')
      .replace(/Days \/ /g, 'Tage / ')
      .replace(/Nights across/g, 'Nächte in')
      .replace(/Nights/g, 'Nächte')
      .replace(/View Details/g, 'Details ansehen')
      .replace(/More Details & Itinerary/g, 'Mehr Details & Reiseverlauf')
      .replace(/Book Tour/g, 'Tour buchen')
      .replace(/Plan Journey/g, 'Reise planen')
      .replace(/Read Official Luxury PDF Brochure/g, 'Offizielle Luxus-PDF-Broschüre lesen')
      .replace(/Official PDF Guide/g, 'Offizieller PDF-Leitfaden')
      .replace(/Starting Tariff/g, 'Starttarif')
      .replace(/Valleys Visited/g, 'Besuchte Täler')
      .replace(/Duration/g, 'Reisedauer')
      .replace(/Included/g, 'Enthalten')
      .replace(/Excluded/g, 'Nicht enthalten')
      .replace(/Breakfast, Lunch & Dinner/g, 'Frühstück, Mittag- & Abendessen')
      .replace(/Dinner included/g, 'Abendessen enthalten')
      .replace(/Breakfast/g, 'Frühstück')
      .replace(/Dinner/g, 'Abendessen')
      .replace(/Lunch/g, 'Mittagessen');
  }

  // Common pattern replacements for Dzongkha
  if (langCode === 'dz') {
    return text
      .replace(/Kingdom in the Clouds: Ultra-Luxury Journey/g, 'སྤྲིན་གྱི་དཀྱིལ་གྱི་རྒྱལ་ཁབ། མཆོག་གྱུར་ལྟ་སྐོར།')
      .replace(/Book Tour/g, 'མངགས་ཆ་བཟོ་བ།')
      .replace(/View Details/g, 'ཞིབ་ཕྲ་ལྟ་བ།')
      .replace(/Plan Journey/g, 'ལམ་སྟོན་བཟོ་བ།');
  }

  return text;
}

export function translatePackage(pkg: TourPackage, langCode: string): TourPackage {
  if (!pkg || langCode === 'en') return pkg;

  const override = PACKAGE_TRANSLATIONS[langCode] && PACKAGE_TRANSLATIONS[langCode][pkg.title];
  if (override) {
    return {
      ...pkg,
      title: override.title || translateText(pkg.title, langCode),
      subtitle: override.subtitle || translateText(pkg.subtitle, langCode),
      description: override.description || translateText(pkg.description, langCode),
      highlights: override.highlights || pkg.highlights.map(h => translateText(h, langCode)),
      included: override.included || pkg.included.map(i => translateText(i, langCode)),
      itinerary: pkg.itinerary.map(item => ({
        ...item,
        title: translateText(item.title, langCode),
        description: translateText(item.description, langCode),
        highlights: item.highlights ? item.highlights.map(h => translateText(h, langCode)) : [],
        meals: item.meals ? translateText(item.meals, langCode) : item.meals
      }))
    };
  }

  return {
    ...pkg,
    title: translateText(pkg.title, langCode),
    subtitle: translateText(pkg.subtitle, langCode),
    description: translateText(pkg.description, langCode),
    highlights: pkg.highlights.map(h => translateText(h, langCode)),
    included: pkg.included.map(i => translateText(i, langCode)),
    itinerary: pkg.itinerary.map(item => ({
      ...item,
      title: translateText(item.title, langCode),
      description: translateText(item.description, langCode),
      highlights: item.highlights ? item.highlights.map(h => translateText(h, langCode)) : [],
      meals: item.meals ? translateText(item.meals, langCode) : item.meals
    }))
  };
}

export function translateHotel(hotel: Hotel, langCode: string): Hotel {
  if (!hotel || langCode === 'en') return hotel;
  return {
    ...hotel,
    name: translateText(hotel.name, langCode),
    tagline: translateText(hotel.tagline, langCode),
    description: translateText(hotel.description, langCode),
    amenities: hotel.amenities.map(a => translateText(a, langCode))
  };
}

export function translateFestival(festival: Festival, langCode: string): Festival {
  if (!festival || langCode === 'en') return festival;
  return {
    ...festival,
    name: translateText(festival.name, langCode),
    description: translateText(festival.description, langCode),
    significance: translateText(festival.significance, langCode)
  };
}

export function translateBrochure(brochure: Brochure, langCode: string): Brochure {
  if (!brochure || langCode === 'en') return brochure;
  return {
    ...brochure,
    title: translateText(brochure.title, langCode),
    subtitle: translateText(brochure.subtitle, langCode),
    category: translateText(brochure.category, langCode)
  };
}
