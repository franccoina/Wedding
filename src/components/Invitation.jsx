import { useEffect, useState } from "react";
import { Check, X, Baby, User, UserPlus } from "lucide-react";
import {
  buildRsvpPayload,
  submitRsvpPayload,
  validateRsvpPayload,
} from "../services/rsvpService";

import couple1 from "../assets/img/couple-1.webp";
import couple2 from "../assets/img/couple-2.webp";
import couple3 from "../assets/img/couple-3.webp";
import couple4 from "../assets/img/couple-4.webp";
import couple5 from "../assets/img/couple-5.webp";
import couple6 from "../assets/img/couple-6.webp";
import couple7 from "../assets/img/couple-7.webp";
import couple8 from "../assets/img/couple-8.webp";
import couple9 from "../assets/img/couple-9.webp";

import dress1 from "../assets/img/dress-1.webp";
import dress2 from "../assets/img/dress-2.webp";
import dress3 from "../assets/img/dress-3.webp";
import dress4 from "../assets/img/dress-4.webp";

import ringsOrnament from "../assets/img/rings-ornament.webp";
import bowOrnament from "../assets/img/bow-ornament.webp";
import reception from "../assets/img/reception.webp";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import Swiper required modules
import { Pagination, Mousewheel, Keyboard } from "swiper/modules";

const weddingDate = new Date("2026-10-25T00:00:00-05:00");

const events = [
  { id: 1, time: "1:00 pm", title: "Ceremonia", text: "Parroquia Santa Bárbara de la Ayurá" },
  { id: 2, time: "2:30 pm", title: "Recepción", text: "Salón Sagrado Medellín" },
];

const coupleGallery = [
  { id: 1, src: couple1, alt: "Pareja viéndose abarazados de cerca" },
  { id: 2, src: couple2, alt: "Pareja caminando en un campo en sepia" },
  { id: 3, src: couple3, alt: "Pareja caminando agarrados del brazo" },
  { id: 4, src: couple4, alt: "Pareja viéndose sentados en blanco y negro" },
  { id: 5, src: couple5, alt: "Pareja agarrados de la mano de cerca" },
  { id: 6, src: couple6, alt: "Pareja corriendo en un campo en sepia" },
  { id: 7, src: couple7, alt: "Pareja viéndose de costado de cerca" },
  { id: 8, src: couple8, alt: "Pareja tocando sus manos de cerca en blanco y negro" },
  { id: 9, src: couple9, alt: "Pareja acostados en un campo" },
];

const dressCodeGallery = [
  { id: 1, src: dress1, alt: "Referencia de vestimenta masculina 1" },
  { id: 2, src: dress2, alt: "Referencia de vestimenta femenina 1" },
  { id: 3, src: dress3, alt: "Referencia de vestimenta masculina 2" },
  { id: 4, src: dress4, alt: "Referencia de vestimenta femenina 2" },
];

const contactMessage =
  "¡Hola! ¿Podrían ayudarme con indicaciones para llegar a los eventos de la boda? 😅🙏";

const contactWhatsAppUrl =
  `https://wa.me/573207701661?text=${encodeURIComponent(contactMessage)}`;

const mapUrlReception = "https://www.google.com/maps?rlz=1C1GCEA_enCO1178CO1178&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDIzMjlqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=co&sa=X&geocode=KZXN_6HLg0aOMRPmvgEX_yRq&daddr=v%C3%ADa+la+catedral,+Vereda+el+vallano+%23Kil%C3%B3metro+4,+Envigado,+Antioquia";
const mapEmbedUrlReception = "https://www.google.com/maps?q=Sagrado%20Medell%C3%ADn%2C%20V%C3%ADa%20La%20Catedral%2C%20Vereda%20El%20Vallano%2C%20Envigado%2C%20Antioquia&t=k&output=embed";

const mapUrlCeremony = "https://www.google.com/maps/search/?api=1&query=Parroquia+Santa+B%C3%A1rbara+de+la+Ayur%C3%A1,+Diagonal+31+%2334B+Sur-13,+Envigado,+Antioquia";
const mapEmbedUrlCeremony = "https://www.google.com/maps?q=Parroquia%20Santa%20B%C3%A1rbara%20de%20la%20Ayur%C3%A1%2C%20Diagonal%2031%20%2334B%20Sur-13%2C%20Envigado%2C%20Antioquia&t=k&output=embed";

