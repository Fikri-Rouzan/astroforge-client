// src/components/AsteroidField.tsx
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useWeb3 } from "../hooks/useWeb3.js";
import { PHASER_CONFIG } from "../config/phaser.config.js";
import { Shield, Orbit } from "lucide-react";

/**
 * Custom Phaser Scene to manage interactive space mining telemetry visuals
 */
class MiningScene extends Phaser.Scene {
  private playerShip: Phaser.GameObjects.Graphics | null = null;
  private asteroids: Phaser.GameObjects.Group | null = null;
  private laserLines: Phaser.GameObjects.Graphics | null = null;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null =
    null;
  private currentStatus: string = "IDLE";

  constructor() {
    super({ key: "MiningScene" });
  }

  preload(): void {
    // No external image assets required. Generating procedural primitives instead.
  }

  create(): void {
    const { width, height } = this.scale;

    // 1. Generate a procedural starfield background grid
    for (let i = 0; i < 60; i++) {
      const starX = Phaser.Math.Between(0, width);
      const starY = Phaser.Math.Between(0, height);
      const starAlpha = Phaser.Math.FloatBetween(0.2, 0.8);
      const starRadius = Phaser.Math.FloatBetween(0.5, 1.5);

      const star = this.add.circle(starX, starY, starRadius, 0xffffff);
      star.setAlpha(starAlpha);
    }

    // 2. Setup a graphic drawing layer for reactive neon mining lasers
    this.laserLines = this.add.graphics();

    // 3. Provision a particle emitter layer for cosmic ore dust explosions
    const sparkGraphics = this.make.graphics({ x: 0, y: 0 });
    sparkGraphics.fillStyle(0x06b6d4, 1);
    sparkGraphics.fillRect(0, 0, 3, 3);
    const sparkKey = "spark-particle";
    sparkGraphics.generateTexture(sparkKey, 3, 3);

    this.particleEmitter = this.add.particles(0, 0, sparkKey, {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 600,
      emitting: false,
    });

    // 4. Construct procedural floating asteroids via arcade physics groups
    this.asteroids = this.physics.add.group();
    const asteroidPositions = [
      { x: width * 0.2, y: height * 0.3, radius: 24 },
      { x: width * 0.15, y: height * 0.7, radius: 18 },
      { x: width * 0.35, y: height * 0.5, radius: 30 },
    ];

    asteroidPositions.forEach((pos) => {
      const targetAsteroid = this.add.graphics({ x: pos.x, y: pos.y });

      // Draw a jagged space rock mathematically
      targetAsteroid.lineStyle(2, 0x4b5563, 1);
      targetAsteroid.fillStyle(0x141226, 1);
      targetAsteroid.beginPath();

      const points = 8;
      for (let j = 0; j < points; j++) {
        const angle = (j / points) * Math.PI * 2;
        const variance = Phaser.Math.FloatBetween(0.8, 1.2);
        const r = pos.radius * variance;
        const pX = Math.cos(angle) * r;
        const pY = Math.sin(angle) * r;

        if (j === 0) targetAsteroid.moveTo(pX, pY);
        else targetAsteroid.lineTo(pX, pY);
      }

      targetAsteroid.closePath();
      targetAsteroid.strokePath();
      targetAsteroid.fillPath();

      // Inject contract data boundaries into the physics object
      this.asteroids?.add(targetAsteroid);
      const body = targetAsteroid.body as Phaser.Physics.Arcade.Body;
      body.setCircle(pos.radius, -pos.radius, -pos.radius);
      body.setAngularVelocity(Phaser.Math.FloatBetween(-10, 10));
    });

    // 5. Fabricate a sleek Sci-Fi neon command ship primitive shape
    this.playerShip = this.add.graphics({ x: width * 0.75, y: height * 0.5 });
    this.playerShip.lineStyle(2, 0x6366f1, 1);
    this.playerShip.fillStyle(0x0c0b18, 1);
    this.playerShip.beginPath();
    this.playerShip.moveTo(30, 0); // Nose cone point
    this.playerShip.lineTo(-20, -20); // Left wing port side
    this.playerShip.lineTo(-10, 0); // Engine exhaust bay
    this.playerShip.lineTo(-20, 20); // Right wing starboard side
    this.playerShip.closePath();
    this.playerShip.strokePath();
    this.playerShip.fillPath();

    // Accent plasma core cockpit ring
    this.playerShip.lineStyle(1, 0x06b6d4, 1);
    this.playerShip.strokeCircle(0, 0, 5);
  }

