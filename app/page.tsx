import Reel from "@/components/reel/Reel";
import Hud from "@/components/Hud";
import Reveal from "@/components/Reveal";
import About from "@/components/sections/About";
import Disciplines from "@/components/sections/Disciplines";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Credits from "@/components/sections/Credits";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

/**
 * The page is one continuous reel. The opening 15 seconds play on their own
 * (components/reel), then the lockup becomes the hero and every section after
 * it is another scene: a hard colour cut, a scene number, one big idea.
 */
export default function Page() {
  return (
    <>
      <Hud />
      <main>
        <Reel />
        <About />
        <Disciplines />
        <Work />
        <Experience />
        <Credits />
        <Contact />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
