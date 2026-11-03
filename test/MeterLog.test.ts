import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("MeterLog Smart Contract", function () {
  let meterLog: any;
  let owner: HardhatEthersSigner;
  let tenant1: HardhatEthersSigner;
  let tenant2: HardhatEthersSigner;
  let stranger: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, tenant1, tenant2, stranger] = await ethers.getSigners();
    const MeterLogFactory = await ethers.getContractFactory("MeterLog");
    meterLog = await MeterLogFactory.deploy();
    await meterLog.waitForDeployment();
  });

  describe("1. Meter Registration", function () {
    it("should successfully register a new meter and emit MeterRegistered", async function () {
      const tx = await meterLog.connect(tenant1).registerMeter(
        "Hostel Room 12",
        "Block A, 2nd Floor",
        "Single occupant student room"
      );
      const receipt = await tx.wait();

      expect(await meterLog.getTotalMeters()).to.equal(1);

      const meter = await meterLog.getMeter(1);
      expect(meter.id).to.equal(1);
      expect(meter.name).to.equal("Hostel Room 12");
      expect(meter.location).to.equal("Block A, 2nd Floor");
      expect(meter.description).to.equal("Single occupant student room");
      expect(meter.owner).to.equal(tenant1.address);
      expect(meter.latestReading).to.equal(0);
      expect(meter.totalConsumption).to.equal(0);
      expect(meter.readingCount).to.equal(0);
      expect(meter.exists).to.be.true;

      await expect(tx)
        .to.emit(meterLog, "MeterRegistered")
        .withArgs(1, tenant1.address, "Hostel Room 12", "Block A, 2nd Floor", (val: any) => val > 0);
    });

    it("should register multiple meters with incremented unique IDs", async function () {
      await meterLog.connect(tenant1).registerMeter("Meter A", "Building 1", "Main");
      await meterLog.connect(tenant2).registerMeter("Meter B", "Building 2", "Annex");

      expect(await meterLog.getTotalMeters()).to.equal(2);

      const meter1 = await meterLog.getMeter(1);
      const meter2 = await meterLog.getMeter(2);

      expect(meter1.owner).to.equal(tenant1.address);
      expect(meter2.owner).to.equal(tenant2.address);
      expect(meter1.name).to.equal("Meter A");
      expect(meter2.name).to.equal("Meter B");
    });

    it("should reject registration with empty name", async function () {
      await expect(
        meterLog.connect(tenant1).registerMeter("", "Block A", "Desc")
      ).to.be.revertedWith("Meter name cannot be empty");
    });

    it("should reject registration with empty location", async function () {
      await expect(
        meterLog.connect(tenant1).registerMeter("Hostel Room 12", "", "Desc")
      ).to.be.revertedWith("Meter location cannot be empty");
    });
  });

  describe("2. Recording Meter Readings", function () {
    beforeEach(async function () {
      // Register meter #1 for tenant1
      await meterLog.connect(tenant1).registerMeter("Unit 101", "West Wing", "Apartment");
    });

    it("should record the first reading with 0 consumption (initial reading)", async function () {
      const tx = await meterLog.connect(tenant1).recordReading(1, 1050);
      await tx.wait();

      const meter = await meterLog.getMeter(1);
      expect(meter.latestReading).to.equal(1050);
      expect(meter.totalConsumption).to.equal(0);
      expect(meter.readingCount).to.equal(1);

      const readings = await meterLog.getMeterReadings(1);
      expect(readings.length).to.equal(1);
      expect(readings[0].readingKwh).to.equal(1050);
      expect(readings[0].consumption).to.equal(0);
      expect(readings[0].recordedBy).to.equal(tenant1.address);
      expect(readings[0].isInitial).to.be.true;

      await expect(tx)
        .to.emit(meterLog, "ReadingRecorded")
        .withArgs(1, 1050, 0, (t: any) => t > 0, tenant1.address);
    });

    it("should record subsequent readings and correctly calculate consumption", async function () {
      // 1st reading: 1000 kWh
      await meterLog.connect(tenant1).recordReading(1, 1000);

      // 2nd reading: 1150 kWh (delta: 150 kWh)
      const tx2 = await meterLog.connect(tenant1).recordReading(1, 1150);
      await tx2.wait();

      let meter = await meterLog.getMeter(1);
      expect(meter.latestReading).to.equal(1150);
      expect(meter.totalConsumption).to.equal(150);
      expect(meter.readingCount).to.equal(2);

      // 3rd reading: 1300 kWh (delta: 150 kWh, total: 300 kWh)
      await meterLog.connect(tenant1).recordReading(1, 1300);

      meter = await meterLog.getMeter(1);
      expect(meter.latestReading).to.equal(1300);
      expect(meter.totalConsumption).to.equal(300);
      expect(meter.readingCount).to.equal(3);

      const history = await meterLog.getMeterReadings(1);
      expect(history.length).to.equal(3);
      expect(history[0].consumption).to.equal(0);
      expect(history[0].isInitial).to.be.true;
      expect(history[1].consumption).to.equal(150);
      expect(history[1].isInitial).to.be.false;
      expect(history[2].consumption).to.equal(150);
      expect(history[2].isInitial).to.be.false;
    });

    it("should allow equal reading (zero consumption interval)", async function () {
      await meterLog.connect(tenant1).recordReading(1, 1000);
      await meterLog.connect(tenant1).recordReading(1, 1000);

      const meter = await meterLog.getMeter(1);
      expect(meter.latestReading).to.equal(1000);
      expect(meter.totalConsumption).to.equal(0);
      expect(meter.readingCount).to.equal(2);
    });

    it("should REJECT readings lower than previous reading", async function () {
      await meterLog.connect(tenant1).recordReading(1, 1200);

      await expect(
        meterLog.connect(tenant1).recordReading(1, 1199)
      ).to.be.revertedWith("New reading cannot be lower than previous reading");
    });

    it("should REJECT reading recording by non-owner", async function () {
      await expect(
        meterLog.connect(stranger).recordReading(1, 1500)
      ).to.be.revertedWith("Unauthorized: Not the meter owner");
    });

    it("should REJECT recording reading for non-existent meter", async function () {
      await expect(
        meterLog.connect(tenant1).recordReading(999, 100)
      ).to.be.revertedWith("Meter does not exist");
    });
  });

  describe("3. Updating Meter Information", function () {
    beforeEach(async function () {
      await meterLog.connect(tenant1).registerMeter("Old Name", "Old Location", "Old Description");
    });

    it("should allow owner to update meter details and emit MeterUpdated", async function () {
      const tx = await meterLog.connect(tenant1).updateMeter(
        1,
        "New Suite 5B",
        "North Tower, Floor 5",
        "Renovated commercial office"
      );

      const meter = await meterLog.getMeter(1);
      expect(meter.name).to.equal("New Suite 5B");
      expect(meter.location).to.equal("North Tower, Floor 5");
      expect(meter.description).to.equal("Renovated commercial office");

      await expect(tx)
        .to.emit(meterLog, "MeterUpdated")
        .withArgs(1, "New Suite 5B", "North Tower, Floor 5", "Renovated commercial office", (t: any) => t > 0);
    });

    it("should REJECT update from non-owner", async function () {
      await expect(
        meterLog.connect(stranger).updateMeter(1, "Hacked", "Hacked", "Hacked")
      ).to.be.revertedWith("Unauthorized: Not the meter owner");
    });

    it("should REJECT empty name or location during update", async function () {
      await expect(
        meterLog.connect(tenant1).updateMeter(1, "", "Valid Loc", "Desc")
      ).to.be.revertedWith("Meter name cannot be empty");

      await expect(
        meterLog.connect(tenant1).updateMeter(1, "Valid Name", "", "Desc")
      ).to.be.revertedWith("Meter location cannot be empty");
    });
  });

  describe("4. Queries and Global Statistics", function () {
    it("should return all registered meters correctly", async function () {
      await meterLog.connect(tenant1).registerMeter("Meter 1", "Loc 1", "Desc 1");
      await meterLog.connect(tenant2).registerMeter("Meter 2", "Loc 2", "Desc 2");

      const all = await meterLog.getAllMeters();
      expect(all.length).to.equal(2);
      expect(all[0].name).to.equal("Meter 1");
      expect(all[1].name).to.equal("Meter 2");
    });

    it("should return meters filtered by owner", async function () {
      await meterLog.connect(tenant1).registerMeter("T1 - Meter 1", "A", "");
      await meterLog.connect(tenant2).registerMeter("T2 - Meter 1", "B", "");
      await meterLog.connect(tenant1).registerMeter("T1 - Meter 2", "C", "");

      const t1Meters = await meterLog.getMetersByOwner(tenant1.address);
      const t2Meters = await meterLog.getMetersByOwner(tenant2.address);

      expect(t1Meters.length).to.equal(2);
      expect(t1Meters[0]).to.equal(1);
      expect(t1Meters[1]).to.equal(3);

      expect(t2Meters.length).to.equal(1);
      expect(t2Meters[0]).to.equal(2);
    });

    it("should calculate global stats correctly across multiple meters and readings", async function () {
      await meterLog.connect(tenant1).registerMeter("M1", "L1", "");
      await meterLog.connect(tenant2).registerMeter("M2", "L2", "");

      // M1 readings: 100 -> 150 (50 kWh)
      await meterLog.connect(tenant1).recordReading(1, 100);
      await meterLog.connect(tenant1).recordReading(1, 150);

      // M2 readings: 500 -> 580 (80 kWh)
      await meterLog.connect(tenant2).recordReading(2, 500);
      await meterLog.connect(tenant2).recordReading(2, 580);

      const [totalMeters, totalReadings, totalConsumption] = await meterLog.getGlobalStats();

      expect(totalMeters).to.equal(2);
      expect(totalReadings).to.equal(4);
      expect(totalConsumption).to.equal(130); // 50 + 80
    });

    it("should pure calculateConsumption accurately and enforce ordering", async function () {
      const consumption = await meterLog.calculateConsumption(200, 350);
      expect(consumption).to.equal(150);

      await expect(
        meterLog.calculateConsumption(350, 200)
      ).to.be.revertedWith("Current reading must be >= previous reading");
    });
  });
});

