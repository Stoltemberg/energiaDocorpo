import Image from "next/image";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { MobileStickyCta } from "./MobileStickyCta";

const whatsappNumber = "5551985920038";
const whatsappMessage = encodeURIComponent(
  "Olá! Vi o site da Energia do Corpo e quero conhecer os planos da academia.",
);
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Rua%20Gildo%20de%20Freitas%2C%20627%2C%20Olaria%2C%20Canoas%20RS";

const benefits = [
  {
    number: "01",
    title: "Musculação completa",
    text: "Estrutura para você ganhar força, condicionamento e consistência.",
  },
  {
    number: "02",
    title: "Cardio",
    text: "Equipamentos para acelerar o ritmo e cuidar da sua saúde.",
  },
  {
    number: "03",
    title: "Planos da academia",
    text: "Fale com a equipe e encontre a melhor opção para começar.",
  },
];

const journey = [
  {
    step: "01",
    title: "Chame no WhatsApp",
    text: "Fale com a equipe e escolha o melhor horário para conhecer a academia.",
  },
  {
    step: "02",
    title: "Conheça o espaço",
    text: "Tire suas dúvidas e veja como a academia pode fazer parte da sua rotina.",
  },
  {
    step: "03",
    title: "Comece sua evolução",
    text: "Dê o primeiro passo para uma rotina com mais força, saúde e confiança.",
  },
];

const faqs = [
  {
    question: "Preciso já ter experiência para treinar?",
    answer:
      "Não. A academia atende tanto quem está começando quanto quem já treina. Conte à equipe quais são seus objetivos no primeiro contato.",
  },
  {
    question: "Como posso conhecer os planos?",
    answer:
      "Chame a equipe no WhatsApp para receber as opções disponíveis e escolher a que mais combina com seus objetivos.",
  },
  {
    question: "Quais modalidades estão disponíveis?",
    answer:
      "A Energia do Corpo divulga musculação e cardio. Consulte a equipe para detalhes sobre a estrutura e os planos disponíveis.",
  },
  {
    question: "Onde fica a academia?",
    answer:
      "Na Rua Gildo de Freitas, 627, bairro Olaria, em Canoas. O botão de localização abre a rota no Google Maps.",
  },
];

