/**
 * ============================================================================
 * NASA MISSIONS COMPREHENSIVE DATA ENGINE (STAGE 2)
 * Space Apps Challenge Theme: "Abandoned but not Forgotten: Storytelling about
 * NASA's Discarded Equipment on the Moon and Mars."
 *
 * Full schema-compliant dataset of 10 curated NASA missions.
 * Fully verified astrodynamic, engineering, and historical archival data.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NASA_MISSIONS = factory();
    root.NASADataEngine = {
      getAllMissions: function() {
        return root.NASA_MISSIONS;
      },
      getMissionById: function(id) {
        return root.NASA_MISSIONS.find(function(m) { return m.id === id; });
      },
      getMissionsByFate: function(fate) {
        return root.NASA_MISSIONS.filter(function(m) { return m.fateCategory === fate; });
      },
      getMissionsByCelestialBody: function(body) {
        var term = body.toLowerCase();
        return root.NASA_MISSIONS.filter(function(m) {
          var landedMatch = m.landingSiteCoordinates &&
            m.landingSiteCoordinates.celestialBody &&
            m.landingSiteCoordinates.celestialBody.toLowerCase().indexOf(term) !== -1;
          var destMatch = m.destinations && m.destinations.some(function(d) {
            return d.toLowerCase().indexOf(term) !== -1;
          });
          return landedMatch || destMatch;
        });
      },
      getChapter: function(missionId, chapterNumberOrId) {
        var mission = this.getMissionById(missionId);
        if (!mission || !mission.storyRoadmap) return null;
        if (typeof chapterNumberOrId === 'number') {
          return mission.storyRoadmap[chapterNumberOrId - 1] || null;
        }
        return mission.storyRoadmap.find(function(c) {
          return c.chapterId === chapterNumberOrId || c.interactiveType === chapterNumberOrId;
        }) || null;
      }
    };
  }
})(typeof window !== 'undefined' ? window : this, function () {

  const missions = [
    // ========================================================================
    // MISSION 1: APOLLO 11
    // ========================================================================
    {
      id: 'apollo-11',
      name: 'Apollo 11',
      callsign: 'Columbia (CSM-107) & Eagle (LM-5)',
      agency: 'NASA',
      launchDate: '1969-07-16T13:32:00Z',
      endDate: '1969-07-24T16:50:35Z',
      fateCategory: 'resting_moon',
      currentStatusDescription: 'The Lunar Module Eagle descent stage (LM-5) sits undisturbed in the fine basaltic regolith of Mare Tranquillitatis. Surrounding it are the Laser Ranging Retroreflector (LRRR, still bounced by Earth laser observatories to measure lunar drift), the Passive Seismic Experiment Package (PSEP), Neil Armstrong and Buzz Aldrin\'s discarded lunar overshoes, jettisoned PLSS backpacks, Hasselblad cameras, the U.S. flag, and the immortal stainless-steel plaque declaring: "Here men from the planet Earth first set foot upon the Moon. July 1969 A.D. We came in peace for all mankind."',
      isStillTransmitting: false,
      destinations: [
        'Low Earth Orbit',
        'Translunar Injection Trajectory',
        'Lunar Orbit',
        'Tranquility Base, Mare Tranquillitatis, Moon'
      ],
      launchVehicle: 'Saturn V (SA-506)',
      launchSite: 'Kennedy Space Center, Launch Complex 39A, Merritt Island, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Moon',
        siteName: 'Tranquility Base (Mare Tranquillitatis)',
        latitude: 0.67408,
        longitude: 23.47297
      },
      spacecraftSpecs: {
        dryMassKg: 2034, // Eagle Descent Stage dry mass
        powerSource: 'Silver-Zinc (Ag-Zn) Chemical Batteries (5x 400 Ah in Descent Stage)',
        powerOutputWatts: 1600,
        communicationSystem: 'Unified S-band (USB) 2.2 GHz steerable dish, VHF lunar-to-orbit link, Erectable S-band high-gain antenna',
        instruments: [
          {
            name: 'Laser Ranging Retroreflector',
            acronym: 'LRRR',
            purpose: 'Reflects laser pulses emitted from terrestrial observatories to gauge Earth-Moon distance with sub-centimeter precision.',
            targetMeasurement: 'Lunar orbital recession rate (3.8 cm/year) and lunar core-mantle fluid dynamics.'
          },
          {
            name: 'Passive Seismic Experiment Package',
            acronym: 'PSEP',
            purpose: 'Self-powered seismometer deployed on lunar regolith to detect moonquakes, thermal fractures, and meteorite impacts.',
            targetMeasurement: 'Lunar internal crustal thickness, tectonic stress release, and meteorite flux.'
          },
          {
            name: 'Solar Wind Composition Experiment',
            acronym: 'SWC',
            purpose: 'Deployable platinum-free aluminum foil sheet exposed to the solar wind stream while astronauts explored the surface.',
            targetMeasurement: 'Isotopic abundance ratios of solar wind helium, neon, and argon ions unimpeded by an atmosphere.'
          },
          {
            name: 'Lunar Surface Television Camera',
            acronym: 'LSTV',
            purpose: 'Field-sequential black-and-white camera mounted on the Modular Equipment Stowage Assembly (MESA).',
            targetMeasurement: 'Live broadcast of Neil Armstrong stepping onto the lunar surface (10 fps, 320 lines scan).'
          }
        ]
      },
      trackingTier: 'historical_trajectory',
      distanceFromEarthAU: 0.00257, // ~384,400 km
      tagline: "One small step, one monumental monument in the Sea of Tranquility.",
      discardedEquipment: [
        'Lunar Module Eagle Descent Stage (LM-5)',
        'Laser Ranging Retroreflector (LRRR - still operational via ground lasers)',
        'Passive Seismic Experiment Package (PSEP)',
        'Solar Wind Composition sheet mast',
        'Two Portable Life Support System (PLSS) backpacks',
        'Lunar overshoes and Hasselblad 70mm camera bodies',
        'Commemorative Apollo 1 mission patch and Apollo 11 lunar plaque'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'The Audacious Kennedy Mandate',
          interactiveType: 'objective_choice',
          narrative: 'In May 1961, President John F. Kennedy challenged the nation to land a man on the Moon and return him safely to the Earth before the decade was out. NASA engineers faced a foundational architectural dilemma: direct ascent with a gigantic Nova rocket, Earth Orbit Rendezvous (EOR), or John Houbolt\'s radical Lunar Orbit Rendezvous (LOR) architecture requiring two separate spacecraft.',
          historicalContext: '1961-1962: NASA Langley engineer John Houbolt championed LOR against intense skepticism from NASA leadership, proving it shaved 50% off rocket payload requirements.',
          interactiveData: {
            dilemma: 'Choose the optimal orbital mission architecture to land on the Moon before 1970:',
            options: [
              {
                id: 'direct-ascent',
                title: 'Direct Ascent (Nova Super-Rocket)',
                pros: 'No docking in space required.',
                cons: 'Requires a mammoth 50-story Nova booster that cannot be built before 1975.',
                verdict: 'Mission fails due to schedule deadline.'
              },
              {
                id: 'eor',
                title: 'Earth Orbit Rendezvous (Dual Saturn launches)',
                pros: 'Uses smaller boosters.',
                cons: 'Requires risky orbital cryogenic propellant transfer in zero-g.',
                verdict: 'High operational risk; excessive development schedule.'
              },
              {
                id: 'lor',
                title: 'Lunar Orbit Rendezvous (Saturn V + CSM/LM)',
                pros: 'Only tiny specialized lander descends; minimizes return fuel mass by 50%.',
                cons: 'Critical life-or-death docking 380,000 km from home.',
                verdict: 'Optimal choice: Enabled Apollo 11 to beat the 1969 deadline!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'Forging the Spider: The Lunar Module',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Built by Grumman Aerospace in Bethpage, New York, the Lunar Module was humanity\'s first true extraterrestrial vehicle, designed solely to operate in the vacuum of space. Every gram was scrutinized: its aluminum skin was chemically milled down to the thickness of three sheets of aluminum foil (0.3 mm). The descent stage doubled as a four-legged launch pad to propel the ascent stage back into lunar orbit.',
          historicalContext: '1963-1969: Grumman engineers logged 9 million man-hours under lead engineer Tom Kelly, overcoming early fuel-tank welding cracks and weight crises.',
          interactiveData: {
            craftName: 'Grumman Lunar Module (LM-5 Eagle)',
            hotspots: [
              {
                id: 'dps-engine',
                title: 'Descent Propulsion System (DPS)',
                subsystem: 'Gimbaled Throttleable Hypergolic Rocket Engine',
                description: 'The world\'s first deeply throttleable rocket engine (10% to 60% and 100% thrust), burning Aerozine-50 and nitrogen tetroxide.',
                spec: '43.9 kN maximum thrust, throttleable down to 4.7 kN.'
              },
              {
                id: 'mesa',
                title: 'MESA Equipment Bay',
                subsystem: 'Modular Equipment Stowage Assembly',
                description: 'Hinged compartment containing the TV camera, lunar sample collection tools, and the EASEP scientific package.',
                spec: 'Deployed via a lanyard pulled by Neil Armstrong atop the descent ladder.'
              },
              {
                id: 'landing-gear',
                title: 'Crushable Honeycomb Landing Struts',
                subsystem: 'Structural Impact Attenuation',
                description: 'Four legs filled with deformable aluminum honeycomb to absorb the kinetic shock of landing, fitted with 1.7-meter sensing probes.',
                spec: 'Absorbed vertical touchdown velocities up to 3.0 m/s.'
              },
              {
                id: 'thermal-mylar',
                title: 'Kapton & Mylar Thermal Blankets',
                subsystem: 'Passive Thermal Control System (PTCS)',
                description: '25 layers of aluminized mylar and amber Kapton foil wrapped around the exterior to insulate against +120°C solar glare and -170°C shadows.',
                spec: 'Total weight under 18 kg across the descent stage.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'The Fire of Preparation',
          interactiveType: 'readiness_check',
          narrative: 'Before humans could walk on the Moon, every single component endured punishing qualifications: acoustic vibration chambers simulating Saturn V liftoff roar, vacuum bakeout chambers at Houston, and free-flight simulations in the hazardous Lunar Landing Research Vehicle (LLRV)—from which Armstrong ejected less than one second before a crash.',
          historicalContext: 'May 6, 1968: Neil Armstrong ejected safely from LLRV-1 at Ellington AFB when thruster helium pressure failed, parachuting clear 0.5 seconds before explosion.',
          interactiveData: {
            simulationName: 'Apollo 11 Go/No-Go Readiness Verification',
            checklist: [
              { item: 'Saturn V S-IC Stage Static Firing (5x F-1 engines)', status: 'PASS', notes: '34.5 million Newtons verified at Stennis test stand.' },
              { item: 'Lunar Module LM-5 Full Thermal-Vacuum Soak', status: 'PASS', notes: 'Vacuum Chamber B at MSC Houston: 120 hours at 10⁻⁶ torr.' },
              { item: 'Apollo Guidance Computer (AGC) Luminary 1A Code Verification', status: 'PASS', notes: 'Margaret Hamilton\'s priority scheduling logic verified for radar load shed.' },
              { item: 'LLRV/LLTV Astronaut Manual Pilot Qualification', status: 'PASS', notes: 'Armstrong logged 21 flights; Aldrin qualified on high-sink touchdowns.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Saturn V Liftoff: 7.5 Million Pounds of Roar',
          interactiveType: 'launch_sim',
          narrative: 'On July 16, 1969 at 09:32 EDT, Apollo 11 lifted off from LC-39A. The Saturn V burned 15 metric tons of RP-1 kerosene and liquid oxygen per second. The seismic rumble was detected across Florida. In 11 minutes, the crew was safely in Earth parking orbit, awaiting Translunar Injection.',
          historicalContext: 'July 16, 1969: 1 million spectators crowded Cocoa Beach and Cape Canaveral waterways to witness humanity\'s departure for another world.',
          interactiveData: {
            liftoffWeightKg: 2970000,
            thrustKN: 34500,
            maxQAltitudeKm: 13.5,
            maxQVelocityMach: 1.7,
            tliBurnDurationSeconds: 350,
            trajectoryOutcome: 'Clean Translunar Injection onto free-return trajectory.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'Translunar Coast & The Barbecue Roll',
          interactiveType: 'trajectory_scrub',
          narrative: 'Crossing 384,400 km of cislunar space required constant vigilance. The spacecraft executed Passive Thermal Control (PTC)—the "barbecue roll"—slowly spinning at 3 revolutions per hour to distribute solar thermal roasting evenly. Armstrong and Aldrin checked Eagle\'s systems through the docking tunnel while Michael Collins navigated using sextant sightings on Canopus.',
          historicalContext: 'July 16–19, 1969: Ground controllers at Houston monitored continuous telemetric pulses across the deep space tracking stations at Goldstone, Madrid, and Honeysuckle Creek.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Trans-Lunar Injection (TLI)', velocityKmS: 10.84, date: 'July 16' },
              { distancePct: 35, label: 'Mid-Course Correction 2 (MCC-2)', velocityKmS: 1.82, date: 'July 17' },
              { distancePct: 75, label: 'Earth-Moon Gravitational Neutral Point', velocityKmS: 1.05, date: 'July 18' },
              { distancePct: 92, label: 'Lunar Orbit Insertion (LOI-1)', velocityKmS: 2.58, date: 'July 19' },
              { distancePct: 100, label: 'Powered Descent Initiation (PDI)', velocityKmS: 1.69, date: 'July 20' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'The Eagle Has Landed',
          interactiveType: 'discovery_slider',
          narrative: 'During descent, the Apollo Guidance Computer flashed 1202 and 1201 alarm codes as the rendezvous radar overloaded memory. Armstrong peered through the triangular window to see the autopilot guiding them directly into a football-field-sized crater filled with house-sized boulders. Taking semi-manual attitude control, he flew past West Crater and set the Eagle down with barely 25 seconds of descent propellant remaining.',
          historicalContext: 'July 20, 1969, 20:17:40 UTC: "Houston, Tranquility Base here. The Eagle has landed." Charlie Duke responded: "Roger, Tranquility, we copy you on the ground. You got a bunch of guys about to turn blue. We\'re breathing again. Thanks a lot."',
          interactiveData: {
            events: [
              { timeCode: 'PDI + 05:00', title: '1202 Radar Buffer Overload', metric: 'AGC CPU Load: 115%', detail: 'Executive software drops low-priority tasks to keep descent throttle alive.' },
              { timeCode: 'PDI + 10:20', title: 'Manual Overflight of West Crater', metric: 'Altitude: 30 meters', detail: 'Armstrong tilts Eagle forward at 30 knots to clear dangerous boulder field.' },
              { timeCode: 'PDI + 12:35', title: 'Contact Light Illuminated', metric: 'Fuel Remaining: 2.1%', detail: 'Lunar probe touches regolith; engine shutoff 1 second prior to touchdown.' },
              { timeCode: 'EVA + 02:40', title: '21.5 kg of Lunar Basalt Cached', metric: 'Sample Box #1 Sealed', detail: 'Collected ancient titanium-rich ilmenite basalts dating back 3.7 billion years.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: Tranquility Base Today',
          interactiveType: 'then_vs_now',
          narrative: 'When Armstrong and Aldrin fired the ascent engine to rejoin Collins in orbit, the blast knocked over the nylon American flag. But the Eagle\'s descent stage remains standing steadfastly on the quiet plains of Mare Tranquillitatis. For over 55 years, it has withstood the unfiltered solar vacuum, cosmic rays, and micro-meteorite bombardment. The corner-cube laser retroreflector next to it continues to reflect pulses from Apache Point and McDonald Observatories today.',
          historicalContext: 'Tranquility Base is now protected by California and New Mexico historical registries and international heritage preservation guidelines.',
          interactiveData: {
            thenState: {
              date: 'July 20, 1969',
              appearance: 'Pristine gold-and-black Kapton foil, bright white descent thermal coating, sharp footprints in dark gray dust.',
              operationalState: 'Powered by silver-zinc batteries; live voice transmission to Houston.',
              thermalStatus: 'Active thermal circulation within cabin walls.'
            },
            nowState: {
              date: 'Present Day (55+ Years Later)',
              appearance: 'Foil weathered by solar UV photolysis; outer layers embrittled by micrometeorites; footprints preserved indefinitely.',
              operationalState: 'Batteries dead since July 1969; LRRR laser reflector remains 100% optically functional without electrical power.',
              thermalStatus: 'Cycling between -170°C lunar night and +120°C lunar noon every 29.5 Earth days.'
            },
            preservationNote: 'With no wind, rain, or flowing water, Armstrong\'s footprint alongside the Eagle ladder will remain visible for millions of years unless struck by a direct meteorite.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'Why did NASA leave the Lunar Module descent stage on the Moon instead of bringing it home?',
          shortAnswer: 'Rocket equation physics: Returning the 2-ton descent stage would have required hundreds of tons of additional fuel.',
          deepDive: 'In space exploration, every kilogram lifted from the lunar surface requires exponential rocket propellant all the way from Earth. The Apollo engineers realized the descent stage was an ideal stationary launchpad: its hypergolic fuel tanks and legs had fulfilled their sole purpose upon touchdown. Leaving it behind allowed the ascent stage to remain lightweight (just 4,700 kg loaded) so a modest 15.6 kN rocket engine could easily return the crew to lunar orbit.'
        },
        {
          question: 'Is the Apollo 11 American flag still standing at Tranquility Base?',
          shortAnswer: 'No, it was knocked down by the exhaust plume of the Lunar Module ascent engine when Armstrong and Aldrin blasted off.',
          deepDive: 'Buzz Aldrin watched through the small right-hand cockpit window as the ascent engine fired. The sudden blast of hot hypergolic gas blew over the flag planted barely 8 meters away. High-resolution photos from NASA\'s Lunar Reconnaissance Orbiter (LRO) in 2012 confirmed that while the flags at Apollo 12, 14, 15, 16, and 17 still cast shadows, no flag shadow exists at Apollo 11. Over 50 years of unfiltered solar ultraviolet radiation has also completely bleached any remaining fabric stark white.'
        },
        {
          question: 'How does the Apollo 11 Laser Reflector still work without electricity?',
          shortAnswer: 'It is a passive optical prism array made of 100 fused silica corner cubes that reflect laser beams directly back to their source.',
          deepDive: 'The Laser Ranging Retroreflector (LRRR) contains no electronics, wires, or batteries. It uses precision corner-cube retroreflectors—geometric silica prisms shaped like the corner of an interior cube. Any laser pulse directed at it from an Earth telescope reflects back at the exact identical angle. By timing how many seconds (roughly 2.5 seconds round-trip) light takes to return, scientists measure the Earth-Moon distance down to millimeters and proved the Moon is drifting away from Earth at 3.8 cm per year.'
        }
      ],
      quizQuestions: [
        {
          question: 'What crucial piece of Apollo 11 equipment left on the Moon is STILL actively used by scientists on Earth today?',
          options: [
            'The Lunar Surface Television Camera',
            'The Laser Ranging Retroreflector (LRRR)',
            'The Passive Seismic Experiment Package',
            'The Eagle ascent stage radio transponder'
          ],
          correctIndex: 1,
          explanation: 'The LRRR requires zero electrical power. Ground-based laser observatories continue to fire photons at Tranquility Base to measure lunar orbital drift and test Einstein\'s general relativity.'
        },
        {
          question: 'What famous computer alarm triggered repeatedly during Apollo 11\'s powered descent to the lunar surface?',
          options: [
            '404 Page Not Found',
            '1201 and 1202 Program Alarms',
            'Oxygen Tank Pressure Drop Alarm',
            'Saturn V Trajectory Drift Alert'
          ],
          correctIndex: 1,
          explanation: 'The 1201 and 1202 alarms signified that the Apollo Guidance Computer was receiving too many radar cycles. Thanks to Margaret Hamilton\'s priority-scheduling asynchronous software architecture, the computer safely shed low-priority tasks and kept the thruster guidance alive.'
        },
        {
          question: 'Why did Neil Armstrong manually fly past the original designated landing site in the Lunar Module Eagle?',
          options: [
            'The radar failed completely.',
            'The autopilot was steering them into a hazardous crater filled with giant boulders.',
            'He wanted to land closer to the American flag.',
            'Mission Control ordered him to change landing zones.'
          ],
          correctIndex: 1,
          explanation: 'The Apollo Guidance Computer was directing Eagle into West Crater, a boulder-strewn depression that would have tipped over or punctured the lander. Armstrong switched to semi-manual attitude control and flew downrange to find a smooth patch.'
        }
      ],
      sources: [
        {
          title: 'NASA Apollo 11 Mission Overview',
          url: 'https://www.nasa.gov/mission_pages/apollo/missions/apollo11.html',
          description: 'Official NASA historical archive for Apollo 11 milestones, telemetry, and crew debriefs.'
        },
        {
          title: 'Apollo Lunar Surface Journal: Tranquility Base',
          url: 'https://www.hq.nasa.gov/alsj/a11/a11.html',
          description: 'Verbatim transcripts and engineering debriefs of Apollo 11 surface operations edited by Eric M. Jones.'
        },
        {
          title: 'Lunar Reconnaissance Orbiter: Apollo 11 Resting Site High-Res Imagery',
          url: 'https://www.nasa.gov/mission_pages/LRO/multimedia/lroimages/apollosites.html',
          description: 'LROC Narrow Angle Camera images showing the Eagle descent stage, LRV equipment tracks, and ALSEP instruments from lunar orbit.'
        }
      ]
    },

    // ========================================================================
    // MISSION 2: APOLLO 15
    // ========================================================================
    {
      id: 'apollo-15',
      name: 'Apollo 15',
      callsign: 'Endeavour (CSM-112) & Falcon (LM-10)',
      agency: 'NASA',
      launchDate: '1971-07-26T13:34:00Z',
      endDate: '1971-08-07T20:45:53Z',
      fateCategory: 'resting_moon',
      currentStatusDescription: 'The Lunar Module Falcon descent stage and the first Lunar Roving Vehicle (LRV-001, the "Moon Buggy") rest side-by-side at the Hadley-Apennine landing site beside the sinuous Hadley Rille canyon. The rover was parked 90 meters away so its color television camera could broadcast Falcon\'s ascent stage liftoff. Nearby rests the Apollo Lunar Surface Experiments Package (ALSEP), the famous "Genesis Rock" extraction site, and the "Fallen Astronaut" memorial sculpture honoring astronauts and cosmonauts who died in the pursuit of space exploration.',
      isStillTransmitting: false,
      destinations: [
        'Low Earth Orbit',
        'Translunar Coast',
        'Lunar Orbit',
        'Hadley-Apennine Region (Hadley Rille), Moon'
      ],
      launchVehicle: 'Saturn V (SA-510)',
      launchSite: 'Kennedy Space Center, LC-39A, Merritt Island, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Moon',
        siteName: 'Hadley-Apennine (Hadley Rille)',
        latitude: 26.1322,
        longitude: 3.6339
      },
      spacecraftSpecs: {
        dryMassKg: 2809, // Falcon descent stage (expanded J-mission payload)
        powerSource: 'SNAP-27 Radioisotope Thermoelectric Generator (RTG, 73W) + 2x 36V Silver-Zinc batteries on LRV',
        powerOutputWatts: 73, // SNAP-27 RTG continuous electrical output
        communicationSystem: 'Lunar Communications Relay Unit (LCRU) with high-gain umbrella dish antenna mounted on LRV',
        instruments: [
          {
            name: 'Lunar Roving Vehicle 001',
            acronym: 'LRV-1',
            purpose: 'Four-wheeled electric rover enabling astronauts to traverse 27.8 km across mountains and rilles.',
            targetMeasurement: 'Geological exploration mobility, remote color TV transmission, regolith sample return expansion.'
          },
          {
            name: 'Heat Flow Experiment',
            acronym: 'HFE',
            purpose: 'Deep subsurface borehole probes measuring thermal gradients leaking from the lunar interior.',
            targetMeasurement: 'Lunar core heat flux and radioactive isotope decay rates.'
          },
          {
            name: 'Passive Seismic Experiment',
            acronym: 'PSE',
            purpose: 'Long-period and short-period triaxial seismometer monitoring deep moonquakes and meteorite strikes.',
            targetMeasurement: 'Lunar mantle seismic velocities and moonquake epicenter mapping.'
          },
          {
            name: 'Cold Cathode Gauge Experiment',
            acronym: 'CCGE',
            purpose: 'Measures the density and pressure of the fragile lunar exosphere.',
            targetMeasurement: 'Lunar atmospheric ambient gas pressure down to 10⁻¹² torr.'
          }
        ]
      },
      trackingTier: 'historical_trajectory',
      distanceFromEarthAU: 0.00257,
      tagline: "The first wheeled expedition into deep lunar valleys and mountain peaks.",
      discardedEquipment: [
        'Lunar Roving Vehicle 001 (LRV-1 "Moon Buggy")',
        'Falcon Descent Stage (LM-10)',
        'SNAP-27 Radioisotope Thermoelectric Generator (Pu-238 cask)',
        'Apollo Lunar Surface Experiments Package (ALSEP) central station',
        'Fallen Astronaut aluminum statuette and memorial plaque',
        'Lunar Communications Relay Unit (LCRU) umbrella dish',
        'Commander David Scott\'s geological hammer and falcon feather'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'The J-Mission Revolution',
          interactiveType: 'objective_choice',
          narrative: 'After the initial Apollo landings proved humans could reach the Moon, NASA expanded the spacecraft into the ambitious "J-class" missions. Apollo 15 would be the first to stay three days on the surface, carry double the scientific payload, and bring a vehicle to explore beyond walking distance.',
          historicalContext: '1969-1970: NASA upgraded the Saturn V engines and Lunar Module weight capacity to allow 3-day lunar stays and a folding electric rover.',
          interactiveData: {
            dilemma: 'How do you expand astronaut exploration range from a few hundred meters to over 20 kilometers?',
            options: [
              {
                id: 'lunar-flyer',
                title: 'Lunar Flying Vehicle (Rocket Pogo)',
                pros: 'Can leap over deep chasms.',
                cons: 'Consumes volatile hypergolic fuel; disastrous failure mode if thruster quenches.',
                verdict: 'Cancelled as too hazardous.'
              },
              {
                id: 'electric-buggy',
                title: 'Foldable Electric Rover (Boeing / Delco LRV)',
                pros: 'Folds into a triangular wedge outside the LM descent stage; zero-emission battery drive.',
                cons: 'Extreme mass limit of 210 kg.',
                verdict: 'Selected: LRV expanded exploration radius to 27.8 km!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'Origami in Titanium and Mesh: The LRV',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Designed by Boeing and Delco Electronics, the Lunar Roving Vehicle was an engineering marvel. It weighed just 210 kg on Earth (35 kg in lunar gravity) yet could carry twice its weight in astronauts and rock samples. Its wheels were not rubber—which would shatter in the lunar cold—but zinc-coated piano-wire mesh with titanium chevrons for traction.',
          historicalContext: '1970: Ferenc Pavlics at Delco designed the revolutionary wire-mesh tire after rubber tires failed thermal vacuum tests.',
          interactiveData: {
            craftName: 'Lunar Roving Vehicle 001',
            hotspots: [
              {
                id: 'mesh-wheels',
                title: 'Wire Mesh Tires',
                subsystem: 'Mobility & Traction',
                description: 'Woven zinc-coated steel piano wire mesh with titanium tread chevrons to grip powdery lunar regolith without puncturing.',
                spec: '81 cm diameter, 23 cm width, 0.25-horsepower electric drive per wheel.'
              },
              {
                id: 'folding-chassis',
                title: 'Origami Folding Chassis',
                subsystem: 'Structural Deployment Mechanism',
                description: 'Three-piece aluminum frame folded into a 1.5 x 0.5 meter quadrant of the Lunar Module descent bay, deployed via astronaut pulleys.',
                spec: 'Unfolded in under 5 minutes on the lunar surface.'
              },
              {
                id: 'color-tv-camera',
                title: 'RCA Ground-Controlled TV Unit',
                subsystem: 'Ground-Controlled Television Assembly (GCTA)',
                description: 'Color video camera operated remotely by Ed Fendell in Mission Control Houston with a 1.3-second light-speed delay.',
                spec: 'Tracked Falcon\'s ascent stage liftoff perfectly from 90 meters away.'
              },
              {
                id: 'lcru-antenna',
                title: 'High-Gain Umbrella Antenna',
                subsystem: 'Lunar Communications Relay Unit',
                description: 'Mesh parabolic umbrella antenna aimed directly at Earth for live high-bandwidth TV and astronaut bio-telemetry.',
                spec: '0.9-meter diameter directional S-band dish.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'Torturing the Moon Buggy',
          interactiveType: 'readiness_check',
          narrative: 'Engineers vibrated the LRV on shake tables to simulate Saturn V launch acoustics and ran it through simulated regolith troughs in vacuum chambers. Meanwhile, Commander Dave Scott and Lunar Module Pilot Jim Irwin trained in the volcanic craters of Flagstaff, Arizona, mastering geological field methods under USGS volcanologists.',
          historicalContext: 'Late 1970: Geologist Lee Silver trained Apollo 15 astronauts to become master field geologists, teaching them to identify primordial lunar crustal rock.',
          interactiveData: {
            simulationName: 'Apollo 15 LRV & J-Mission Readiness Verification',
            checklist: [
              { item: 'LRV Deployment Cord Tension Test', status: 'PASS', notes: 'Verified spring-assisted hinge deployment under 1/6th gravity simulation.' },
              { item: 'Independent 4-Wheel Drive Electric Hub Motor Qualification', status: 'PASS', notes: 'Harmonic drive units tested down to -150°C in liquid nitrogen.' },
              { item: 'SNAP-27 Plutonium RTG Cask Insertion Simulation', status: 'PASS', notes: 'Safe handling of 3.8 kg plutonium-238 fuel capsule.' },
              { item: 'Astronaut Geological Sampling in Cinder Lake Crater Field', status: 'PASS', notes: 'Scott and Irwin successfully identified simulated anorthosite samples.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Heavyweight Saturn V SA-510 Liftoff',
          interactiveType: 'launch_sim',
          narrative: 'Apollo 15 launched on July 26, 1971. It was the heaviest Apollo spacecraft stack ever launched: 140,000 kg placed in orbit thanks to uprated F-1 engines and thinned propellant tank walls. The mission cleared Earth without incident on a fast translunar trajectory.',
          historicalContext: 'July 26, 1971: The Saturn V first-stage burn was extended by 2.4 seconds to accommodate the expanded J-mission equipment mass.',
          interactiveData: {
            liftoffWeightKg: 2995000,
            thrustKN: 35100,
            maxQAltitudeKm: 13.7,
            maxQVelocityMach: 1.75,
            tliBurnDurationSeconds: 354,
            trajectoryOutcome: 'Direct injection into Hadley-Apennine high-inclination lunar transfer.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'Navigating into the Apennine Mountains',
          interactiveType: 'trajectory_scrub',
          narrative: 'Entering lunar orbit at an inclination of 28.7 degrees, Apollo 15 flew over towering mountain peaks rising 4,500 meters above the lunar plains. During powered descent, Falcon navigated over 4,000-meter Mount Hadley Delta before touching down near the edge of the 300-meter-deep Hadley Rille gorge.',
          historicalContext: 'July 30, 1971: Falcon touched down on an 11-degree tilt—the steepest of any Apollo landing—in soft regolith near Hadley Rille.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Trans-Lunar Injection', velocityKmS: 10.82, date: 'July 26' },
              { distancePct: 40, label: 'Mid-Course Correction 1', velocityKmS: 1.76, date: 'July 27' },
              { distancePct: 80, label: 'Lunar Orbit Insertion (LOI)', velocityKmS: 2.54, date: 'July 29' },
              { distancePct: 95, label: 'Descent Orbit Insertion (DOI)', velocityKmS: 1.63, date: 'July 30' },
              { distancePct: 100, label: 'Touchdown at Hadley-Apennine', velocityKmS: 0.0, date: 'July 30' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'The Genesis Rock & Galileo\'s Gravity Test',
          interactiveType: 'discovery_slider',
          narrative: 'Driving the rover up the slopes of Mount Hadley Delta, Dave Scott and Jim Irwin spotted a gleaming white rock atop a dark boulder: Sample 15415, the "Genesis Rock." It was a pristine sample of pure anorthosite dating back 4.1 billion years to the Moon\'s primordial magma ocean. Before leaving, Scott dropped a 1.3 kg aluminum geology hammer and a 0.03 kg falcon feather simultaneously—proving Galileo\'s hypothesis that all objects fall at the same rate in a vacuum.',
          historicalContext: 'August 2, 1971: Scott performed Galileo\'s gravity experiment before millions of live TV viewers, declaring: "How about that! Mr. Galileo was correct in his findings."',
          interactiveData: {
            events: [
              { timeCode: 'EVA 1', title: 'Hadley Rille Overlook', metric: 'Distance: 10.3 km driven', detail: 'Surveyed the steep volcanic collapse gorge Hadley Rille.' },
              { timeCode: 'EVA 2', title: 'Discovery of Genesis Rock', metric: 'Sample 15415 (269 grams)', detail: 'Confirmed magma ocean hypothesis of the early Moon\'s origin.' },
              { timeCode: 'EVA 3', title: 'Galileo Hammer-and-Feather Drop', metric: 'Simultaneous 1.2s fall', detail: 'Zero atmospheric resistance demonstrated live on television.' },
              { timeCode: 'Departure', title: 'Fallen Astronaut Memorial', metric: '8.5 cm statuette', detail: 'Secretly placed memorial plaque listing 14 fallen astronauts and cosmonauts.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: The Moon Buggy at Hadley Rille',
          interactiveType: 'then_vs_now',
          narrative: 'Parked precisely 90 meters east of Falcon, Lunar Roving Vehicle 001 remains where Dave Scott parked it on August 2, 1971. Its instrument panel, joystick controller, and wire-mesh wheels are frozen in time. The camera that filmed Falcon\'s ascent blast still points skyward. Alongside rests the SNAP-27 RTG cask, its plutonium decay warmth having cooled over half a century.',
          historicalContext: 'In 2011, NASA\'s Lunar Reconnaissance Orbiter photographed Hadley-Apennine at 25-centimeter resolution, resolving the rover and the dual tracks etched into the regolith.',
          interactiveData: {
            thenState: {
              date: 'August 2, 1971',
              appearance: 'Gleaming aluminum, wire tires coated in gray dust, antenna aligned with Earth, fresh tire tracks 27.8 km across the plains.',
              operationalState: 'Batteries hot (55°C); TV camera scanning the sky under Houston remote command.',
              thermalStatus: 'Warm from daytime operation; cooling fans shut down.'
            },
            nowState: {
              date: 'Present Day (53+ Years Later)',
              appearance: 'Fenders damaged with duct-tape repairs from mission still intact; mesh tires uncorroded; deep undisturbed dual tire tracks.',
              operationalState: 'Batteries fully dead; RTG electrical output zeroed out; static monument.',
              thermalStatus: 'Enduring regular lunar cycles between -170°C and +120°C.'
            },
            preservationNote: 'Apollo 15 is widely considered by planetary scientists as the most scientifically productive lunar expedition in human history.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'Why were the Apollo 15 Lunar Rover tires made of wire mesh instead of rubber?',
          shortAnswer: 'Rubber would have frozen rock-hard and shattered in the extreme -170°C lunar shadow or boiled off volatile oils in the vacuum.',
          deepDive: 'Standard rubber tires rely on vulcanized compounds and pressurized air. In the lunar vacuum, pressurized air would risk explosive decompression, while temperature swings between -170°C and +120°C would embrittle rubber until it shattered like glass. Boeing and Delco designed an open mesh of woven 0.8 mm zinc-coated steel piano wire. Inside was an inner titanium ring that prevented bottoming out, while exterior chevron treads provided aggressive traction on powdery regolith.'
        },
        {
          question: 'What is the secret "Fallen Astronaut" memorial left on Apollo 15?',
          shortAnswer: 'An 8.5 cm aluminum sculpture and memorial plaque listing 14 American astronauts and Soviet cosmonauts who died in service.',
          deepDive: 'Commander Dave Scott commissioned Belgian artist Paul Van Hoeydonck to create a tiny, stylized aluminum figurine representing a fallen explorer. Scott secretly placed the sculpture in the lunar regolith next to the LRV alongside a plaque listing 14 names—including Yuri Gagarin, Vladimir Komarov, Gus Grissom, Ed White, and Roger Chaffee. It was placed without NASA public relations approval and remains humanity\'s only memorial art installation on another world.'
        },
        {
          question: 'What was the Genesis Rock and why did it make scientists weep?',
          shortAnswer: 'It was a 4.1-billion-year-old sample of pure anorthosite that proved the Moon was once completely molten (a magma ocean).',
          deepDive: 'When geologist Lee Silver trained the Apollo 15 crew, he told them to search for light-colored anorthosite, a calcium-rich plagioclase feldspar that should have floated to the surface when the young Moon was a glowing ball of liquid magma. When Scott and Irwin spotted Sample 15415 glinting on Mount Hadley Delta, they immediately recognized it. Radioisotope dating proved it was 4.1 billion years old—formed when the solar system was in its infancy—confirming the Lunar Magma Ocean hypothesis.'
        }
      ],
      quizQuestions: [
        {
          question: 'What was the unique design of the Lunar Roving Vehicle tires to survive lunar conditions?',
          options: [
            'Solid carbon fiber molded rings',
            'Pneumatic vulcanized synthetic rubber',
            'Woven zinc-coated piano-wire mesh with titanium chevrons',
            'Solid titanium tank treads'
          ],
          correctIndex: 2,
          explanation: 'The tires were engineered from woven zinc-coated steel piano-wire mesh with riveted titanium chevrons, which prevented puncturing and handled -170°C to +120°C swings without freezing or popping.'
        },
        {
          question: 'What famous physics experiment did Commander Dave Scott perform on camera before leaving Hadley Rille?',
          options: [
            'He bounced a golf ball across the rille.',
            'He dropped a geology hammer and a falcon feather simultaneously in the lunar vacuum.',
            'He ignited a flare to test combustion.',
            'He tested water ice sublimation in a flask.'
          ],
          correctIndex: 1,
          explanation: 'Scott dropped a 1.3 kg steel hammer and a 0.03 kg falcon feather simultaneously. With zero atmospheric air resistance, both hit the lunar regolith at the exact same instant, validating Galileo\'s 400-year-old gravitational theory.'
        },
        {
          question: 'How far did the Apollo 15 Lunar Roving Vehicle drive during its three days of surface exploration?',
          options: [
            '1.2 kilometers',
            '27.8 kilometers',
            '75.4 kilometers',
            '120.0 kilometers'
          ],
          correctIndex: 1,
          explanation: 'The LRV-1 traversed a total odometer distance of 27.8 km across three EVAs, unlocking mountain exploration that was physically impossible on foot.'
        }
      ],
      sources: [
        {
          title: 'Apollo 15 Lunar Surface Journal: Hadley-Apennine',
          url: 'https://www.hq.nasa.gov/alsj/a15/a15.html',
          description: 'Comprehensive historical logs and transcripts of Apollo 15 exploration, edited by Eric M. Jones.'
        },
        {
          title: 'NASA Technical Report: Lunar Roving Vehicle Operations Handbook',
          url: 'https://ntrs.nasa.gov/citations/19710015566',
          description: 'Original Boeing/Delco LRV engineering manuals, schematics, and deployment mechanisms.'
        },
        {
          title: 'LROC Featured Site: Apollo 15 at Hadley-Apennine',
          url: 'https://www.lroc.asu.edu/posts/554',
          description: 'Arizona State University high-resolution orbital imagery of the Apollo 15 LRV, ALSEP, and surface tracks.'
        }
      ]
    },

    // ========================================================================
    // MISSION 3: VIKING 1 & 2
    // ========================================================================
    {
      id: 'viking-1-2',
      name: 'Viking 1 & 2',
      callsign: 'Viking Lander 1 (Thomas Mutch Memorial Station) & Viking Lander 2',
      agency: 'NASA',
      launchDate: '1975-08-20T21:22:00Z',
      endDate: '1982-11-13T00:00:00Z',
      fateCategory: 'silent_mars',
      currentStatusDescription: 'Viking Lander 1 rests silently in the ancient flood basin of Chryse Planitia ("Plains of Gold"), and Viking Lander 2 rests in Utopia Planitia. VL-1 operated for 2,245 sols before a ground controller inadvertently overwrote antenna tracking coordinates in November 1982, permanently severing contact. VL-2 lost battery power after 1,281 sols in 1980. Both landers remain physically intact on Mars, coated in fine reddish iron-oxide dust, enduring extreme temperature cycles and global dust storms for over five decades.',
      isStillTransmitting: false,
      destinations: [
        'Interplanetary Cruise',
        'Mars Orbit Insertion',
        'Chryse Planitia (VL-1, 22.48° N, 312.05° E)',
        'Utopia Planitia (VL-2, 47.97° N, 225.74° E)'
      ],
      launchVehicle: 'Titan IIIE / Centaur D-1T',
      launchSite: 'Cape Canaveral Air Force Station, LC-41, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Mars',
        siteName: 'Chryse Planitia (VL-1) & Utopia Planitia (VL-2)',
        latitude: 22.48,
        longitude: 312.05
      },
      spacecraftSpecs: {
        dryMassKg: 572, // Landed mass per lander
        powerSource: 'Dual SNAP-19 Radioisotope Thermoelectric Generators (Pu-238, 70W total continuous electrical)',
        powerOutputWatts: 70,
        communicationSystem: 'Steerable High-Gain S-band parabolic dish (direct-to-Earth) & UHF relay blade antenna (to Viking Orbiters at 381 MHz)',
        instruments: [
          {
            name: 'Viking Biology Experiment Package',
            acronym: 'VBEP',
            purpose: 'Three automated biochemical laboratories (Pyrolytic Release, Labeled Release, and Gas Exchange) testing for microbial respiration.',
            targetMeasurement: 'Carbon-14 assimilation, radioactive nutrient metabolism, and photosynthetic gas exchange.'
          },
          {
            name: 'Gas Chromatograph-Mass Spectrometer',
            acronym: 'GCMS',
            purpose: 'Pyrolyzed soil samples up to 500°C to identify volatile organic compounds.',
            targetMeasurement: 'Detection of organic carbon molecules at parts-per-billion sensitivity.'
          },
          {
            name: 'Dual Facsimile Scanning Cameras',
            acronym: 'FSC',
            purpose: 'Rotating mirror sensor capturing high-resolution stereoscopic 360° color panoramas of the Martian surface.',
            targetMeasurement: 'Surface geomorphology, rock distributions, and atmospheric optical depth.'
          },
          {
            name: 'Meteorology Boom Assembly',
            acronym: 'MET',
            purpose: 'Deployable boom recording atmospheric temperature, pressure, and three-dimensional wind vectors.',
            targetMeasurement: 'Diurnal Martian weather patterns, barometric pressure cycles, and dust storm frontal passages.'
          }
        ]
      },
      trackingTier: 'historical_trajectory',
      distanceFromEarthAU: 1.52,
      tagline: "Humanity's first successful operational touch upon the surface of the Red Planet.",
      discardedEquipment: [
        'Viking Lander 1 (Thomas Mutch Memorial Station)',
        'Viking Lander 2',
        'Two aeroshell bioshield covers (jettisoned in Mars orbit)',
        'Two supersonic disc-gap-band parachutes and backshells',
        'Two beryllium/titanium heat shields',
        'Surface sampler backhoes and soil dump piles'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'The Search for Life on the Red Planet',
          interactiveType: 'objective_choice',
          narrative: 'Following Mariner 4\'s 1965 flyby revealing Mars as a cratered desert, Carl Sagan and NASA scientists argued that only an automated biological laboratory landed directly on the surface could answer humanity\'s most profound question: Does life exist beyond Earth?',
          historicalContext: '1968-1971: NASA authorized the Viking Project under James S. Martin Jr. with an unprecedented budget to build two orbiters and two sterilized landers.',
          interactiveData: {
            dilemma: 'How do you design a biology experiment to detect alien microbes whose biology is unknown?',
            options: [
              {
                id: 'visual-microscope',
                title: 'High-Power Optical Microscope',
                pros: 'Direct visual confirmation.',
                cons: 'Requires living microbes to be directly under a tiny slide; cannot detect biochemical reactions.',
                verdict: 'Rejected as insufficient alone.'
              },
              {
                id: 'triad-biology',
                title: 'Three Biochemical Metabolism Tests (VBEP)',
                pros: 'Measures respiration, gas exchange, and carbon assimilation using radioisotopes.',
                cons: 'Complex plumbing weighing 15.5 kg in a cubic foot of space.',
                verdict: 'Selected: Flown on both Viking landers as the most sophisticated biology lab ever miniaturized.',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'The Sterile Marvel: Cleanroom Packaging',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Built by Martin Marietta in Denver, Colorado, the Viking Landers had to be baked in an autoclave oven at 116°C for 40 hours inside a pressurized bioshield container. This planetary protection protocol ensured that not a single terrestrial spore contaminated Mars.',
          historicalContext: '1974: The Viking bioshield encapsulation was the most stringent planetary quarantine procedure ever executed by NASA.',
          interactiveData: {
            craftName: 'Martin Marietta Viking Lander',
            hotspots: [
              {
                id: 'snap-rtg',
                title: 'Dual SNAP-19 RTGs',
                subsystem: 'Nuclear Power Generation',
                description: 'Plutonium-238 heat source powering thermoelectric couples inside protective wind covers.',
                spec: 'Provided 70 Watts of continuous electric power unaffected by night or dust storms.'
              },
              {
                id: 'collector-boom',
                title: 'Surface Sampler Collector Arm',
                subsystem: 'Sample Acquisition Mechanism',
                description: '3-meter retractable boom with a backhoe scoop and sieve chamber to dig trenches and deliver soil to the ovens.',
                spec: 'Capable of digging up to 22 cm deep into rocky regolith.'
              },
              {
                id: 'terminal-descent-engines',
                title: 'Three 18-Nozzle Monopropellant Thrusters',
                subsystem: 'Terminal Landing Propulsion',
                description: 'Hydrazine thrusters multi-nozzled to disperse exhaust plumes and avoid eroding the soil underneath the landing legs.',
                spec: 'Thrust throttleable from 276 N to 2,847 N.'
              },
              {
                id: 'biology-oven',
                title: 'Miniaturized Biology Lab (VBEP)',
                subsystem: 'Automated Biochemical Suite',
                description: '40,000 components, valves, and heaters packed into a 0.03 cubic meter container.',
                spec: 'Conducted Labeled Release, Pyrolytic Release, and Gas Exchange tests.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'The Heat of Sterilization',
          interactiveType: 'readiness_check',
          narrative: 'Every transistor, seal, and camera sensor had to survive both the thermal shock of dry heat sterilization at 116°C and the -125°C freeze of the Martian winter night. Hundreds of early components failed during autoclave qualification until high-temperature solder and Teflon seals were invented.',
          historicalContext: '1974-1975: Test landers were dropped onto simulated boulder fields at White Sands to verify three-legged landing stability.',
          interactiveData: {
            simulationName: 'Viking Lander Planetary Protection & Flight Qualification',
            checklist: [
              { item: '40-Hour Dry Heat Microbial Sterilization Cycle (116°C)', status: 'PASS', notes: 'Microbial bioburden reduced to less than 300 spores total.' },
              { item: 'Three-Legged Dynamic Landing Stability on 15° Slope', status: 'PASS', notes: 'Crushable honeycomb footpads absorbed 3.0 m/s vertical descent.' },
              { item: 'GCMS Pyrolysis Oven Cleanliness Verification', status: 'PASS', notes: 'Zero background organic hydrocarbon contamination verified.' },
              { item: 'Titan IIIE / Centaur Launch Vehicle Integration', status: 'PASS', notes: 'Centaur cryogenic stage mated with Titan solid rocket strap-ons.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Twin Titans Depart Cape Canaveral',
          interactiveType: 'launch_sim',
          narrative: 'Viking 1 launched on August 20, 1975, followed by Viking 2 on September 9, 1975 aboard Titan IIIE-Centaur rockets. After escaping Earth gravity, both spacecraft embarked on an 11-month, 800-million-kilometer interplanetary cruise.',
          historicalContext: 'August 1975: The Titan IIIE rocket featured the liquid-hydrogen Centaur upper stage, providing the energy needed to inject a massive 3,500 kg orbiter-lander duo to Mars.',
          interactiveData: {
            liftoffWeightKg: 640000,
            thrustKN: 10600,
            maxQAltitudeKm: 14.1,
            maxQVelocityMach: 1.8,
            tliBurnDurationSeconds: 310,
            trajectoryOutcome: 'Clean Mars Transfer Orbit with arrival targeted for July 1976.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'Mars Orbit & Scouting Safe Ground',
          interactiveType: 'trajectory_scrub',
          narrative: 'Viking 1 entered Mars orbit on June 19, 1976. The original July 4 American Bicentennial landing was cancelled when orbiter cameras showed the planned landing site was rugged and scarred by catastrophic ancient floods. Flight director James Martin delayed the landing by 16 days while the orbiter scouted Chryse Planitia for a smoother basin.',
          historicalContext: 'July 1976: Project Manager Jim Martin famously refused to rush the landing, stating: "I’d rather land safe than land on the Fourth of July."',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 11.1, date: 'Aug 20, 1975' },
              { distancePct: 50, label: 'Interplanetary Mid-Course Correction', velocityKmS: 2.1, date: 'Feb 1976' },
              { distancePct: 85, label: 'Mars Orbit Insertion (MOI)', velocityKmS: 4.4, date: 'June 19, 1976' },
              { distancePct: 92, label: 'Landing Site Resurvey Delay', velocityKmS: 3.2, date: 'July 4, 1976' },
              { distancePct: 100, label: 'Atmospheric Entry & Touchdown', velocityKmS: 0.0, date: 'July 20, 1976' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'First Sights and The Biology Enigma',
          interactiveType: 'discovery_slider',
          narrative: 'On July 20, 1976, Viking Lander 1 separated from the orbiter, plummeted through the atmosphere at 4.6 km/s protected by its heatshield, deployed its parachute, and fired terminal thrusters to touch down softly. Minutes later, the first clear black-and-white scan of footpad 3 and the rocky Martian soil appeared on screens at JPL. While the Labeled Release experiment showed a sudden release of radioactive gas when nutrient was injected, the GCMS detected no organic molecules—leading scientists to conclude the reaction was caused by soil chemistry (perchlorates) rather than living microbes.',
          historicalContext: 'July 20, 1976: Exactly seven years after Apollo 11 landed on the Moon, Viking 1 transmitted the first photographs from the surface of Mars.',
          interactiveData: {
            events: [
              { timeCode: 'Sol 0 (08:12 UTC)', title: 'First Photo of Mars Surface', metric: 'Resolution: 0.04°', detail: 'Footpad 3 and small pebbles captured in sharp relief.' },
              { timeCode: 'Sol 8', title: 'Labeled Release Gas Spike', metric: 'Radioactive C-14 counts > 10,000', detail: 'Nutrient broth triggers rapid release of labeled carbon dioxide.' },
              { timeCode: 'Sol 20', title: 'GCMS Pyrolysis Run', metric: 'Organic Carbon: < 1 ppb', detail: 'No organic building blocks detected; biology results deemed non-biological oxidation.' },
              { timeCode: 'Sol 500', title: 'Global Dust Storm Recorded', metric: 'Wind: 120 km/h; Optical Depth > 3', detail: 'Documented total darkening of Martian sky during planet-encircling tempest.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: The Silent Pioneers',
          interactiveType: 'then_vs_now',
          narrative: 'In 1982, an engineer uploaded an antenna battery software update that accidentally overwrote the high-gain antenna pointing tables, cutting off Viking 1 forever. Redesignated the Thomas Mutch Memorial Station, VL-1 sits silently in Chryse Planitia. Viking 2 rests 6,000 kilometers away in Utopia Planitia. Both are enveloped in an unbroken mantle of Martian dust, their cameras still staring toward the ochre horizon.',
          historicalContext: 'In 2006, NASA\'s Mars Reconnaissance Orbiter (MRO) High Resolution Imaging Science Experiment (HiRISE) located Viking Lander 1 and its backshell on Chryse Planitia.',
          interactiveData: {
            thenState: {
              date: 'July 1976',
              appearance: 'Clean metallic chassis, white bioshield remnants, shiny aluminum footpads resting on reddish sand.',
              operationalState: 'Continuous telemetry relayed via Viking 1 Orbiter and direct S-band to Earth.',
              thermalStatus: 'Active internal heaters maintaining electronics at +15°C.'
            },
            nowState: {
              date: 'Present Day (48+ Years Later)',
              appearance: 'Completely coated in a 1-millimeter mantle of oxidized iron rust dust; boom and cameras frozen.',
              operationalState: 'Completely silent since November 13, 1982; RTG isotopes decayed down to 10% thermal output.',
              thermalStatus: 'Equilibrated with ambient Martian temperatures (-120°C winter to -10°C summer).'
            },
            preservationNote: 'Viking proved that long-duration automated robotic exploration of the Martian surface was viable, paving the way for Pathfinder, Spirit, Opportunity, Curiosity, and Perseverance.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'Did the Viking landers find life on Mars?',
          shortAnswer: 'The official consensus is no: The metabolic reactions observed were caused by reactive perchlorate chemicals in the soil, not living cells.',
          deepDive: 'The Labeled Release (LR) experiment designed by Gilbert Levin detected a strong release of radioactive carbon gas when organic nutrient broth was drizzled onto the soil—a positive bio-signature on Earth. However, the Gas Chromatograph-Mass Spectrometer (GCMS) found zero organic molecules in the same soil down to parts per billion. Scientists later realized that ultraviolet radiation creates powerful chemical oxidizers (superoxides and perchlorates) on Mars that break down organic broth without any microbes present.'
        },
        {
          question: 'How was Viking 1 accidentally silenced from Earth?',
          shortAnswer: 'A ground controller uploaded an antenna algorithm update that overwrote the transmitter pointing coordinates, pointing the dish away from Earth.',
          deepDive: 'In November 1982, engineers at NASA sent a routine software command to Viking Lander 1 to recondition its aging nickel-cadmium batteries. Unbeknownst to the team, the memory location chosen for the new code overlapped with the look-up table used by the high-gain dish antenna to track Earth. When the antenna initialized, it pointed into empty space. NASA spent months transmitting blind beacon signals to recover the lander, but no response was ever heard again.'
        },
        {
          question: 'Why did the Viking landers use nuclear power instead of solar panels?',
          shortAnswer: 'Solar panels in the 1970s were too heavy, too fragile, and would have been choked to death by Martian dust storms and cold winter nights.',
          deepDive: 'Martian winters at 22° and 48° North latitude feature short daylight hours and temperatures dipping to -125°C. Furthermore, global dust storms blot out over 95% of sunlight. The dual SNAP-19 Radioisotope Thermoelectric Generators (RTGs) provided 70 Watts of steady electric current and hundreds of watts of waste heat to keep the internal biology instruments warm, allowing Viking 1 to survive 6 continuous years on Mars.'
        }
      ],
      quizQuestions: [
        {
          question: 'What heating process was applied to the entire Viking Lander before launch to prevent contaminating Mars?',
          options: [
            'Baking in an autoclave oven at 116°C for 40 hours',
            'Irradiation with cobalt-60 gamma rays',
            'Submersion in liquid nitrogen and chlorine bath',
            'High-voltage electron beam scanning'
          ],
          correctIndex: 0,
          explanation: 'To meet international planetary protection treaties, each Viking lander was sealed in a bioshield capsule and baked at 116°C for 40 hours to destroy any terrestrial bacterial spores.'
        },
        {
          question: 'Why did Viking 1\'s landing have to be postponed from its original target date of July 4, 1976?',
          options: [
            'A solar flare knocked out communications.',
            'Orbiter photos revealed the original landing site was dangerously rocky and scarred by ancient mega-floods.',
            'The Titan rocket upper stage had an engine anomaly.',
            'The Soviet Union landed a rover in the same spot first.'
          ],
          correctIndex: 1,
          explanation: 'Orbiter imagery showed that the planned American Bicentennial landing site was dangerously rough. Flight director James Martin delayed the landing 16 days while scouting Chryse Planitia for a safer zone.'
        },
        {
          question: 'What nuclear power system kept Viking 1 operating for over 2,200 sols in the freezing Martian environment?',
          options: [
            'Lithium-ion supercapacitors',
            'Dual SNAP-19 Radioisotope Thermoelectric Generators (RTGs)',
            'A fission nuclear reactor core',
            'Hydrogen-oxygen fuel cell tanks'
          ],
          correctIndex: 1,
          explanation: 'The lander utilized dual SNAP-19 RTGs fueled by Plutonium-238, providing 70 Watts of continuous electricity and thermal heating that defied the -125°C winter cold.'
        }
      ],
      sources: [
        {
          title: 'NASA History Division: On Mars - Exploration of the Red Planet 1958-1978',
          url: 'https://history.nasa.gov/SP-4212/on-mars.html',
          description: 'Definitive historical monograph on the design, execution, and science of the Viking project.'
        },
        {
          title: 'NASA Solar System Exploration: Viking 1 & 2 Archive',
          url: 'https://solarsystem.nasa.gov/missions/viking-1/in-depth/',
          description: 'Official NASA mission logs, telemetry specifications, and landed science archives.'
        },
        {
          title: 'HiRISE MRO: High-Resolution Imaging of Viking Lander 1 in Chryse Planitia',
          url: 'https://www.uahirise.org/PSP_001521_2025',
          description: 'Orbital imaging from 250 km altitude showing Viking 1 resting among Chryse dunes.'
        }
      ]
    },

    // ========================================================================
    // MISSION 4: MARS PATHFINDER & SOJOURNER
    // ========================================================================
    {
      id: 'pathfinder-sojourner',
      name: 'Mars Pathfinder & Sojourner',
      callsign: 'Carl Sagan Memorial Station & Sojourner Rover',
      agency: 'NASA/JPL',
      launchDate: '1996-12-04T06:58:07Z',
      endDate: '1997-09-27T10:23:00Z',
      fateCategory: 'silent_mars',
      currentStatusDescription: 'Resting at Ares Vallis in Chryse Planitia. The three-petaled lander (posthumously designated the Carl Sagan Memorial Station) and the microwave-oven-sized micro-rover Sojourner operated nearly 3 times and 12 times their design lifespans respectively. The station went silent on Sol 83 after its primary silver-zinc battery died from thermal degradation. Sojourner\'s autonomous contingency logic programmed it to circle the lander when radio signals ceased; it likely stands frozen within a few paces of the lander petals.',
      isStillTransmitting: false,
      destinations: [
        'Interplanetary Cruise',
        'Direct Atmospheric Entry',
        'Ares Vallis, Chryse Planitia, Mars'
      ],
      launchVehicle: 'Delta II 7925',
      launchSite: 'Cape Canaveral Air Force Station, LC-17B, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Mars',
        siteName: 'Carl Sagan Memorial Station, Ares Vallis',
        latitude: 19.33,
        longitude: 326.45 // 33.55° W
      },
      spacecraftSpecs: {
        dryMassKg: 264, // Lander 264 kg + Sojourner rover 10.6 kg
        powerSource: 'Lander: GaAs Solar Panels + 40 Ah Silver-Zinc battery; Rover: 0.22 m² Solar Array + 3x D-cell LiSOCl2 batteries',
        powerOutputWatts: 100, // Lander ~100W peak; Rover ~16W peak
        communicationSystem: 'Lander: Steerable High-Gain Antenna (HGA) X-band direct to Earth; Rover: UHF radio modem (9600 baud) communicating with Lander',
        instruments: [
          {
            name: 'Alpha Proton X-ray Spectrometer',
            acronym: 'APXS',
            purpose: 'Sensor head on deployment arm placed against rocks to determine elemental chemical composition.',
            targetMeasurement: 'Abundances of silica, aluminum, sulfur, and iron in Martian rocks like "Barnacle Bill" and "Yogi".'
          },
          {
            name: 'Imager for Mars Pathfinder',
            acronym: 'IMP',
            purpose: 'Stereoscopic camera mast rising 0.8 meters above the lander petal with color filter wheels.',
            targetMeasurement: 'True-color 3D panoramas, atmospheric dust opacity, windsock deflection vectors.'
          },
          {
            name: 'Atmospheric Structure Instrument / Meteorology Package',
            acronym: 'ASI/MET',
            purpose: 'Mast-mounted thermocouple and pressure sensor recording atmospheric entry profiles and diurnal weather.',
            targetMeasurement: 'Entry deceleration deceleration curve, surface temperature swings, thermal dust devil vortices.'
          },
          {
            name: 'Rover Wheel Abrasion Experiment',
            acronym: 'WAE',
            purpose: 'Thin metal films on rover wheels monitored by photocells to evaluate regolith friction wear.',
            targetMeasurement: 'Abrasiveness and grain hardness of Martian surface dust.'
          }
        ]
      },
      trackingTier: 'historical_trajectory',
      distanceFromEarthAU: 1.52,
      tagline: "The 10-kilogram robotic pioneer that re-opened the Martian frontier.",
      discardedEquipment: [
        'Carl Sagan Memorial Station (three deployable petals)',
        'Sojourner Micro-Rover (10.6 kg, 6-wheel rocker-bogie)',
        '24-lobe giant airbag impact assembly',
        'Supersonic mortar-deployed parachute and backshell',
        'Beryllium/phenolic heat shield',
        'Three Solid Rocket Assisted Deceleration (RAD) rocket motors'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'Faster, Better, Cheaper',
          interactiveType: 'objective_choice',
          narrative: 'In 1992, NASA Administrator Dan Goldin challenged JPL to break away from billion-dollar flagship programs. Mars Pathfinder had to land a rover on Mars for under $150 million—less than the cost of making the Hollywood film Apollo 13.',
          historicalContext: '1992-1993: NASA approved Discovery-class missions, demanding low-cost, innovative engineering with short 3-year development timelines.',
          interactiveData: {
            dilemma: 'How do you cushion a spacecraft landing without heavy, expensive rocket engines and landing legs?',
            options: [
              {
                id: 'traditional-retrorockets',
                title: 'Viking-style Liquid Retrorockets',
                pros: 'Proven heritage.',
                cons: 'Requires complex throttleable engines, propellant valves, and heavy landing legs that blow the budget.',
                verdict: 'Too heavy and too expensive.'
              },
              {
                id: 'airbags',
                title: 'Cocoon of Giant Vectran Airbags',
                pros: 'Spacecraft bounces across the desert like a rubber ball; ultra-lightweight and cheap.',
                cons: 'Never attempted on another planet; risk of puncturing on sharp volcanic rocks.',
                verdict: 'Selected: Bounced 15 times up to 15 meters high and came to rest safely!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'The Rocker-Bogie & Microwave Rover',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Weighing just 10.6 kg, Sojourner was named after abolitionist and women\'s rights champion Sojourner Truth. JPL roboticist Don Bickler invented the legendary "Rocker-Bogie" suspension: a six-wheeled system with no springs, enabling the tiny rover to climb over obstacles larger than its own wheel diameter without tipping over.',
          historicalContext: '1995: The rocker-bogie design became the gold standard for every subsequent NASA Mars rover, including Spirit, Opportunity, Curiosity, and Perseverance.',
          interactiveData: {
            craftName: 'Mars Pathfinder & Sojourner Rover',
            hotspots: [
              {
                id: 'rocker-bogie',
                title: '6-Wheel Rocker-Bogie Suspension',
                subsystem: 'Mobility Architecture',
                description: 'Differential rocker and bogie linkages keeping all 6 wheels in contact with the ground over uneven terrain.',
                spec: 'Climbs rocks 13 cm high while tilting the body by no more than half the slope angle.'
              },
              {
                id: 'apxs-arm',
                title: 'APXS Deployment Mechanism',
                subsystem: 'In-Situ Chemical Analysis',
                description: 'Curium-244 radioactive alpha emitter held directly against rock surfaces for 10-hour spectroscopic integration.',
                spec: 'Identified volcanic andesite rocks containing high silica content.'
              },
              {
                id: 'petal-chassis',
                title: 'Self-Righting Tetrahedral Petals',
                subsystem: 'Surface Lander Structure',
                description: 'Three triangular petals actuated by powerful electric motors to right the lander regardless of which side it landed on.',
                spec: 'Opened like an unfolding flower on July 4, 1997.'
              },
              {
                id: 'vectran-airbags',
                title: '24-Lobe Vectran Airbags',
                subsystem: 'Impact Attenuation Assembly',
                description: 'Multi-layered synthetic liquid-crystal polymer fabric cushions inflated 8 seconds before touchdown.',
                spec: 'Absorbed 14 m/s (50 km/h) impact shock forces.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'The Great Airbag Drop Tests',
          interactiveType: 'readiness_check',
          narrative: 'Testing the giant airbags inside the world\'s largest vacuum chamber at NASA Plum Brook Station in Ohio was nearly fatal for the project: the first prototypes shredded on simulated fiberglass boulders. Engineers redesigned the airbags with four layers of bulletproof Vectran fabric.',
          historicalContext: '1995: Plum Brook drop tests solved catastrophic fabric tear modes by adding internal equalization cords and abrasion-resistant outer bladders.',
          interactiveData: {
            simulationName: 'Pathfinder Plum Brook Airbag Drop & Rover Qualification',
            checklist: [
              { item: 'Plum Brook Vacuum Chamber Drop Test (14 m/s impact)', status: 'PASS', notes: 'Redesigned 4-ply Vectran survived jagged granite boulder field.' },
              { item: 'RAD Rocket Ignition Timing Sensor Verification', status: 'PASS', notes: 'Radar altimeter fires three solid rockets 10 meters above ground.' },
              { item: 'Sojourner Autonomous Hazard Avoidance Laser Stripers', status: 'PASS', notes: 'Rover software successfully steered around simulated sand traps.' },
              { item: 'Thermal Vacuum Soak (-110°C to +40°C)', status: 'PASS', notes: 'Lander computer verified under diurnal temperature oscillations.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Delta II 7925 Launches into the Night',
          interactiveType: 'launch_sim',
          narrative: 'Mars Pathfinder blasted off on December 4, 1996 from Cape Canaveral atop a Delta II rocket. Unlike Viking, Pathfinder carried no orbital insertion engine: it would perform a direct atmospheric entry straight from interplanetary space at 26,000 km/h.',
          historicalContext: 'December 1996: Launching just weeks after Mars Global Surveyor, Pathfinder began the modern golden age of continuous Mars exploration.',
          interactiveData: {
            liftoffWeightKg: 231000,
            thrustKN: 3100,
            maxQAltitudeKm: 12.8,
            maxQVelocityMach: 1.65,
            tliBurnDurationSeconds: 275,
            trajectoryOutcome: 'Direct interplanetary atmospheric entry trajectory targeted to Ares Vallis.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'Seven Months to Ares Vallis',
          interactiveType: 'trajectory_scrub',
          narrative: 'Cruising toward Mars, Pathfinder performed four precision trajectory trim maneuvers. On July 4, 1997, the spacecraft plunged directly into the thin Martian atmosphere. The heatshield bled off 90% of the speed; the parachute deployed at supersonic velocity, the RAD rockets fired, the tether cut, and the airbag cocoon bounced across Ares Vallis.',
          historicalContext: 'July 4, 1997: Over 100 million people accessed the fledgling World Wide Web to follow Pathfinder\'s landing, creating the first internet traffic surge in history.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 11.2, date: 'Dec 4, 1996' },
              { distancePct: 35, label: 'Mid-Course Correction 1', velocityKmS: 2.3, date: 'Jan 10, 1997' },
              { distancePct: 80, label: 'Mid-Course Correction 3', velocityKmS: 1.5, date: 'May 1, 1997' },
              { distancePct: 98, label: 'Atmospheric Entry (7.3 km/s)', velocityKmS: 7.3, date: 'July 4, 1997' },
              { distancePct: 100, label: 'Bouncing Airbag Touchdown', velocityKmS: 0.0, date: 'July 4, 1997' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'Sojourner Rolls Down the Ramp',
          interactiveType: 'discovery_slider',
          narrative: 'After the airbags deflated and retracted, the three lander petals unfurled. On Sol 2, Sojourner backed down the deployment ramp onto the soil of Mars. Over the next 83 sols, the rover investigated famous rocks named "Barnacle Bill", "Yogi", and "Scooby Doo", discovering rounded cobbles and conglomerate rocks that proved catastrophic floods of liquid water once coursed through Ares Vallis.',
          historicalContext: 'July 6, 1997: Sojourner became the first wheeled robotic vehicle to drive on another planet, transmitting 550 photos and 16 chemical analyses.',
          interactiveData: {
            events: [
              { timeCode: 'Sol 2', title: 'Wheels on Mars', metric: 'First Roll off Ramp', detail: 'Sojourner touches the reddish soil; first extraterrestrial tracks.' },
              { timeCode: 'Sol 3', title: 'Barnacle Bill Chemical Scan', metric: 'Silica content: 58%', detail: 'APXS reveals volcanic andesite, indicating planetary crustal differentiation.' },
              { timeCode: 'Sol 10', title: 'Yogi the Bear Investigation', metric: 'Distance traveled: 22 meters', detail: 'Identified weathered basaltic rock shaped by ancient catastrophic river flows.' },
              { timeCode: 'Sol 83', title: 'Final Data Transmission', metric: 'Total Images: 17,000+', detail: 'Lander primary silver-zinc battery exhausts chemical storage.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: The Carl Sagan Memorial Station',
          interactiveType: 'then_vs_now',
          narrative: 'On September 27, 1997 (Sol 83), Mission Control lost contact after the lander\'s rechargeable battery succumbed to repeated freezing night cycles. Sojourner\'s software included contingency instructions: if the lander went silent, the rover was programmed to circle the station. It is almost certainly parked beside the Carl Sagan Memorial Station, a monument to the dawn of agile planetary robotics.',
          historicalContext: 'In January 2007, NASA\'s Mars Reconnaissance Orbiter HiRISE camera spotted the Pathfinder lander and its retracted airbags clearly on Ares Vallis.',
          interactiveData: {
            thenState: {
              date: 'July 4, 1997',
              appearance: 'Vibrant gold-and-black solar panels, white retracted airbag bundles, bright silver rover tracks.',
              operationalState: 'Active X-band transmission to Goldstone; rover relaying data at 9600 baud.',
              thermalStatus: 'Warmed by diurnal solar cycle and internal battery dissipation.'
            },
            nowState: {
              date: 'Present Day (27+ Years Later)',
              appearance: 'Coated in fine rust-red dust; solar panels obscured; airbags weathered by windblown silt.',
              operationalState: 'Silent since September 1997; batteries chemically dead.',
              thermalStatus: 'Frozen in the sub-zero swings of Ares Vallis.'
            },
            preservationNote: 'Pathfinder proved that low-cost planetary missions were feasible and directly validated the entry, descent, landing, and mobility systems for the Mars Exploration Rovers Spirit and Opportunity.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'Why did the Pathfinder mission stop communicating after 83 sols?',
          shortAnswer: 'Its rechargeable silver-zinc battery suffered repeated thermal degradation from cold Martian nights and could no longer hold a charge.',
          deepDive: 'Pathfinder relied on a 40-ampere-hour rechargeable silver-zinc battery to warm its electronics during the -85°C Martian nights. Silver-zinc batteries degrade rapidly under deep thermal cycling. By Sol 83, the battery had developed internal shorts. Without battery buffering, the main computer could not reboot when the morning sun struck the solar panels, leaving the lander permanently offline.'
        },
        {
          question: 'What did the Sojourner rover do when the lander stopped communicating?',
          shortAnswer: 'Its onboard contingency programming instructed it to drive in circles around the lander, waiting for a communication signal that never came.',
          deepDive: 'Sojourner was an autonomous rover capable of laser-hazard avoidance, but it had no direct communication link to Earth—all data flowed through the lander via a 9600-baud radio modem. JPL engineers programmed Sojourner with a contingency protocol: if contact with the lander was lost for several days, it would assume the lander was still alive and drive in an orbit around it to regain line-of-sight. When its non-rechargeable lithium batteries finally froze, Sojourner likely came to rest just meters from the lander.'
        },
        {
          question: 'How did giant airbags work without causing the lander to tip over and explode?',
          shortAnswer: '24 interconnected Vectran spheres cushioned the impact, allowing the spacecraft to bounce 15 times up to 15 meters high before coming to rest.',
          deepDive: 'The airbag system surrounded the tetrahedral lander with four multi-lobed clusters made of Vectran, a liquid-crystal polymer fiber twice as strong as Kevlar. Inflated in less than a second by gas generators, the airbags absorbed the vertical velocity of 14 m/s. Once the bouncing ceased, internal winches pulled the deflated airbags flat against the ground so the lander petals could push themselves upright.'
        }
      ],
      quizQuestions: [
        {
          question: 'What revolutionary suspension system did JPL engineer Don Bickler invent for the Sojourner rover?',
          options: [
            'Hydraulic active-strut coil suspension',
            'Six-wheeled Rocker-Bogie suspension',
            'Pneumatic leaf-spring articulating axles',
            'Magnetic levitation chassis'
          ],
          correctIndex: 1,
          explanation: 'The Rocker-Bogie suspension uses no springs; its articulating linkages distribute weight across all six wheels, allowing rovers to climb obstacles larger than their wheel diameter without tipping over.'
        },
        {
          question: 'What rock on Mars did Sojourner analyze that revealed volcanic andesite indicating ancient crustal differentiation?',
          options: [
            'Genesis Rock',
            'Barnacle Bill',
            'Bounce Rock',
            'Big Joe'
          ],
          correctIndex: 1,
          explanation: 'Sojourner pressed its Alpha Proton X-ray Spectrometer against "Barnacle Bill" on Sol 3, revealing an andesitic composition with higher silica content than typical basaltic meteorites.'
        },
        {
          question: 'What was the Mars Pathfinder lander renamed to honor a visionary planetary scientist who died shortly before landing?',
          options: [
            'The Carl Sagan Memorial Station',
            'The Stephen Hawking Outpost',
            'The Arthur C. Clarke Base',
            'The Eugene Shoemaker Station'
          ],
          correctIndex: 0,
          explanation: 'Following Carl Sagan\'s death in December 1996, NASA Administrator Dan Goldin renamed the lander the Carl Sagan Memorial Station in honor of his passionate advocacy for Mars exploration.'
        }
      ],
      sources: [
        {
          title: 'NASA JPL Mars Pathfinder Mission Archive',
          url: 'https://mars.nasa.gov/mars-pathfinder/',
          description: 'Official NASA Jet Propulsion Laboratory mission summary, rover telemetry, and scientific papers.'
        },
        {
          title: 'Science Magazine: The Mars Pathfinder Mission (Special Issue, Dec 1997)',
          url: 'https://www.science.org/toc/science/278/5344',
          description: 'Peer-reviewed scientific findings on Ares Vallis hydrology, rock chemistry, and atmospheric meteorology.'
        },
        {
          title: 'NASA MRO HiRISE: Pathfinder Landing Site in 3D',
          url: 'https://www.uahirise.org/PSP_001890_1995',
          description: 'High-resolution orbital images showing the Carl Sagan Memorial Station, retracted airbags, and heat shield fragments.'
        }
      ]
    },

    // ========================================================================
    // MISSION 5: SPIRIT & OPPORTUNITY (MER)
    // ========================================================================
    {
      id: 'spirit-opportunity',
      name: 'Spirit & Opportunity (MER)',
      callsign: 'MER-A (Spirit) & MER-B (Opportunity)',
      agency: 'NASA/JPL',
      launchDate: '2003-06-10T17:58:47Z',
      endDate: '2019-02-13T19:00:00Z', // Opportunity official end of mission
      fateCategory: 'silent_mars',
      currentStatusDescription: 'Spirit is embedded in soft sulfate sand at Troy on the west side of Home Plate in Gusev Crater (silent since March 22, 2010). Opportunity rests in Perseverance Valley on the rim of Endeavour Crater after driving an astonishing 45.16 kilometers (a true marathon on an alien world) over 15 years on a planned 90-day mission. In June 2018, a catastrophic planet-encircling dust storm blotted out the sun, depleting Oppy\'s batteries after Sol 5352. Both rovers remain permanent monuments to robotic persistence.',
      isStillTransmitting: false,
      destinations: [
        'Interplanetary Cruise',
        'Gusev Crater (Spirit - 14.5684° S, 175.4726° E)',
        'Meridiani Planum & Endeavour Crater (Opportunity - 1.9462° S, 354.4734° E)'
      ],
      launchVehicle: 'Delta II 7925 (Spirit) / Delta II 7925H Heavy (Opportunity)',
      launchSite: 'Cape Canaveral Air Force Station, LC-17A & LC-17B, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Mars',
        siteName: 'Gusev Crater (Spirit) & Meridiani Planum (Opportunity)',
        latitude: -1.9462,
        longitude: 354.4734
      },
      spacecraftSpecs: {
        dryMassKg: 185, // Landed rover mass each
        powerSource: 'Triple-junction GaAs Solar Arrays (0.31 m²) + 2x 8 Ah Lithium-ion secondary batteries',
        powerOutputWatts: 140, // Up to 140W pristine solar output; drops to ~20W during severe dust storms
        communicationSystem: 'Steerable X-band High-Gain Antenna (HGA), Low-Gain Antenna (LGA), and UHF Monopole Antenna communicating with Mars Global Surveyor & Mars Odyssey',
        instruments: [
          {
            name: 'Panoramic Camera',
            acronym: 'Pancam',
            purpose: 'High-resolution multispectral stereoscopic mast-mounted camera.',
            targetMeasurement: 'Geomorphology, mineral identification through color filter ratios, astronomical imaging.'
          },
          {
            name: 'Microscopic Imager',
            acronym: 'MI',
            purpose: 'Extreme close-up lens on robotic arm yielding sub-millimeter imagery of rock textures.',
            targetMeasurement: 'Individual mineral grains, sediment laminae, and famous hematite "blueberries".'
          },
          {
            name: 'Mössbauer Spectrometer',
            acronym: 'MIMOS II',
            purpose: 'Determines the oxidation state and mineralogy of iron-bearing rocks using cobalt-57 source.',
            targetMeasurement: 'Jarosite, hematite, magnetite, and olivine iron ratios indicating water acidity.'
          },
          {
            name: 'Rock Abrasion Tool',
            acronym: 'RAT',
            purpose: 'Diamond-tipped grinding wheel that grinds away weathered outer rock rind to reveal fresh interior.',
            targetMeasurement: 'Creates 45 mm diameter, 5 mm deep clean surfaces for chemical sensors.'
          }
        ]
      },
      trackingTier: 'historical_trajectory',
      distanceFromEarthAU: 1.52,
      tagline: "Twin robot geologists designed for 90 days that conquered a marathon across Mars.",
      discardedEquipment: [
        'Spirit Rover (embedded at Troy, Gusev Crater)',
        'Opportunity Rover (silent in Perseverance Valley, Endeavour Crater)',
        'Two tetrahedral lander petal bases (Columbia Memorial Station & Challenger Memorial Station)',
        'Two 24-lobe airbag impact envelopes',
        'Two supersonic parachutes and backshells',
        'Two tungsten-weighted heatshields (including Opportunity\'s "Heat Shield Rock" site)'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'Follow the Water',
          interactiveType: 'objective_choice',
          narrative: 'Following orbital detections of dried river channels and gray hematite mineral signatures, NASA formulated the "Follow the Water" strategy. Two identical robot field geologists would be sent to opposite sides of Mars: Spirit to Gusev Crater (suspected ancient lake bed) and Opportunity to Meridiani Planum (hematite mineral beds).',
          historicalContext: '2000: NASA Associate Administrator Ed Weiler approved the twin Mars Exploration Rover project following the tragic losses of the 1999 Mars Climate Orbiter and Polar Lander.',
          interactiveData: {
            dilemma: 'How do you investigate suspected ancient lake beds on opposite sides of the planet?',
            options: [
              {
                id: 'single-big-rover',
                title: 'Single Giant Rover',
                pros: 'Concentrates instruments on one target.',
                cons: 'High risk; all eggs in one basket if launch or landing fails.',
                verdict: 'Too risky for return-to-flight mission.'
              },
              {
                id: 'twin-rovers',
                title: 'Twin Rovers (MER-A Spirit & MER-B Opportunity)',
                pros: 'Redundancy; samples two completely distinct geological water environments on opposite hemispheres.',
                cons: 'Requires double the manufacturing and operations shifts.',
                verdict: 'Selected: Discovered both volcanic hydrothermal systems and ancient acidic groundwater lakes!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'The Mechanical Field Geologist',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Each rover stood 1.5 meters tall, weighed 185 kg, and carried an Instrument Deployment Device (IDD)—a 5-jointed robotic arm functioning as an astronaut geologist\'s arm holding a magnifying glass, rock hammer, and chemical sensors.',
          historicalContext: '2001-2003: Led by Principal Investigator Steve Squyres and JPL Project Manager Pete Theisinger, the team worked 7 days a week to meet the rigid 2003 planetary launch window.',
          interactiveData: {
            craftName: 'Mars Exploration Rover (Spirit / Opportunity)',
            hotspots: [
              {
                id: 'pancam-mast',
                title: 'Pancam & Navcam Mast Assembly',
                subsystem: 'Stereo Vision & Mast Electronics',
                description: 'Mounted at human eye level (1.5 m) to replicate an astronaut geologist standing on Mars.',
                spec: 'Captures 1024x1024 pixel stereo multispectral pairs across 13 geological color filters.'
              },
              {
                id: 'idd-arm',
                title: 'Instrument Deployment Device (IDD)',
                subsystem: 'Robotic Manipulator Arm',
                description: '5-degrees-of-freedom arm positioning the MI, APXS, Mössbauer, and RAT against rocks.',
                spec: 'Carried a 4.2 kg instrument turret placed within 1 mm positioning accuracy.'
              },
              {
                id: 'rat-grinder',
                title: 'Rock Abrasion Tool (RAT)',
                subsystem: 'Surface Grinding & Abrasion',
                description: 'Diamond-grit cutting wheels spinning at 3,000 RPM to grind through centuries of weathering varnish.',
                spec: 'Exposed pristine subsurface rock matrix up to 5 mm deep.'
              },
              {
                id: 'solar-wings',
                title: 'Triple-Junction GaAs Solar Arrays',
                subsystem: 'Electrical Power Subsystem',
                description: '0.31 m² array producing 140 Watts, supplemented by fortunate atmospheric dust-cleaning events ("cleaning events").',
                spec: 'Powered Opportunity for 5,352 sols instead of the planned 90 sols.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'Burying the Rover in Sand',
          interactiveType: 'readiness_check',
          narrative: 'JPL engineers built the "Sandbox" at Pasadena, filling it with volcanic sand, diatomaceous earth, and crushed basalt to simulate every conceivable trap. They drove a full-scale test rover ("SSTV") through steep dune slopes to calibrate traction limits.',
          historicalContext: '2002: In the JPL In-Situ Instrument Laboratory (ISIL), software engineers simulated the entry-descent-landing communications sequence hundreds of times.',
          interactiveData: {
            simulationName: 'MER Environmental & Traction Qualification',
            checklist: [
              { item: 'JPL Sandbox 20° Soft Dune Sand Traction Test', status: 'PASS', notes: 'Rocker-bogie calibrated for wheel slip in loose regolith.' },
              { item: 'Thermal Vacuum Chamber (-105°C night survival)', status: 'PASS', notes: 'Radioisotope heater units (RHUs) and electric strip heaters verified.' },
              { item: 'DIMES Descent Image Motion Sensor Verification', status: 'PASS', notes: 'Downward-looking camera detects horizontal drift to trigger transverse rockets.' },
              { item: 'Airbag Deployment & Retraction Cable Snag Tests', status: 'PASS', notes: 'Internal cords successfully pulled airbags clear of rover wheels.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Two Rockets to the Red Planet',
          interactiveType: 'launch_sim',
          narrative: 'Spirit launched on June 10, 2003, and Opportunity followed on July 7, 2003 aboard Delta II boosters. Both departed Earth cleanly, racing along heliocentric transfer arcs toward their rendezvous with opposite hemispheres of Mars in January 2004.',
          historicalContext: 'June-July 2003: The launches were timed for when Mars and Earth reached their closest opposition in nearly 60,000 years (56 million kilometers apart).',
          interactiveData: {
            liftoffWeightKg: 231000,
            thrustKN: 3100,
            maxQAltitudeKm: 13.0,
            maxQVelocityMach: 1.7,
            tliBurnDurationSeconds: 280,
            trajectoryOutcome: 'Clean Trans-Mars Injection targeting Gusev Crater and Meridiani Planum.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'The Interplanetary Relay',
          interactiveType: 'trajectory_scrub',
          narrative: 'Crossing 460 million kilometers of space, both rovers entered Mars atmosphere in January 2004. Spirit endured high crosswinds at Gusev Crater, landing safely on January 4. Twenty days later on January 25, Opportunity executed a textbook "hole-in-one" landing, rolling straight into Eagle Crater on Meridiani Planum.',
          historicalContext: 'January 25, 2004: Opportunity bounced 26 times inside giant airbags and came to rest inside a 22-meter-wide crater ringed by exposed bedrock outcroppings.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 11.2, date: 'June/July 2003' },
              { distancePct: 40, label: 'Mid-Course Correction 1', velocityKmS: 2.1, date: 'Aug 2003' },
              { distancePct: 85, label: 'Approach Phase / Trajectory Trim', velocityKmS: 1.4, date: 'Dec 2003' },
              { distancePct: 98, label: 'Atmospheric Entry (5.4 km/s)', velocityKmS: 5.4, date: 'Jan 2004' },
              { distancePct: 100, label: 'Airbag Touchdown on Mars', velocityKmS: 0.0, date: 'Jan 4 & Jan 25, 2004' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'Martian Blueberries & Hydrothermal Springs',
          interactiveType: 'discovery_slider',
          narrative: 'Opportunity immediately spotted layered bedrock inside Eagle Crater. Turning its Microscopic Imager on the rock, it discovered millions of tiny spherules nicknamed "Martian Blueberries"—hematite concretions formed in gently flowing, acidic groundwater billions of years ago. Meanwhile, on the opposite side of Mars, Spirit\'s stuck right-front wheel dragged a trench that dug up pure silica (90% SiO₂), revealing ancient volcanic hydrothermal hot springs.',
          historicalContext: 'March 2004: Steve Squyres announced: "Opportunity has landed in an area where liquid water once soaked the subsurface and soaked it repeatedly."',
          interactiveData: {
            events: [
              { timeCode: 'Sol 34 (Oppy)', title: 'Eagle Crater Blueberries', metric: 'Size: 1-3 mm hematite spheres', detail: 'Concretions formed in mineral-rich acidic water standing in ancient lakes.' },
              { timeCode: 'Sol 779 (Spirit)', title: 'The Silica Trench at Home Plate', metric: 'Purity: 91% pure silica', detail: 'Stuck wheel dragged open evidence of ancient hydrothermal volcanic geysers.' },
              { timeCode: 'Sol 2200 (Oppy)', title: 'Arrival at Santa Maria Crater', metric: 'Hydrated sulfate minerals', detail: 'Confirmed widespread groundwater alteration across Meridiani Planum.' },
              { timeCode: 'Sol 4000 (Oppy)', title: 'Marathon on Mars Reached', metric: 'Distance: 42.195 km', detail: 'Opportunity became the first vehicle to complete a full marathon distance on another world.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: Monuments to Endurance',
          interactiveType: 'then_vs_now',
          narrative: 'Spirit remains embedded at Troy in Gusev Crater, where it survived as a stationary science platform until freezing temperatures silenced its transmitter in 2010. Opportunity pushed onward across Endeavour Crater until June 10, 2018 (Sol 5352), when a catastrophic planet-encircling dust storm blotted out the sun. Its final transmission reported: "My battery is low and it\'s getting dark." On February 13, 2019, after sending over 1,000 recovery commands, NASA declared the mission complete.',
          historicalContext: 'Opportunity drove 45.16 kilometers (28.06 miles)—holding the extraterrestrial driving distance record until superseded.',
          interactiveData: {
            thenState: {
              date: 'January 2004',
              appearance: 'Shiny black solar wings, pristine white instrument mast, clean chassis rolling freely across dunes.',
              operationalState: 'Designed for 90 sols and 600 meters of driving; full telemetric health.',
              thermalStatus: 'Solar arrays producing 900 Watt-hours per sol.'
            },
            nowState: {
              date: 'Present Day',
              appearance: 'Coated in heavy coats of reddish dust; right front wheel locked; standing silently on the rim of Endeavour.',
              operationalState: 'Spirit silent since March 2010; Opportunity silent since June 2018; batteries dead.',
              thermalStatus: 'Frozen in ambient Martian diurnal cycles.'
            },
            preservationNote: 'Spirit and Opportunity transformed our view of Mars from a dead volcanic desert to a once-habitable world rich in ancient lakes, groundwater, and hydrothermal geysers.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'How did Opportunity survive 15 years when it was designed for only 90 days?',
          shortAnswer: 'Fortuitous Martian wind gusts ("cleaning events") swept dust off the solar panels, while ultra-reliable engineering outlasted all wear expectations.',
          deepDive: 'Engineers expected dust falling from the atmosphere to coat the solar panels and choke off electric power within 90 sols. But to NASA\'s delight, seasonal dust devils and thermal wind vortices regularly swept across Meridiani Planum, blowing the solar arrays clean and resetting power generation back to 90%. Furthermore, the rover\'s brushless DC hub motors, harmonic gearboxes, and lithium-ion batteries endured tens of millions of cycles without catastrophic failure.'
        },
        {
          question: 'What were the famous "blueberries" discovered by Opportunity?',
          shortAnswer: 'They are tiny spherical concretions of the mineral hematite formed when liquid groundwater percolated through porous rock billions of years ago.',
          deepDive: 'When Opportunity rolled up to the outcrop inside Eagle Crater, its microscopic imager revealed millions of tiny gray spheres 1 to 3 millimeters across embedded in the rock. The Mössbauer spectrometer confirmed they were rich in gray crystalline hematite (Fe₂O₃). On Earth, such concretions form when mineral-laden groundwater precipitates iron salts through sedimentary rock. When wind eroded the softer rock around them, the spheres fell out and carpeted the crater floor.'
        },
        {
          question: 'How did a broken wheel lead Spirit to its greatest scientific discovery?',
          shortAnswer: 'Its seized front-right wheel was dragged through the soil like a plow, churning up subsurface deposits of 90% pure silica formed by ancient hot springs.',
          deepDive: 'In March 2006, Spirit\'s right front wheel motor permanently seized. Rover drivers had to drive Spirit backward, dragging the dead wheel through the dirt. In May 2007 at Home Plate, the dragging wheel churned up bright white soil. When analyzed by the APXS, it was found to be 91% pure silica—a mineral signature that on Earth is produced only in volcanic hydrothermal hot springs or fumaroles where boiling water leaches away minerals, proving ancient Mars had volcanic hydrothermal environments suitable for microbial life.'
        }
      ],
      quizQuestions: [
        {
          question: 'What unexpected Martian phenomenon repeatedly rescued Spirit and Opportunity by cleaning their solar panels?',
          options: [
            'Subsurface geothermal steam geysers',
            'Martian dust devils and thermal wind vortices',
            'Atmospheric carbon dioxide snow flurries',
            'Electrostatic levitation of regolith'
          ],
          correctIndex: 1,
          explanation: 'Dust devils and seasonal wind gusts repeatedly blew accumulation dust off the solar panels ("cleaning events"), resetting electric output and extending their missions from 90 days to up to 15 years.'
        },
        {
          question: 'What total extraterrestrial driving distance did Opportunity log before being silenced by a global dust storm?',
          options: [
            '5.2 kilometers',
            '21.1 kilometers',
            '45.16 kilometers',
            '102.4 kilometers'
          ],
          correctIndex: 2,
          explanation: 'Opportunity drove an astonishing 45.16 kilometers (28.06 miles), completing the first full marathon on another celestial body.'
        },
        {
          question: 'What mineral concretions nicknamed "blueberries" did Opportunity find that proved water once soaked the Martian plains?',
          options: [
            'Pure diamonds formed by meteorite impacts',
            'Hematite spherules precipitated from ancient groundwater',
            'Frozen carbon dioxide dry-ice pellets',
            'Volcanic obsidian droplets'
          ],
          correctIndex: 1,
          explanation: 'The "blueberries" are iron-rich hematite spherules that precipitated out of standing groundwater in ancient Martian lakebeds.'
        }
      ],
      sources: [
        {
          title: 'NASA JPL Mars Exploration Rover Mission Archive',
          url: 'https://mars.nasa.gov/mer/',
          description: 'Complete operational logs, image archives, and science papers for Spirit and Opportunity.'
        },
        {
          title: 'Steve Squyres: Roving Mars - Spirit, Opportunity, and the Exploration of the Red Planet',
          url: 'https://www.nasa.gov/centers/jpl/news/mer-20050804.html',
          description: 'Historical memoir by Principal Investigator Steve Squyres on the engineering and discoveries of MER.'
        },
        {
          title: 'HiRISE MRO: Opportunity Rover Resting in Perseverance Valley',
          url: 'https://www.uahirise.org/ESP_058203_1780',
          description: 'Ultra-high-resolution orbital photography of Opportunity resting silently in Endeavour Crater after the 2018 dust storm.'
        }
      ]
    },

    // ========================================================================
    // MISSION 6: CURIOSITY (MARS SCIENCE LABORATORY - MSL)
    // ========================================================================
    {
      id: 'curiosity',
      name: 'Curiosity (MSL)',
      callsign: 'Mars Science Laboratory (MSL)',
      agency: 'NASA/JPL',
      launchDate: '2011-11-26T15:02:00Z',
      endDate: null, // Active
      fateCategory: 'active_surface',
      currentStatusDescription: 'Actively climbing Mount Sharp (Aeolis Mons) inside Gale Crater, surpassing 4,300+ sols on Mars and driving over 32 kilometers. While the nuclear rover continues cutting-edge science, discarded mission equipment lies scattered across Gale Crater: the descent stage skycrane crashed 650 meters away, the supersonic heatshield impacted 1.5 kilometers away, and the parachute with backshell lies 615 meters away—enduring Martian storms as permanent historical relics.',
      isStillTransmitting: true,
      destinations: [
        'Interplanetary Transfer',
        'Direct Guided Entry',
        'Bradbury Landing, Gale Crater, Mount Sharp, Mars'
      ],
      launchVehicle: 'Atlas V 541',
      launchSite: 'Cape Canaveral Air Force Station, Space Launch Complex 41, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Mars',
        siteName: 'Bradbury Landing, Gale Crater',
        latitude: -4.5895,
        longitude: 137.4417
      },
      spacecraftSpecs: {
        dryMassKg: 899, // Rover mass on Mars
        powerSource: 'Multi-Mission Radioisotope Thermoelectric Generator (MMRTG, 4.8 kg Plutonium-238 Dioxide) + 2x 43 Ah Li-ion batteries',
        powerOutputWatts: 110, // ~110 Watts continuous electrical power, decaying ~1.5% per year
        communicationSystem: 'Steerable X-band High-Gain Antenna (HGA direct-to-Earth) + Dual Electra UHF transceivers relaying via Mars Reconnaissance Orbiter and MAVEN (up to 2 Mbps)',
        instruments: [
          {
            name: 'Mast Camera',
            acronym: 'Mastcam',
            purpose: 'Twin multispectral true-color stereo cameras with telephoto and wide-angle lenses.',
            targetMeasurement: 'Geological landscaping, sediment structures, atmospheric opacity, and night astronomy.'
          },
          {
            name: 'Chemistry and Camera / ChemCam',
            acronym: 'ChemCam',
            purpose: 'Infrared laser vaporizes rock targets up to 7 meters away; spectrometer analyzes plasma spark light.',
            targetMeasurement: 'Elemental composition (silicon, iron, magnesium, aluminum) of rocks without driving up to them.'
          },
          {
            name: 'Sample Analysis at Mars',
            acronym: 'SAM',
            purpose: 'Miniaturized chemistry suite with gas chromatograph, quadrupole mass spectrometer, and tunable laser spectrometer.',
            targetMeasurement: 'Complex organic carbon compounds, methane gas plumes, and carbon/hydrogen isotope ratios.'
          },
          {
            name: 'Chemistry and Mineralogy',
            acronym: 'CheMin',
            purpose: 'Powder X-ray diffraction and X-ray fluorescence instrument analyzing drilled rock powder.',
            targetMeasurement: 'Quantitative crystalline mineralogy (clays, sulfates, pyroxenes) identifying aqueous history.'
          }
        ]
      },
      trackingTier: 'live_calculated',
      distanceFromEarthAU: 1.52,
      tagline: "The one-ton nuclear roving laboratory climbing an alien mountain.",
      discardedEquipment: [
        'Rocket-powered Skycrane descent stage (impacted 650 m away at 160 km/h)',
        'Supersonic Disc-Gap-Band Parachute and Backshell (impacted 615 m away)',
        '4.5-meter Phenolic-Impregnated Carbon Ablator (PICA) heatshield (impacted 1.5 km away)',
        'Drill bits and sample cleaning purge deposits',
        'Cruise Stage debris burned up during atmospheric entry'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'A Monster Laboratory on Mars',
          interactiveType: 'objective_choice',
          narrative: 'Following the discoveries of Spirit and Opportunity, scientists knew Mars once had water—but was it ever habitable for life? To answer that, NASA needed a rover the size of an SUV carrying wet chemistry ovens, X-ray diffractometers, and laser blasters. Such a machine would weigh 900 kg—too heavy for airbags.',
          historicalContext: '2004-2006: NASA approved the Mars Science Laboratory (MSL) mission to assess whether Gale Crater ever hosted environmental conditions favorable for microbial life.',
          interactiveData: {
            dilemma: 'How do you softly land a one-ton rover without airbags or landing legs that could tip over?',
            options: [
              {
                id: 'huge-airbags',
                title: 'Massive Scaled-Up Airbags',
                pros: 'Proven heritage from Pathfinder and MER.',
                cons: 'Would require airbags taller than a three-story building; fabric would tear under 1,000 kg impact.',
                verdict: 'Physics makes it impossible.'
              },
              {
                id: 'skycrane',
                title: 'The Skycrane Maneuver',
                pros: 'Rocket platform lowers rover on three nylon bridles directly onto its wheels, then flies away to crash.',
                cons: 'Unprecedented complexity; dozens of pyrotechnic cuts must fire with microsecond precision.',
                verdict: 'Selected: Landed Curiosity with pinpoint precision at Bradbury Landing!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'Nuclear Power & The Laser Blaster',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Curiosity discarded solar panels in favor of a Multi-Mission Radioisotope Thermoelectric Generator (MMRTG). Powered by 4.8 kg of plutonium-238 dioxide, it generates continuous heat that is converted into 110 Watts of electricity 24 hours a day, unaffected by night or dust storms. Its 2-meter robotic arm carries a heavy percussion drill that pulverizes rock interiors into fine gray flour.',
          historicalContext: '2008-2011: JPL engineers assembled Curiosity in High Bay 1, outfitting it with titanium suspension tubes and custom-machined aluminum wheels.',
          interactiveData: {
            craftName: 'Curiosity Rover (Mars Science Laboratory)',
            hotspots: [
              {
                id: 'mmrtg-power',
                title: 'Multi-Mission RTG (MMRTG)',
                subsystem: 'Nuclear Power & Thermal Control',
                description: 'Plutonium-238 decay produces 2,000 Watts of thermal heat, generating ~110 Watts of electricity.',
                spec: 'Circulates liquid freon through internal tubes to keep electronics warm through freezing Martian nights.'
              },
              {
                id: 'chemcam-laser',
                title: 'ChemCam Laser Telescope',
                subsystem: 'Laser-Induced Breakdown Spectroscopy',
                description: 'Fires gigawatt-per-cm² laser pulses at rocks up to 7 meters away, creating a glowing plasma spark analyzed by spectrometer.',
                spec: 'Fired over 1,000,000 laser shots on Mars.'
              },
              {
                id: 'sam-lab',
                title: 'Sample Analysis at Mars (SAM)',
                subsystem: 'Internal Analytical Chemistry Suite',
                description: 'Occupies over half the interior chassis; houses 74 sample cups, pyrolysis ovens, and a mass spectrometer.',
                spec: 'Heats rock samples to 850°C to sniff for organic carbon molecules.'
              },
              {
                id: 'percussion-drill',
                title: 'Rotary Percussion Drill',
                subsystem: 'Subsurface Sampling Mechanism',
                description: 'Drills 5 cm deep into solid bedrock, sifting gray rock powder through a 150-micrometer sieve into CheMin and SAM.',
                spec: 'Delivered pristine samples of ancient mudstones from Yellowknife Bay.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'The Seven Minutes of Terror',
          interactiveType: 'readiness_check',
          narrative: 'Because radio signals between Mars and Earth take 14 minutes to travel one way, Curiosity had to land completely autonomously. Engineers had to trust 500,000 lines of guidance code and 76 pyrotechnic explosive bolts. If a single bolt failed to fire, the mission was lost.',
          historicalContext: '2011: JPL EDL team lead Adam Steltzner famously dubbed the entry, descent, and landing sequence "The Seven Minutes of Terror."',
          interactiveData: {
            simulationName: 'Curiosity Guided Entry & Skycrane Verification',
            checklist: [
              { item: 'Guided Entry Ballast Tungsten Mass Jettison Test', status: 'PASS', notes: 'Shifts center of mass to generate aerodynamic lift in Martian atmosphere.' },
              { item: 'Skycrane Bridle Triple-Drop pyrotechnic release', status: 'PASS', notes: 'Nylon cords lower rover 7.5 meters below descent stage.' },
              { item: 'TDS Terminal Descent Radar Doppler Accuracy', status: 'PASS', notes: 'Six-beam radar tracks surface altitude and velocity down to centimeters.' },
              { item: 'ChemCam Autofocus Laser Targeting at 7 Meters', status: 'PASS', notes: 'Focuses sub-millimeter laser beam on basalt rock targets in vacuum.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Atlas V 541 Roars from SLC-41',
          interactiveType: 'launch_sim',
          narrative: 'On November 26, 2011, the Atlas V 541 rocket—featuring four solid rocket boosters and a 5-meter payload fairing—blasted off from Cape Canaveral. The Centaur upper stage placed Curiosity onto a high-energy transfer trajectory directly to Mars.',
          historicalContext: 'November 2011: The launch vehicle delivered 3,893 kg of cruise stage, aeroshell, and rover into planetary transfer with near-zero trajectory insertion error.',
          interactiveData: {
            liftoffWeightKg: 531000,
            thrustKN: 10600,
            maxQAltitudeKm: 13.8,
            maxQVelocityMach: 1.8,
            tliBurnDurationSeconds: 315,
            trajectoryOutcome: 'Precision Trans-Mars Injection with zero mid-course correction burn needed initially.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'Guided Atmospheric Entry & Skycrane',
          interactiveType: 'trajectory_scrub',
          narrative: 'On August 5, 2012, Curiosity slammed into the Martian atmosphere at 21,000 km/h. For the first time, small thrusters guided the capsule like a lifting body, steering toward its landing ellipse. At Mach 1.7, the largest supersonic parachute ever built deployed. Then, the rocket-powered skycrane lit its eight throttleable engines, lowered Curiosity on three nylon ropes, cut the cables, and blasted away into the distance.',
          historicalContext: 'August 5, 2012 (22:32 PDT): "Touchdown confirmed! We\'re safe on Mars!"—Eruptions of tears and cheers filled JPL Mission Control.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 10.9, date: 'Nov 26, 2011' },
              { distancePct: 50, label: 'Interplanetary Cruise', velocityKmS: 2.2, date: 'March 2012' },
              { distancePct: 95, label: 'Aeroshell Separation & Entry', velocityKmS: 5.9, date: 'Aug 5, 2012' },
              { distancePct: 99, label: 'Skycrane Lowering Maneuver', velocityKmS: 0.75, date: 'Aug 5, 2012' },
              { distancePct: 100, label: 'Wheels on Gale Crater', velocityKmS: 0.0, date: 'Aug 5, 2012' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'Yellowknife Bay: An Ancient Habitable Lake',
          interactiveType: 'discovery_slider',
          narrative: 'Just months after landing, Curiosity drilled into the mudstones of Yellowknife Bay. Inside the gray powder, SAM and CheMin identified clay minerals, carbon, hydrogen, oxygen, phosphorus, and sulfur—the elemental building blocks of life. Gale Crater was once an ancient freshwater lake with neutral pH that could have supported microbial life for millions of years.',
          historicalContext: 'March 2013: NASA announced that Curiosity had achieved its primary mission goal: proving ancient Mars had all conditions required to support microbial life.',
          interactiveData: {
            events: [
              { timeCode: 'Sol 65', title: 'Stream Bed Pebbles at Hottah', metric: 'Size: 2-40 mm rounded gravel', detail: 'Proved ancient vigorous streams flowed knee-deep across Gale Crater.' },
              { timeCode: 'Sol 180', title: 'First Drilling at John Klein', metric: 'Clay minerals: Smectite > 20%', detail: 'Confirmed freshwater lakebed with neutral pH and low salinity.' },
              { timeCode: 'Sol 1000', title: 'Mount Sharp Foothills Reached', metric: 'Climbing sulfate layers', detail: 'Transitioned from ancient lake sediments to drying planetary epoch.' },
              { timeCode: 'Sol 2000', title: 'Organic Molecules Detected in Mudstone', metric: 'Thiophenes, benzene, toluene', detail: 'Preserved 3-billion-year-old indigenous organic macromolecules confirmed in rock.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: Climbing Mount Sharp',
          interactiveType: 'then_vs_now',
          narrative: 'Curiosity is actively exploring the Gediz Vallis ridge on Mount Sharp today. Its nuclear generator continues to power it faithfully, though its aluminum wheels bear scars and punctures from sharp ventifact rocks encountered early in the mission. Miles behind it, the skycrane descent stage, heatshield, and parachute lie where they fell in 2012, silently slowly weathered by the winds of Gale Crater.',
          historicalContext: 'Curiosity has spent over 12 Earth years continuously driving, drilling, and analyzing the layered history of Mars.',
          interactiveData: {
            thenState: {
              date: 'August 2012',
              appearance: 'Pristine aluminum wheels, gleaming white RTG casing, unblemished chassis resting at Bradbury Landing.',
              operationalState: 'Delivering 110W electrical power; skycrane smoke visible in distance photos.',
              thermalStatus: 'Freon loop circulating RTG waste heat throughout the body.'
            },
            nowState: {
              date: 'Present Day (Active Mission)',
              appearance: 'Wheels scarred with tears and holes (monitored via MAHLI camera); body coated in red dust.',
              operationalState: 'Power decaying naturally by ~1.5 Watts per year (~90W today); fully productive science operations.',
              thermalStatus: 'Internal electronics maintained within safe operating limits.'
            },
            preservationNote: 'Curiosity rewritten planetary science by confirming that ancient Mars had long-lasting freshwater lakes and the organic chemical ingredients necessary for life.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'What was the crazy "Skycrane" maneuver and why did NASA invent it?',
          shortAnswer: 'A rocket-powered hover platform that lowered the 1-ton rover on cables to avoid kicking up blinding dust or requiring heavy landing legs.',
          deepDive: 'At 899 kg, Curiosity was far too heavy for airbags (which would have torn) and traditional lander legs (which would require the rover to drive down precarious ramps that could jam). JPL engineers conceived the Skycrane: an autonomous rocket platform with eight variable-thrust hydrazine engines that halted descent 20 meters above Mars, gently winched the rover down on three nylon bridles, waited for wheels to touch, severed the cords with pyrotechnic guillotines, and throttled up to fly away and crash 650 meters away.'
        },
        {
          question: 'Why do Curiosity\'s aluminum wheels have holes and Morse code patterns in them?',
          shortAnswer: 'The tread holes spell "JPL" in Morse code (.--- .--. .-..) as visual odometry markers, but unexpected punctures forced driving adjustments.',
          deepDive: 'Each of Curiosity\'s six wheels was machined from a single block of aerospace-grade aluminum, thinned down to 0.75 mm to save weight. Holes were cut in the cleats in Morse code spelling "JPL" (.--- .--. .-..)—creating stamped track marks that downward cameras use to calculate wheel slip. However, sharp wind-sculpted ventifact rocks punctured the thin aluminum treads early in the mission. NASA engineers updated drive software (traction control) to match wheel speeds to terrain slopes, preserving the wheels for over 32 km of climbing.'
        },
        {
          question: 'What did Curiosity find in Yellowknife Bay that proved Mars was once habitable?',
          shortAnswer: 'It found gray mudstone containing clay minerals, low salinity, neutral pH, and all key bio-elements (carbon, hydrogen, nitrogen, oxygen, phosphorus, sulfur).',
          deepDive: 'When Curiosity drilled into the "John Klein" mudstone outcrop at Yellowknife Bay, the powder was not red like the oxidized surface—it was gray, indicating an environment protected from harsh oxidation. The CheMin and SAM instruments revealed smectite clay minerals that form only in calm, non-acidic freshwater. If a human had stood beside the ancient lake at Yellowknife Bay 3.5 billion years ago, they could have safely drank the water.'
        }
      ],
      quizQuestions: [
        {
          question: 'How did the Skycrane deliver Curiosity safely to the surface of Mars?',
          options: [
            'It deployed giant 30-meter airbags that bounced across the crater.',
            'It hovered 7.5 meters above the ground and lowered the rover on nylon bridles directly onto its wheels.',
            'It crash-landed the descent stage into soft sand dunes.',
            'It used a giant magnetic tether attached to the orbiter.'
          ],
          correctIndex: 1,
          explanation: 'The Skycrane descent stage hovered 7.5 meters above the surface, lowered Curiosity on three nylon bridles directly onto its wheels, cut the cables, and flew away to crash.'
        },
        {
          question: 'What nuclear power source provides Curiosity with continuous electricity and heat on Mars?',
          options: [
            'A miniature uranium fission reactor',
            'A Multi-Mission Radioisotope Thermoelectric Generator (MMRTG) fueled by Plutonium-238',
            'Lithium-thionyl chloride primary batteries',
            'Deuterium-tritium fusion cells'
          ],
          correctIndex: 1,
          explanation: 'Curiosity is powered by an MMRTG containing 4.8 kg of Plutonium-238 dioxide, which generates steady heat converted into electricity by thermocouples.'
        },
        {
          question: 'What hidden message is stamped into the tracks of Curiosity\'s wheels in Morse code?',
          options: [
            'NASA (.--. ... .-)',
            'JPL (.--- .--. .-..)',
            'MARS (-- .- .-. ...)',
            'HOPE (.... --- .--. .)'
          ],
          correctIndex: 1,
          explanation: 'Holes cut in the wheels leave impressions in the soil that spell "JPL" in Morse code (.--- .--. .-..), which rover drivers use to measure driving distance and wheel slippage.'
        }
      ],
      sources: [
        {
          title: 'NASA Mars Science Laboratory Curiosity Overview',
          url: 'https://mars.nasa.gov/msl/',
          description: 'Official NASA JPL mission homepage, daily rover raw imagery, and science team updates.'
        },
        {
          title: 'Science Magazine: Habitability, Organic Compounds, and Geochemistry of Gale Crater',
          url: 'https://www.science.org/doi/10.1126/science.1242777',
          description: 'Special collection of peer-reviewed papers announcing the discovery of habitability in Gale Crater.'
        },
        {
          title: 'NASA JPL Photojournal: Skycrane Crash Site and Discarded EDL Hardware in Gale Crater',
          url: 'https://photojournal.jpl.nasa.gov/catalog/PIA16001',
          description: 'Orbital MRO images showing the heatshield, parachute, skycrane crash site, and Curiosity lander footprint.'
        }
      ]
    },

    // ========================================================================
    // MISSION 7: PERSEVERANCE & INGENUITY (MARS 2020)
    // ========================================================================
    {
      id: 'perseverance-ingenuity',
      name: 'Perseverance & Ingenuity',
      callsign: 'Mars 2020 & Ginny (Ingenuity Rotorcraft)',
      agency: 'NASA/JPL',
      launchDate: '2020-07-30T11:50:00Z',
      endDate: null, // Perseverance active; Ingenuity grounded Jan 2024
      fateCategory: 'active_surface',
      currentStatusDescription: 'Perseverance is actively collecting and caching rock cores on the western rim and river delta of Jezero Crater. Ingenuity completed 72 historic powered flights across Mars before landing hard on Flight 72 in January 2024, damaging a carbon-fiber rotor blade. Ingenuity now rests forever at "Valinor Hills" as humanity\'s Wright Brothers moment on Mars, still awake and collecting stationary temperature telemetry. Its heatshield, parachute, and skycrane remain discarded relics across the crater floor.',
      isStillTransmitting: true, // Perseverance active to Earth; Ingenuity transmits local telemetry to Perseverance
      destinations: [
        'Interplanetary Transfer',
        'Direct Guided Entry',
        'Octavia E. Butler Landing, Jezero Crater Delta, Mars'
      ],
      launchVehicle: 'Atlas V 541',
      launchSite: 'Cape Canaveral Space Force Station, SLC-41, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Mars',
        siteName: 'Octavia E. Butler Landing, Jezero Crater',
        latitude: 18.38,
        longitude: 77.58
      },
      spacecraftSpecs: {
        dryMassKg: 1025, // Perseverance 1,025 kg + Ingenuity 1.8 kg
        powerSource: 'Perseverance: MMRTG (Pu-238, 110W) + 2x 43 Ah Li-ion batteries; Ingenuity: Solar cell atop rotor + 6 Sony Li-ion cells (350W burst)',
        powerOutputWatts: 110,
        communicationSystem: 'Steerable X-band HGA, UHF Electra transceivers to MRO/MAVEN/TGO; 900 MHz Zigbee-based helicopter base station link',
        instruments: [
          {
            name: 'SuperCam',
            acronym: 'SuperCam',
            purpose: 'Fires infrared laser to analyze rock minerals; micro-camera and microphone records rock-zapping and wind audio.',
            targetMeasurement: 'Atomic composition, Raman organic spectroscopy, and acoustic rock hardness.'
          },
          {
            name: 'Scanning Habitable Environments with Raman & Luminescence',
            acronym: 'SHERLOC',
            purpose: 'Deep UV laser and spectrometer on robotic arm detecting organic molecules and mineral maps.',
            targetMeasurement: 'Aromatic amino acids, carbonates, and biosignatures in rock grains.'
          },
          {
            name: 'Mars Oxygen ISRU Experiment',
            acronym: 'MOXIE',
            purpose: 'Electrochemical oxygen generator extracting breathable O₂ from atmospheric CO₂.',
            targetMeasurement: 'Demonstrated in-situ resource utilization producing 12 g of oxygen per hour.'
          },
          {
            name: 'Radar Imager for Mars\' Subsurface Experiment',
            acronym: 'RIMFAX',
            purpose: 'Ground-penetrating radar probing geological strata up to 10 meters below rover wheels.',
            targetMeasurement: 'Buried deltaic lakebed sediment layers, volcanic fault lines, and rock density.'
          }
        ]
      },
      trackingTier: 'live_calculated',
      distanceFromEarthAU: 1.52,
      tagline: "Caching the seeds of Mars Sample Return and taking flight on another world.",
      discardedEquipment: [
        'Ingenuity Mars Helicopter (grounded at Valinor Hills after 72 flights)',
        'Rocket-powered Skycrane descent stage (impacted 700 m northwest)',
        'Supersonic Range-Trigger parachute and backshell',
        'PICA-X thermal heatshield (inspected up-close by Ingenuity)',
        'Sample Return Depot: 10 hermetically sealed titanium sample tubes cached at Three Forks',
        'Abrasion drill bit disposal assemblies'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'The Sample Caching Mandate',
          interactiveType: 'objective_choice',
          narrative: 'While Curiosity sought signs of habitability, Mars 2020 had a bold new goal: search for actual signs of ancient microbial life (biosignatures) and cache hermetically sealed rock cores for a future Mars Sample Return mission. And riding beneath the belly would be a high-risk tech demo: an aerial rotorcraft in an atmosphere just 1% as dense as Earth\'s.',
          historicalContext: '2013-2015: The Planetary Science Decadal Survey named Mars Sample Return the highest priority in planetary science; JPL engineer MiMi Aung led the team proving a helicopter could fly on Mars.',
          interactiveData: {
            dilemma: 'How do you generate enough aerodynamic lift to fly a helicopter in an atmosphere with 1% of Earth\'s density?',
            options: [
              {
                id: 'fixed-wing-plane',
                title: 'High-Altitude Glider Plane',
                pros: 'High cruise speed.',
                cons: 'Requires a runway to land; cannot hover or scout rovers in rocky craters.',
                verdict: 'Too difficult to land safely.'
              },
              {
                id: 'coaxial-rotorcraft',
                title: 'Coaxial Carbon-Fiber Rotorcraft (Ingenuity)',
                pros: 'Counter-rotating carbon-fiber blades spinning at 2,500 RPM (5x faster than Earth helicopters).',
                cons: 'Extreme weight limit of under 2.0 kilograms; autonomy must navigate without GPS.',
                verdict: 'Selected: Achieved 72 flights, 128 flight minutes, and 17 kilometers of aerial scouting!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'Cleanest Tubes in Human History',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Built at JPL, Perseverance carried the Adaptive Caching Assembly: a robotic internal carousel containing 43 titanium sample tubes. These tubes were machined and baked in cleanrooms cleaner than any surgical theater to guarantee zero terrestrial contamination. Meanwhile, Ingenuity was built with carbon-fiber blades, foam cores, and off-the-shelf smartphone processors.',
          historicalContext: '2018-2020: Engineers integrated Terrain-Relative Navigation (TRN) into Perseverance, enabling the lander to actively steer away from hazards in real time during descent.',
          interactiveData: {
            craftName: 'Perseverance Rover & Ingenuity Helicopter',
            hotspots: [
              {
                id: 'caching-carousel',
                title: 'Adaptive Caching Assembly',
                subsystem: 'Sample Collection & Hermetic Sealing',
                description: 'Internal robotic arm that moves titanium tubes between the core drill, imaging stations, and hermetic seal presses.',
                spec: 'Seals samples inside laser-welded titanium containers designed to last 20+ years.'
              },
              {
                id: 'ingenuity-blades',
                title: 'Ingenuity Counter-Rotating Rotors',
                subsystem: 'Aerodynamic Propulsion',
                description: 'Two 1.2-meter coaxial blades with custom airfoils spinning in opposite directions at 2,400 to 2,700 RPM.',
                spec: 'Generates enough lift to overcome 1% atmospheric density in 38% gravity.'
              },
              {
                id: 'moxie-generator',
                title: 'MOXIE Oxygen Generator',
                subsystem: 'In-Situ Resource Utilization (ISRU)',
                description: 'Solid oxide electrolysis splits atmospheric carbon dioxide (CO₂) into oxygen (O₂) and carbon monoxide at 800°C.',
                spec: 'Produced 122 grams of 98% pure oxygen across 16 tests.'
              },
              {
                id: 'supercam-mic',
                title: 'SuperCam Acoustic Microphone',
                subsystem: 'Acoustic Planetary Sensing',
                description: 'First high-fidelity microphone on Mars, recording the whir of Ingenuity\'s blades, wind breezes, and laser snaps.',
                spec: 'Recorded the speed of sound on Mars (240 m/s for low frequencies, 250 m/s for high).'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'The 25-Foot Space Simulator',
          interactiveType: 'readiness_check',
          narrative: 'To test Ingenuity, JPL evacuated the 25-foot Space Simulator chamber to a vacuum, backfilled it with pure carbon dioxide at 7 millibars, and mounted the helicopter on an upward gravity-offload tether to simulate 38% Martian gravity. On the rover side, the coring drill endured thousands of test bites into volcanic basalts.',
          historicalContext: 'January 2019: In the JPL space simulator, Ingenuity took its first tethered hover, proving controlled aerodynamic flight in Mars conditions was possible.',
          interactiveData: {
            simulationName: 'Mars 2020 & Ingenuity Qualification',
            checklist: [
              { item: '25-Foot Chamber 7-Millibar CO₂ Hover Test', status: 'PASS', notes: 'Autonomous optical-flow flight control loop locked at 2,500 RPM.' },
              { item: 'Terrain-Relative Navigation (TRN) Lander Vision System', status: 'PASS', notes: 'Camera algorithms matched descent images to onboard hazard maps at 30 fps.' },
              { item: 'Titanium Sample Tube Ultra-Cleanliness Bakeout', status: 'PASS', notes: 'Certified less than 1 nanogram of terrestrial organic carbon per tube.' },
              { item: 'MOXIE High-Temperature Ceramic Electrolyzer Verification', status: 'PASS', notes: 'Tested 800°C electrolysis under simulated Martian atmospheric feed.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Departure Amid a Global Pandemic',
          interactiveType: 'launch_sim',
          narrative: 'Perseverance launched on July 30, 2020 from SLC-41 Cape Canaveral during the peak of the COVID-19 pandemic. Missing the 2020 launch window would have delayed the mission by 26 months at a cost of $500 million. A commemorative plate on the rover honored healthcare workers worldwide.',
          historicalContext: 'July 30, 2020: The launch team wore masks and worked in socially distanced control rooms, successfully executing the TMI burn.',
          interactiveData: {
            liftoffWeightKg: 531000,
            thrustKN: 10600,
            maxQAltitudeKm: 13.9,
            maxQVelocityMach: 1.82,
            tliBurnDurationSeconds: 318,
            trajectoryOutcome: 'Precision Trans-Mars Injection targeting Jezero Crater.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'The Crater Delta Bullseye',
          interactiveType: 'trajectory_scrub',
          narrative: 'On February 18, 2021, Perseverance executed the most precise landing in planetary history. Using Terrain-Relative Navigation, the onboard computer compared live descent photos to an orbital hazard map, steering away from razor-sharp boulder fields and cliff faces to touch down smoothly on the delta deposits of Jezero Crater.',
          historicalContext: 'February 18, 2021: High-definition cameras captured the parachute inflation and the Skycrane lowering Perseverance in full color and sound.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 10.9, date: 'July 30, 2020' },
              { distancePct: 45, label: 'Interplanetary Cruise', velocityKmS: 2.1, date: 'Nov 2020' },
              { distancePct: 95, label: 'Range-Trigger Parachute Deploy', velocityKmS: 1.8, date: 'Feb 18, 2021' },
              { distancePct: 99, label: 'Terrain-Relative Navigation Divert', velocityKmS: 0.6, date: 'Feb 18, 2021' },
              { distancePct: 100, label: 'Touchdown at Octavia E. Butler Landing', velocityKmS: 0.0, date: 'Feb 18, 2021' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'The Wright Brothers Moment & Cached Cores',
          interactiveType: 'discovery_slider',
          narrative: 'On April 19, 2021, Ingenuity unlocked the skies of Mars with Flight 1—spinning its blades, rising 3 meters, hovering, and landing gently. It carried a postage-stamp-sized piece of fabric from the Wright Brothers\' 1903 Flyer taped under its solar panel. Meanwhile, Perseverance drilled 24 pristine core samples of lakebed mudstones and igneous rocks, caching 10 backup tubes on the flat ground of "Three Forks" as a secure depot for Mars Sample Return.',
          historicalContext: 'December 2022 - January 2023: Perseverance deposited 10 titanium sample tubes on the surface of Mars, creating humanity\'s first sample depot on an alien world.',
          interactiveData: {
            events: [
              { timeCode: 'April 19, 2021', title: 'Ingenuity Flight 1', metric: 'Altitude: 3 m, Duration: 39.1s', detail: 'Humanity\'s first powered, controlled aerodynamic flight on another world.' },
              { timeCode: 'Sol 164', title: 'First Core Sample: Montdenier', metric: 'Sample Tube #1 Sealed', detail: 'Extracted ancient volcanic basalt core from crater floor.' },
              { timeCode: 'Sol 650', title: 'Three Forks Sample Depot Complete', metric: '10 Titanium Tubes Cached', detail: 'Primary backup depot established for future Mars Sample Return retrieval.' },
              { timeCode: 'Flight 72 (Jan 2024)', title: 'Ingenuity Final Touchdown', metric: 'Rotor blade damaged', detail: 'Landed hard after navigation blackout; permanently grounded after 72 flights.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: Valinor Hills & The Rim of Jezero',
          interactiveType: 'then_vs_now',
          narrative: 'Perseverance is climbing the western rim of Jezero Crater today, caching its most ancient rock samples yet. Several kilometers behind it, Ingenuity stands frozen forever at "Valinor Hills." Though grounded by a cracked rotor blade, Ingenuity remains alive: its solar panel wakes it each morning to record temperatures and calibrate Martian weather models. Across the crater, its heatshield, parachute, and skycrane remain as the modern monuments of humanity\'s quest.',
          historicalContext: 'Ingenuity flew 14 times farther than planned and logged over 2 hours of flight time across 72 missions.',
          interactiveData: {
            thenState: {
              date: 'February 2021',
              appearance: 'Spotless titanium hardware, pristine white chassis, folded helicopter tucked under belly belly-shield.',
              operationalState: 'Designed as a 30-day aerial tech demo; rover commencing primary mission.',
              thermalStatus: 'Peak MMRTG output (110W) and full battery health.'
            },
            nowState: {
              date: 'Present Day (Active Mission)',
              appearance: 'Perseverance dusty but fully functional; Ingenuity grounded at Valinor Hills with broken rotor tip.',
              operationalState: 'Perseverance active with 24 cached cores; Ingenuity acting as stationary weather station.',
              thermalStatus: 'Both vehicles navigating daily diurnal Martian temperature swings.'
            },
            preservationNote: 'Ingenuity proved that powered flight is possible on other worlds, paving the way for future aerial explorers like the Dragonfly mission to Saturn\'s moon Titan.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'What piece of aviation history did the Ingenuity helicopter secretly carry to Mars?',
          shortAnswer: 'A tiny piece of unbleached muslin fabric from the wing of the Wright Brothers\' 1903 Flyer, taped beneath its solar panel.',
          deepDive: 'To honor the heritage of human aviation, NASA engineers taped a postage-stamp-sized swatch of fabric from the wing of the 1903 Wright Flyer underneath Ingenuity\'s solar panel. The International Civil Aviation Organization (ICAO) designated Ingenuity\'s Martian airfield "Wright Brothers Field" (code JZRO) and assigned the callsign "IGY". When Ingenuity lifted off on April 19, 2021, the Wright family fabric flew through the air of a second planet.'
        },
        {
          question: 'Why did NASA place 10 sealed sample tubes directly onto the Martian ground at Three Forks?',
          shortAnswer: 'It created an accessible backup depot for the Mars Sample Return mission in case Perseverance breaks down before handing tubes to the lander.',
          deepDive: 'The primary architecture for Mars Sample Return calls for Perseverance to drive directly to the Sample Retrieval Lander and transfer its internal tube cache into a rocket. But if Perseverance suffers a catastrophic failure, it cannot deliver them. As an insurance policy, Perseverance cached 10 duplicate titanium tubes at "Three Forks"—spaced 5 to 15 meters apart on a flat plain—so two small recovery helicopters could easily land, grab the tubes with claws, and fly them to the return rocket.'
        },
        {
          question: 'How did Ingenuity fly without a human pilot or GPS on Mars?',
          shortAnswer: 'It used an autonomous optical-flow algorithm: a downward camera tracked sand ripples 30 times a second to calculate speed and position.',
          deepDive: 'With radio delays between 5 and 20 minutes, real-time joystick control from Earth is impossible. Furthermore, Mars has no GPS satellite constellation and no global magnetic field for compasses. Ingenuity navigated using an inertial measurement unit (IMU) coupled with a high-speed black-and-white downward camera. An onboard algorithm compared successive frames, tracking features and sand ripples 30 times per second to estimate its exact position, velocity, and tilt.'
        }
      ],
      quizQuestions: [
        {
          question: 'How many successful powered flights did the Ingenuity Mars Helicopter complete before its mission ended?',
          options: [
            '5 flights',
            '25 flights',
            '72 flights',
            '100 flights'
          ],
          correctIndex: 2,
          explanation: 'Ingenuity was designed as a 30-day technology demonstration to attempt up to 5 flights. It astonished engineers by completing 72 historic flights over nearly three years before damaging a rotor blade in January 2024.'
        },
        {
          question: 'What instrument on Perseverance successfully produced breathable oxygen directly from the Martian atmosphere?',
          options: [
            'SHERLOC',
            'MOXIE',
            'PIXL',
            'RIMFAX'
          ],
          correctIndex: 1,
          explanation: 'MOXIE (Mars Oxygen ISRU Experiment) extracted oxygen from the atmospheric carbon dioxide using solid oxide electrolysis, proving technology needed for future human expeditions.'
        },
        {
          question: 'What historical artifact is taped beneath Ingenuity\'s solar panel?',
          options: [
            'A piece of Neil Armstrong\'s Apollo 11 spacesuit',
            'A wing fabric swatch from the Wright Brothers\' 1903 Flyer',
            'A fragment of Chuck Yeager\'s Bell X-1 rocket plane',
            'A micro-chip with 10 million children\'s signatures'
          ],
          correctIndex: 1,
          explanation: 'A small piece of muslin fabric from the lower left wing of the Wright Brothers\' 1903 Flyer was taped under Ingenuity\'s solar panel, connecting the first flight on Earth to the first flight on Mars.'
        }
      ],
      sources: [
        {
          title: 'NASA Mars 2020 Perseverance Mission Overview',
          url: 'https://mars.nasa.gov/mars2020/',
          description: 'Official NASA Jet Propulsion Laboratory mission homepage for Perseverance and Ingenuity.'
        },
        {
          title: 'Science: The Jezero Crater Delta Geological Survey by Perseverance',
          url: 'https://www.science.org/doi/10.1126/science.abo5460',
          description: 'Peer-reviewed analysis of lakebed sedimentation, boulder conglomerate flood deposits, and core samples.'
        },
        {
          title: 'NASA JPL: Ingenuity Mars Helicopter Flight Log',
          url: 'https://mars.nasa.gov/technology/helicopter/#Flight-Log',
          description: 'Complete flight-by-flight telemetry archive detailing distance, duration, altitude, and landing coords for all 72 flights.'
        }
      ]
    },

    // ========================================================================
    // MISSION 8: CASSINI-HUYGENS
    // ========================================================================
    {
      id: 'cassini-huygens',
      name: 'Cassini-Huygens',
      callsign: 'Cassini Orbiter & Huygens Titan Probe',
      agency: 'NASA/ESA',
      launchDate: '1997-10-15T08:43:00Z',
      endDate: '2017-09-15T11:55:46Z',
      fateCategory: 'sacrificial_plunge',
      currentStatusDescription: 'After 13 glorious years orbiting Saturn, revolutionizing our understanding of its rings and ocean worlds Enceladus and Titan, Cassini executed the "Grand Finale"—22 daring dives between Saturn and its innermost rings. On September 15, 2017, with attitude-control thruster fuel nearly exhausted, NASA directed Cassini into a deliberate sacrificial plunge into Saturn\'s crushing atmosphere. The probe vaporized within minutes, protecting potentially habitable ocean moons Enceladus and Titan from future microbial contamination. The ESA Huygens probe rests on Titan\'s frozen methane surface.',
      isStillTransmitting: false,
      destinations: [
        'Venus Gravity Assists (x2)',
        'Earth Gravity Assist',
        'Jupiter Gravity Assist',
        'Saturn Orbit Insertion',
        'Adiri, Titan (Huygens Probe Landing)',
        'Saturn Atmosphere (Cassini Sacrificial Plunge)'
      ],
      launchVehicle: 'Titan IVB / Centaur',
      launchSite: 'Cape Canaveral Air Force Station, Launch Complex 40, Florida',
      landingSiteCoordinates: {
        celestialBody: 'Saturn (Atmosphere) / Titan (Huygens)',
        siteName: 'Saturn Upper Atmosphere (Cassini) & Adiri, Titan (Huygens)',
        latitude: -9.4,
        longitude: 53.0
      },
      spacecraftSpecs: {
        dryMassKg: 2125, // Cassini 2,125 kg dry orbiter + 318 kg Huygens probe
        powerSource: 'Three General Purpose Heat Source Radioisotope Thermoelectric Generators (GPHS-RTGs, 32.7 kg Pu-238)',
        powerOutputWatts: 885, // 885W at launch in 1997, decayed to 633W by 2017 Grand Finale
        communicationSystem: '4-meter high-gain parabolic Cassegrain dish antenna provided by Italian Space Agency (ASI), transmitting at X-band and Ka-band',
        instruments: [
          {
            name: 'Composite Infrared Spectrometer',
            acronym: 'CIRS',
            purpose: 'Measures infrared thermal emission from Saturn, rings, and moons.',
            targetMeasurement: 'Discovered the thermal "tiger stripe" fractures venting water plumes on Enceladus.'
          },
          {
            name: 'Ion and Neutral Mass Spectrometer',
            acronym: 'INMS',
            purpose: 'Sniffs composition of neutral and charged particles in atmosphere and geyser plumes.',
            targetMeasurement: 'Sampled water vapor, methane, nitrogen, carbon dioxide, and organic macromolecules directly in Enceladus geysers.'
          },
          {
            name: 'Cassini Plasma Spectrometer',
            acronym: 'CAPS',
            purpose: 'Measures flux and energy of electrons and protons trapped in Saturn\'s magnetic field.',
            targetMeasurement: 'Magnetospheric plasma dynamics and interaction with ring particle charging.'
          },
          {
            name: 'Huygens Surface Science Package',
            acronym: 'SSP',
            purpose: 'Sensors on the ESA Huygens probe measuring physical properties of Titan\'s surface during descent and landing.',
            targetMeasurement: 'Confirmed liquid methane/ethane rainfall and soft "wet sand" consistency of Titan regolith.'
          }
        ]
      },
      trackingTier: 'historical_trajectory',
      distanceFromEarthAU: 9.58, // Average Saturn distance ~1.4 billion km
      tagline: "The grand explorer of the ringed world that died to protect alien oceans.",
      discardedEquipment: [
        'Cassini Spacecraft (vaporized into atoms in Saturn\'s atmosphere on Sept 15, 2017)',
        'ESA Huygens Probe (resting permanently on the frozen methane sands of Titan)',
        'Huygens descent heatshield and parachute assembly',
        'Jettisoned rocket engine covers and spent propellant'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'The Flagship to the Ringed Giant',
          interactiveType: 'objective_choice',
          narrative: 'Following the Voyager flybys, scientists realized Saturn was not just a planet with rings—it was a mini solar system. Its giant moon Titan possessed an atmosphere thicker than Earth\'s, while tiny moons like Enceladus hinted at active geology. NASA teamed up with the European Space Agency (ESA) and Italian Space Agency (ASI) to build the ultimate deep-space flagship.',
          historicalContext: '1982-1988: Joint NASA-ESA studies approved Cassini-Huygens as an international flagship, combining NASA\'s Saturn orbiter with ESA\'s Titan atmospheric probe.',
          interactiveData: {
            dilemma: 'How do you propel a 5.7-metric-ton flagship to Saturn without requiring an impossibly massive rocket?',
            options: [
              {
                id: 'direct-burn',
                title: 'Direct High-Energy Burn',
                pros: 'Faster travel time.',
                cons: 'Requires a fictional booster; no rocket in existence could carry 5,700 kg directly to Saturn.',
                verdict: 'Physically impossible with 1990s rockets.'
              },
              {
                id: 'vvejag',
                title: 'VVEJGA Gravitational Slingshot Route',
                pros: 'Venus-Venus-Earth-Jupiter Gravity Assists multiply speed using planetary momentum.',
                cons: 'Takes 6.7 years of interplanetary transit across the inner solar system.',
                verdict: 'Selected: Gravitational billiards flung Cassini smoothly to Saturn!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'A School Bus in Deep Space',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Cassini was the size of a two-story school bus and weighed 5,712 kg loaded with fuel. Because sunlight at Saturn is only 1% as intense as at Earth, solar panels were out of the question. Three radioisotope thermoelectric generators fueled by 32.7 kg of plutonium-238 provided 885 Watts of electricity. Fixed to its flank was ESA\'s 318-kilogram Huygens probe, protected by a gold-coated heatshield.',
          historicalContext: '1990-1997: Built at JPL with instruments contributed by 17 nations, Cassini represented the pinnacle of 20th-century planetary robotics.',
          interactiveData: {
            craftName: 'Cassini Orbiter & ESA Huygens Probe',
            hotspots: [
              {
                id: 'hga-dish',
                title: '4-Meter High-Gain Antenna',
                subsystem: 'Telecommunications & Radar',
                description: 'Cassegrain parabolic dish provided by ASI; doubled as a radar mapper and solar heatshield during inner-system cruise.',
                spec: 'Transmitted high-speed scientific data across 1.5 billion km of space.'
              },
              {
                id: 'huygens-probe',
                title: 'ESA Huygens Titan Probe',
                subsystem: 'Atmospheric Entry Capsule',
                description: '2.7-meter saucer-shaped probe designed to penetrate Titan\'s dense nitrogen-methane atmosphere and land on its surface.',
                spec: 'Survived 2.5-hour descent through smoggy clouds and operated 72 minutes on the surface.'
              },
              {
                id: 'r-4d-engine',
                title: 'Main Bipropellant Rocket Engine',
                subsystem: 'Orbital Propulsion',
                description: 'Twin 445-Newton R-4D hypergolic rocket engines burning monomethylhydrazine and nitrogen tetroxide.',
                spec: 'Fired for 96 minutes to brake Cassini into Saturn orbit on July 1, 2004.'
              },
              {
                id: 'rtg-cluster',
                title: 'Three GPHS-RTGs',
                subsystem: 'Nuclear Power Subsystem',
                description: 'Plutonium-238 heat converted to 885 Watts of electricity by silicon-germanium thermocouples.',
                spec: 'Powered 12 orbiter instruments for two decades in the cold outer solar system.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'The Great Radio Firmware Fix',
          interactiveType: 'readiness_check',
          narrative: 'In 2000, during the interplanetary cruise, ESA engineer Boris Smeds discovered a catastrophic design flaw: Doppler shift caused by Huygens\' high-speed entry would shift radio frequencies outside the receiver bandwidth of Cassini\'s relay receiver. NASA and ESA astrodynamicists redesigned Cassini\'s orbit, increasing its flyby distance to reduce the Doppler shift and saving the mission.',
          historicalContext: '2000: Astrodynamicist Boris Smeds\' ingenuity averted total data loss for the Huygens Titan landing.',
          interactiveData: {
            simulationName: 'Cassini-Huygens System & Doppler Relay Verification',
            checklist: [
              { item: 'Titan Trajectory Doppler Redesign Simulation', status: 'PASS', notes: 'Flyby geometry modified to lower relative velocity during probe descent.' },
              { item: 'GPHS-RTG Thermal Radiator Vacuum Soak', status: 'PASS', notes: 'Stable 885W output verified in cryogenic space simulator.' },
              { item: 'Huygens Parachute Mortar Pyrotechnic Test', status: 'PASS', notes: 'Mach 1.5 supersonic drogue and main parachute deployment verified.' },
              { item: 'Titan IVB / Centaur High-Energy Stack Integration', status: 'PASS', notes: 'America\'s most powerful operational rocket mated at LC-40.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Titan IVB Blasts into the Night',
          interactiveType: 'launch_sim',
          narrative: 'On October 15, 1997 at 04:43 EDT, Cassini blasted off from Cape Canaveral aboard a 53-meter-tall Titan IVB/Centaur rocket. Two solid rocket motor upgrades generated a colossal 15 million Newtons of thrust, lighting up the Florida coast as Cassini began its seven-year voyage.',
          historicalContext: 'October 1997: Over 800 scientists, engineers, and dignitaries watched Cassini lift off on the last flight of the 20th century\'s outer-planet explorers.',
          interactiveData: {
            liftoffWeightKg: 940000,
            thrustKN: 15100,
            maxQAltitudeKm: 14.5,
            maxQVelocityMach: 1.85,
            tliBurnDurationSeconds: 330,
            trajectoryOutcome: 'Clean interplanetary injection onto Venus-1 transfer trajectory.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'The 3-Billion-Kilometer Billiards Shot',
          interactiveType: 'trajectory_scrub',
          narrative: 'Cassini executed two flybys of Venus, one of Earth, and one of Jupiter—gaining speed with each gravitational kiss. On July 1, 2004, Cassini fired its main engine for 96 minutes, slipping through the gap between Saturn\'s F and G rings to enter orbit. On Christmas Day 2004, Cassini released Huygens on an unpowered ballistic trajectory toward Titan.',
          historicalContext: 'January 14, 2005: Huygens touched down on Titan, returning the first photos from the surface of a moon in the outer solar system.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 11.2, date: 'Oct 15, 1997' },
              { distancePct: 20, label: 'Venus Flyby 2', velocityKmS: 19.1, date: 'June 24, 1999' },
              { distancePct: 50, label: 'Jupiter Flyby', velocityKmS: 31.5, date: 'Dec 30, 2000' },
              { distancePct: 90, label: 'Saturn Orbit Insertion (SOI)', velocityKmS: 5.2, date: 'July 1, 2004' },
              { distancePct: 100, label: 'Huygens Lands on Titan', velocityKmS: 0.0, date: 'Jan 14, 2005' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'Enceladus Geysers & Titan Methane Seas',
          interactiveType: 'discovery_slider',
          narrative: 'Cassini rewrote planetary science. At Titan, radar pierced smoggy skies to reveal liquid methane rivers, lakes, and seas like Kraken Mare. At tiny, ice-covered Enceladus, Cassini discovered geysers of water vapor, salt crystals, and organic molecules blasting into space from warm fractures ("tiger stripes") over a global subsurface ocean—propelling Enceladus to the top of the list for potential extraterrestrial life.',
          historicalContext: '2005-2015: Cassini completed 294 orbits of Saturn, executed 127 targeted flybys of Titan, and flew directly through the icy geyser plumes of Enceladus.',
          interactiveData: {
            events: [
              { timeCode: 'Jan 14, 2005', title: 'Huygens Touches Down on Titan', metric: 'Surface temp: -179°C', detail: 'Photographed river networks carved by liquid methane and rounded water-ice pebbles.' },
              { timeCode: 'July 14, 2005', title: 'Discovery of Enceladus Plumes', metric: 'Geyser speed: 400 m/s', detail: 'Discovered cryovolcanic water vapor geysers feeding Saturn\'s E-ring.' },
              { timeCode: 'Oct 28, 2015', title: 'Deep Dive Through Plume', metric: 'Altitude: 48 km above surface', detail: 'INMS detected molecular hydrogen (H₂), confirming hydrothermal vents on ocean floor.' },
              { timeCode: 'April 2017', title: 'Grand Finale Commences', metric: '22 dives inside rings', detail: 'First spacecraft to explore the 2,000-kilometer gap between Saturn and its rings.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: The Sacrificial Plunge',
          interactiveType: 'then_vs_now',
          narrative: 'By 2017, Cassini was running out of propellant. If left abandoned in orbit, it would eventually crash into Enceladus or Titan, potentially contaminating their pristine oceans with dormant Earth microbes. To protect those alien worlds, NASA commanded Cassini into a deliberate death dive. On September 15, 2017, Cassini plunged into Saturn\'s upper atmosphere at 120,000 km/h. Fighting with thrusters to keep its antenna pointed at Earth to the very end, it vaporized within minutes, becoming part of the planet it explored.',
          historicalContext: 'September 15, 2017 (04:55 PDT): "Loss of signal confirmed. This has been an incredible mission, an incredible spacecraft, and you\'re all an incredible team."—Earl Maize, Cassini Project Manager.',
          interactiveData: {
            thenState: {
              date: 'July 2004',
              appearance: 'Gold Kapton insulation pristine; 4-meter white dish shining; 3,000 kg of hydrazine/oxidizer in fuel tanks.',
              operationalState: 'All 12 science suites operational; RTG producing 750W; entering pristine orbit.',
              thermalStatus: 'Stable thermal equilibrium maintained by internal radioisotope heaters.'
            },
            nowState: {
              date: 'Present Day',
              appearance: 'Cassini: Vaporized into atomic constituents within Saturn\'s crushing atmosphere; Huygens: Resting frozen on Titan.',
              operationalState: 'Cassini silent since September 15, 2017; Huygens batteries expired 72 minutes after touchdown in 2005.',
              thermalStatus: 'Huygens frozen at -179°C on Adiri plain; Cassini atoms dispersed through Saturn\'s hydrogen envelope.'
            },
            preservationNote: 'Cassini\'s deliberate destruction set the ethical gold standard for planetary protection, sacrificing the greatest robotic spacecraft in history to ensure alien ocean worlds remain untainted for future discovery.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'Why did NASA deliberately crash Cassini into Saturn instead of leaving it in orbit?',
          shortAnswer: 'To protect the ocean moons Enceladus and Titan from potential contamination by terrestrial bacterial spores that might still be clinging to the spacecraft.',
          deepDive: 'Cassini discovered that Enceladus has a warm subsurface saltwater ocean with hydrothermal vents, while Titan has liquid methane lakes and prebiotic chemistry. Under international planetary protection treaties, NASA had an ethical obligation to avoid any accidental collision. If Cassini ran out of propellant, gravitational nudges from Saturn\'s moons would have eventually pulled the dead probe onto an impact course. Plunging into Saturn\'s atmosphere vaporized Cassini completely, ensuring Earth microbes never contaminate alien ecosystems.'
        },
        {
          question: 'What did the ESA Huygens probe find on the surface of Saturn\'s giant moon Titan?',
          shortAnswer: 'It found drainage river valleys, rounded water-ice boulders, and a coastline meeting mud plains soaked in liquid methane and ethane.',
          deepDive: 'On January 14, 2005, Huygens parachuted through Titan\'s thick nitrogen-methane smog. Its cameras captured aerial views of river networks carved by liquid methane rain draining into dry lakebeds. When the probe touched down at Adiri, its penetrometer sank into soft soil with the consistency of wet sand or creme brulee. Heat from the lander warmed the ground, causing clouds of methane gas to evaporate—confirming Titan has an active methane hydrological cycle analogous to Earth\'s water cycle.'
        },
        {
          question: 'What proved that Enceladus has a warm ocean beneath its frozen ice shell?',
          shortAnswer: 'Cassini flew directly through the geyser plumes and tasted water vapor, salt, organic macromolecules, and molecular hydrogen from hydrothermal vents.',
          deepDive: 'At Enceladus\' south pole, Cassini\'s cameras spotted towering plumes of ice crystals venting hundreds of kilometers into space from four parallel fissures dubbed "tiger stripes." When Cassini flew just 48 km above the surface through the plume, its INMS mass spectrometer detected water vapor, salts, methane, carbon dioxide, and molecular hydrogen (H₂). The molecular hydrogen proved that hot geochemical reactions between seawater and a rocky core (serpentinization) are active today, providing chemical energy that could fuel chemosynthetic life.'
        }
      ],
      quizQuestions: [
        {
          question: 'Why did NASA command Cassini to perform its deliberate "Grand Finale" sacrificial plunge into Saturn?',
          options: [
            'Its main camera failed completely.',
            'To protect potentially habitable ocean moons Enceladus and Titan from microbial contamination.',
            'Saturn\'s magnetic field was pulling it down uncontrollably.',
            'To measure the core temperature of Saturn\'s solid iron center.'
          ],
          correctIndex: 1,
          explanation: 'With propellant running out, NASA intentionally vaporized Cassini in Saturn\'s atmosphere to prevent an accidental crash onto Enceladus or Titan, preserving their pristine ocean environments for future astrobiology missions.'
        },
        {
          question: 'What tiny moon of Saturn was discovered by Cassini to spray water vapor and organic geysers into space from a subsurface ocean?',
          options: [
            'Mimas',
            'Enceladus',
            'Iapetus',
            'Hyperion'
          ],
          correctIndex: 1,
          explanation: 'Enceladus sprays water vapor, silica, and organic molecules from deep fractures at its south pole, fed by a global subsurface ocean with active hydrothermal vents.'
        },
        {
          question: 'What European Space Agency probe detached from Cassini to land on the surface of Saturn\'s moon Titan in 2005?',
          options: [
            'Rosetta',
            'Huygens',
            'Philae',
            'Giotto'
          ],
          correctIndex: 1,
          explanation: 'The ESA Huygens probe detached on Christmas Day 2004 and parachuted onto Titan on January 14, 2005, becoming the first spacecraft to land on a body in the outer solar system.'
        }
      ],
      sources: [
        {
          title: 'NASA Cassini: The Grand Finale Archive',
          url: 'https://solarsystem.nasa.gov/missions/cassini/overview/',
          description: 'Official NASA JPL archive documenting the 13-year mission, science returns, and final orbital dives.'
        },
        {
          title: 'ESA Science & Technology: Huygens Titan Probe Mission',
          url: 'https://www.cosmos.esa.int/web/huygens',
          description: 'European Space Agency archival repository for Huygens descent data, panoramic images, and atmospheric profiles.'
        },
        {
          title: 'Nature: Hydrothermal Systems in Small Ocean Worlds (Enceladus Plumes)',
          url: 'https://www.nature.com/articles/nature14262',
          description: 'Peer-reviewed research paper establishing the discovery of active hydrothermal vents on Enceladus\' ocean floor.'
        }
      ]
    },

    // ========================================================================
    // MISSION 9: VOYAGER 1 & 2
    // ========================================================================
    {
      id: 'voyager-1-2',
      name: 'Voyager 1 & 2',
      callsign: 'Voyager 1 (VGR-1) & Voyager 2 (VGR-2)',
      agency: 'NASA/JPL',
      launchDate: '1977-08-20T14:29:00Z', // Voyager 2 launched first
      endDate: null, // Active in interstellar space
      fateCategory: 'deep_space',
      currentStatusDescription: 'Voyager 1 and Voyager 2 are humanity\'s farthest emissaries, both now traversing interstellar space beyond the heliopause. Voyager 1 is over 24.5 billion kilometers (164 AU) from Earth, and Voyager 2 is over 20.5 billion kilometers (137 AU) away. Each carries the famous 12-inch gold-plated copper phonograph record ("The Golden Record") containing sounds, music, and images of Earth. As RTG electrical power decays by roughly 4 Watts per year, NASA sequentially powers down instruments to prolong operations into the 2030s, after which they will drift silently through the Milky Way galaxy for billions of years.',
      isStillTransmitting: true,
      destinations: [
        'Jupiter Flybys (1979)',
        'Saturn Flybys (1980, 1981)',
        'Uranus Flyby (Voyager 2, 1986)',
        'Neptune Flyby (Voyager 2, 1989)',
        'Heliopause / Interstellar Space'
      ],
      launchVehicle: 'Titan IIIE / Centaur',
      launchSite: 'Cape Canaveral Air Force Station, Launch Complex 41, Florida',
      landingSiteCoordinates: null,
      spacecraftSpecs: {
        dryMassKg: 773, // Launch dry mass per probe
        powerSource: 'Three Multi-Hundred-Watt Radioisotope Thermoelectric Generators (MHW-RTG, Plutonium-238)',
        powerOutputWatts: 470, // 470 Watts at launch in 1977; decayed to ~220 Watts today
        communicationSystem: '3.7-meter High-Gain Parabolic Reflector Antenna transmitting at S-band (2.3 GHz) and X-band (8.4 GHz) to NASA Deep Space Network 70-meter dish antennas',
        instruments: [
          {
            name: 'Triaxial Fluxgate Magnetometer',
            acronym: 'MAG',
            purpose: 'Measures intensity and direction of interplanetary and interstellar magnetic fields.',
            targetMeasurement: 'Detected the sudden jump in magnetic field strength confirming crossing of the heliopause into interstellar space.'
          },
          {
            name: 'Low Energy Charged Particle',
            acronym: 'LECP',
            purpose: 'Measures composition and energy spectrum of solar wind ions and cosmic ray electrons.',
            targetMeasurement: 'Recorded the dramatic drop in solar particles and surge in galactic cosmic rays at the heliopause.'
          },
          {
            name: 'Cosmic Ray Subsystem',
            acronym: 'CRS',
            purpose: 'High-energy detectors searching for galactic cosmic rays originating from supernova explosions.',
            targetMeasurement: 'Provides primary verification of true interstellar space boundary conditions.'
          },
          {
            name: 'Plasma Wave Subsystem',
            acronym: 'PWS',
            purpose: 'Measures electrostatic and electromagnetic waves in tenuous ambient plasma.',
            targetMeasurement: 'Recorded "sounds" of interstellar plasma oscillating following solar coronal mass ejection shocks.'
          }
        ]
      },
      trackingTier: 'live_calculated',
      distanceFromEarthAU: 164.2, // Voyager 1 current distance (~24.5 billion km)
      tagline: "Humanity's farthest emissaries carrying the Golden Record into the cosmic ocean.",
      discardedEquipment: [
        'Two Titan IIIE Centaur upper stage rocket bodies (in solar orbit)',
        'Scan Platform mirror mechanisms (powered down permanently to save wattage)',
        'Boom deployment lanyards and spent hydrazine attitude propellant',
        'Voyager 1 and 2 will drift indefinitely through interstellar space as permanent technological artifacts'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'The Once-in-176-Year Grand Tour',
          interactiveType: 'objective_choice',
          narrative: 'In 1965, Gary Flandro, a graduate student working at JPL, made an astonishing mathematical discovery: in the late 1970s, Jupiter, Saturn, Uranus, and Neptune would align along a single geometric arc—an alignment that occurs only once every 176 years. A single spacecraft could visit all four outer gas giants using gravitational slingshots, cutting travel time from 30 years down to 12.',
          historicalContext: '1965-1972: Gary Flandro\'s orbital calculation inspired NASA\'s Grand Tour proposal, which was descoped into the twin Voyager missions to fit congressional budgets.',
          interactiveData: {
            dilemma: 'Should you send both spacecraft to Saturn and Titan, or sacrifice a close Titan flyby to visit Uranus and Neptune?',
            options: [
              {
                id: 'both-titan',
                title: 'Send Both Probes to Titan',
                pros: 'Guarantees redundant coverage of Saturn\'s mysterious atmosphere moon.',
                cons: 'Gravity assist pulls both probes northward out of the ecliptic plane; Uranus and Neptune cannot be reached.',
                verdict: 'Too conservative; sacrifices two outer planets.'
              },
              {
                id: 'split-strategy',
                title: 'The Dual-Path Strategy',
                pros: 'Voyager 1 sacrifices Uranus to do a close flyby of Titan; Voyager 2 stays in the ecliptic to visit Uranus and Neptune.',
                cons: 'If Voyager 1 fails at Titan, Voyager 2 must be diverted, abandoning Uranus.',
                verdict: 'Selected: Voyager 1 revealed Titan while Voyager 2 completed the Grand Tour of all 4 gas giants!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'The Golden Record & The 10-Sided Bus',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Built by JPL, each Voyager was designed around a 10-sided decagonal bus housing computers and fuel tanks, crowned by a 3.7-meter parabolic dish antenna. Mounted on the side was the Golden Record: a 12-inch gold-plated copper phonograph record curated by Carl Sagan, containing greetings in 55 languages, 115 images, sounds of Earth (wind, rain, whale songs), and 90 minutes of music from Bach to Chuck Berry.',
          historicalContext: '1977: Ann Druyan, Carl Sagan, and Timothy Ferris compiled the Golden Record in just six months, etching instructions into the aluminum protective cover.',
          interactiveData: {
            craftName: 'Voyager 1 & 2 Interstellar Probes',
            hotspots: [
              {
                id: 'golden-record',
                title: 'The Golden Phonograph Record',
                subsystem: 'Interstellar Time Capsule',
                description: 'Gold-plated copper disc with electroplated gold containing analogue audio and video signals, accompanied by a needle and playing stylus.',
                spec: 'Designed to survive intact in the vacuum of interstellar space for more than 1 billion years.'
              },
              {
                id: 'high-gain-dish',
                title: '3.7-Meter High-Gain Antenna',
                subsystem: 'Telecommunications Subsystem',
                description: 'Rigid graphite-epoxy parabolic reflector dish transmitting an ultra-narrow beam directly back to Earth.',
                spec: 'Signals now take over 22.5 hours to travel from Voyager 1 to Earth at the speed of light.'
              },
              {
                id: 'rtg-boom',
                title: 'Three MHW-RTGs on Deployable Boom',
                subsystem: 'Radioisotope Thermoelectric Generators',
                description: 'Plutonium-238 heat source mounted on an extended boom to keep gamma and neutron radiation away from sensitive science instruments.',
                spec: 'Initial output: 470 Watts; continuous decay provides ~220 Watts after 47 years.'
              },
              {
                id: 'magnetometer-boom',
                title: '13-Meter Fiberglass Magnetometer Boom',
                subsystem: 'Magnetic Field Sensing',
                description: 'Deployable coiled fiberglass boom holding two triaxial fluxgate magnetometers far from the spacecraft\'s internal magnetic fields.',
                spec: 'Measured the orientation change of magnetic lines at the boundary of interstellar space.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: 'Radiation Hardening for Jupiter\'s Inferno',
          interactiveType: 'readiness_check',
          narrative: 'Pioneer 10 had revealed that Jupiter possesses radiation belts millions of times more lethal than the Van Allen belts around Earth. Engineers had to strip out commercial transistors, wrap cables in copper and lead shielding, and rewrite fault-protection software so the computers would not reset when struck by energetic electrons.',
          historicalContext: '1976: Voyager engineers added redundant command computers and hardened CMOS electronics to withstand mega-rad radiation doses at Jupiter.',
          interactiveData: {
            simulationName: 'Voyager Jupiter Radiation & Deep Space Autonomy Qualification',
            checklist: [
              { item: 'Jupiter Radiation Belt Multi-Rad Semiconductor Qualification', status: 'PASS', notes: 'Lead and aluminum foil shielding wrapped around all sensor cabling.' },
              { item: 'Autonomous Computer Command Subsystem (CCS) Fault Protection', status: 'PASS', notes: 'Automatic fault recovery algorithms verified for memory resets.' },
              { item: '3.7-Meter Parabolic Antenna Gain Pattern Verification', status: 'PASS', notes: 'X-band transmission pattern mapped to 0.05-degree pointing accuracy.' },
              { item: 'Golden Record Cover Electroplating & Micro-Engraving Inspection', status: 'PASS', notes: 'Pulsar map coordinates and hydrogen transition diagram etched with precision.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Two Pioneers Flee Earth',
          interactiveType: 'launch_sim',
          narrative: 'Voyager 2 launched first on August 20, 1977, followed by Voyager 1 on a faster, more eccentric trajectory on September 5, 1977 aboard Titan IIIE-Centaur rockets. A third-stage solid rocket kick motor boosted both spacecraft to a staggering 45,000 km/h escape velocity.',
          historicalContext: 'September 1977: Voyager 1 overtook Voyager 2 on December 15, 1977, becoming the lead spacecraft on the journey to Jupiter and Saturn.',
          interactiveData: {
            liftoffWeightKg: 640000,
            thrustKN: 10600,
            maxQAltitudeKm: 14.2,
            maxQVelocityMach: 1.8,
            tliBurnDurationSeconds: 320,
            trajectoryOutcome: 'Clean injection onto interplanetary Grand Tour transfer arcs.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'The Great Tour of the Outer Giants',
          interactiveType: 'trajectory_scrub',
          narrative: 'At Jupiter in 1979, the Voyagers discovered active sulfur volcanoes on Io, an ocean beneath the cracked ice of Europa, and rings around Jupiter. At Saturn in 1980-1981, they explored the intricate braided rings and Titan\'s thick atmosphere. Voyager 2 pushed onward alone to Uranus in 1986—discovering 10 new moons—and Neptune in 1989, revealing the Great Dark Spot and cryovolcanic geysers on Triton.',
          historicalContext: 'August 1989: Voyager 2 flew just 4,950 kilometers above Neptune\'s north pole, completing its 12-year planetary Grand Tour.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Earth Departure', velocityKmS: 11.2, date: 'Aug/Sept 1977' },
              { distancePct: 15, label: 'Jupiter Flyby', velocityKmS: 32.1, date: 'March/July 1979' },
              { distancePct: 35, label: 'Saturn Flyby', velocityKmS: 24.3, date: 'Nov 1980 / Aug 1981' },
              { distancePct: 65, label: 'Uranus Flyby (Voyager 2)', velocityKmS: 18.2, date: 'Jan 24, 1986' },
              { distancePct: 100, label: 'Neptune Flyby (Voyager 2)', velocityKmS: 16.7, date: 'Aug 25, 1989' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'The Pale Blue Dot & Crossing the Heliopause',
          interactiveType: 'discovery_slider',
          narrative: 'On February 14, 1990, at Carl Sagan\'s request, Voyager 1 turned its camera back toward the inner solar system from 6 billion kilometers away. It captured the "Pale Blue Dot"—Earth suspended as a tiny speck of dust in a sunbeam. On August 25, 2012, Voyager 1 made history by crossing the heliopause, leaving the sun\'s magnetic bubble behind and entering interstellar space. Voyager 2 followed on November 5, 2018.',
          historicalContext: 'August 25, 2012: Voyager 1 became the first human-made object to cross into the interstellar medium.',
          interactiveData: {
            events: [
              { timeCode: 'Feb 14, 1990', title: 'The Pale Blue Dot', metric: 'Distance: 40.5 AU (6B km)', detail: 'Earth captured in a fraction of a single pixel; Sagan penned his immortal reflection.' },
              { timeCode: 'Aug 25, 2012', title: 'Voyager 1 Crosses Heliopause', metric: 'Distance: 121.6 AU', detail: 'Solar particles plummeted to zero; galactic cosmic rays surged by 9%. First craft in interstellar space.' },
              { timeCode: 'Nov 5, 2018', title: 'Voyager 2 Crosses Heliopause', metric: 'Distance: 119.0 AU', detail: 'Confirmed interstellar boundary structure with working plasma spectrometer instrument.' },
              { timeCode: 'May 2024', title: 'Memory Chip Telemetry Fix', metric: 'Distance: 164 AU (24.5B km)', detail: 'Engineers relocated flight data code across 24 billion km to restore degraded telemetry.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: Drifting Through Eternity',
          interactiveType: 'then_vs_now',
          narrative: 'Today, Voyager 1 and Voyager 2 are coasting through the silent interstellar medium. A radio signal sent from Earth takes over 22.5 hours to reach Voyager 1. By roughly 2030, electrical power from their plutonium generators will drop below the threshold needed to power any scientific instrument, and their transmitters will fall silent. But the spacecraft themselves will endure virtually forever: in 40,000 years, Voyager 1 will pass within 1.6 light-years of star Gliese 445, drifting onward as immortal ambassadors of humanity.',
          historicalContext: 'The Voyagers will outlast the solar system itself: billions of years from now, when the Sun expands into a red giant, the Golden Records will still be intact in deep space.',
          interactiveData: {
            thenState: {
              date: 'September 1977',
              appearance: 'Pristine 3.7-meter white dish, polished gold cover over phonograph record, all 11 instrument suites operating.',
              operationalState: '470 Watts electrical power; cameras firing thousands of images per month.',
              thermalStatus: 'Warm interior electronics protected by thermal louvers.'
            },
            nowState: {
              date: 'Present Day (47+ Years Later)',
              appearance: 'Uncorroded in interstellar vacuum; RTGs decayed; Golden Record etched with pulsar directions untouched.',
              operationalState: 'Only 4 instruments operating; power decaying by 4W per year; silent shutdown expected ~2030.',
              thermalStatus: 'Sub-zero electronics operating near cold design limits; heater circuits systematically powered off.'
            },
            preservationNote: 'Voyager represents humanity\'s farthest physical reach into the cosmos. Even if humanity vanishes, our voices, laughter, and music will continue traveling through the stars.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'What is Carl Sagan\'s famous "Pale Blue Dot" photo and why was it nearly not taken?',
          shortAnswer: 'A photo of Earth taken from 6 billion km away looking like a mote of dust; NASA managers feared pointing the camera near the Sun would burn out the vidicon sensors.',
          deepDive: 'In 1989, as Voyager 1 completed its primary mission, Carl Sagan urged NASA to turn the camera around to snap a family portrait of the solar system. Mission managers resisted, fearing the intense glare of the nearby Sun would fry the sensitive vidicon camera tubes. Sagan appealed directly to NASA Administrator Richard Truly. On Valentine\'s Day 1990, Voyager 1 snapped the photo: Earth occupied just 0.12 of a single pixel, caught in a scattered beam of sunlight, inspiring Sagan\'s poetic manifesto on human humility.'
        },
        {
          question: 'How did NASA fix a Voyager 1 computer malfunction from 24 billion kilometers away in 2024?',
          shortAnswer: 'Engineers diagnosed a single failed memory chip in the Flight Data System and remotely relocated the corrupted code to unused memory sectors.',
          deepDive: 'In November 2023, Voyager 1 stopped sending coherent science and engineering telemetry, transmitting only a repetitive loop of ones and zeros. A round-trip signal took 45 hours. In April 2024, JPL engineers discovered that a single memory chip in the Flight Data System (FDS)—responsible for 3% of the computer\'s code—had failed. Because no single memory space was large enough to hold the displaced code, engineers divided the software into chunks, rewrote pointers, and transmitted the patch across 24.5 billion km, fully restoring scientific telemetry.'
        },
        {
          question: 'What is etched on the cover of the Golden Record to teach aliens how to play it?',
          shortAnswer: 'Diagrams showing the record\'s rotation speed using the fundamental hydrogen atom transition, a pulsar map showing Earth\'s location, and stylus assembly.',
          deepDive: 'The exterior aluminum cover of the Golden Record is electroplated with high-purity gold and etched with visual instructions. At the lower right is the fundamental state of the hydrogen atom, defining a universal unit of time (0.7 nanoseconds) and length (21 cm). Using this timebase, binary markings around the edge specify that the record must spin at 16⅔ revolutions per minute. A starburst map of 14 pulsars connects Earth to known celestial clocks, allowing extraterrestrial finders to calculate both Earth\'s cosmic location and the epoch when the craft was launched.'
        }
      ],
      quizQuestions: [
        {
          question: 'What rare celestial alignment enabled the Voyager missions to visit all four gas giants in a single voyage?',
          options: [
            'A lunar eclipse occurring during a solar maximum',
            'A once-in-176-year planetary alignment of Jupiter, Saturn, Uranus, and Neptune',
            'A triple transit of Venus and Mercury across the Sun',
            'Halley\'s Comet passing through the asteroid belt'
          ],
          correctIndex: 1,
          explanation: 'Gary Flandro calculated that a geometric alignment of Jupiter, Saturn, Uranus, and Neptune occurring only once every 176 years would allow a spacecraft to use gravitational slingshots to visit all four gas giants in just 12 years.'
        },
        {
          question: 'What message of humanity is carried on the exterior of both Voyager spacecraft?',
          options: [
            'A silicon crystal storing the complete contents of Wikipedia',
            'A 12-inch gold-plated copper phonograph record containing sounds, music, and images of Earth',
            'A bronze statue of an astronaut and cosmonaut',
            'A digital holographic laser disk containing DNA sequences'
          ],
          correctIndex: 1,
          explanation: 'Each Voyager carries the 12-inch gold-plated copper "Golden Record", curated by Carl Sagan and Ann Druyan, containing 115 images, sounds of nature, greetings in 55 languages, and 90 minutes of human music.'
        },
        {
          question: 'What milestone did Voyager 1 achieve on August 25, 2012?',
          options: [
            'It collided with an Oort cloud comet.',
            'It became the first human-made object to cross the heliopause and enter interstellar space.',
            'It exhausted its hydrazine attitude thrusters.',
            'It made a close flyby of the dwarf planet Pluto.'
          ],
          correctIndex: 1,
          explanation: 'Voyager 1 crossed the heliopause at 121.6 AU (18 billion km) from the Sun on August 25, 2012, crossing from the solar wind envelope into the cold plasma of true interstellar space.'
        }
      ],
      sources: [
        {
          title: 'NASA JPL Voyager - The Interstellar Mission',
          url: 'https://voyager.jpl.nasa.gov/',
          description: 'Official NASA Jet Propulsion Laboratory mission status, live odometer tracking, and Golden Record archives.'
        },
        {
          title: 'Carl Sagan: Pale Blue Dot - A Vision of the Human Future in Space',
          url: 'https://www.planetary.org/worlds/pale-blue-dot',
          description: 'The Planetary Society\'s archive of the iconic 1990 photograph and Carl Sagan\'s accompanying text.'
        },
        {
          title: 'Science Magazine: Voyager 1 Crosses into Interstellar Space',
          url: 'https://www.science.org/doi/10.1126/science.1241681',
          description: 'Peer-reviewed research paper analyzing plasma density oscillations confirming Voyager 1\'s departure from the heliosphere.'
        }
      ]
    },

    // ========================================================================
    // MISSION 10: HUBBLE & JAMES WEBB (JWST)
    // ========================================================================
    {
      id: 'hubble-jwst',
      name: 'Hubble & James Webb (JWST)',
      callsign: 'HST (Hubble Space Telescope) & JWST (James Webb Space Telescope)',
      agency: 'NASA/ESA',
      launchDate: '1990-04-24T12:33:51Z', // Hubble launch; JWST launched 2021-12-25
      endDate: null, // Both actively observing
      fateCategory: 'active_orbit',
      currentStatusDescription: 'Hubble orbits in Low Earth Orbit (~535 km altitude), serviced 5 times by the Space Shuttle between 1993 and 2009 where astronauts replaced gyroscopes, batteries, computers, and instruments—jettisoning early modules like COSTAR into oceanic deorbit. Meanwhile, JWST operates 1.5 million kilometers from Earth in a halo orbit around the Sun-Earth L2 Lagrange point with a tennis-court-sized 5-layer Kapton sunshield keeping its golden beryllium mirrors at -233°C (40 Kelvin). Both continue unlocking cosmic dawn.',
      isStillTransmitting: true,
      destinations: [
        'Low Earth Orbit (Hubble - 535 km circular orbit, 28.5° inclination)',
        'Sun-Earth Lagrange Point 2 Halo Orbit (JWST - 1.5 million km from Earth)'
      ],
      launchVehicle: 'Space Shuttle Discovery (STS-31 - Hubble) / Ariane 5 ECA (VA256 - JWST)',
      launchSite: 'Kennedy Space Center LC-39B, Florida (Hubble) / Guiana Space Centre ELA-3, Kourou (JWST)',
      landingSiteCoordinates: null,
      spacecraftSpecs: {
        dryMassKg: 11110, // Hubble 11,110 kg / JWST 6,161 kg
        powerSource: 'Hubble: Dual GaAs Solar Wings (2,800W) + 6x NiH2 batteries; JWST: 5-panel Solar Array (2,000W) + Li-ion battery',
        powerOutputWatts: 2000,
        communicationSystem: 'Hubble: High-Gain S-band antennas relaying through NASA TDRSS satellites; JWST: High-Gain Ka-band (25.9 GHz) and S-band antennas direct to NASA Deep Space Network (up to 28 Mbps)',
        instruments: [
          {
            name: 'Wide Field Camera 3 (Hubble)',
            acronym: 'WFC3',
            purpose: 'High-resolution panchromatic camera installed during Servicing Mission 4, imaging from UV to near-infrared.',
            targetMeasurement: 'Pillars of Creation, distant supernovae measuring cosmic acceleration, galactic evolution.'
          },
          {
            name: 'Advanced Camera for Surveys (Hubble)',
            acronym: 'ACS',
            purpose: 'Wide-field imaging camera capturing ultra-deep field exposures of the early universe.',
            targetMeasurement: 'Hubble Ultra Deep Field, gravitational lensing dark matter maps.'
          },
          {
            name: 'Near-Infrared Camera (JWST)',
            acronym: 'NIRCam',
            purpose: 'Primary near-infrared imager operating from 0.6 to 5 micrometers with coronagraphs.',
            targetMeasurement: 'First light galaxies formed after the Big Bang, stellar nursery protostars, exoplanet atmospheres.'
          },
          {
            name: 'Mid-Infrared Instrument (JWST)',
            acronym: 'MIRI',
            purpose: 'Camera and spectrograph cooled to 7 Kelvin (-266°C) by a closed-cycle helium loop cryocooler.',
            targetMeasurement: 'Thermal infrared dust emission, cold Kuiper Belt objects, atmospheric carbon dioxide in exoplanets.'
          }
        ]
      },
      trackingTier: 'live_calculated',
      distanceFromEarthAU: 0.01003, // JWST at Sun-Earth L2 (~1.5 million km)
      tagline: "The orbital titans that rewrote the history of our universe.",
      discardedEquipment: [
        'Hubble Servicing Mission jettisons: Original solar arrays rolled up and returned/discarded',
        'Corrective Optics Space Telescope Axial Replacement (COSTAR - removed during SM4 in 2009)',
        'WFPC-1 and WFPC-2 camera modules returned to Smithsonian',
        'Ariane 5 upper stage and fairings jettisoned in heliocentric/ocean orbits'
      ],
      storyRoadmap: [
        {
          chapterNumber: 1,
          chapterId: 'idea',
          title: 'Above the Murky Atmosphere',
          interactiveType: 'objective_choice',
          narrative: 'In 1946, astrophysicist Lyman Spitzer proposed placing a telescope in space above Earth\'s turbulent atmosphere. Decades later, NASA realized Spitzer\'s dream with Hubble, designing it from the start to be serviced by astronauts. Decades later, scientists realized that to see the very first stars born after the Big Bang, their light had been stretched by cosmic expansion into the infrared—requiring an even larger telescope cooled to near absolute zero at Lagrange Point 2.',
          historicalContext: '1970s-1990: NASA, ESA, and prime contractor Lockheed built Hubble, followed in the 2000s by the ambitious James Webb Space Telescope project.',
          interactiveData: {
            dilemma: 'Where should you place a massive infrared telescope so its own heat doesn\'t blind its mirrors?',
            options: [
              {
                id: 'low-earth-orbit',
                title: 'Low Earth Orbit (Like Hubble)',
                pros: 'Astronauts can service and repair it with spacecraft.',
                cons: 'Earth and Moon emit intense infrared thermal glow; warm side blinds infrared detectors.',
                verdict: 'Unsuitable for deep-space infrared astronomy.'
              },
              {
                id: 'l2-lagrange',
                title: 'Sun-Earth L2 Lagrange Point (1.5M km from Earth)',
                pros: 'Sun, Earth, and Moon stay on one side; a single sunshield blocks all thermal heat.',
                cons: 'Too far for human servicing missions; must unfold autonomously with zero flaws.',
                verdict: 'Selected: Enabled JWST to reach 40 Kelvin (-233°C) passively!',
                isOptimal: true
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterId: 'building',
          title: 'Spherical Aberration & The Golden Origami',
          interactiveType: 'subsystem_hotspots',
          narrative: 'Hubble launched in 1990 with a 2.4-meter primary mirror ground to an incorrect shape by 2 micrometers (1/50th of a human hair)—blurring its images until astronauts installed COSTAR "eyeglasses" in 1993. Learning from Hubble, JWST was built with 18 hexagonal beryllium segments coated in 100-nanometer-thick vaporized gold, folded like origami inside an Ariane 5 fairing alongside a 5-layer tennis-court-sized Kapton sunshield.',
          historicalContext: '1993: STS-61 Space Shuttle astronauts executed the most complex orbital repair in history, restoring Hubble\'s razor-sharp vision.',
          interactiveData: {
            craftName: 'Hubble & James Webb Space Telescopes',
            hotspots: [
              {
                id: 'jwst-gold-mirrors',
                title: '18 Hexagonal Gold-Coated Mirrors',
                subsystem: 'Primary Optical Assembly',
                description: 'Beryllium segments coated in pure vapor-deposited gold (weighing just 4.8 grams total) to maximize infrared reflectivity.',
                spec: '6.5-meter total collecting aperture (nearly 3x the diameter of Hubble).'
              },
              {
                id: 'kapton-sunshield',
                title: '5-Layer Kapton Sunshield',
                subsystem: 'Passive Cryogenic Thermal Control',
                description: 'Five membrane layers of aluminum- and silicon-doped Kapton, each as thin as a human hair, separated by vacuum gaps.',
                spec: 'Drops temperatures from +85°C on the sun-facing side to -233°C on the telescope side.'
              },
              {
                id: 'hubble-servicing-latch',
                title: 'Hubble Orbital Replaceable Unit (ORU) Bays',
                subsystem: 'Human Servicing Architecture',
                description: 'Modular instrument bays with handrails, yellow alignment guides, and captive bolt latches designed for spacewalking astronauts.',
                spec: 'Allowed 5 Space Shuttle servicing missions between 1993 and 2009.'
              },
              {
                id: 'miri-cryocooler',
                title: 'MIRI Closed-Cycle Helium Cryocooler',
                subsystem: 'Active Mid-Infrared Refrigeration',
                description: 'Pulse-tube compressor pumping liquid helium through loops to cool the MIRI detector to 6.7 Kelvin (-266°C).',
                spec: 'Cools detectors to within 7 degrees of absolute zero.'
              }
            ]
          }
        },
        {
          chapterNumber: 3,
          chapterId: 'testing',
          title: '344 Single Points of Failure',
          interactiveType: 'readiness_check',
          narrative: 'Because JWST was heading to L2 where astronauts could not reach it, the telescope had 344 single points of failure during its 29-day deployment sequence: unrolling the sunshield, tensioning the five layers, swinging out the secondary mirror, and locking the golden wings. Every motor and release actuator had to work with 100% reliability.',
          historicalContext: '2021: Northrop Grumman and NASA teams subjected JWST to full acoustic, vibration, and thermal-vacuum deployment tests in Chamber A at Johnson Space Center.',
          interactiveData: {
            simulationName: 'JWST L2 Deployment & Cryogenic Optical Verification',
            checklist: [
              { item: 'JSC Chamber A Cryogenic Optical Alignment (-233°C)', status: 'PASS', notes: 'All 18 segments aligned with nanometer-scale wave-front actuators.' },
              { item: 'Sunshield 5-Layer Release Actuator Verification (107 release pins)', status: 'PASS', notes: 'Simulated zero-g deployment verified without membrane snagging.' },
              { item: 'Hubble Gyroscope RSU Reconfiguration Testing', status: 'PASS', notes: 'Validated single-gyro operational pointing mode for life extension.' },
              { item: 'Ariane 5 High-Accuracy Insertion Trajectory Optimization', status: 'PASS', notes: 'Precision burn saved propellant, doubling JWST operational lifetime to 20+ years.' }
            ]
          }
        },
        {
          chapterNumber: 4,
          chapterId: 'launch',
          title: 'Discovery & The Christmas Day Gift',
          interactiveType: 'launch_sim',
          narrative: 'Hubble launched on April 24, 1990 aboard Space Shuttle Discovery (STS-31). Thirty-one years later on Christmas Day, December 25, 2021, an Ariane 5 rocket launched JWST from Kourou, French Guiana. The European rocket gave such a perfect orbital injection that JWST saved half its station-keeping propellant, extending its planned lifespan from 10 years to over 20.',
          historicalContext: 'December 25, 2021: The Ariane 5 launch was dubbed "humanity\'s Christmas present to the cosmos."',
          interactiveData: {
            liftoffWeightKg: 780000,
            thrustKN: 11400,
            maxQAltitudeKm: 13.5,
            maxQVelocityMach: 1.7,
            tliBurnDurationSeconds: 520,
            trajectoryOutcome: 'Flawless injection toward the Sun-Earth L2 Lagrange point.'
          }
        },
        {
          chapterNumber: 5,
          chapterId: 'journey',
          title: 'The Million-Mile Origami Unfolding',
          interactiveType: 'trajectory_scrub',
          narrative: 'While Hubble stayed in low Earth orbit completing 15 orbits per day, JWST spent its first month traveling 1.5 million kilometers to L2. Over 29 nail-biting days, controllers commanded the unfolding of the sunshield, tensioned the membranes, locked the secondary mirror tripod into place, and deployed the wings of the primary mirror without a single failure.',
          historicalContext: 'January 24, 2022: JWST fired its thrusters for 297 seconds to insert itself into its halo orbit around L2, completing deployment with zero errors.',
          interactiveData: {
            waypoints: [
              { distancePct: 0, label: 'Ariane 5 Separation & Solar Array Deploy', velocityKmS: 10.2, date: 'Dec 25, 2021' },
              { distancePct: 25, label: 'Sunshield Pallets Lowered', velocityKmS: 2.1, date: 'Dec 28, 2021' },
              { distancePct: 50, label: '5-Layer Sunshield Fully Tensioned', velocityKmS: 1.4, date: 'Jan 4, 2022' },
              { distancePct: 75, label: 'Secondary Mirror & Golden Wings Locked', velocityKmS: 0.9, date: 'Jan 8, 2022' },
              { distancePct: 100, label: 'L2 Halo Orbit Insertion Burn', velocityKmS: 0.2, date: 'Jan 24, 2022' }
            ]
          }
        },
        {
          chapterNumber: 6,
          chapterId: 'discovery',
          title: 'From Accelerating Universes to Cosmic Dawn',
          interactiveType: 'discovery_slider',
          narrative: 'Hubble determined the age of the universe (13.8 billion years), discovered that cosmic expansion is accelerating due to dark energy, and imaged the iconic Pillars of Creation and Deep Fields. JWST picked up the torch: peering through cosmic dust to capture the earliest galaxies formed just 300 million years after the Big Bang (JADES-GS-z14-0) and detecting carbon dioxide, water vapor, and sulfur in the atmospheres of distant exoplanets.',
          historicalContext: 'July 12, 2022: President Joe Biden unveiled JWST\'s First Deep Field (SMACS 0723), revealing thousands of galaxies warped by gravitational lensing.',
          interactiveData: {
            events: [
              { timeCode: '1998 (Hubble)', title: 'Discovery of Dark Energy', metric: 'Expansion rate accelerating', detail: 'Type Ia supernovae observations proved the universe is expanding at an accelerating rate.' },
              { timeCode: '2004 (Hubble)', title: 'Hubble Ultra Deep Field', metric: '10,000 galaxies in single speck', detail: 'Looked back 13 billion years into cosmic history in an empty patch of sky.' },
              { timeCode: 'July 2022 (JWST)', title: 'First Deep Field SMACS 0723', metric: 'Gravitational lensing arcs', detail: 'Sharpest infrared image of the distant universe in human history.' },
              { timeCode: '2024 (JWST)', title: 'Galaxies at Cosmic Dawn', metric: 'Redshift z = 14.32', detail: 'Discovered unexpectedly massive and bright galaxies born just 290 million years after Big Bang.' }
            ]
          }
        },
        {
          chapterNumber: 7,
          chapterId: 'where_is_it_now',
          title: 'Where Is It Now: Guardians of the Deep Cosmos',
          interactiveType: 'then_vs_now',
          narrative: 'Both telescopes are operating simultaneously today in a golden era of multi-wavelength astronomy. Hubble, now in its fourth decade, continues imaging in ultraviolet and visible light, though atmospheric drag will eventually cause its orbit to decay in the mid-2030s unless re-boosted. Meanwhile, JWST is cruising in its pristine halo orbit around L2, with sufficient propellant to continue peering into the cosmic dawn until the 2040s.',
          historicalContext: 'Hubble has completed over 1.5 million observations; JWST complements it by peering through the dust that blinds visible-light telescopes.',
          interactiveData: {
            thenState: {
              date: 'Launch Days (1990 & 2021)',
              appearance: 'Hubble: Polished silver blanket in Shuttle cargo bay; JWST: Origami gold hexagonal package in Ariane fairing.',
              operationalState: 'Hubble suffered initial spherical aberration; JWST faced 344 single points of failure.',
              thermalStatus: 'JWST cooling rapidly from ambient Earth temperature to 40 Kelvin.'
            },
            nowState: {
              date: 'Present Day (Both Active)',
              appearance: 'Hubble showing exterior thermal blanket wear; JWST mirrors hit by micro-meteorites but performing above specs.',
              operationalState: 'Both telescopes conducting joint observation campaigns of colliding galaxies and exoplanets.',
              thermalStatus: 'Hubble cycling with 95-minute orbital day/night; JWST steady at -233°C behind its Kapton shield.'
            },
            preservationNote: 'Together, Hubble and James Webb have fundamentally transformed human philosophy, confirming that our galaxy is one of hundreds of billions in an expanding, dynamic universe.'
          }
        }
      ],
      curiosityQuestions: [
        {
          question: 'Why does the James Webb Space Telescope use mirrors coated in pure gold instead of aluminum?',
          shortAnswer: 'Gold reflects infrared light with unmatched 98% efficiency, allowing Webb to detect faint infrared heat from the earliest stars.',
          deepDive: 'Standard visible-light telescopes like Hubble use aluminum coatings, which excel at reflecting ultraviolet and visible light. But because light from the earliest galaxies has traveled across expanding space for 13.5 billion years, its wavelength has stretched into the infrared (cosmological redshift). Gold is the most reflective substance known for near- and mid-infrared light (reflecting over 98% of photons). Engineers applied a micro-thin layer of gold—just 100 nanometers thick (weighing only 4.8 grams across all 18 segments)—capped with a protective silica glass coat.'
        },
        {
          question: 'How did astronauts fix Hubble\'s blurry vision in space in 1993?',
          shortAnswer: 'They installed COSTAR, a module containing tiny corrective mirrors that acted like a pair of eyeglasses to cancel out the primary mirror flaw.',
          deepDive: 'When Hubble began operating in 1990, engineers were horrified to find that its 2.4-meter primary mirror had been polished too flat at its outer edge by just 2 micrometers (spherical aberration). Light from stars could not focus onto a sharp point. In December 1993, the crew of STS-61 executed five grueling spacewalks. They removed the High Speed Photometer and inserted COSTAR (Corrective Optics Space Telescope Axial Replacement)—deploying 10 coin-sized corrective mirrors on motorized arms that intercepted the blurred light beam and restored Hubble\'s diffraction-limited optical clarity.'
        },
        {
          question: 'Why can\'t astronauts fly to the James Webb Space Telescope to fix it if it breaks?',
          shortAnswer: 'Webb is located 1.5 million kilometers from Earth at Lagrange Point 2—four times farther than the Moon and far beyond the range of any current human spacecraft.',
          deepDive: 'The Space Shuttle could reach only Low Earth Orbit (~600 km altitude). Hubble was positioned at 535 km precisely so astronauts could repair and upgrade it. But JWST must operate in the extreme cold of deep space at the Sun-Earth L2 point, 1,500,000 km away. No human spacecraft since Apollo 17 has flown beyond Low Earth Orbit. Furthermore, human presence generates heat, outgassing, and water vapor that would instantly freeze onto Webb\'s -233°C mirrors and blind its sensors.'
        }
      ],
      quizQuestions: [
        {
          question: 'Why must the James Webb Space Telescope be kept at an ultra-cold -233°C (40 Kelvin)?',
          options: [
            'To keep its liquid nitrogen rocket fuel from boiling',
            'To prevent the telescope\'s own infrared heat glow from blinding its sensitive infrared detectors',
            'To freeze its solar panels for superconductivity',
            'To protect its computer chips from cosmic ray radiation'
          ],
          correctIndex: 1,
          explanation: 'Because Webb observes faint infrared heat signals from distant stars, any warmth from the telescope itself would swamp the detectors. The 5-layer Kapton sunshield drops temperatures to -233°C so Webb can see faint cosmic infrared photons.'
        },
        {
          question: 'How was Hubble\'s initial blurry mirror flaw fixed in 1993 during Servicing Mission 1?',
          options: [
            'Astronauts brought the telescope back to Earth inside the Space Shuttle.',
            'Astronauts replaced the entire 2.4-meter primary mirror during a spacewalk.',
            'Astronauts installed COSTAR, a module with corrective mirrors that acted like eyeglasses.',
            'NASA uploaded an AI software deblurring algorithm from Mission Control.'
          ],
          correctIndex: 2,
          explanation: 'Astronauts installed COSTAR (Corrective Optics Space Telescope Axial Replacement), which deployed coin-sized motorized mirrors into the optical path, perfectly counteracting the primary mirror\'s spherical aberration.'
        },
        {
          question: 'At what stable gravitational point in space does the James Webb Space Telescope operate?',
          options: [
            'Low Earth Orbit (550 km altitude)',
            'Sun-Earth Lagrange Point 2 (L2), 1.5 million kilometers from Earth',
            'Geostationary Orbit (35,786 km altitude)',
            'Lunar South Pole Shackleton Crater'
          ],
          correctIndex: 1,
          explanation: 'JWST orbits the Sun-Earth L2 Lagrange point, 1.5 million km from Earth, where the gravitational forces of the Sun and Earth balance to keep the telescope positioned with its sunshield facing the Sun, Earth, and Moon simultaneously.'
        }
      ],
      sources: [
        {
          title: 'NASA James Webb Space Telescope Mission Overview',
          url: 'https://webb.nasa.gov/',
          description: 'Official NASA Goddard Space Flight Center portal for JWST deployment, instrument specs, and first light gallery.'
        },
        {
          title: 'NASA Hubble Space Telescope Mission Archive',
          url: 'https://hubblesite.org/',
          description: 'Space Telescope Science Institute (STScI) complete image library, Servicing Mission history, and scientific discoveries.'
        },
        {
          title: 'STScI: The First Deep Field and Early Galaxy Discoveries of JWST',
          url: 'https://www.stsci.edu/jwst/science-execution/approved-programs',
          description: 'Peer-reviewed observation logs detailing JADES-GS-z14-0 and exoplanet atmospheric spectroscopy.'
        }
      ]
    }
  ];

  return missions;
});
