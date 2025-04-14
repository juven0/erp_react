import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronUp, Globe, X, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SectionId = 'hero' | 'fonctionnalites' | 'avantages' | 'temoignages' | 'contact';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [navbarExpanded, setNavbarExpanded] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [animatedElements, setAnimatedElements] = useState<string[]>([]);
  const navigate  = useNavigate()
  
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const advantagesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const callToActionRef = useRef<HTMLElement>(null);

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const handelButton = ()=>{ navigate("/login") }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      const sections = ['hero', 'fonctionnalites', 'avantages', 'temoignages', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
      
      const checkElement = (ref: React.RefObject<HTMLElement | null>, id: string) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.8 && !animatedElements.includes(id)) {
            setAnimatedElements(prev => [...prev, id]);
          }
        }
      };
      
      checkElement(heroRef, 'hero-section');
      checkElement(featuresRef, 'features-section');
      checkElement(advantagesRef, 'advantages-section');
      checkElement(testimonialsRef, 'testimonials-section');
      checkElement(contactRef, 'contact-section');
      checkElement(callToActionRef, 'cta-section');
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [animatedElements]);

  const toggleNavbar = () => {
    setNavbarExpanded(!navbarExpanded);
  };

  const getAnimationClass = (elementId: string, animationType: string = 'fade-up') => {
    const baseClass = 'transition-all duration-1000 ease-out';
    
    if (animatedElements.includes(elementId)) {
      return `${baseClass} opacity-100 translate-y-0`;
    }
    
    switch (animationType) {
      case 'fade-up':
        return `${baseClass} opacity-0 translate-y-12`;
      case 'fade-in':
        return `${baseClass} opacity-0`;
      case 'fade-right':
        return `${baseClass} opacity-0 -translate-x-12`;
      case 'fade-left':
        return `${baseClass} opacity-0 translate-x-12`;
      default:
        return `${baseClass} opacity-0`;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <div 
          className={`
            ${navbarExpanded ? 'w-full max-w-4xl' : 'w-64 md:w-80'} 
            transition-all duration-500 ease-in-out 
            backdrop-blur-md ${scrollY > 100 ? 'bg-white/90' : 'bg-white/80'} rounded-full
            shadow-lg text-gray-800
            mx-4
          `}
          onClick={!navbarExpanded ? toggleNavbar : undefined}
        >
          <div className={`flex items-center ${navbarExpanded ? 'justify-between px-6 py-3' : 'justify-center px-4 py-3'}`}>
            {navbarExpanded ? (
              <>
                <div className="flex items-center gap-2" onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer' }}>
                  <div className="bg-purple-600 text-white rounded-full p-2">
                    <Globe size={18} />
                  </div>
                  <span className="font-bold">Tymo</span>
                </div>
                
                
                <div className="hidden md:flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    className={`hover:bg-purple-50 text-gray-800 text-sm ${activeSection === 'fonctionnalites' ? 'text-purple-600 font-medium' : ''}`}
                    onClick={() => scrollToSection('fonctionnalites')}
                  >
                    Fonctionnalités
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`hover:bg-purple-50 text-gray-800 text-sm ${activeSection === 'avantages' ? 'text-purple-600 font-medium' : ''}`}
                    onClick={() => scrollToSection('avantages')}
                  >
                    Avantages
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`hover:bg-purple-50 text-gray-800 text-sm ${activeSection === 'temoignages' ? 'text-purple-600 font-medium' : ''}`}
                    onClick={() => scrollToSection('temoignages')}
                  >
                    Témoignages
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`hover:bg-purple-50 text-gray-800 text-sm ${activeSection === 'contact' ? 'text-purple-600 font-medium' : ''}`}
                    onClick={() => scrollToSection('contact')}
                  >
                    Contact
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                 
                  <Button className="bg-purple-600 hover:bg-purple-700 rounded-full text-xs py-1 px-3 text-white" onClick={()=>handelButton()}>
                    Connexion
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="rounded-full w-8 h-8 p-0 flex items-center justify-center text-gray-700"
                    onClick={toggleNavbar}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-600 text-white rounded-full p-1">
                    <Globe size={16} />
                  </div>
                  <span className="font-bold text-sm">Tymo</span>
                </div>
                <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
                  <User size={14} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      
      {mobileMenuOpen && navbarExpanded && (
        <div className="md:hidden fixed top-20 left-0 right-0 z-40 backdrop-blur-md bg-white/90 mx-4 rounded-xl text-gray-800">
          <div className="flex flex-col space-y-1 p-4">
            <Button 
              variant="ghost" 
              className={`justify-start hover:bg-purple-50 text-gray-800 ${activeSection === 'fonctionnalites' ? 'text-purple-600 font-medium' : ''}`}
              onClick={() => scrollToSection('fonctionnalites')}
            >
              Fonctionnalités
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start hover:bg-purple-50 text-gray-800 ${activeSection === 'avantages' ? 'text-purple-600 font-medium' : ''}`}
              onClick={() => scrollToSection('avantages')}
            >
              Avantages
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start hover:bg-purple-50 text-gray-800 ${activeSection === 'temoignages' ? 'text-purple-600 font-medium' : ''}`}
              onClick={() => scrollToSection('temoignages')}
            >
              Témoignages
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start hover:bg-purple-50 text-gray-800 ${activeSection === 'contact' ? 'text-purple-600 font-medium' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </Button>
          </div>
        </div>
      )}
      
      <div className="h-24"></div>
      
      <section ref={heroRef} id="hero" className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className={`order-2 lg:order-1 ${getAnimationClass('hero-section', 'fade-right')}`}>
              <div className="rounded-full animate-pulse overflow-hidden mb-8 w-64 h-16 md:h-24 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-300"></div>
              
              <div className="mb-8">
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700 rounded-full mb-4">
                  <ChevronRight size={20} />
                </Button>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">TRANSFORMEZ VOTRE GESTION DES RESSOURCES HUMAINES À MADAGASCAR</h1>
                <p className="text-gray-700">
                  Développez une gestion complète des employés adaptée au marché malgache grâce à notre solution <span className="font-semibold">innovante</span> et nos <span className="font-semibold">technologies avancées</span>.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className={`bg-white border border-gray-100 shadow-sm p-6 rounded-lg ${getAnimationClass('hero-section', 'fade-up')}`} style={{ transitionDelay: '200ms' }}>
                  <div className="flex justify-between mb-2">
                    <h2 className="text-4xl font-bold">136+</h2>
                    <Button variant="ghost" className="rounded-full">
                      <ChevronUp size={20} />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    projets originaux et implémentations réussies à Madagascar et dans la région
                  </p>
                  <Button 
                    variant="link" 
                    className="text-purple-600 p-0 mt-4"
                    onClick={() => scrollToSection('temoignages')}
                  >
                    voir tous les projets
                  </Button>
                </div>
                
                <div className={`bg-purple-50 p-6 rounded-lg ${getAnimationClass('hero-section', 'fade-up')}`} style={{ transitionDelay: '400ms' }}>
                  <div className="flex justify-between mb-2">
                    <h2 className="text-4xl font-bold">15+</h2>
                    <Button variant="ghost" className="rounded-full">
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    années d'expertise en solutions technologiques à Madagascar
                  </p>
                </div>
              </div>
            </div>
            
            
            <div className={`relative order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-auto ${getAnimationClass('hero-section', 'fade-left')}`}>
              <div className="bg-purple-400 rounded-lg h-full overflow-hidden">
                <img src="/api/placeholder/600/800" alt="ERP System" className="w-full h-full object-cover opacity-30" />
                
                <div className={`absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-4 py-2 flex items-center ${getAnimationClass('hero-section', 'fade-in')}`} style={{ transitionDelay: '600ms' }}>
                  <div className="flex -space-x-2 mr-2">
                    <div className="w-8 h-8 rounded-full bg-purple-800"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-300"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="font-bold">100+ </span>
                  <span className="text-gray-600 text-sm">/ nouveaux utilisateurs</span>
                </div>
                
                <div className={`absolute right-16 md:right-24 top-1/3 ${getAnimationClass('hero-section', 'fade-in')}`} style={{ transitionDelay: '800ms' }}>
                  <div className="bg-white bg-opacity-90 rounded-full px-4 py-2">
                    <span className="text-purple-800">solution locale</span>
                  </div>
                </div>
                
                <div className={`absolute right-8 md:right-16 top-1/2 ${getAnimationClass('hero-section', 'fade-in')}`} style={{ transitionDelay: '1000ms' }}>
                  <div className="bg-white bg-opacity-90 rounded-full px-4 py-2">
                    <span className="text-purple-800">design moderne</span>
                  </div>
                </div>
                
                <div className={`absolute bottom-12 right-4 md:right-12 bg-white rounded-lg p-4 md:p-6 max-w-sm ${getAnimationClass('hero-section', 'fade-in')}`} style={{ transitionDelay: '1200ms' }}>
                  <p className="mb-4">
                    Utilisant des principes de conception <span className="font-bold">à la pointe</span> et des <span className="font-bold">techniques</span> d'ingénierie avancées, notre équipe dédiée à Madagascar s'efforce d'améliorer la valeur de nos produits et services pour vous.
                  </p>
                  <div className="flex justify-end">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button 
              variant="outline" 
              className={`rounded-full border-purple-300 hover:bg-purple-50 flex items-center gap-2 ${getAnimationClass('hero-section', 'fade-up')}`}
              onClick={() => scrollToSection('fonctionnalites')}
              style={{ transitionDelay: '1400ms' }}
            >
              En savoir plus
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      </section>
      
      
      <section ref={featuresRef} id="fonctionnalites" className="bg-purple-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-12 ${getAnimationClass('features-section', 'fade-up')}`}>Fonctionnalités principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((num, index) => {
              const titles = [
                "Gestion des profils",
                "Suivi de performance",
                "Gestion des congés",
                "Tableau de bord analytique",
                "Gestion des salaires",
                "Recrutement et intégration"
              ];
              
              const descriptions = [
                "Créez et gérez des profils d'employés complets avec historique professionnel, compétences et documents adaptés au marché malgache.",
                "Établissez des objectifs, réalisez des évaluations et suivez la progression des employés avec des indicateurs locaux.",
                "Planifiez les congés selon le calendrier officiel malgache, incluant les jours fériés nationaux.",
                "Visualisez les données clés et obtenez des insights précieux sur votre capital humain à Madagascar.",
                "Automatisez les processus de paie conformément à la législation malgache et gérez facilement les avantages sociaux.",
                "Rationalisez le processus de recrutement, adapté au marché du travail malgache."
              ];
              
              return (
                <div 
                  key={index}
                  className={`bg-white p-6 rounded-lg shadow-sm transform transition-all duration-700 ${getAnimationClass('features-section', 'fade-up')}`}
                  style={{ transitionDelay: `${200 * index}ms` }}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-purple-600 font-bold">{num}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{titles[index]}</h3>
                  <p className="text-gray-600">{descriptions[index]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      
      <section ref={advantagesRef} id="avantages" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-12 ${getAnimationClass('advantages-section', 'fade-up')}`}>Pourquoi choisir Tymo </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={getAnimationClass('advantages-section', 'fade-right')}>
              <div className="bg-purple-600 h-72 rounded-lg relative overflow-hidden">
                <img src="/api/placeholder/500/400" alt="Dashboard demonstration" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">Tymo </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  title: "Expertise locale",
                  description: "Notre équipe basée à Antananarivo comprend les défis spécifiques des entreprises malgaches et vous offre un support dans votre langue."
                },
                {
                  title: "Conformité légale",
                  description: "Notre système est constamment mis à jour pour respecter la législation du travail malgache et les exigences fiscales locales."
                },
                {
                  title: "Support 24/7",
                  description: "Notre équipe basée à Madagascar est disponible à tout moment pour vous aider, avec une assistance technique en français et malgache."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex gap-4 ${getAnimationClass('advantages-section', 'fade-left')}`}
                  style={{ transitionDelay: `${300 * index}ms` }}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      
      <section ref={testimonialsRef} id="temoignages" className="bg-purple-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-12 ${getAnimationClass('testimonials-section', 'fade-up')}`}>Ce que disent nos clients à Madagascar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rakoto Andrianaivo",
                position: "DRH, TanaTech",
                quote: "Tymo a révolutionné notre gestion RH à Antananarivo. Le système s'adapte parfaitement aux spécificités du droit du travail malgache."
              },
              {
                name: "Noro Razafindrakoto",
                position: "CEO, MadaStart",
                quote: "L'interface bilingue français-malgache a été un facteur décisif pour nous. Le support client local répond rapidement à nos besoins."
              },
              {
                name: "Hasina Rabemananjara",
                position: "Resp. RH, ToamasExport",
                quote: "Les rapports analytiques nous permettent enfin de comprendre nos dynamiques RH à Toamasina. Un outil indispensable pour notre croissance."
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-lg shadow-sm ${getAnimationClass('testimonials-section', 'fade-up')}`}
                style={{ transitionDelay: `${200 * index}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      
      <section ref={callToActionRef} className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${getAnimationClass('cta-section', 'fade-up')}`}>Prêt à transformer votre gestion RH à Madagascar?</h2>
          <p className={`text-gray-600 max-w-2xl mx-auto mb-8 ${getAnimationClass('cta-section', 'fade-up')}`} style={{ transitionDelay: '200ms' }}>
            Rejoignez plus de 100 entreprises malgaches qui utilisent déjà notre solution pour optimiser leur gestion des ressources humaines.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${getAnimationClass('cta-section', 'fade-up')}`} style={{ transitionDelay: '400ms' }}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6">
              Demander une démo
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6">
              Voir les tarifs
            </Button>
          </div>
        </div>
      </section>
      
      
      <section ref={contactRef} id="contact" className="bg-purple-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-12 ${getAnimationClass('contact-section', 'fade-up')}`}>Contactez-nous</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={getAnimationClass('contact-section', 'fade-right')}>
              <h3 className="text-xl font-bold mb-4">Nos coordonnées à Madagascar</h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">📍</span>
                  <span>Lot II M 23 Antananarivo 101, Madagascar</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">📞</span>
                  <span>+261 34 12 345 67</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">✉️</span>
                  <span>contact@Tymo.mg</span>
                </p>
              </div>
              
              <h3 className="text-xl font-bold mt-8 mb-4">Heures d'ouverture</h3>
              <p className="text-gray-600">
                Lundi - Vendredi: 8h00 - 17h00<br />
                Samedi - Dimanche: Fermé
              </p>
            </div>
            
            <div className={`bg-white p-6 rounded-lg shadow-sm ${getAnimationClass('contact-section', 'fade-left')}`}>
              <h3 className="text-xl font-bold mb-4">Envoyez-nous un message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Sujet</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md h-32"></textarea>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3">
                  Envoyer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white text-purple-600 rounded-full p-2">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-lg">Tymo</span>
              </div>
              <p className="text-gray-300 text-sm">
                Solution complète de gestion des ressources humaines pour entreprises de toutes tailles.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Navigation</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Button variant="link" className="text-gray-300 p-0 hover:text-white" onClick={() => scrollToSection('hero')}>
                  Accueil
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 p-0 hover:text-white" onClick={() => scrollToSection('fonctionnalites')}>
                    Fonctionnalités
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 p-0 hover:text-white" onClick={() => scrollToSection('avantages')}>
                    Avantages
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 p-0 hover:text-white" onClick={() => scrollToSection('temoignages')}>
                    Témoignages
                  </Button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Ressources</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Centre d'aide</li>
                <li>Documentation</li>
                <li>Blog</li>
                <li>Webinaires</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Confidentialité</li>
                <li>Mentions légales</li>
                <li>CGU</li>
                <li>RGPD</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 Tymo. Tous droits réservés.
          </div>
        </div>
      </footer>
      
      {/* Parallax/Floating element */}
      <div 
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition-all" 
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
          opacity: scrollY > 300 ? 1 : 0,
          pointerEvents: scrollY > 300 ? 'auto' : 'none',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp size={24} />
      </div>
      
      {/* Animation decorative elements */}
      <div 
        className="fixed top-1/3 left-0 w-8 h-8 bg-purple-500 rounded-full opacity-20" 
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      ></div>
      <div 
        className="fixed top-2/3 right-0 w-16 h-16 bg-purple-300 rounded-full opacity-20" 
        style={{
          transform: `translateY(${scrollY * -0.05}px)`,
        }}
      ></div>
      <div 
        className="fixed top-1/2 left-8 w-4 h-4 bg-purple-700 rounded-full opacity-10" 
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      ></div>
    </div>
  );
}