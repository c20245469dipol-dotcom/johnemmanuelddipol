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

if (document.querySelector("#services")) {
  ScrollTrigger.create({
    trigger: "#services",
    start: "top top",
    end: "bottom top",
    pin: true,
    markers: false,
  });
}

const canvas = document.querySelector("#physicsCanvas");
if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to initialize the physics canvas 2D context.");
  }

  const particles = [];
  const pointer = { x: 0, y: 0, active: false };

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle() {
    const radius = 12 + Math.random() * 18;
    return {
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 3.2,
      vy: (Math.random() - 0.5) * 2.8,
      radius,
      color: ['#fbbf24', '#60a5fa', '#34d399', '#c084fc', '#f472b6'][Math.floor(Math.random() * 5)],
    };
  }

  function initPhysics() {
    particles.length = 0;
    for (let i = 0; i < 14; i++) {
      particles.push(createParticle());
    }
  }

  function applyPointerForce() {
    if (!pointer.active) return;
    for (const particle of particles) {
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distanceSquared = dx * dx + dy * dy;
      const maxDistance = 150;

      if (distanceSquared < maxDistance * maxDistance && distanceSquared > 0.0001) {
        const distance = Math.sqrt(distanceSquared);
        const force = (maxDistance - distance) / maxDistance;
        particle.vx += (dx / distance) * force * 0.9;
        particle.vy += (dy / distance) * force * 0.9;
      }
    }
  }

  function updatePhysics() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    applyPointerForce();

    for (const particle of particles) {
      particle.vy += 0.08;
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x - particle.radius < 0) {
        particle.x = particle.radius;
        particle.vx *= -0.96;
      }
      if (particle.x + particle.radius > width) {
        particle.x = width - particle.radius;
        particle.vx *= -0.96;
      }
      if (particle.y - particle.radius < 0) {
        particle.y = particle.radius;
        particle.vy *= -0.9;
      }
      if (particle.y + particle.radius > height) {
        particle.y = height - particle.radius;
        particle.vy *= -0.88;
        particle.vx *= 0.99;
      }

      particle.vx *= 0.997;
      particle.vy *= 0.997;
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const first = particles[i];
        const second = particles[j];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const minDistance = first.radius + second.radius;

        if (distance < minDistance) {
          const overlap = (minDistance - distance) / 2;
          const nx = dx / distance;
          const ny = dy / distance;
          first.x -= nx * overlap;
          first.y -= ny * overlap;
          second.x += nx * overlap;
          second.y += ny * overlap;
          first.vx -= nx * 0.08;
          first.vy -= ny * 0.08;
          second.vx += nx * 0.08;
          second.vy += ny * 0.08;
        }
      }
    }
  }

  function drawPhysics() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    for (const particle of particles) {
      const gradient = context.createRadialGradient(
        particle.x - particle.radius * 0.2,
        particle.y - particle.radius * 0.3,
        2,
        particle.x,
        particle.y,
        particle.radius,
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.25, particle.color);
      gradient.addColorStop(1, "rgba(15, 23, 42, 0.15)");
      context.beginPath();
      context.fillStyle = gradient;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function animatePhysics() {
    updatePhysics();
    drawPhysics();
    requestAnimationFrame(animatePhysics);
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  window.addEventListener("resize", () => {
    resizeCanvas();
    initPhysics();
  });

  resizeCanvas();
  initPhysics();
  animatePhysics();
}