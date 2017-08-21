pragma solidity ^0.4.11;

contract Bounties {
    
    struct Bounty {
        mapping (address => uint) donations;
        uint totalAmount;
        uint totalDonators;
    }

    mapping (string => Bounty) bounties;

    function addBounty(string issueLink) payable returns (bool) {
        if (msg.value > 0) {
            if (bounties[issueLink].donations[msg.sender] <= 0) {
                bounties[issueLink].totalDonators += 1;
            }
            bounties[issueLink].totalAmount += msg.value;
            bounties[issueLink].donations[msg.sender] += msg.value;

            return true;
        }

        return false;        
    }

}
