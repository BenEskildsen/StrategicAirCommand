const {randomIn, normalIn} = require('bens_utils').stochastic;

const initGameState = (
  clientIDs, config,
) => {
  const game = {
    time: 0,
    tickInterval: null,

    worldSize: {...config.worldSize},
    canvasSize: {
      width: Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9),
      height: window.innerHeight * 0.9},

    entities: {},
    visibleEntities: {},
    planeTypesSeen: {},
    stats: {},

    fogLocations: [],
    selectedIDs: [],
    marquee: null,
    clientID: 1,
    clientIDs,
    clickMode: 'LAUNCH',
    launchName: 'U-2',
    showStats: true,

    showEnemies: false, // for debugging
    showEnemyFlightPaths: false, // for debugging

    planeDesigns: {
      1: {
       'U-2': {
         name: 'U-2', type: 'RECON', fuel: 3000, vision: 120, speed: 0.75, ammo: 0,
        },
       'B-52': {
         name: 'B-52', type: 'BOMBER', fuel: 2400, vision: 40, speed: 0.9, ammo: 1,
        },
       'F-101': {
         name: 'F-101', type: 'FIGHTER', fuel: 1500, vision: 45, speed: 1.8, ammo: 4,
        },
       'F-106': {
         name: 'F-106', type: 'FIGHTER', fuel: 600, vision: 55, speed: 2.3, ammo: 3,
        },
      },
      2: {
        'MIG-19': {
          name: 'MIG-19', type: 'FIGHTER', fuel: 1200, vision: 50, speed: 1.4, ammo: 1,
        },
        'Yak-28': {
          name: 'Yak-28', type: 'FIGHTER', fuel: 1600, vision: 40, speed: 1.2, ammo: 1,
        },
        'MIG-21': {
          name: 'MIG-21', type: 'FIGHTER', fuel: 600, vision: 50, speed: 2, ammo: 2,
        },
        'IL-28': {
          name: 'IL-28', type: 'BOMBER', fuel: 1400, vision: 60, speed: 1, ammo: 1,
        },
        'TU-95': {
          name: 'TU-95', type: 'BOMBER', fuel: 3000, vision: 60, speed: 0.6, ammo: 1,
        },
      },
    },

    hotKeys: {
      onKeyDown: {},
      onKeyPress: {},
      onKeyUp: {},
      keysDown: {},
    },
  };

  let i = 0;
  for (const clientID of clientIDs) {
    for (let j = 0; j < config.numAirbases[clientID]; j++) {
      const airbase =
        makeAirbase(
          clientID,
          {
            x: i == 0
              ? randomIn(40, 250)
              : randomIn(game.worldSize.width - 40, game.worldSize.width - 250),
            y: normalIn(200, game.worldSize.height - 200),
          },
          {...config.planes[clientID]},
        );
      game.entities[airbase.id] = airbase;
    }

    game.stats[clientID] = {
      'fighters_shot_down': 0,
      'bombers_shot_down': 0,
      'recons_shot_down': 0,
      'planes_no_fuel': 0,
      'fighter_sorties': 0,
      'bomber_sorties': 0,
      'recon_sorties': 0,
      'fighter_aces': 0,
      'airbases_destroyed': 0,
    },
    i++;
  }

  return game;
};


let nextID = 1;
const makeAirbase = (clientID, position, planes) => {
  return {
    clientID, id: nextID++,
    type: "AIRBASE",
    name: "AIRBASE", // helps with selection
    isBuilding: true,

    planes: {...planes}, // {[name]: number}

    vision: 60,

    position,
    targetPos: {...position},
    speed: 0,

    targetEnemy: null,
  };
}


const makePlane = (
  clientID, position, type, targetPos,
  parameters,
) => {
  const {
    fuel,
    vision,
    speed,
    name,
    ammo,
  } = parameters;
  return {
    clientID, id: nextID++,
    type, // FIGHTER | BOMBER | RECON
    isPlane: true,

    // dynamic parameters
    fuel,
    vision,
    speed,
    name,
    ammo,

    position,
    targetPos,

    targetEnemy: null,
    kills: 0,
  };
}


const makeExplosion = (
  position, maxRadius, duration,
) => {
  return {
    id: nextID++,
    type: 'EXPLOSION',
    duration,
    age: 0,
    position,
    maxRadius,
    clientID: 2,
    hasBeenDiscovered: true,
  }
};

module.exports = {
  initGameState,
  makeAirbase,
  makePlane,
  makeExplosion,
};
