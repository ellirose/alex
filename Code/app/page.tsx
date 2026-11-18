import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { About } from '@/components/sections/About';
import { Concepts } from '@/components/sections/Concepts';
import { Credentials } from '@/components/sections/Credentials';
import { Experience } from '@/components/sections/Experience';
import { Expertise } from '@/components/sections/Expertise';
import { Hero } from '@/components/sections/Hero';
import { Reel } from '@/components/sections/Reel';
import { Toolkit } from '@/components/sections/Toolkit';
import { Work } from '@/components/sections/Work';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Experience />
        <Work />
        <Concepts />
        <Reel />
        <Toolkit />
        <Credentials />
      </main>
      <Footer />
    </>
  );
}
