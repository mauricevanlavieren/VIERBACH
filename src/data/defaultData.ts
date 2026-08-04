import { WebsiteData } from '../types';
import heroImg from '../assets/images/vierbach_at6_crane_1785838631009.jpg';
import project1Img from '../assets/images/project_steel_assembly_1785838711385.jpg';
import project2Img from '../assets/images/project_roof_truss_1785838735361.jpg';
import project3Img from '../assets/images/project_hvac_placement_1785838750830.jpg';

export const INITIAL_WEBSITE_DATA: WebsiteData = {
  company: {
    name: 'VIERBACH',
    tagline: 'Hijskraanverhuur met Machinist | AT6 Mobiele Torenkraan',
    phone: '31641775668',
    phoneDisplay: '+31 6 41775668',
    whatsapp: '31612345678',
    email: 'info@vierbach-hijskranen.nl',
    kvk: '87654321',
    btw: 'NL001234567B01',
    address: 'Regio Midden-Nederland (Standplaats Gelderland / Utrecht)',
    workingRadius: 'Inzetbaar in heel Nederland & Benelux',
    statusBadge: 'Direct Beschikbaar voor Projecten',
  },
  hero: {
    title: 'Mobiele Hijskraan AT6 met Ervaren Machinist',
    subtitle: 'Snel opgebouwd, maximale reikwijdte en professionele bediening. VIERBACH is uw betrouwbare eenmanszaak voor nauwkeurig hijswerk op elke bouwlocatie.',
    craneModel: 'Spierings AT6 Mobiele Torenkraan',
    heroImageUrl: heroImg,
    badgeText: 'Eenmanszaak • Direct Contact • Snel Ter Plaatse',
    specs: [
      { label: 'Max. Hijslast', value: '10.000 kg', subtext: 'Op korte afstand' },
      { label: 'Max. Vlucht (Gieklengte)', value: '60,0 m', subtext: 'Met 1.700 kg op de punt' },
      { label: 'Haakhoogte', value: '30,0 m - 48,2 m', subtext: 'Met getoptie 30°' },
      { label: 'Opbouwtijd', value: '< 20 Minuten', subtext: 'Volledig hydraulisch & zelfstandig' },
    ],
  },
  projects: [
    {
      id: 'project-1',
      title: 'Montage Stalen Spanten Logistiek Centrum',
      clientOrType: 'Staalbouw & Bedrijfshuisvesting',
      date: 'Juli 2026',
      location: 'Tiel, Gelderland',
      imageUrl: project1Img,
      description: 'Nauwkeurige positionering en montage van zware stalen spanten van 4,2 ton op een krappe bouwlocatie. Dankzij de wendbare AT6 mobiele torenkraan kon de gehele hal vanuit één vaste opstelplaats gemonteerd worden.',
      specs: ['Max. hijslast: 4,2 ton', 'Vlucht: 45 meter', 'Montagetijd: 1 werkdag'],
    },
    {
      id: 'project-2',
      title: 'Plaatsing Prefab Houten Dakelementen Villa',
      clientOrType: 'Luxe Woningbouw & Houtskelet',
      date: 'Juni 2026',
      location: 'Utrecht, Utrecht',
      imageUrl: project2Img,
      description: 'Hijsen en tot op de millimeter exact plaatsen van grote houten dakconstructies over een bestaande achtertuin met bomen heen. Kraanopstelling op een smalle toegangsweg zonder hinder voor omwonenden.',
      specs: ['Haakhoogte: 36 meter', 'Hijsstraal over obstakel', 'Perfect zicht met afstandsbediening'],
    },
    {
      id: 'project-3',
      title: 'Inhijsen Zware Luchtbehandelingskasten',
      clientOrType: 'Installatietechniek & HVAC',
      date: 'Mei 2026',
      location: 'Arnhem, Gelderland',
      imageUrl: project3Img,
      description: 'Plaatsing van drie zware klimaatbehandelingskasten op het dak van een distributiecentrum. Met de grote gieklengte van de AT6 werd de maximale reikwijdte tot het midden van het dak gehaald.',
      specs: ['Vlucht: 52 meter', 'Gewicht per unit: 2.100 kg', 'Inclusief hijsplan & stempelling'],
    },
  ],
  terms: [
    {
      id: 'term-1',
      number: '01',
      title: 'Toepasselijkheid & Algemene Bepalingen',
      content: [
        'Deze Algemene Voorwaarden zijn van toepassing op alle aanbiedingen, offertes, overeenkomsten en werkzaamheden van VIERBACH Kraanverhuur, voor het verhuren van de mobiele hijskraan AT6 inclusief gecertificeerde machinist.',
        'Afwijkingen van deze voorwaarden zijn slechts geldig indien deze uitdrukkelijk en schriftelijk (of via e-mail/WhatsApp) zijn overeengekomen.',
        'De Algemene Algemene Voorwaarden voor de Verhuur van Mobiele Kranen (VVT-voorwaarden) zijn voor zover toepasselijk mede van kracht.',
      ],
    },
    {
      id: 'term-2',
      number: '02',
      title: 'Uitvoering & Inzet Machinist',
      content: [
        'De mobiele hijskraan wordt uitsluitend verhuurd mét machinist. De machinist is gediplomeerd, gecertificeerd en bevoegd om de AT6 kraan te bedienen.',
        'De machinist beoordeelt ter plaatse de veiligheid van de hijsoperatie. De machinist heeft te allen tijde het recht om hijswerkzaamheden stil te leggen indien de veiligheid (door weer, wind, ondergrond of ondeugdelijk hijsgereedschap van derden) in het geding komt.',
        'De opdrachtgever zorgt voor een duidelijke instructie en een daartoe bevoegde aanslagman indien vereist op de bouwlocatie.',
      ],
    },
    {
      id: 'term-3',
      number: '03',
      title: 'Opstellingsplaats & Toegankelijkheid',
      content: [
        'De opdrachtgever draagt er zorg voor dat de opstellingsplaats en de toegangswegen geschikt, vrij van obstakels en voldoende draagkrachtig zijn voor de mobiele kraan AT6.',
        'Schade aan terreinen, bestrating, kabels of leidingen als gevolg van een onvoldoende draagkrachtige of onjuist aangewezen ondergrond valt onder de verantwoordelijkheid van de opdrachtgever.',
        'Eventuele benodigde vergunningen, verkeersmaatregelen of TVM (tijdelijke verkeersmaatregelen) dienen vooraf door de opdrachtgever te zijn geregeld, tenzij anders overeengekomen.',
      ],
    },
    {
      id: 'term-4',
      number: '04',
      title: 'Tarieven, Btw & Annulering',
      content: [
        'Tarieven worden berekend op basis van het overeengekomen uurtarief of dagtarief, inclusief machinist en brandstof, exclusief BTW, eventuele vergunningskosten en tolgelden.',
        'De berekening van de werktijd vangt aan bij vertrek vanaf de standplaats en eindigt bij terugkomst op de standplaats, inclusief op- en afbouwtijd.',
        'Annulering tot 24 uur voor aanvang is kosteloos. Bij annulering binnen 24 uur voor aanvang van de werkzaamheden kan een minimum van 4 uur plus aanrijdkosten in rekening worden gebracht.',
      ],
    },
    {
      id: 'term-5',
      number: '05',
      title: 'Aansprakelijkheid & Verzekering',
      content: [
        'VIERBACH beschikt over een uitstekende Bedrijfsaansprakelijkheidsverzekering (AVB) en specifieke Kraanverhuurverzekering.',
        'Aansprakelijkheid voor indirecte schade, gevolgschade of vertragingsschade is uitgesloten, behoudens opzet of grove schuld van VIERBACH.',
        'De te hijsen lasten dienen door de opdrachtgever adequaat te zijn ingepakt/bevestigd en voorzien van de juiste hijspunten.',
      ],
    },
  ],
};
