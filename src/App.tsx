import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Leaf, 
  Smartphone,
  Eye,
  ArrowRight,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

// TikTok Pixel & Events API Configuration
const TIKTOK_PIXEL_IDS = ['D9HS3P3C77UDT3P967TG', 'D9IEBAJC77U84G6G7PN0'];
const TIKTOK_ACCESS_TOKEN = '6fb1754dc33918094136a4e913b65b7aeba7171f';

declare global {
  interface Window {
    ttq?: any;
  }
}

// TikTok Server-Side Events API Helper (Dispatches to all active pixels)
const sendTikTokEventsApi = (eventName: string, params?: Record<string, any>) => {
  try {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    TIKTOK_PIXEL_IDS.forEach((pixelId) => {
      const payload = {
        pixel_code: pixelId,
        event: eventName,
        event_id: eventId,
        timestamp: new Date().toISOString(),
        context: {
          page: {
            url: window.location.href,
            referrer: document.referrer
          },
          user: {
            user_agent: navigator.userAgent
          }
        },
        properties: params || {}
      };

      fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': TIKTOK_ACCESS_TOKEN
        },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Ignore network CORS or adblocker restrictions silently
      });
    });
  } catch (e) {
    // Prevent breaking user experience
  }
};

// Dual TikTok Event Trigger Helper (Pixel Client-Side + Events API)
const trackTikTokEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track(eventName, params);
  }
  sendTikTokEventsApi(eventName, params);
};

// Route Change Tracker for TikTok Pixel & Events API PageView
function TikTokRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.ttq && typeof window.ttq.page === 'function') {
      window.ttq.page();
    }
    sendTikTokEventsApi('PageView');
  }, [location]);

  return null;
}

interface Remedy {
  letter: string;
  symptom: string;
  page: number;
  ingredient: string;
  preview: string;
}

const remediesData: Remedy[] = [
  { letter: 'A', symptom: 'Azia, Refluxo & Queimação no Estômago', page: 116, ingredient: 'Chá de Espinheira-Santa & Suco de Batata Doce', preview: 'Alívio imediato da queimação estomacal sem precisar de antiácidos químicos.' },
  { letter: 'A', symptom: 'Ansiedade, Estresse & Esgotamento Nervoso', page: 212, ingredient: 'Infusão Concentrada de Mulungu & Maracujá', preview: 'Acalma o sistema nervoso central de forma suave, reduzindo a tensão e palpitação.' },
  { letter: 'A', symptom: 'Articulações, Juntas & Dores Musculares', page: 340, ingredient: 'Compressa Tópica de Canela-de-Velho & Arnica', preview: 'Desinflama as articulações, joelhos e coluna em poucos dias de uso contínuo.' },
  { letter: 'C', symptom: 'Colesterol Alto, Triglicérides & Artérias', page: 351, ingredient: 'Alho Roxo Macerado com Limão e Azeite', preview: 'Ajuda a desobstruir artérias e regular as taxas sanguíneas naturally.' },
  { letter: 'C', symptom: 'Cólicas Intestinais & Prisão de Ventre', page: 327, ingredient: 'Chá de Ameixa Preta com Semente de Linhaça', preview: 'Estimula o trânsito intestinal sem causar dores abdominais ou diarreia.' },
  { letter: 'D', symptom: 'Dores nas Costas, Coluna e Peito', page: 325, ingredient: 'Cataplasma de Argila Verde com Sucupira', preview: 'Alivia dores lombares e rigidez muscular rapidamente.' },
  { letter: 'D', symptom: 'Dor de Cabeça e Enxaqueca Crônica', page: 196, ingredient: 'Óleo Essencial de Hortelã-Pimenta na Têmpora', preview: 'Descongestiona os vasos sanguíneos aliviando a pressão cefálica.' },
  { letter: 'F', symptom: 'Fígado Gorduroso & Doenças do Fígado', page: 220, ingredient: 'Chá de Alcachofra com Boldo-do-Chile', preview: 'Regenera as células hepáticas e limpa o acúmulo de gordura no fígado.' },
  { letter: 'G', symptom: 'Gases Intestinais & Flatulência', page: 228, ingredient: 'Infusão de Erva-Doce, Anis Estrelado e Carqueja', preview: 'Elimina o estufamento abdominal e os gases dolorosos imediatamente.' },
  { letter: 'G', symptom: 'Gripe, Tosse & Catarro na Garganta', page: 240, ingredient: 'Xarope Caseiro de Agrião, Mel e Própolis', preview: 'Expulsa o catarro retido nos pulmões e fortalece a imunidade.' },
  { letter: 'H', symptom: 'Hipertensão Arterial (Pressão Alta)', page: 258, ingredient: 'Água de Chuchu com Folha de Oliveira e Alho', preview: 'Potente vaso-dilatador natural para manter a pressão sob controle.' },
  { letter: 'I', symptom: 'Insônia & Sono Agitado', page: 278, ingredient: 'Chá de Camomila com Valeriana e Passiflora', preview: 'Induz ao sono profundo e restaurador sem causar dependência.' },
  { letter: 'M', symptom: 'Menopausa & Distúrbios Hormonais', page: 292, ingredient: 'Extrato Natural de Amora Preta & Sálvia', preview: 'Reduz os calorões, suores noturnos e oscilações de humor na menopausa.' },
  { letter: 'R', symptom: 'Rins, Cálculos Renais & Infecção Urinária', page: 344, ingredient: 'Chá de Quebra-Pedra com Cabelo de Milho', preview: 'Auxilia na dissolução de pedras nos rins e limpa o trato urinário.' },
  { letter: 'V', symptom: 'Varizes & Má Circulação nas Pernas', page: 380, ingredient: 'Banho de Assento com Castanha-da-Índia', preview: 'Alivia o inchaço, sensação de peso e dores nas pernas cansadas.' }
];

