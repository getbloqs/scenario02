pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SubdomainRedirect is Ownable {
 
  struct SubdomainEntry {
    string redirect; // redirect url
    address owner; // entry owner
    uint registeredUntil; // timestamp until this registration is valid
  }

  uint public registrationFee = 1000000;
  uint public registrations = 0;
  uint public registrationPeriod = 1 years + 30 days;
  mapping (string => SubdomainEntry) entries;
  mapping (uint => string) names;

  function createRegistration(string name, string redirect) external payable {
    require(
      msg.value >= registrationFee &&
      (entries[name].owner == address(0) || entries[name].registeredUntil < now) &&
      bytes(redirect).length > 0
    );

    entries[name].redirect = redirect;
    entries[name].owner = msg.sender;
    entries[name].registeredUntil = now + registrationPeriod;
    names[registrations] = name;
    registrations += 1;
  }

  function renewRegistration(string name) external payable {
    require(
      msg.value >= registrationFee &&
      entries[name].owner == msg.sender
    );

    entries[name].registeredUntil = now + registrationPeriod;
  }

  function updateRegistration(string name, string redirect) external {
    require(
      entries[name].owner == msg.sender &&
      entries[name].registeredUntil > now
    );

    entries[name].redirect = redirect;
  }

  function getRegistrationByIndex(uint index) public view returns (string, string, uint, address) {
    require(
      index >= 0 && index < registrations
    );

    string memory name = names[index];
    return (name, entries[name].redirect, entries[name].registeredUntil, entries[name].owner);
  }

  function getRegistrationByName(string name) public view returns (string, string, uint, address) {    
    return (name, entries[name].redirect, entries[name].registeredUntil, entries[name].owner);
  }

  function clearRegistration(string name, bool full) onlyOwner external {
    entries[name].redirect = "";

    if (full) {
      entries[name].owner = address(0);
      entries[name].registeredUntil = 0;
    }
  }

}