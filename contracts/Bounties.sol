pragma solidity ^0.4.11;

contract Bounties {

    enum BountyState { Open, Closed }

    event BountyClaim(string issueLink, string solutionLink, address claimant);
    
    struct Bounty {
        mapping (address => uint) donations;

        BountyState state;

        uint totalAmount;
        uint totalDonators;
    }

    mapping (string => Bounty) bounties;

    function addBounty(string issueLink) payable {
        require(msg.value > 0 && bytes(issueLink).length > 0);

        if (bounties[issueLink].donations[msg.sender] <= 0) {
            bounties[issueLink].totalDonators += 1;
        }
        bounties[issueLink].totalAmount += msg.value;
        bounties[issueLink].donations[msg.sender] += msg.value;
    }

    function claimBounty(string issueLink, string solutionLink) {
        require(bytes(solutionLink).length > 0);


    }

    function acceptClaim(string issueLink, string solutionLink) {

    }

}
