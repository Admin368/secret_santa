import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type RecursivePartial,
  type Engine,
  type IOptions,
} from "@tsparticles/engine";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { useEffect, useState } from "react";

const options: RecursivePartial<IOptions> = {
  preset: "snow",
  background: {
    color: "transparent",
  },
  particles: {
    opacity: {
      value: 0.5,
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
  },
};
export const options2: RecursivePartial<IOptions> = {
  //   background: {
  //     color: {
  //       value: "#000000",
  //     },
  //   },
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "bubble",
      },
      // resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      grab: {
        distance: 100,
        line_linked: {
          opacity: 1,
        },
        outer_shape: "circle",
        enable: true,
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "out",
      },
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        // area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      // random: true,
      value: 5,
    },
  },
};
export const Snow = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSnowPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return <Particles options={options} style={{ position: "fixed" }} />;
};