  /**
   * Safe bridge method invoked by React to pass the off-chain database state changes
   */
  public updateMiningStatus(status: string): void {
    this.currentStatus = status;
  }

  override update(): void {
    if (!this.playerShip || !this.laserLines || !this.particleEmitter) return;

    // Gentle engine idling ship hover animation simulation
    this.playerShip.y =
      this.scale.height * 0.5 + Math.sin(this.time.now / 400) * 4;

    // Clear laser trails from previous frames
    this.laserLines.clear();

    if (this.currentStatus === "MINING") {
      // Engage extraction mechanics visualizers
      const beamTargetX = this.scale.width * 0.35;
      const beamTargetY =
        this.scale.height * 0.5 + Math.sin(this.time.now / 200) * 10;

      // Draw double coherent neon plasma laser vectors
      this.laserLines.lineStyle(3, 0x06b6d4, 0.8);
      this.laserLines.lineBetween(
        this.playerShip.x,
        this.playerShip.y - 5,
        beamTargetX,
        beamTargetY,
      );
      this.laserLines.lineBetween(
        this.playerShip.x,
        this.playerShip.y + 5,
        beamTargetX,
        beamTargetY,
      );

      // Core white laser fusion track
      this.laserLines.lineStyle(1, 0xffffff, 1);
      this.laserLines.lineBetween(
        this.playerShip.x,
        this.playerShip.y,
        beamTargetX,
        beamTargetY,
      );

      // Move and burst mining impact sparks
      this.particleEmitter.setPosition(beamTargetX, beamTargetY);
      if (!this.particleEmitter.emitting) {
        this.particleEmitter.start();
      }
    } else {
      // Disengage mining beams if ship status returns to IDLE
      if (this.particleEmitter.emitting) {
        this.particleEmitter.stop();
      }
    }
  }
}

export const AsteroidField: React.FC = () => {
  const { playerProfile } = useWeb3();
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<MiningScene | null>(null);

  useEffect(() => {
    // Instantiate the active scene instance
    const customMiningScene = new MiningScene();
    sceneRef.current = customMiningScene;

    // Launch the core engine bundled with the responsive scene configuration
    const gameInstance = new Phaser.Game({
      ...PHASER_CONFIG,
      scene: [customMiningScene],
    });
    gameRef.current = gameInstance;

    // Garbage collector execution routine on component unmount to prevent canvas memory leaks
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  // Bridge effect to constantly feed updated database parameters into Phaser's execution loop
  useEffect(() => {
    if (
      sceneRef.current &&
      playerProfile &&
      playerProfile.ships &&
      playerProfile.ships.length > 0
    ) {
      const primaryShipStatus = playerProfile.ships[0].status;
      sceneRef.current.updateMiningStatus(primaryShipStatus);
    }
  }, [playerProfile]);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold font-heading text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Orbit className="w-5 h-5 text-cosmic-secondary" />
          ORBITAL SECTOR TELEMETRY (PHASER CANVAS)
        </h3>
        {playerProfile?.ships?.[0]?.status === "MINING" && (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md animate-pulse">
            <Shield className="w-3.5 h-3.5" />
            EXTRACTING ASSETS...
          </span>
        )}
      </div>

      {/* Phaser Canvas Anchor Mount Node Container */}
      <div
        id="astroforge-canvas-container"
        className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-cosmic-void shadow-inner flex justify-center items-center"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
};
