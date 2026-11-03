// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MeterLog
 * @dev On-chain electricity meter reading tracker for landlords, tenants, and small businesses.
 * Records meter registrations, meter readings, and calculates energy consumption.
 */
contract MeterLog {
    struct Reading {
        uint256 readingKwh;
        uint256 consumption;
        uint256 timestamp;
        address recordedBy;
        bool isInitial;
    }

    struct Meter {
        uint256 id;
        address owner;
        string name;
        string location;
        string description;
        uint256 registrationDate;
        uint256 lastUpdated;
        uint256 latestReading;
        uint256 totalConsumption;
        uint256 readingCount;
        bool exists;
    }

    // State variables
    uint256 private _meterIdCounter;
    uint256 public totalReadingsRecorded;

    // Meter storage: meterId => Meter
    mapping(uint256 => Meter) private _meters;
    // Meter reading history: meterId => Reading[]
    mapping(uint256 => Reading[]) private _meterReadings;
    // User owned meters: owner address => meterIds
    mapping(address => uint256[]) private _ownerMeters;

    // List of all registered meter IDs
    uint256[] private _allMeterIds;

    // Events
    event MeterRegistered(
        uint256 indexed meterId,
        address indexed owner,
        string name,
        string location,
        uint256 timestamp
    );

    event ReadingRecorded(
        uint256 indexed meterId,
        uint256 readingKwh,
        uint256 consumption,
        uint256 timestamp,
        address indexed recordedBy
    );

    event MeterUpdated(
        uint256 indexed meterId,
        string name,
        string location,
        string description,
        uint256 timestamp
    );

    // Modifiers
    modifier meterExists(uint256 meterId) {
        require(_meters[meterId].exists, "Meter does not exist");
        _;
    }

    modifier onlyMeterOwner(uint256 meterId) {
        require(_meters[meterId].exists, "Meter does not exist");
        require(_meters[meterId].owner == msg.sender, "Unauthorized: Not the meter owner");
        _;
    }

    /**
     * @notice Register a new electricity meter
     * @param name Name / identifier of the meter (e.g. Hostel Room 12)
     * @param location Location of the meter (e.g. Block A)
     * @param description Optional description
     * @return meterId The unique ID of the newly registered meter
     */
    function registerMeter(
        string calldata name,
        string calldata location,
        string calldata description
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Meter name cannot be empty");
        require(bytes(location).length > 0, "Meter location cannot be empty");

        _meterIdCounter++;
        uint256 newId = _meterIdCounter;

        _meters[newId] = Meter({
            id: newId,
            owner: msg.sender,
            name: name,
            location: location,
            description: description,
            registrationDate: block.timestamp,
            lastUpdated: block.timestamp,
            latestReading: 0,
            totalConsumption: 0,
            readingCount: 0,
            exists: true
        });

        _allMeterIds.push(newId);
        _ownerMeters[msg.sender].push(newId);

        emit MeterRegistered(newId, msg.sender, name, location, block.timestamp);

        return newId;
    }

    /**
     * @notice Record a new electricity meter reading in kWh
     * @param meterId The ID of the meter
     * @param readingKwh Current meter reading in kWh
     */
    function recordReading(uint256 meterId, uint256 readingKwh) external onlyMeterOwner(meterId) {
        Meter storage meter = _meters[meterId];

        uint256 consumption = 0;
        bool isInitial = (meter.readingCount == 0);

        if (!isInitial) {
            require(
                readingKwh >= meter.latestReading,
                "New reading cannot be lower than previous reading"
            );
            consumption = readingKwh - meter.latestReading;
        }

        meter.latestReading = readingKwh;
        meter.totalConsumption += consumption;
        meter.lastUpdated = block.timestamp;
        meter.readingCount++;
        totalReadingsRecorded++;

        _meterReadings[meterId].push(Reading({
            readingKwh: readingKwh,
            consumption: consumption,
            timestamp: block.timestamp,
            recordedBy: msg.sender,
            isInitial: isInitial
        }));

        emit ReadingRecorded(meterId, readingKwh, consumption, block.timestamp, msg.sender);
    }

    /**
     * @notice Update metadata for an existing meter
     * @param meterId The ID of the meter
     * @param name New name
     * @param location New location
     * @param description New description
     */
    function updateMeter(
        uint256 meterId,
        string calldata name,
        string calldata location,
        string calldata description
    ) external onlyMeterOwner(meterId) {
        require(bytes(name).length > 0, "Meter name cannot be empty");
        require(bytes(location).length > 0, "Meter location cannot be empty");

        Meter storage meter = _meters[meterId];
        meter.name = name;
        meter.location = location;
        meter.description = description;
        meter.lastUpdated = block.timestamp;

        emit MeterUpdated(meterId, name, location, description, block.timestamp);
    }

    /**
     * @notice Get single meter details
     */
    function getMeter(uint256 meterId) external view meterExists(meterId) returns (Meter memory) {
        return _meters[meterId];
    }

    /**
     * @notice Get all readings for a specific meter in chronological order
     */
    function getMeterReadings(uint256 meterId) external view meterExists(meterId) returns (Reading[] memory) {
        return _meterReadings[meterId];
    }

    /**
     * @notice Get all registered meters
     */
    function getAllMeters() external view returns (Meter[] memory) {
        uint256 total = _allMeterIds.length;
        Meter[] memory allMeters = new Meter[](total);
        for (uint256 i = 0; i < total; i++) {
            allMeters[i] = _meters[_allMeterIds[i]];
        }
        return allMeters;
    }

    /**
     * @notice Get meter IDs owned by an address
     */
    function getMetersByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerMeters[owner];
    }

    /**
     * @notice Get total registered meters count
     */
    function getTotalMeters() external view returns (uint256) {
        return _allMeterIds.length;
    }

    /**
     * @notice Calculate consumption between two arbitrary readings for a meter
     */
    function calculateConsumption(
        uint256 previousReading,
        uint256 currentReading
    ) external pure returns (uint256) {
        require(currentReading >= previousReading, "Current reading must be >= previous reading");
        return currentReading - previousReading;
    }

    /**
     * @notice Get aggregated global stats
     */
    function getGlobalStats() external view returns (
        uint256 totalMeters,
        uint256 totalReadings,
        uint256 totalSystemConsumption
    ) {
        uint256 sumConsumption = 0;
        uint256 total = _allMeterIds.length;
        for (uint256 i = 0; i < total; i++) {
            sumConsumption += _meters[_allMeterIds[i]].totalConsumption;
        }
        return (total, totalReadingsRecorded, sumConsumption);
    }
}
