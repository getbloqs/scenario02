pragma solidity ^0.4.11;

import './Owned.sol';

contract SubdomainRedirect is Owned {
 
  struct SubdomainEntry {
    string redirect; // redirect url
    address owner; // entry owner
    uint registeredUntil; // timestamp until this registration is valid
  }

  uint public registrationFee = 5 finney;
  uint public registrations = 0;
  mapping (string => SubdomainEntry) entries;
  mapping (uint => string) names;

  function createRegistration(string name, string redirect) payable {
    require(
      msg.value >= registrationFee &&
      (entries[name].owner == address(0) || entries[name].registeredUntil < now) &&
      bytes(redirect).length > 0
    );

    entries[name].redirect = redirect;
    entries[name].owner = msg.sender;
    entries[name].registeredUntil = now + 1 years + 30 days; // register for 1 year and 30 days
    names[registrations] = name;
    registrations += 1;
  }

  function renewRegistration(string name) payable {
    require(
      msg.value >= registrationFee &&
      entries[name].owner == msg.sender
    );

    entries[name].registeredUntil = now + 1 years + 30 days; // register for 1 year and 30 days
  }

  function updateRegistration(string name, string redirect) {
    require(
      entries[name].owner == msg.sender &&
      entries[name].registeredUntil > now
    );

    entries[name].redirect = redirect;
  }

  function getRegistration(uint index) constant returns (string, string, uint, address) {
    require(
      index >= 0 && index < registrations
    );

    string memory name = names[index];
    return (name, entries[name].redirect, entries[name].registeredUntil, entries[name].owner);
  }

  function clearRegistration(string name, bool full) ownerOnly {
    entries[name].redirect = "";

    if (full) {
      entries[name].owner = address(0);
      entries[name].registeredUntil = 0;
    }
  }

}