const swiperSettings = {
  slidesPerView: "auto",
  spaceBetween: 16,
  centeredSlides: true,
  centeredSlidesBounds: true,
  centerInsufficientSlides: true,
  speed: 600,
  grabCursor: true,
  resistance: true,
  resistanceRatio: 0.5,
  longSwipesRatio: 0.25,
  watchSlidesProgress: true,
  simulateTouch: true,
  mousewheel: { forceToAxis: true },
  pagination: { clickable: true },
  keyboard: { enabled: true },
  modules: [Pagination, Mousewheel, Keyboard],
  className: "mySwiper",
};

function getCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());

  return [
    ["Días", Math.floor(distance / 86400000)],
    ["Horas", Math.floor((distance / 3600000) % 24)],
    ["Minutos", Math.floor((distance / 60000) % 60)],
    ["Segundos", Math.floor((distance / 1000) % 60)],
  ];
}

export function Invitation() {
  const [countdown, setCountdown] = useState(getCountdown);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvpData, setRsvpData] = useState(null);
  const [attendance, setAttendance] = useState("yes");
  const [ageRange, setAgeRange] = useState("adult");

  useEffect(() => {
    const intervalId = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(intervalId);
  }, []);

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
      <main>
        <section className="gallery-section light-paper-section" id="bienvenida">
          <p className="kicker">Con mucha alegría</p>
          <h2>¡Nos casamos!</h2>

          <p className="lead">
            Después de compartir tantos caminos, queremos celebrar el más bonito
            de todos junto a las personas que hacen especial nuestra historia.
          </p>

          <Swiper {...swiperSettings}>
            {coupleGallery.map((image) => (
              <SwiperSlide key={`couple-img-${image.id}`}>
                <img src={image.src} alt={image.alt} />
              </SwiperSlide>
            ))}
          </Swiper>
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
              <a href="#itinerario" rel="noreferrer">Ver horarios</a>
            </article>
            <article>
              <h3>Dónde</h3>
              <p>Salón Sagrado Medellín &<br /><b>Parroquia Santa Bárbara de la Ayurá</b></p>
              <a href="#ubicacion" rel="noreferrer">Ver ubicaciones</a>
            </article>
            <article>
              <h3>Vestuario</h3>
              <p>Código de vestuario<br /><b>Jardín Elegante</b></p>
              <a href="#vestimenta" rel="noreferrer">Ver referencias</a>
            </article>
          </div>
        </section>

        <section className="schedule-section light-paper-section" id="itinerario">
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

        <section className="schedule-section light-paper-section" id="contacto">
          <h3>¿Necesitas más ayuda para llegar?</h3>
          <p>
            Si requieres una orientación más específica o tienes algún imprevisto,
            puedes contactarnos por este medio.
          </p>
          <a className="contact-link" href={contactWhatsAppUrl} target="_blank" rel="noreferrer">Contactar vía WhatsApp</a>
        </section>

        <section className="map-section dark-paper-section" id="ubicacion-recepcion">
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

          <p className="lead">
            Los invitamos a vestir con un atuendo elegante y cómodo para un entorno natural, eligiendo
            tonos pastel o suaves. Les agradecemos reservar el blanco y sus tonalidades para la novia.
          </p>

          <Swiper {...swiperSettings}>
            {dressCodeGallery.map((image) => (
              <SwiperSlide key={`dress-code-img-${image.id}`}>
                <img src={image.src} alt={image.alt} />
              </SwiperSlide>
            ))}
          </Swiper>
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
                <img src={bowOrnament} width={88} height="auto" loading="lazy" alt="" />
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
                    <Check className="h-5 w-5" aria-hidden="true" />
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
                    <X className="h-5 w-5" aria-hidden="true" />
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
                          <Baby className="h-5 w-5" aria-hidden="true" />
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
                          <User className="h-5 w-5" aria-hidden="true" />
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
                          <UserPlus className="h-5 w-5" aria-hidden="true" />
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
          <img src={ringsOrnament} width={88} height="auto" loading="lazy" alt="" />
        </div>
        <p className="signature">Nuestra Boda</p>
        <span>25 · 10 · 2026</span>
      </footer>
    </>
  );
}
