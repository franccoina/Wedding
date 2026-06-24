import { useEffect, useRef, useState } from "react";
import { Check, X, Baby, User, UserPlus, ChevronDown } from "lucide-react";
import { BlossomCarousel } from "@blossom-carousel/react";
import { Analytics } from '@vercel/analytics/react';
import { MusicToggle } from "./components/MusicToggle";
import { backgroundAudioSrc } from "./config/rsvp";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import {
  buildRsvpPayload,
  submitRsvpPayload,
  validateRsvpPayload,
} from "./services/rsvpService";
import heroWedding from "./assets/img/hero-wedding.png";
import ringsOrnament from "./assets/img/rings-ornament.png";
import bowOrnament from "./assets/img/bow-ornament.png";
import stationery from "./assets/img/stationery.png";
import reception from "./assets/img/reception.png";
import invitationCover from "./assets/img/invitation-cover.jpg";
import invitationOpening from "./assets/vid/invitation-opening.mp4";
import weddingLogo from "../public/img/wedding-logo.png";
import "@blossom-carousel/react/style.css";

const weddingDate = new Date("2026-10-25T00:00:00-05:00");

const events = [
  { id: 1, time: "1:00 pm", title: "Ceremonia", text: "Parroquia Santa Bárbara de la Ayurá" },
  { id: 2, time: "2:30 pm", title: "Recepción", text: "Salón Sagrado Medellín" },
];

const coupleGallery = [
  { id: 1, src: heroWedding, alt: "Pareja caminando en una hacienda" },
  { id: 2, src: stationery, alt: "Papelería elegante de boda" },
  { id: 3, src: reception, alt: "Mesa de recepción iluminada con velas" },
  { id: 4, src: heroWedding, alt: "Pareja caminando en una hacienda" },
  { id: 5, src: stationery, alt: "Papelería elegante de boda" },
  { id: 6, src: reception, alt: "Mesa de recepción iluminada con velas" },
  { id: 7, src: heroWedding, alt: "Pareja caminando en una hacienda" },
  { id: 8, src: stationery, alt: "Papelería elegante de boda" },
  { id: 9, src: reception, alt: "Mesa de recepción iluminada con velas" },
  { id: 10, src: heroWedding, alt: "Pareja caminando en una hacienda" },
];

const dressCodeGallery = [
  { id: 1, src: heroWedding, alt: "Pareja caminando en una hacienda" },
  { id: 2, src: stationery, alt: "Papelería elegante de boda" },
  { id: 3, src: reception, alt: "Mesa de recepción iluminada con velas" },
  { id: 4, src: heroWedding, alt: "Pareja caminando en una hacienda" },
  { id: 5, src: stationery, alt: "Papelería elegante de boda" },
  { id: 6, src: reception, alt: "Mesa de recepción iluminada con velas" },
  { id: 7, src: heroWedding, alt: "Pareja caminando en una hacienda" },
  { id: 8, src: stationery, alt: "Papelería elegante de boda" },
  { id: 9, src: reception, alt: "Mesa de recepción iluminada con velas" },
  { id: 10, src: heroWedding, alt: "Pareja caminando en una hacienda" },
];

const contactWhatsAppUrl = "https://wa.me/573207701661/?text=¡Hola! ¿Por favor podrían ayudarme con indicaciones para llegar a los eventos de la boda? 😅🙏";

const mapUrlReception = "https://www.google.com/maps?rlz=1C1GCEA_enCO1178CO1178&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDIzMjlqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=co&sa=X&geocode=KZXN_6HLg0aOMRPmvgEX_yRq&daddr=v%C3%ADa+la+catedral,+Vereda+el+vallano+%23Kil%C3%B3metro+4,+Envigado,+Antioquia";
const mapEmbedUrlReception = "https://www.google.com/maps?q=Sagrado%20Medell%C3%ADn%2C%20V%C3%ADa%20La%20Catedral%2C%20Vereda%20El%20Vallano%2C%20Envigado%2C%20Antioquia&t=k&output=embed";

