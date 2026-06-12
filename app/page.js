import { NavBar }               from '../components/ui/NavBar.jsx';
import { Scene }                from '../components/scene/Scene.jsx';
import { HeroSection }          from '../components/sections/HeroSection.jsx';
import { AboutSection }         from '../components/sections/AboutSection.jsx';
import { ExperienceSection }    from '../components/sections/ExperienceSection.jsx';
import { SkillsSection }        from '../components/sections/SkillsSection.jsx';
import { WorkSection }          from '../components/sections/WorkSection.jsx';
import { EducationSection }     from '../components/sections/EducationSection.jsx';
import { CertificationsSection } from '../components/sections/CertificationsSection.jsx';
import { ContactSection }       from '../components/sections/ContactSection.jsx';

export default function Page() {
  return (
    <>
      <Scene />
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <WorkSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
      </main>
    </>
  );
}
