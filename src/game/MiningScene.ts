import Phaser from "phaser";

export class MiningScene extends Phaser.Scene {
  private playerShip: Phaser.GameObjects.Graphics | null = null;
  private asteroids: Phaser.GameObjects.Group | null = null;
  private laserLines: Phaser.GameObjects.Graphics | null = null;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null =
    null;
  private currentStatus: string = "IDLE";

  constructor() {
    super({ key: "MiningScene" });
  }

  preload(): void {}

  create(): void {
    const { width, height } = this.scale;

    for (let i = 0; i < 60; i++) {
      const starX = Phaser.Math.Between(0, width);
      const starY = Phaser.Math.Between(0, height);
      const starAlpha = Phaser.Math.FloatBetween(0.2, 0.8);
      const starRadius = Phaser.Math.FloatBetween(0.5, 1.5);

      const star = this.add.circle(starX, starY, starRadius, 0xffffff);
      star.setAlpha(starAlpha);
    }

    this.laserLines = this.add.graphics();

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

    this.asteroids = this.physics.add.group();
    const asteroidPositions = [
      { x: width * 0.2, y: height * 0.3, radius: 24 },
      { x: width * 0.15, y: height * 0.7, radius: 18 },
      { x: width * 0.35, y: height * 0.5, radius: 30 },
    ];

    asteroidPositions.forEach((pos) => {
      const targetAsteroid = this.add.graphics({ x: pos.x, y: pos.y });
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

      this.asteroids?.add(targetAsteroid);
      const body = targetAsteroid.body as Phaser.Physics.Arcade.Body;
      body.setCircle(pos.radius, -pos.radius, -pos.radius);
      body.setAngularVelocity(Phaser.Math.FloatBetween(-10, 10));
    });

    this.playerShip = this.add.graphics({ x: width * 0.75, y: height * 0.5 });
    this.playerShip.lineStyle(2, 0x6366f1, 1);
    this.playerShip.fillStyle(0x0c0b18, 1);
    this.playerShip.beginPath();
    this.playerShip.moveTo(30, 0);
    this.playerShip.lineTo(-20, -20);
    this.playerShip.lineTo(-10, 0);
    this.playerShip.lineTo(-20, 20);
    this.playerShip.closePath();
    this.playerShip.strokePath();
    this.playerShip.fillPath();

    this.playerShip.lineStyle(1, 0x06b6d4, 1);
    this.playerShip.strokeCircle(0, 0, 5);
  }

  public updateMiningStatus(status: string): void {
    this.currentStatus = status;
  }

  override update(): void {
    if (!this.playerShip || !this.laserLines || !this.particleEmitter) return;

    this.playerShip.y =
      this.scale.height * 0.5 + Math.sin(this.time.now / 400) * 4;
    this.laserLines.clear();

    if (this.currentStatus === "MINING") {
      const beamTargetX = this.scale.width * 0.35;
      const beamTargetY =
        this.scale.height * 0.5 + Math.sin(this.time.now / 200) * 10;

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

      this.laserLines.lineStyle(1, 0xffffff, 1);
      this.laserLines.lineBetween(
        this.playerShip.x,
        this.playerShip.y,
        beamTargetX,
        beamTargetY,
      );

      this.particleEmitter.setPosition(beamTargetX, beamTargetY);
      if (!this.particleEmitter.emitting) {
        this.particleEmitter.start();
      }
    } else {
      if (this.particleEmitter.emitting) {
        this.particleEmitter.stop();
      }
    }
  }
}
