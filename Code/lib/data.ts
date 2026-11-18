/** Language-independent content: tools, colours and media credits. */

export const COLORS = {
  ink: '#1E2B3A',
  slate: '#4A5868',
  mist: '#8C98A6',
  snow: '#FFFDF8',
  paper: '#F7F2E8',
  sand: '#EFE5D3',
  dune: '#E3D3BA',
  copper: '#BC5C33',
  pacific: '#2A7C8E',
  andes: '#9FB4CC',
  sun: '#E9B23C',
  coral: '#D9705C',
} as const;

export type GroupId = 'design' | 'video' | 'web' | 'marketing' | 'ops';

export const TOOL_GROUPS: { id: GroupId; color: string; tools: string[] }[] = [
  { id: 'design', color: COLORS.copper, tools: ['Figma', 'Photoshop', 'Illustrator', 'InDesign', 'Canva Pro'] },
  { id: 'video', color: COLORS.pacific, tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Audition'] },
  {
    id: 'web',
    color: '#C99016',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'WordPress', 'Git'],
  },
  {
    id: 'marketing',
    color: COLORS.coral,
    tools: ['GA4', 'Tag Manager', 'Search Console', 'Looker Studio', 'Google Ads', 'Meta Ads', 'HubSpot'],
  },
  { id: 'ops', color: '#5B7FA6', tools: ['Notion', 'Trello', 'Jira', 'Excel', 'PowerPoint', 'Google Workspace'] },
];

/** City imagery for the journey timeline, in the same order as the roles. */
export const CITY_PHOTOS = ['/media/santiago.jpg', '/media/valparaiso.jpg', '/media/concepcion.jpg'];

/**
 * Third-party media used on the site (all from Wikimedia Commons).
 * Keep this list in sync with CREDITS.md — attribution is a licence requirement.
 */
export const MEDIA_CREDITS: { label: string; author: string; license: string; source: string }[] = [
  {
    label: 'Santiago de Chile, desde Cerro San Cristóbal',
    author: 'Omnespsx (D•ES)',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Santiago_de_Chile,_Desde_Cerro_San_Crist%C3%B3bal_(cropped).jpg',
  },
  {
    label: 'Casa en calle Miramar, Cerro Alegre, Valparaíso',
    author: 'Carlos Figueroa Rojas',
    license: 'CC BY-SA 4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Casa_en_calle_Miramar,_Cerro_Alegre,_Valpara%C3%ADso_20201102_93.jpg',
  },
  {
    label: 'Concepción and the Biobío River',
    author: 'Paul Edmonds',
    license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:Concepcion_and_the_Biobio_River.jpg',
  },
  {
    label: 'Atacama Desert Panorama',
    author: 'D. Schreiner and S. Degezelle / ESO',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Atacama_Desert_Panorama_(img_2303).jpg',
  },
  {
    label: 'Ascensor Barón, Valparaíso (video)',
    author: 'Kimako Studio',
    license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Ascensor_Baron_video_vc.webm',
  },
];