function Arrow() {
  return <ArrowUpRightIcon className="action-arrow" />;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Energia do Corpo — início">
          <Image
            className="brand-logo"
            src="/logo-energia-do-corpo.png"
            alt="Energia do Corpo Academia"
            width="900"
            height="900"
            unoptimized
          />
        </a>
        <nav aria-label="Navegação principal">
          <a href="#estrutura">Estrutura</a>
          <a href="#modalidades">Modalidades</a>
          <a href="#localizacao">Localização</a>
        </nav>
        <a
          className="header-cta"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Ver planos <Arrow />
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-photo">
          <Image
            className="hero-image"
            src="/hero-producao.png"
            alt="Pessoa treinando com cabos em uma academia"
            fill
            sizes="100vw"
            priority
            unoptimized
          />
          <span className="photo-note">Imagem ilustrativa</span>
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <h1 aria-label="Mais energia. Mais resultados.">
            Mais energia.
            <br />
            Mais resultados.
          </h1>
          <p className="hero-copy">
            Musculação e cardio para você sair da intenção e começar a evoluir
            de verdade.
          </p>
          <a
            id="hero-plans-cta"
            className="primary-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>Conheça nossos planos</span>
            <ArrowUpRightIcon className="plan-arrow" />
          </a>
          <a
            className="location-link"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="pin" aria-hidden="true" />
            <span>Rua Gildo de Freitas, 627 — Olaria, Canoas</span>
          </a>
        </div>
        <div className="hero-stats" aria-label="Diferenciais">
          <div><strong>Musculação</strong><span>Treine força</span></div>
          <div><strong>Cardio</strong><span>Ganhe fôlego</span></div>
          <div><strong>Planos</strong><span>Fale com a equipe</span></div>
        </div>
      </section>

      <section className="manifesto section-shell" id="estrutura">
        <div>
          <p className="eyebrow"><span /> Seu próximo passo começa aqui</p>
          <h2>Não é só sobre treinar.<br />É sobre voltar mais forte.</h2>
        </div>
        <div className="manifesto-copy">
          <p>
            Você não precisa esperar a segunda-feira, o próximo mês ou a
            motivação perfeita. Precisa de um lugar que transforme decisão em
            movimento.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Quero conhecer a academia <Arrow />
          </a>
        </div>
      </section>

      <section className="benefits section-shell" id="modalidades">
        <div className="section-heading">
          <p className="section-index">[ O QUE VOCÊ ENCONTRA ]</p>
          <h2>Estrutura para<br />manter o ritmo.</h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article key={benefit.number} className="benefit-card">
              <span className="card-number">{benefit.number}</span>
              <div className="energy-mark" aria-hidden="true">E</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-band">
        <div className="split-photo">
          <Image
            className="split-image"
            src="/hero-producao.png"
            alt="Pessoa treinando em uma academia"
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div className="split-copy">
          <p className="eyebrow"><span /> Para todos os níveis</p>
          <h2>Seu começo não precisa ser perfeito.</h2>
          <p>
            Só precisa acontecer. Seja para ganhar força, melhorar o
            condicionamento ou cuidar mais de você, aqui o treino começa com o
            seu objetivo.
          </p>
          <ul>
            <li>Ambiente preparado para musculação e cardio</li>
            <li>Informações de planos direto com a equipe</li>
            <li>Academia no bairro Olaria, em Canoas</li>
          </ul>
          <a className="outline-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
            Falar com a equipe <Arrow />
          </a>
        </div>
      </section>

      <section className="journey section-shell">
        <div className="section-heading compact">
          <p className="section-index">[ SIMPLES ASSIM ]</p>
          <h2>Do “eu preciso”<br />ao “eu comecei”.</h2>
        </div>
        <div className="journey-grid">
          {journey.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="location-section" id="localizacao">
        <div className="map-panel">
          <div className="map-grid" aria-hidden="true">
            <span />
          </div>
          <div className="map-pin" aria-hidden="true">
            <Image
              src="/logo-energia-do-corpo.png"
              alt=""
              width={900}
              height={900}
              unoptimized
            />
          </div>
          <p>Olaria · Canoas</p>
        </div>
        <div className="location-copy">
          <p className="eyebrow"><span /> Perto de você</p>
          <h2>Sua nova rotina tem endereço.</h2>
          <address>
            Rua Gildo de Freitas, 627<br />
            Olaria — Canoas, RS
          </address>
          <a className="primary-cta small" href={mapsUrl} target="_blank" rel="noreferrer">
            <span>Abrir rota no Google Maps</span>
            <Arrow />
          </a>
          <a className="instagram-link" href="https://www.instagram.com/energiadocorpo.canoas/" target="_blank" rel="noreferrer">
            @energiadocorpo.canoas <Arrow />
          </a>
        </div>
      </section>

      <section className="faq section-shell">
        <div className="section-heading compact">
          <p className="section-index">[ TIRE SUAS DÚVIDAS ]</p>
          <h2>Perguntas frequentes.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {faq.question}
                <b aria-hidden="true">+</b>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow"><span /> Sua energia muda tudo</p>
        <h2>O melhor treino é<br />o que você começa.</h2>
        <p>Agende uma visita e conheça a Energia do Corpo.</p>
        <a className="primary-cta final-plans-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span>Conheça nossos planos</span>
          <ArrowUpRightIcon className="plan-arrow" />
        </a>
      </section>

      <footer>
        <a className="wordmark footer-brand" href="#inicio">
          <Image
            className="footer-logo"
            src="/logo-energia-do-corpo.png"
            alt="Energia do Corpo Academia"
            width="900"
            height="900"
            loading="lazy"
            unoptimized
          />
        </a>
        <p>Musculação e cardio em Canoas.</p>
        <div>
          <a href="https://www.instagram.com/energiadocorpo.canoas/" target="_blank" rel="noreferrer">Instagram</a>
          <a href={mapsUrl} target="_blank" rel="noreferrer">Localização</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <small>2026 Energia do Corpo Academia. Informações sujeitas a confirmação.</small>
      </footer>

      <MobileStickyCta href={whatsappUrl} />
    </main>
  );
}