const mapUrlCeremony = "https://www.google.com/maps/search/?api=1&query=Parroquia+Santa+B%C3%A1rbara+de+la+Ayur%C3%A1,+Diagonal+31+%2334B+Sur-13,+Envigado,+Antioquia";
const mapEmbedUrlCeremony = "https://www.google.com/maps?q=Parroquia%20Santa%20B%C3%A1rbara%20de%20la%20Ayur%C3%A1%2C%20Diagonal%2031%20%2334B%20Sur-13%2C%20Envigado%2C%20Antioquia&t=k&output=embed";

function getCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());

  return [
    ["Días", Math.floor(distance / 86400000)],
    ["Horas", Math.floor((distance / 3600000) % 24)],
    ["Minutos", Math.floor((distance / 60000) % 60)],
    ["Segundos", Math.floor((distance / 1000) % 60)],
  ];
}

function App() {
  const [countdown, setCountdown] = useState(getCountdown);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvpData, setRsvpData] = useState(null);
  const [attendance, setAttendance] = useState("yes");
  const [ageRange, setAgeRange] = useState("adult");
  const introVideo = useRef(null);
  const music = useBackgroundMusic(backgroundAudioSrc);

  useEffect(() => {
    const intervalId = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("invitation-locked", !invitationOpen);
    return () => document.body.classList.remove("invitation-locked");
  }, [invitationOpen]);

  function openInvitation() {
    if (envelopeOpening) return;
    setEnvelopeOpening(true);
    introVideo.current?.play().catch(() => { });
  }

  function trackIntroProgress() {
    const video = introVideo.current;
    if (!video) return;
    if (video.currentTime > 0.05) setIntroVisible(true);
    if (video.duration - video.currentTime <= 0.8 && !invitationOpen) {
      setInvitationOpen(true);
    }
  }

  async function submitRsvp(event) {
    event.preventDefault();
    // Keep a reference to the form element: event.currentTarget becomes null
    // after the first await, so it cannot be used for reset() later on.
    const formElement = event.currentTarget;
    const payload = buildRsvpPayload(new FormData(formElement), attendance);
    const validationError = validateRsvpPayload(payload);

    if (validationError) {
      setRsvpError(validationError);
      return;
    }

    setRsvpSending(true);
    setRsvpError("");

    try {
      await submitRsvpPayload(payload);

      setRsvpData(payload);

      formElement.reset();
      setAttendance("yes");
      setAgeRange("adult");
      setRsvpSent(true);
    } catch (error) {
      console.error("No se pudo registrar el RSVP:", error);
      setRsvpError("No pudimos registrar tu respuesta. Inténtalo nuevamente.");
    } finally {
      setRsvpSending(false);
    }
  }

  return (
    <>
      <section className={`invitation-cover ${envelopeOpening ? "is-opening" : ""} ${invitationOpen ? "is-open" : ""}`} aria-hidden={invitationOpen} onClick={openInvitation}>
        <img className={`intro-media intro-poster ${introVisible ? "hidden" : ""}`} src={invitationCover} alt="Sobre de invitación con sello dorado" />
        <video
          className={`intro-media intro-video ${introVisible ? "visible" : ""}`}
          ref={introVideo}
          src={invitationOpening}
          poster={invitationCover}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={trackIntroProgress}
          onEnded={() => setInvitationOpen(true)}
        />
        {!envelopeOpening && <p className="intro-hint">Toca para abrir</p>}
      </section>

      <header className="hero" id="inicio" style={{ backgroundImage: `url(${heroWedding})` }}>
        <nav className="navbar">
          <a className="brand" href="#inicio">
            <img src={weddingLogo} width={40} height={40} alt="wedding-logo" />
          </a>
          <div className="nav-links">
            <a href="#detalles">El gran día</a>
            <a href="#vestimenta">Indicaciones</a>
            <a href="#confirmar">Confirmar</a>
          </div>
        </nav>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1><em className="couple-title">
            <span>Daniela</span>
            <span><small className="conjunction">&</small></span>
            <span>Michael</span>
          </em></h1>
          <p className="hero-date">25 · 10 · 2026</p>
          <a className="outline-button" href="#detalles">Descubre los detalles</a>
        </div>
        <a className="scroll-hint" href="#bienvenida" aria-label="Continuar">
          <b><ChevronDown /></b>
        </a>
      </header>

      <main>
        <section className="gallery-section light-paper-section" id="bienvenida">
          <p className="kicker">Con mucha alegría</p>
          <h2>¡Nos casamos!</h2>
          <p className="lead">
            Después de compartir tantos caminos, queremos celebrar el más bonito
            de todos junto a las personas que hacen especial nuestra historia.
          </p>

          <BlossomCarousel className="masonry-carousel">
            {coupleGallery.map((image) => (
              <div className="masonry-slide" key={`couple-img-${image.id}`}>
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </BlossomCarousel>
        </section>

        <section className="countdown-section">
          <p className="kicker light">La espera comienza</p>
          <h2>Faltan solamente</h2>
          <div className="countdown">
            {countdown.map(([label, value]) => (
              <div className="countdown-item" key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="details-section dark-paper-section" id="detalles">
          <p className="kicker">Guarda la fecha</p>
          <h2>El gran día</h2>
          <div className="details-grid">
            <article>
              <h3>Cuándo</h3>
              <p>Domingo<br /><b>25 de octubre de 2026</b></p>
              <small>Horario sujeto a itinerario</small>
            </article>
            <article>
              <h3>Dónde</h3>
              <p>Salón Sagrado Medellín &<br /><b>Parroquia Santa Bárbara de la Ayurá</b></p>
              <a href="#ubicacion" rel="noreferrer">Ver ubicaciones</a>
            </article>
            <article>
              <h3>Vestuario</h3>
              <p>Código de vestuario<br /><b>Elegante</b></p>
              <small>El blanco para la novia</small>
            </article>
          </div>
        </section>

        <section className="schedule-section light-paper-section">
          <p className="kicker">No te pierdas nada</p>
          <h2>Itinerario</h2>

          <div className="timeline-centered">
            {events.map((event, index) => (
              <article
                key={`events-${event.id}`}
                className={`timeline-event ${index % 2 === 0 ? "left" : "right"
                  }`}
              >
                <div className="timeline-content">
                  <time>{event.time}</time>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="map-section dark-paper-section" id="ubicacion">
          <div className="map-copy">
            <p className="kicker">Cómo llegar</p>
            <p>Parroquia Santa Bárbara de la Ayurá</p>
            <span>Diagonal 31 # 34B sur - 13, Envigado, Antioquia</span>
            <a className="map-link" href={mapUrlCeremony} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
          </div>
          <iframe
            title="Mapa de Parroquia Santa Bárbara de la Ayurá"
            src={mapEmbedUrlCeremony}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>

        <section className="schedule-section light-paper-section">
          <h3>¿Necesitas más ayuda para llegar?</h3>
          <p>A través de este medio puedes contactarnos por si necesitas orientación mas específica.</p>
          <a className="contact-link" href={contactWhatsAppUrl} target="_blank" rel="noreferrer">Contactar vía WhatsApp</a>
        </section>

        <section className="map-section dark-paper-section" id="ubicacion">
          <div className="map-copy">
            <p className="kicker">Cómo llegar</p>
            <p>Salón Sagrado Medellín</p>
            <span>Vía La Catedral, vereda El Vallano, km 4, Envigado, Antioquia</span>
            <a className="map-link" href={mapUrlReception} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
          </div>
          <iframe
            title="Mapa de Salón Sagrado Medellín"
            src={mapEmbedUrlReception}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>

        <section className="gallery-section light-paper-section" id="vestimenta">
          <p className="kicker">Referencias de</p>
          <h2>Vestimenta</h2>

          <BlossomCarousel className="masonry-carousel">
            {dressCodeGallery.map((image) => (
              <div className="masonry-slide" key={`dress-code-img-${image.id}`}>
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </BlossomCarousel>
        </section>

        <section className="quote-section" style={{ backgroundImage: `url(${reception})` }}>
          <div>
            <p>“De la suerte de encontrarnos a la fortuna de tenernos.”</p>
          </div>
        </section>

        <section className="gift-section light-paper-section" id="regalos">
          <p className="kicker">Lazos en forma de</p>
          <h2>Obsequios</h2>
          <p className="lead">
            Tu presencia es lo más importante para nosotros. Si además deseas
            tener un detalle, hemos preparado una opción sencilla.
          </p>
          <div className="gift-card">
            <h3>Lluvia de sobres</h3>
            <p>Encontrarás un espacio especial durante la celebración.</p>
          </div>
        </section>

        <section className="rsvp-section" id="confirmar">
          <div className="rsvp-intro">
            <h2>Confirmar asistencia</h2>
            <p>Completa este formulario para ayudarnos a preparar cada detalle.</p>
          </div>
          {rsvpSent ? (
            <div className="rsvp-confirmation">
              <div className="ornament">
                <img src={bowOrnament} width={88} height="auto" alt="bow-ornament" />
              </div>
              <h3>
                {rsvpData?.attendance === "yes"
                  ? "¡Gracias por confirmar!"
                  : "¡Gracias por avisar!"}
              </h3>
              <p>
                {rsvpData?.attendance === "yes"
                  ? "Hemos registrado tu respuesta. Nos alegra compartir este momento tan especial contigo."
                  : "Hemos registrado tu respuesta. Aunque no puedas asistir, te tendremos presente."}
              </p>
              <button type="button" onClick={() => setRsvpSent(false)}>Enviar otra respuesta</button>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={submitRsvp}>
              <fieldset className="attendance-field">
                <legend>¿Podrás acompañarnos?</legend>
                <div className="confirmation-options">
                  <label className={attendance === "yes" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={attendance === "yes"}
                      onChange={() => setAttendance("yes")}
                    />
                    <Check className="h-5 w-5" />
                    <span>Sí, allí estaré</span>
                  </label>

                  <label className={attendance === "no" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={attendance === "no"}
                      onChange={() => setAttendance("no")}
                    />
                    <X className="h-5 w-5" />
                    <span>No podré asistir</span>
                  </label>
                </div>
              </fieldset>

              <div className="form-grid">
                <label>
                  Nombre completo *
                  <input name="fullName" required placeholder="Escribe tu nombre" />
                </label>
                <label>
                  Teléfono
                  <input name="phone" type="tel" placeholder="+57 300 000 0000" />
                </label>
                {attendance === "yes" && (
                  <>
                    <fieldset className="attendance-field age-field">
                      <legend>Rango de edad</legend>
                      <div className="age-options">
                        <label className={ageRange === "child" ? "selected" : ""}>
                          <input
                            type="radio"
                            name="ageRange"
                            value="child"
                            checked={ageRange === "child"}
                            onChange={() => setAgeRange("child")}
                          />
                          <Baby className="h-5 w-5" />
                          <span>Niño</span>
                        </label>

                        <label className={ageRange === "young" ? "selected" : ""}>
                          <input
                            type="radio"
                            name="ageRange"
                            value="young"
                            checked={ageRange === "young"}
                            onChange={() => setAgeRange("young")}
                          />
                          <User className="h-5 w-5" />
                          <span>Joven</span>
                        </label>

                        <label className={ageRange === "adult" ? "selected" : ""}>
                          <input
                            type="radio"
                            name="ageRange"
                            value="adult"
                            checked={ageRange === "adult"}
                            onChange={() => setAgeRange("adult")}
                          />
                          <UserPlus className="h-5 w-5" />
                          <span>Adulto</span>
                        </label>
                      </div>
                    </fieldset>

                    <label className="form-full">
                      Restricciones alimentarias
                      <input name="dietary" placeholder="Vegetariano, alergias u otras indicaciones" />
                    </label>
                  </>
                )}
                <label className="form-full">
                  Mensaje para la pareja
                  <textarea name="message" rows="4" placeholder="Escribe unas palabras especiales" />
                </label>
              </div>
              {rsvpError && <p className="form-error">{rsvpError}</p>}
              <button className="submit-button" type="submit" disabled={rsvpSending}>
                {rsvpSending ? "Enviando..." : "Enviar confirmación"}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer>
        <div className="ornament">
          <img src={ringsOrnament} width={88} height="auto" alt="rings-ornament" />
        </div>
        <p className="signature">Nuestra Boda</p>
        <span>25 · 10 · 2026</span>
      </footer>

      <MusicToggle
        enabled={music.enabled}
        playing={music.playing}
        unavailable={music.unavailable}
        onToggle={music.toggle}
      />

      <Analytics />
    </>
  );
}

export default App;
