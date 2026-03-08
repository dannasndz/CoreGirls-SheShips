export type RoleModel = {
  id: string;
  name: string;
  country: string;
  field: string;
  category: "S" | "T" | "E" | "M";
  summary: string;
  linkedin?: string;
  photo: string;
  historical?: boolean;
};

export const roleModels: RoleModel[] = [
  // ═══════════════════════════════════════
  // SCIENCE (S)
  // ═══════════════════════════════════════
  {
    id: "sandra-diaz",
    name: "Sandra Díaz",
    country: "Argentina 🇦🇷",
    field: "Ecology",
    category: "S",
    summary:
      "One of the most cited environmental scientists in the world. Won the Princess of Asturias Award and was named one of Nature's 10 people who mattered in science in 2019.",
    photo: "/references/sandra-diaz.png",
  },
  {
    id: "julieta-fierro",
    name: "Julieta Fierro",
    country: "Mexico 🇲🇽",
    field: "Astrophysics",
    category: "S",
    summary:
      "Legendary Mexican astrophysicist and science communicator at UNAM. Wrote 40 books and won the UNESCO Kalinga Prize for popularizing science.",
    photo: "/references/julieta-ferro.png",
  },
  {
    id: "maria-elena-alvarez",
    name: "María Elena Álvarez-Buylla",
    country: "Mexico 🇲🇽",
    field: "Neuroscience",
    category: "S",
    summary:
      "Pioneering neuroscientist who discovered that the adult brain can generate new neurons, challenging decades of scientific belief.",
    photo: "/references/maria-elena.png",
  },
  {
    id: "ana-primavesi",
    name: "Ana Primavesi",
    country: "Brazil 🇧🇷",
    field: "Agronomy & Soil Science",
    category: "S",
    summary:
      "Pioneer of organic agriculture and agroecology in Latin America. Her work transformed sustainable farming practices across the continent.",
    photo: "/references/ana-primavesi.png",
  },
  {
    id: "natalia-gennaro",
    name: "Natalia Gennaro",
    country: "Argentina 🇦🇷",
    field: "Medicine & Regenerative Science",
    category: "S",
    summary:
      "Specialist in gynecology, longevity medicine, and regenerative medicine. Completed 3 medical degrees and 18+ master's programs. Forbes Latinas 2025.",
    photo: "/references/natalia-gennaro.png",
  },

  // ═══════════════════════════════════════
  // TECHNOLOGY (T)
  // ═══════════════════════════════════════
  {
    id: "mariana-costa-checa",
    name: "Mariana Costa Checa",
    country: "Peru 🇵🇪",
    field: "Tech Education",
    category: "T",
    summary:
      "Co-founder of Laboratoria, training thousands of Latin American women in tech. Named one of MIT Technology Review's Innovators Under 35.",
    linkedin: "https://www.linkedin.com/in/mariana-costa-checa-85876231/",
    photo: "/references/mariana-costa.png",
  },
  {
    id: "eduvigis-ortiz",
    name: "Eduvigis Ortíz",
    country: "Dominican Republic 🇩🇴",
    field: "Cybersecurity & AI",
    category: "T",
    summary:
      "Industrial engineer and Fulbright scholar. Expert in cybersecurity, big data, and AI. Founded and presides Women4Cyber Spain. Forbes Latinas 2025.",
    linkedin: "https://www.linkedin.com/in/eduvigisortizmoronta/",
    photo: "/references/eduvigis-ortiz.png",
  },
  {
    id: "micaela-martelli",
    name: "Micaela Martelli",
    country: "Argentina 🇦🇷",
    field: "BioPharma & Digital Health",
    category: "T",
    summary:
      "Industrial engineer with MIT Sloan MBA. Director of Sector Solutions at Telefónica España, leading Industry, Energy, Health, and Insurance divisions. Forbes Latinas 2025.",
    linkedin: "https://www.linkedin.com/in/micaelamartelli/",
    photo: "/references/micaela-martelli.png",
  },
  {
    id: "patricia-pomies",
    name: "Patricia Pomiés",
    country: "Argentina 🇦🇷",
    field: "Tech Leadership",
    category: "T",
    summary:
      "Chief Operating Officer of Globant, a NYSE-listed digital company. Leads European expansion from Madrid. Advocates for women in tech leadership. Forbes Latinas 2025.",
    linkedin: "https://www.linkedin.com/in/patricia-pomies-8a99a44/",
    photo: "/references/patricia-pomies.png",
  },
  {
    id: "nathaly-rey",
    name: "Nathaly Rey",
    country: "Venezuela 🇻🇪",
    field: "Cloud Computing & Privacy",
    category: "T",
    summary:
      "Leads global regulatory compliance efforts at Google Cloud. Holds a doctorate in Cloud Computing and Privacy. Forbes Latinas 2025.",
    linkedin: "https://www.linkedin.com/in/nathalyrey/",
    photo: "/references/nathaly-rey.png",
  },
  {
    id: "victoria-ducournau",
    name: "Victoria Ducournau",
    country: "Venezuela 🇻🇪",
    field: "Digital Transformation & eCommerce",
    category: "T",
    summary:
      "Expert in retail and digital transformation. Led eCommerce at Estée Lauder, Nespresso, Sephora, Dyson, Microsoft, and Amazon Ads. Forbes Latinas 2025.",
    linkedin: "https://www.linkedin.com/in/victoriaduco/",
    photo: "/references/victoria-ducournau.png",
  },

  // ═══════════════════════════════════════
  // ENGINEERING (E)
  // ═══════════════════════════════════════
  {
    id: "maria-telkes",
    name: "María Télkes",
    country: "Hungary/USA 🇭🇺🇺🇸",
    field: "Renewable Energy",
    category: "E",
    summary:
      "Known as the 'Sun Queen.' Invented the first thermoelectric solar energy system and the first solar-heated house.",
    photo: "/references/maria-telkes.png",
  },

  // ═══════════════════════════════════════
  // MATHEMATICS (M)
  // ═══════════════════════════════════════
  {
    id: "silvia-torres-peimbert",
    name: "Silvia Torres-Peimbert",
    country: "Mexico 🇲🇽",
    field: "Astronomy & Mathematics",
    category: "M",
    summary:
      "First Latin American woman to preside over the International Astronomical Union. Won the L'Oréal-UNESCO Award for Women in Science.",
    photo: "/references/silvia-torres.png",
  },

  // ═══════════════════════════════════════
  // TOP 15 WOMEN IN TECH LATAM 2025
  // ═══════════════════════════════════════
  {
    id: "victoria-de-leon",
    name: "Victoria de León",
    country: "Mexico 🇲🇽",
    field: "Robotics & Space Engineering",
    category: "E",
    summary:
      "Robotics engineer from Tec de Monterrey and research intern at Carnegie Mellon. Developed a biomaterial to detect radiation in lunar habitats, set to be tested on the International Space Station.",
    linkedin: "https://www.linkedin.com/in/victoria-de-le%C3%B3n-654b0924a/",
    photo: "/references/victoria-de-leon.png",
  },
  {
    id: "gabriela-salas-cabrera",
    name: "Gabriela Salas Cabrera",
    country: "Mexico 🇲🇽",
    field: "Data Science & Indigenous Languages",
    category: "T",
    summary:
      "Data scientist who led the integration of Nahuatl into Google Translate. Combines data science with indigenous activism to preserve native languages through technology.",
    linkedin: "https://www.linkedin.com/in/gabriela-salas-cabrera-7b8554130/",
    photo: "/references/gabriela-salas.png",
  },
  {
    id: "noemi-hernandez",
    name: "Noemí Hernández Guerrero",
    country: "Mexico 🇲🇽",
    field: "Tech & Customer Success",
    category: "T",
    summary:
      "Director of Customer Success at Salesforce. Active advocate for gender equity in tech and mentor encouraging girls to pursue STEM careers.",
    linkedin: "https://www.linkedin.com/in/noemihdzgro/",
    photo: "/references/noemi-hernandez.png",
  },
  {
    id: "katherine-vergara",
    name: "Katherine Vergara",
    country: "Chile 🇨🇱",
    field: "STEM Education & Game Dev",
    category: "T",
    summary:
      "Founded STEMtivista and co-founded Tónico, a video game studio. Uses interactive storytelling and games to make science accessible to diverse audiences across Latin America.",
    linkedin: "https://www.linkedin.com/in/katherinevergara/",
    photo: "/references/katherine-vergara.png",
  },
  {
    id: "cristina-junqueira",
    name: "Cristina Junqueira",
    country: "Brazil 🇧🇷",
    field: "Fintech",
    category: "T",
    summary:
      "Co-founder of Nubank, the largest fintech in Latin America. Industrial engineer who democratized financial services for millions through technology and innovation.",
    linkedin: "https://www.linkedin.com/in/crisjunqueira/",
    photo: "/references/cristina-junqueira.png",
  },
  {
    id: "maria-oliveira-tamellini",
    name: "Maria Oliveira Tamellini",
    country: "Brazil 🇧🇷",
    field: "AI & Digital Safety",
    category: "T",
    summary:
      "Co-founder of GamerSafer, using AI and identity verification to protect children in online gaming. Pioneer in ethical tech for child safety in digital environments.",
    linkedin: "https://www.linkedin.com/in/mariaotamellini/",
    photo: "/references/maria-oliveira.png",
  },
  {
    id: "melissa-amado",
    name: "Melissa Amado",
    country: "Peru 🇵🇪",
    field: "AI & Mining Tech",
    category: "T",
    summary:
      "Founder of BeE3 LabTech, developing AI solutions for mining. Won the Most Disruptive Award at Women in Tech LATAM Awards 2024. Transforming Peru's most traditional industry through technology.",
    linkedin: "https://www.linkedin.com/in/melissa-amado-8153a142/",
    photo: "/references/melissa-amado.png",
  },
  {
    id: "ophelia-pastrana",
    name: "Ophelia Pastrana",
    country: "Colombia/Mexico 🇨🇴🇲🇽",
    field: "Physics & Science Communication",
    category: "S",
    summary:
      "Physicist and economist. Named in WEF's 100 Leaders of the Future and Forbes' 50+ Creatives. Pioneering transgender activist and science communicator in Latin America.",
    linkedin: "https://www.linkedin.com/in/ophcourse/",
    photo: "/references/phelia-pastrana.png",
  },
  {
    id: "linda-patino",
    name: "Linda Patiño",
    country: "Colombia 🇨🇴",
    field: "Tech & Digital Rights",
    category: "T",
    summary:
      "Communications Manager at Google Colombia. Leads digital citizenship and online safety initiatives. Influential voice on digital rights from a gender perspective in Latin America.",
    linkedin: "https://www.linkedin.com/in/lindapatcar/",
    photo: "/references/linda-patino.png",
  },
  {
    id: "micaela-mantegna",
    name: "Micaela Mantegna",
    country: "Argentina 🇦🇷",
    field: "AI Ethics & Game Law",
    category: "T",
    summary:
      "Harvard Berkman Klein Center fellow. Expert in AI governance and video game law. Founded Women in Games Argentina. Speaker at TED, UNESCO, and the World Economic Forum.",
    linkedin: "https://www.linkedin.com/in/micaelamantegna/",
    photo: "/references/micaela-mantegna.png",
  },
  {
    id: "mercedes-bidart",
    name: "Mercedes Bidart",
    country: "Argentina 🇦🇷",
    field: "Blockchain & Fintech",
    category: "T",
    summary:
      "Co-founder and CEO of Quipu, using blockchain to digitize community markets across Latin America. Harvard-trained urban planner building inclusive economic systems through technology.",
    linkedin: "https://www.linkedin.com/in/mercedes-bidart-argentina/",
    photo: "/references/mercedes-bidart.png",
  },
  {
    id: "nina-da-hora",
    name: "Nina da Hora",
    country: "Brazil 🇧🇷",
    field: "Cybersecurity & Digital Inclusion",
    category: "T",
    summary:
      "Computer scientist and cybersecurity researcher. Founded Instituto da Hora promoting ethical tech and racial equity in AI. Leading voice on algorithmic justice in Brazil.",
    linkedin: "https://www.linkedin.com/in/ninadahora/",
    photo: "/references/nina-da-hora.png",
  },
  {
    id: "maria-paz-gillet",
    name: "María Paz Gillet",
    country: "Chile 🇨🇱",
    field: "Insurtech & Telematics",
    category: "T",
    summary:
      "CEO and co-founder of Jooycar, transforming auto insurance in Latin America through telematics. One of the few female founders to scale an insurtech company in the region.",
    linkedin: "https://www.linkedin.com/in/mariapazgillet/",
    photo: "/references/maria-paz.png",
  },
  {
    id: "gabriela-ceballos",
    name: "Gabriela Ceballos",
    country: "Mexico 🇲🇽",
    field: "AI & HR Tech",
    category: "T",
    summary:
      "Founder and CEO of Hitch, an AI-powered recruitment platform. Economics and finance graduate from Tec de Monterrey, solving hiring challenges with data-driven solutions.",
    linkedin: "https://www.linkedin.com/in/gabiceballos/",
    photo: "/references/gabriela-ceballos.png",
  },
  {
    id: "eddymar-coronel",
    name: "Eddymar Coronel",
    country: "Venezuela 🇻🇪",
    field: "Industrial Tech & AI",
    category: "E",
    summary:
      "CXO at Fracttal, the first AI-integrated maintenance management system. Electronic engineer transforming industrial maintenance across Latin America and Europe.",
    linkedin: "https://www.linkedin.com/in/eddymarcoronel/",
    photo: "/references/eddymar-coronel.png",
  },
  {
    id: "manuela-gutierrez",
    name: "Manuela Gutiérrez",
    country: "Colombia 🇨🇴",
    field: "HealthTech & UX",
    category: "T",
    summary:
      "PMO & Operations Lead at 360 Health Data. 10+ years in software, specializing in healthcare tech, UI/UX design, and clinical trial solutions to reduce healthcare inequality.",
    linkedin: "https://www.linkedin.com/in/manuela-gutierrez-212588b6/",
    photo: "/references/manuela-gutierrez.png",
  },

  // ═══════════════════════════════════════
  // HISTORICAL LATINAS IN STEM
  // ═══════════════════════════════════════
  {
    id: "ellen-ochoa",
    name: "Ellen Ochoa",
    country: "USA/Mexico 🇺🇸🇲🇽",
    field: "Aerospace Engineering",
    category: "E",
    summary:
      "First Hispanic woman to go to space (1993). Flew four Space Shuttle missions and became the first Hispanic director of NASA's Johnson Space Center.",
    photo: "/references/ellen-ochoa.png",
    historical: true,
  },
  {
    id: "france-cordova",
    name: "France Córdova",
    country: "USA/Mexico 🇺🇸🇲🇽",
    field: "Astrophysics",
    category: "S",
    summary:
      "Youngest person and first Hispanic woman to serve as NASA's Chief Scientist. Later became the director of the National Science Foundation (NSF).",
    photo: "/references/france-cordova.png",
    historical: true,
  },
  {
    id: "adriana-ocampo",
    name: "Adriana Ocampo",
    country: "Colombia/Argentina 🇨🇴🇦🇷",
    field: "Planetary Geology",
    category: "S",
    summary:
      "NASA planetary geologist who helped confirm the Chicxulub crater as the impact site that caused dinosaur extinction. Led multiple NASA planetary missions.",
    photo: "/references/adriana-ocampo.png",
    historical: true,
  },
  {
    id: "antonia-novello",
    name: "Antonia Novello",
    country: "Puerto Rico 🇵🇷",
    field: "Medicine & Public Health",
    category: "S",
    summary:
      "First woman and first Hispanic to serve as U.S. Surgeon General (1990-1993). Advocated for children's health, anti-smoking campaigns, and AIDS awareness.",
    photo: "/references/antonia-novello.png",
    historical: true,
  },
  {
    id: "helen-rodriguez-trias",
    name: "Helen Rodríguez Trías",
    country: "Puerto Rico 🇵🇷",
    field: "Pediatric Medicine",
    category: "S",
    summary:
      "First Latina president of the American Public Health Association. Pioneered neonatal care and fought for women's reproductive rights and health equity.",
    photo: "/references/helen-rodriguez.png",
    historical: true,
  },
  {
    id: "ynes-mexia",
    name: "Ynes Mexía",
    country: "Mexico/USA 🇲🇽🇺🇸",
    field: "Botany",
    category: "S",
    summary:
      "Legendary botanist who collected over 145,000 plant specimens across Latin America. Discovered 500 new species, with 50 named after her.",
    photo: "/references/ynes-mexia.png",
    historical: true,
  },
  {
    id: "mercedes-sosa-de-newton",
    name: "Lydia Villa-Komaroff",
    country: "USA/Mexico 🇺🇸🇲🇽",
    field: "Molecular Biology",
    category: "S",
    summary:
      "First Mexican-American woman to earn a PhD in science. Her team discovered that bacteria could produce insulin, revolutionizing diabetes treatment worldwide.",
    photo: "/references/lydia-villa.png",
    historical: true,
  },
  {
    id: "maria-contreras-sweet",
    name: "María Contreras-Sweet",
    country: "Mexico/USA 🇲🇽🇺🇸",
    field: "Technology & Entrepreneurship",
    category: "T",
    summary:
      "Founded ProAmérica Bank and served as head of the U.S. Small Business Administration under President Obama, empowering Latina entrepreneurs in tech and business.",
    photo: "/references/maria-contreras.png",
    historical: true,
  },
  {
    id: "diana-trujillo",
    name: "Diana Trujillo",
    country: "Colombia 🇨🇴",
    field: "Aerospace Engineering",
    category: "E",
    summary:
      "NASA aerospace engineer who led the robotic arm team on the Mars Perseverance rover. First person to host a NASA broadcast in Spanish for a planetary landing.",
    photo: "/references/diana-trujillo.png",
    historical: true,
  },
  {
    id: "evangelina-villegas",
    name: "Evangelina Villegas",
    country: "Mexico 🇲🇽",
    field: "Biochemistry & Agriculture",
    category: "S",
    summary:
      "Won the World Food Prize (2000) for developing Quality Protein Maize (QPM), a nutritionally enhanced corn that has helped fight malnutrition across the developing world.",
    photo: "/references/evangelina-villegas.png",
    historical: true,
  },
  {
    id: "dolores-huerta",
    name: "Helia Bravo Hollis",
    country: "Mexico 🇲🇽",
    field: "Botany & Biology",
    category: "S",
    summary:
      "Mexico's first female biologist. Pioneer in the study of cacti, documenting over 1,600 species. Founded the Botanical Garden at UNAM and fought for biodiversity conservation.",
    photo: "/references/helia-bravo.png",
    historical: true,
  },
];

export const categoryLabels: Record<string, string> = {
  S: "Science",
  T: "Technology",
  E: "Engineering",
  M: "Mathematics",
};