// Header Navigation Bar Component
function NavigationHeader({ largeFont, setLargeFont }: { largeFont: boolean; setLargeFont: (val: boolean) => void }) {
  return (
    <>
      <div className="top-notice-bar">
        <span>🌿 Atendimento Exclusivo para o Público do TikTok</span>
        <span className="highlight">Desconto de R$ 97 por R$ 12,95</span>
        <button 
          className="font-size-toggle" 
          onClick={() => setLargeFont(!largeFont)}
          title="Clique para aumentar ou diminuir a letra"
        >
          <Eye size={15} /> {largeFont ? 'Letra Normal' : 'Aumentar Letra A+'}
        </button>
      </div>
    </>
  );
}

// 1. PRESELL PAGE COMPONENT (/presell)
function PresellPage() {
  const [whatsappNumber] = useState('5547997114520');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Dor nas Articulações, Coluna e Músculos');

  const quizOptions = [
    { label: 'Dor nas Articulações, Coluna e Músculos', page: 340 },
    { label: 'Azia, Refluxo e Queimação no Estômago', page: 116 },
    { label: 'Insônia e Sono Agitado', page: 278 },
    { label: 'Pressão Alta (Hipertensão)', page: 258 },
    { label: 'Doenças do Fígado e Gordura no Fígado', page: 220 },
    { label: 'Prisão de Ventre, Gases e Estufamento', page: 327 },
    { label: 'Varizes e Má Circulação nas Pernas', page: 380 },
    { label: 'Ansiedade, Estresse e Esgotamento', page: 212 },
    { label: 'Colesterol e Triglicérides Altos', page: 351 },
    { label: 'Menopausa e Calorões', page: 292 },
    { label: 'Gripe, Tosse e Catarro no Peito', page: 240 },
    { label: 'Cálculo Renal e Dores nos Rins', page: 344 }
  ];

  const generateWhatsappLink = () => {
    const selectedObj = quizOptions.find(o => o.label === selectedSymptom);
    const pageText = selectedObj ? ` (Seção no Livro: Pág. ${selectedObj.page})` : '';
    const message = encodeURIComponent(
      `Olá! Vi o vídeo no TikTok sobre o Guia de Medicina Alternativa de A a Z por R$ 12,95.\nMeu foco principal é: ${selectedSymptom}${pageText}.\nGostaria de receber a recomendação e a oferta no WhatsApp!`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const handleWhatsappClick = (buttonPosition: string) => {
    // TikTok Pixel Event Triggers for WhatsApp Conversion
    trackTikTokEvent('ClickButton', { 
      button_name: `WhatsApp_${buttonPosition}`,
      symptom: selectedSymptom,
      value: 12.95,
      currency: 'BRL'
    });
    trackTikTokEvent('Contact', {
      content_name: 'Atendimento WhatsApp X1',
      symptom: selectedSymptom
    });
    trackTikTokEvent('InitiatePurchase', {
      content_name: 'Guia Medicina Alternativa A-Z',
      value: 12.95,
      currency: 'BRL'
    });
  };

  return (
    <div className="container">
      <div className="presell-wrapper">
        
        {/* Specialist Badge */}
        <div className="presell-avatar-box">
          <div className="presell-avatar">
            <Leaf size={24} />
          </div>
          <div className="presell-avatar-info">
            <div className="presell-avatar-name">Dra. Elena Soares | Saúde Natural</div>
            <div className="presell-avatar-status">
              <span className="status-dot"></span> Online agora no WhatsApp
            </div>
          </div>
        </div>

        {/* Presell Headline */}
        <h1 className="presell-title">
          Você sofre com <span>Dores no Corpo, Azia, Insônia</span> ou Pressão Alta no Dia a Dia?
        </h1>

        <p className="presell-description">
          Consulte o <strong>Índice Oficial de A a Z</strong> e descubra receitas naturais testadas para mais de 120 desconfortos da idade, <strong>por apenas R$ 12,95</strong>.
        </p>

        {/* TOP WHATSAPP CTA BUTTON */}
        <div style={{ marginBottom: '28px' }}>
          <a 
            href={generateWhatsappLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="presell-wa-button"
            onClick={() => handleWhatsappClick('Topo')}
          >
            <MessageCircle size={28} />
            <span>Falar no WhatsApp & Liberar Guia por R$ 12,95</span>
          </a>
        </div>

        {/* Product Mockup Preview */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src="/images/book_mockup.png" 
            alt="Guia Medicina Alternativa de A a Z" 
            style={{ maxWidth: '280px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
          />
        </div>

        {/* Interactive 1-click Quiz based on REAL BOOK INDEX */}
        <div className="presell-quiz-box">
          <div className="quiz-question-title">
            <HelpCircle size={20} />
            Qual o seu principal desconforto no momento? (Selecione 1 opção do Índice):
          </div>
          <div className="quiz-options">
            {quizOptions.map((opt) => (
              <button
                key={opt.label}
                className={`quiz-option-btn ${selectedSymptom === opt.label ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSymptom(opt.label);
                  trackTikTokEvent('ClickButton', { button_name: `QuizOption_${opt.label}` });
                }}
              >
                <span>🌿 {opt.label} <small style={{ color: '#2d6a4f', fontSize: '0.82rem' }}>(Pág. {opt.page})</small></span>
                <span style={{ fontSize: '1.2rem' }}>{selectedSymptom === opt.label ? '✓' : '→'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM WHATSAPP CTA BUTTON */}
        <a 
          href={generateWhatsappLink()} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="presell-wa-button"
          onClick={() => handleWhatsappClick('Quiz_Bottom')}
        >
          <MessageCircle size={28} />
          <span>Falar no WhatsApp & Liberar Guia por R$ 12,95</span>
        </a>

        <div style={{ marginTop: '16px', fontSize: '0.88rem', color: '#385141', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontWeight: 600 }}>
          <span>⚡ Resposta Imediata</span>
          <span>🔒 Conversa Segura no WhatsApp</span>
          <span>🛡️ Garantia de 7 Dias</span>
        </div>

      </div>
    </div>
  );
}

// 2. LANDING PAGE COMPONENT (/home)
function HomePage() {
  const [activeTab, setActiveTab] = useState<'mockup' | 'inside'>('mockup');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('TODOS');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredRemedies = remediesData.filter((remedy) => {
    const matchesSearch = remedy.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          remedy.ingredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === 'TODOS' || remedy.letter === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  const alphabet = ['TODOS', 'A', 'C', 'D', 'F', 'G', 'H', 'I', 'M', 'R', 'V'];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCheckout = (locationSource: string = 'Checkout_Main') => {
    // TikTok Pixel Conversion Events for Checkout
    trackTikTokEvent('AddToCart', { 
      content_name: 'Guia Medicina Alternativa de A a Z', 
      content_category: 'Ebook',
      value: 12.95, 
      currency: 'BRL',
      location: locationSource
    });
    trackTikTokEvent('InitiatePurchase', { 
      content_name: 'Guia Medicina Alternativa de A a Z', 
      content_category: 'Ebook',
      value: 12.95, 
      currency: 'BRL',
      location: locationSource
    });

    window.location.href = '#checkout';
    alert('Redirecionando para a página de checkout 100% segura...');
  };

  return (
    <>
      {/* Header Section / Hero */}
      <header className="hero-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="badge-tag">
              <Sparkles size={18} color="#1b4332" />
              Leitura Fácil & Soluções 100% Práticas
            </div>

            <h1 className="hero-title">
              Descubra Como Tratar as <span>Dores do Dia a Dia</span> com o Poder da Natureza.
            </h1>

            <p className="hero-subtitle">
              O guia completo de A a Z com receitas caseiras e remédios naturais que realmente funcionam, 
              organizado em linguagem simples para você encontrar a solução em segundos, <strong>sem depender de farmácias</strong>.
            </p>
          </div>

          {/* Product Showcase Visual */}
          <div className="product-showcase">
            <div className="mockup-wrapper">
              <div className="badge-seal">GUIA COMPLETO 2026</div>

              <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  onClick={() => setActiveTab('mockup')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #1b4332',
                    background: activeTab === 'mockup' ? '#1b4332' : '#ffffff',
                    color: activeTab === 'mockup' ? '#ffffff' : '#1b4332',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  📖 Capa do Livro
                </button>
                <button 
                  onClick={() => setActiveTab('inside')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #1b4332',
                    background: activeTab === 'inside' ? '#1b4332' : '#ffffff',
                    color: activeTab === 'inside' ? '#ffffff' : '#1b4332',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  📱 Leitura no Celular/Tablet
                </button>
              </div>

              <img 
                src={activeTab === 'mockup' ? "/images/book_mockup.png" : "/images/guia_digital_preview.png"} 
                alt="Mockup do Guia Medicina Alternativa de A a Z" 
                className="mockup-image" 
              />
              
              <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#52796f', fontStyle: 'italic' }}>
                *Acesso digital imediato no celular, tablet, computador ou para imprimir.
              </p>
            </div>

            {/* Direct Bullet Points */}
            <div className="benefits-list">
              <h3 style={{ fontSize: '1.4rem', color: '#1b4332', fontWeight: 800, marginBottom: '6px' }}>
                O que você vai encontrar dentro do Guia:
              </h3>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <CheckCircle2 size={22} />
                </div>
                <div className="benefit-content">
                  <h4>Receitas Caseiras Testadas</h4>
                  <p>Soluções naturais explicadas passo a passo para azia, dores musculares, insônia, pressão, ansiedade e muito mais.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <Leaf size={22} />
                </div>
                <div className="benefit-content">
                  <h4>100% Natural e Acessível</h4>
                  <p>Ingredientes simples e baratos que você já tem na sua cozinha ou encontra facilmente em qualquer feira.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <BookOpen size={22} />
                </div>
                <div className="benefit-content">
                  <h4>Fácil de Ler & Organizado de A a Z</h4>
                  <p>Índice alfabético super prático. Sentiu uma dor? Basta abrir na letra correspondente e achar a receita em segundos.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <Smartphone size={22} />
                </div>
                <div className="benefit-content">
                  <h4>Letras Grandes e Leitura Confortável</h4>
                  <p>Pensado especialmente para quem busca clareza visual sem cansar os olhos na tela do celular ou tablet.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Primary CTA Box */}
          <div className="cta-box" id="checkout">
            <span style={{ background: '#ffe6d5', color: '#e05200', padding: '6px 16px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem' }}>
              ⚡ PROMOÇÃO EXCLUSIVA DE HOJE
            </span>

            <div className="price-display">
              <div className="price-de">De R$ 97,00</div>
              <div className="price-por">
                <span>Por Apenas</span> R$ 12,95
              </div>
              <div className="price-installments">
                ou 2x de R$ 6,80 no cartão
              </div>
            </div>

            <button onClick={() => handleCheckout('Hero_CTA')} className="cta-button">
              <Sparkles size={24} />
              Quero Ter Acesso ao Guia Natural Agora
              <ArrowRight size={24} />
            </button>

            <div className="cta-subtext">
              <span>🔒 Compra 100% Segura</span>
              <span>⚡ Acesso Imediato por E-mail</span>
              <span>🛡️ Garantia de 7 Dias</span>
            </div>

            {/* Security Strip Seals */}
            <div className="security-strip">
              <div className="security-badge-item">
                <ShieldCheck size={20} color="#1b4332" />
                <span>Pagamento Criptografado</span>
              </div>
              <div className="security-badge-item">
                <Lock size={20} color="#1b4332" />
                <span>Dados 100% Protegidos</span>
              </div>
              <div className="security-badge-item">
                <CheckCircle2 size={20} color="#1b4332" />
                <span>Entrega Garantida</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Interactive Symptom Preview Section */}
      <section className="interactive-section">
        <div className="container">
          <h2 className="section-title">Veja Como é Prático Consultar o Guia</h2>
          <p className="section-subtitle">
            Digite o nome da sua dor ou selecione uma letra do abecedário para ver uma amostra de como as receitas são apresentadas com total clareza.
          </p>

          <div className="az-search-box">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={22} />
              <input 
                type="text" 
                className="search-input"
                placeholder="Ex: Azia, Fígado, Insônia, Dor nas Costas, Colesterol..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="alphabet-filter">
              <span style={{ fontWeight: 700, color: '#1b4332', alignSelf: 'center', marginRight: '6px', fontSize: '0.9rem' }}>
                Filtrar de A a Z:
              </span>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  className={`letter-btn ${selectedLetter === letter ? 'active' : ''}`}
                  onClick={() => setSelectedLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="remedy-cards-grid">
            {filteredRemedies.map((remedy, idx) => (
              <div key={idx} className="remedy-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="remedy-badge">LETRA {remedy.letter}</span>
                  <span style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 700, background: '#eef7f2', padding: '2px 8px', borderRadius: '8px' }}>Pág. {remedy.page}</span>
                </div>
                <h3 className="remedy-title">{remedy.symptom}</h3>
                <div className="remedy-ingredient">🌿 Receita: {remedy.ingredient}</div>
                <p className="remedy-desc">{remedy.preview}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px' }}>
              E mais de 120 outras receitas organizadas no livro completo!
            </p>
            <button onClick={() => handleCheckout('AZ_Section_CTA')} className="cta-button" style={{ maxWidth: '420px', padding: '16px 28px', fontSize: '1.1rem' }}>
              Garantir Meu Livro Completo por R$ 12,95
            </button>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="guarantee-section">
        <div className="container">
          <div className="guarantee-card">
            <div className="guarantee-seal-img">
              <div className="number">7</div>
              <div className="unit">DIAS DE<br/>GARANTIA</div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.8rem', color: '#1b4332', fontWeight: 800, marginBottom: '12px' }}>
                Sua Compra é 100% Segura e Sem Riscos!
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#2c4235', lineHeight: 1.6, marginBottom: '16px' }}>
                Confiamos tanto na qualidade e na facilidade de aplicação do guia <strong>"Medicina Alternativa de A a Z"</strong> que oferecemos uma garantia incondicional de 7 dias.
              </p>
              <p style={{ fontSize: '1rem', color: '#385141', lineHeight: 1.5 }}>
                Se você folhear o guia e achar que não valeu a pena ou não se adaptar à leitura, basta nos enviar uma mensagem e devolveremos <strong>100% do seu dinheiro</strong> imediatamente, sem perguntas e sem complicações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Reviews Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Quem Já Comprou e Recomenda</h2>
          <p className="section-subtitle">
            Veja a opinião de pessoas que buscavam soluções naturais e leitura confortável.
          </p>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar-circle">M</div>
                <div className="user-info">
                  <div className="name">Maria de Fátima, 58 anos</div>
                  <div className="city">Campinas - SP</div>
                </div>
              </div>
              <div className="stars">
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
              </div>
              <p className="testimonial-text">
                "Comprei depois de ver no TikTok e fiquei impressionada. As letras são grandes, fáceis de ler no meu celular. O chá para insônia funcionou no primeiro dia!"
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar-circle" style={{ background: '#2e7d32' }}>J</div>
                <div className="user-info">
                  <div className="name">José Geraldo, 64 anos</div>
                  <div className="city">Belo Horizonte - MG</div>
                </div>
              </div>
              <div className="stars">
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
              </div>
              <p className="testimonial-text">
                "Muito prático! Quando sinto azia ou dor nas costas, abro no índice da letra e já sei o que preparar na cozinha. Economizei muito dinheiro com remédios de farmácia."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar-circle" style={{ background: '#d97706' }}>S</div>
                <div className="user-info">
                  <div className="name">Sônia Regina, 52 anos</div>
                  <div className="city">Niterói - RJ</div>
                </div>
              </div>
              <div className="stars">
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <Star size={18} fill="#ffb703" color="#ffb703" />
              </div>
              <p className="testimonial-text">
                "Tinha receio de comprar na internet, mas o processo foi super seguro e recebi o arquivo na hora no meu e-mail e no WhatsApp. Recomendo para todos da minha idade!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Dúvidas Frequentes</h2>
          <p className="section-subtitle">
            Tudo o que você precisa saber antes de fazer o seu pedido.
          </p>

          <div className="faq-list">
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(0)}>
                <span>Como vou receber o livro após a compra?</span>
                {openFaq === 0 ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
              {openFaq === 0 && (
                <div className="faq-answer">
                  O acesso é imediato! Assim que o pagamento for confirmado (no PIX a liberação é na hora), você receberá um link seguro por e-mail e também pelo WhatsApp para baixar o guia em PDF no seu celular, tablet ou computador.
                </div>
              )}
            </div>

            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(1)}>
                <span>Consigo ler facilmente no meu celular?</span>
                {openFaq === 1 ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
              {openFaq === 1 && (
                <div className="faq-answer">
                  Sim! O guia foi formatado especialmente com letras grandes, alto contraste e formatação clara para facilitar a leitura em telas de qualquer tamanho sem cansar a vista. Se preferir, você também pode imprimir em papel.
                </div>
              )}
            </div>

            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(2)}>
                <span>Os ingredientes das receitas são difíceis de achar?</span>
                {openFaq === 2 ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
              {openFaq === 2 && (
                <div className="faq-answer">
                  Não. Todas as receitas priorizam ingredientes naturais, frutas, ervas e temperos fáceis de encontrar no seu mercado local, feira livre ou até mesmo já presentes na sua própria cozinha.
                </div>
              )}
            </div>

            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(3)}>
                <span>É seguro realizar a compra neste site?</span>
                {openFaq === 3 ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
              {openFaq === 3 && (
                <div className="faq-answer">
                  Totalmente seguro! Utilizamos plataformas de pagamento com segurança de nível bancário e criptografia SSL de 256 bits. Seus dados pessoais e de pagamento estão protegidos.
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => handleCheckout('FAQ_Section_CTA')} className="cta-button">
              <Sparkles size={24} />
              Quero Acessar o Guia Medicina Alternativa de A a Z Agora
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar for Mobile TikTok Converts */}
      <div className="sticky-bottom-bar">
        <div className="sticky-info">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>Guia Completo A-Z</div>
            <div className="sticky-price">
              R$ 12,95 <span className="sticky-old-price">R$ 97</span>
            </div>
          </div>
        </div>

        <button onClick={() => handleCheckout('Sticky_Bottom_CTA')} className="sticky-btn">
          Quero o Guia Agora ➔
        </button>
      </div>
    </>
  );
}

// MAIN APP ROUTER COMPONENT
export default function App() {
  const [largeFont, setLargeFont] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [toastName, setToastName] = useState('Dona Maria S. (SP)');

  const toastNames = [
    'Dona Maria S. (São Paulo - SP)',
    'Sr. Roberto F. (Belo Horizonte - MG)',
    'Dona Tereza M. (Curitiba - PR)',
    'Sr. Antônio G. (Rio de Janeiro - RJ)',
    'Dona Lúcia C. (Porto Alegre - RS)',
    'Dona Francisca V. (Salvador - BA)'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = toastNames[Math.floor(Math.random() * toastNames.length)];
      setToastName(randomName);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HashRouter>
      <TikTokRouteTracker />
      <div className={largeFont ? 'large-font-mode' : ''}>
        <NavigationHeader largeFont={largeFont} setLargeFont={setLargeFont} />

        <Routes>
          <Route path="/presell" element={<PresellPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/presell" replace />} />
          <Route path="*" element={<Navigate to="/presell" replace />} />
        </Routes>

        {/* Footer */}
        <footer>
          <div className="container">
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>
              🌿 Medicina Alternativa de A a Z
            </p>
            <p>Seu guia natural de saúde, bem-estar e autonomia para o dia a dia.</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '16px' }}>
              Aviso Legal: As informações contidas neste guia têm caráter educativo e informativo sobre terapias naturais e remédios caseiros tradicionais. Elas não substituem o diagnóstico ou acompanhamento médico profissional.
            </p>
            <p style={{ marginTop: '20px', fontSize: '0.85rem' }}>
              &copy; 2026 Medicina Alternativa de A a Z. Todos os direitos reservados. | <a href="#privacy">Termos & Privacidade</a>
            </p>
          </div>
        </footer>

        {/* Social Proof Floating Toast Notification */}
        {showToast && (
          <div className="social-toast">
            <div style={{ background: '#d8f3dc', padding: '8px', borderRadius: '50%', color: '#1b4332' }}>
              <CheckCircle2 size={20} />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#14281d' }}>
              <strong>{toastName}</strong><br />
              acabou de garantir o acesso pelo WhatsApp!
            </div>
          </div>
        )}
      </div>
    </HashRouter>
  );
}
