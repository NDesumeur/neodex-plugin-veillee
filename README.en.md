# Nightwatch

A pixel art survival game: alone in a meadow at night, lantern in hand, hold out until dawn against waves of creatures.

*Version française : [README.md](README.md)*

## Controls

- **Arrows** or **WASD** (or **ZQSD**): walk.
- **Mouse or finger**: hold down and you walk towards that point.
- When choosing an upgrade: **↑ ↓** then **Enter**, the **1 2 3** keys, or a click.
- **P** or **Esc**: pause.

## How it works

- Your weapons fire by themselves: you walk and dodge the creatures.
- They leave **crystals**: pick them up to level up. At each level, choose one upgrade out of three, each over 5 levels:
  - **Lantern**: a flash of light around you;
  - **Daggers**: thrown at the nearest creature;
  - **Fireflies**: they circle around you;
  - **Lightning**: strikes creatures on screen;
  - **Boots**, **Heart**, **Magnet**, **Wick** (fires more often) and **Oil** (stronger weapons).
- **Bats** are faster than you. **Shades**, **pumpkins** and **golems** arrive as the night goes on, and two **great crows** come at 5 and 8 minutes.
- Sometimes a creature leaves **bread**: it heals.
- Hold out **10 minutes**: dawn breaks and you win.

## Evolutions (new in 1.2.0)

A weapon raised to **level 5** evolves if you also have its **partner item** (at least level 1): the evolution then shows up first among the choices, with a purple frame, and replaces it for the rest of the night.

| Weapon level 5 | + item | = evolution |
|---|---|---|
| Lantern | Oil | **Lighthouse**: a huge, burning light, more often |
| Daggers | Boots | **Thousand blades**: 12 daggers all around, piercing 6 creatures |
| Fireflies | Magnet | **Swarm**: 9 green fireflies on a weaving circle |
| Lightning | Wick | **Thunderstorm**: 10 stronger bolts that burst onto nearby creatures |

An evolved weapon has purple points at the bottom of the screen. The **EVOLUTIONS** notebook in the right-hand column gives the four recipes, and the name of each evolution once you have found it.

## Stats

The Bests panel keeps your **longest night**, **dawns seen**, **creatures defeated** and the number of **games**.

## Data and sync

Your bests are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Nightwatch → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## Full screen

The "FULL SCREEN" button puts the game in full screen. The game also grows with the window, from a small laptop to a big screen.

## What's new in version 1.1.0

- **Full screen** (see above).
- **Four characters**, each with their starting weapon: the Watchman (lantern), the Huntress (daggers, by surviving 3 minutes), the Herbalist (fireflies, by surviving 6 minutes) and the Sorcerer (lightning, by seeing the dawn). Choose them in the right column.
- **Four maps**: the meadow, the graveyard (graves and fences), the forest (trees, ferns, mushrooms) and the farm (rows of wheat, fences, pumpkins).
- **Visible upgrades**: at the bottom of the screen, the icon of each upgrade you took and its level (up to 5 dots).
