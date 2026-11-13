import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const toggleButton = document.querySelector('#toggledark');
const html = document.querySelector('html');
if (toggleButton) {
  toggleButton.addEventListener('click', function () {
    html.classList.add('no-flash');
    html.classList.toggle('dark');
    toggleButton.setAttribute('aria-pressed', String(html.classList.contains('dark')));
    
    gsap.killTweensOf(toggleButton, 'rotation');
    const rotation = Number(gsap.getProperty(toggleButton, 'rotation'));
    const nextFullRotation = (Math.floor(rotation / 360) + 1) * 360;
    gsap.to(toggleButton, { rotation: nextFullRotation, duration: 0.2, ease: "power2.out" });
    
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(function () {
          html.classList.remove('no-flash');
        }, 10);
      });
    });
  });
}

const replayButton = document.querySelector("#Replay");
replayButton?.addEventListener("click", () => window.location.reload());

const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });
tl.from("form", { y: -200, opacity: 0, stagger: 0.2 })
  .from("li", { y: -200, opacity: 0, stagger: 0.2 })
  .from("h2", { y: -200, opacity: 0, stagger: 0.2 })
  .from("p", { y: -200, opacity: 0, stagger: 0.2 })
  .from("span", { y: -200, opacity: 0, stagger: 0.2 })
  .from("h1", { y: -200, opacity: 0, ease: "bounce.out" });

gsap.from("#services", {
  y: 50,
  opacity: 0,
  duration: 0.35,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#services",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

gsap.fromTo("#progressBar",
  { scaleX: 0 },
  {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: false,
    }
  }
);

//  if (document.querySelector("#services")) {
//   ScrollTrigger.create({
//     trigger: "#services",
//     start: "top top",
//     end: "bottom top",
//     pin: true,
//     markers: false,
//   });
// }