/**
 * Project images for the gallery (Concept lab section). Files live in public/work/<category>/NN.jpg.
 * To add a piece, drop the file in its folder and add a row with its pixel size.
 * Category names and descriptions are in lib/dictionaries.ts → concepts.
 */

export type Category = 'branding' | 'logos' | 'posters' | 'web' | 'mobile' | 'fashion' | 'sportswear' | 'uniforms';
export type Piece = { src: string; w: number; h: number };
export type GalleryItem = Piece & { category: Category; index: number };

export const CATEGORIES: Category[] = ['branding', 'logos', 'posters', 'web', 'mobile', 'fashion', 'sportswear', 'uniforms'];

export const PIECES: Record<Category, Piece[]> = {
  branding: [
    { src: '/work/branding/01.jpg', w: 736, h: 920 },
    { src: '/work/branding/02.jpg', w: 736, h: 824 },
    { src: '/work/branding/03.jpg', w: 736, h: 1104 },
    { src: '/work/branding/04.jpg', w: 736, h: 1104 },
    { src: '/work/branding/05.jpg', w: 735, h: 919 },
  ],
  logos: [
    { src: '/work/logos/01.jpg', w: 736, h: 736 },
    { src: '/work/logos/02.jpg', w: 736, h: 736 },
    { src: '/work/logos/03.jpg', w: 736, h: 877 },
    { src: '/work/logos/04.jpg', w: 736, h: 1307 },
    { src: '/work/logos/05.jpg', w: 736, h: 552 },
    { src: '/work/logos/06.jpg', w: 736, h: 1318 },
    { src: '/work/logos/07.jpg', w: 600, h: 600 },
    { src: '/work/logos/08.jpg', w: 736, h: 736 },
  ],
  posters: [
    { src: '/work/posters/01.jpg', w: 474, h: 843 },
    { src: '/work/posters/02.jpg', w: 736, h: 1308 },
    { src: '/work/posters/03.jpg', w: 735, h: 1104 },
    { src: '/work/posters/04.jpg', w: 736, h: 1308 },
    { src: '/work/posters/05.jpg', w: 736, h: 1308 },
    { src: '/work/posters/06.jpg', w: 736, h: 1299 },
    { src: '/work/posters/07.jpg', w: 736, h: 1308 },
    { src: '/work/posters/08.jpg', w: 736, h: 1104 },
    { src: '/work/posters/09.jpg', w: 736, h: 1308 },
    { src: '/work/posters/10.jpg', w: 720, h: 720 },
  ],
  web: [
    { src: '/work/web/01.jpg', w: 736, h: 552 },
    { src: '/work/web/02.jpg', w: 720, h: 1279 },
    { src: '/work/web/03.jpg', w: 736, h: 1302 },
    { src: '/work/web/04.jpg', w: 736, h: 1104 },
    { src: '/work/web/05.jpg', w: 735, h: 919 },
    { src: '/work/web/06.jpg', w: 735, h: 416 },
    { src: '/work/web/07.jpg', w: 736, h: 1313 },
    { src: '/work/web/08.jpg', w: 736, h: 1308 },
    { src: '/work/web/09.jpg', w: 736, h: 1104 },
  ],
  mobile: [
    { src: '/work/mobile/01.jpg', w: 736, h: 552 },
    { src: '/work/mobile/02.jpg', w: 736, h: 1472 },
    { src: '/work/mobile/03.jpg', w: 736, h: 1104 },
    { src: '/work/mobile/04.jpg', w: 736, h: 552 },
    { src: '/work/mobile/05.jpg', w: 735, h: 685 },
    { src: '/work/mobile/06.jpg', w: 736, h: 552 },
    { src: '/work/mobile/07.jpg', w: 736, h: 589 },
  ],
  fashion: [
    { src: '/work/fashion/01.jpg', w: 736, h: 981 },
    { src: '/work/fashion/02.jpg', w: 736, h: 1318 },
    { src: '/work/fashion/03.jpg', w: 736, h: 1104 },
    { src: '/work/fashion/04.jpg', w: 736, h: 972 },
    { src: '/work/fashion/05.jpg', w: 736, h: 736 },
    { src: '/work/fashion/06.jpg', w: 736, h: 1104 },
    { src: '/work/fashion/07.jpg', w: 735, h: 1105 },
  ],
  sportswear: [
    { src: '/work/sportswear/01.jpg', w: 736, h: 736 },
    { src: '/work/sportswear/02.jpg', w: 736, h: 736 },
    { src: '/work/sportswear/03.jpg', w: 683, h: 1024 },
    { src: '/work/sportswear/04.jpg', w: 736, h: 1104 },
  ],
  uniforms: [
    { src: '/work/uniforms/01.jpg', w: 638, h: 822 },
    { src: '/work/uniforms/02.jpg', w: 736, h: 981 },
    { src: '/work/uniforms/03.jpg', w: 735, h: 844 },
    { src: '/work/uniforms/04.jpg', w: 735, h: 672 },
    { src: '/work/uniforms/05.jpg', w: 735, h: 919 },
    { src: '/work/uniforms/06.jpg', w: 736, h: 1144 },
    { src: '/work/uniforms/07.jpg', w: 736, h: 1318 },
    { src: '/work/uniforms/08.jpg', w: 564, h: 851 },
    { src: '/work/uniforms/09.jpg', w: 736, h: 981 },
  ],
};

const withMeta = (category: Category): GalleryItem[] => PIECES[category].map((p, index) => ({ ...p, category, index }));

/** Every piece, dealt round-robin across categories so the full grid stays varied. */
const ALL: GalleryItem[] = (() => {
  const lists = CATEGORIES.map(withMeta);
  const longest = Math.max(...lists.map((l) => l.length));
  const out: GalleryItem[] = [];
  for (let i = 0; i < longest; i++) for (const list of lists) if (list[i]) out.push(list[i]);
  return out;
})();

export const galleryFor = (filter: Category | 'all') => (filter === 'all' ? ALL : withMeta(filter));
