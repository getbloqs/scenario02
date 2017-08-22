pragma solidity ^0.4.11;

contract Bounties {

    enum BountyState { Open, Closed }

    event BountyClearedEvent(string issueLink, address claimant);
    event BountyClaimEvent(string issueLink, string solutionLink, address claimant);
    event BountyClaimAcceptedEvent(string issueLink, string solutionLink, address claimant);
    
    struct BountyClaim {
        mapping (address => bool) donatorSupported;

        address claimant;
        uint donatorSupport;
    }

    struct Bounty {
        mapping (address => uint) donations;
        mapping (string => BountyClaim) claims;

        BountyState state;
        uint totalAmount;
        address claimant;
    }

    mapping (string => Bounty) bounties;

    function addBounty(string issueLink) payable {

        // some ether and no empty issueLink
        require(msg.value > 0 && bytes(issueLink).length > 0);

        bounties[issueLink].totalAmount += msg.value;
        bounties[issueLink].donations[msg.sender] += msg.value;
    }

    function claimBounty(string issueLink, string solutionLink) {

        // no empty solution link
        // address of claim is empty
        require(
            bytes(solutionLink).length > 0 && 
            bounties[issueLink].claims[solutionLink].claimant == address(0)
        );
           
        bounties[issueLink].claims[solutionLink].claimant = msg.sender;
        BountyClaimEvent(issueLink, solutionLink, msg.sender);
    }

    function supportClaim(string issueLink, string solutionLink) {

        // donator must have made a donation
        // not yet supported
        // Bounty must still be open
        require(
            bounties[issueLink].donations[msg.sender] > 0 && 
            !bounties[issueLink].claims[solutionLink].donatorSupported[msg.sender] && 
            bounties[issueLink].state == BountyState.Open 
        ); 

        bounties[issueLink].claims[solutionLink].donatorSupported[msg.sender] = true;
        bounties[issueLink].claims[solutionLink].donatorSupport += (bounties[issueLink].donations[msg.sender] * 100) / bounties[issueLink].totalAmount;

        if (bounties[issueLink].claims[solutionLink].donatorSupport >= 40) {
            bounties[issueLink].claimant = bounties[issueLink].claims[solutionLink].claimant;
            bounties[issueLink].state = BountyState.Closed;
            BountyClaimAcceptedEvent(issueLink, solutionLink, bounties[issueLink].claimant);
        }
    }

    function clearBounty(string issueLink) {

        // bounty is closed and claimant is the message sender
        require(
            bounties[issueLink].state == BountyState.Closed &&
            bounties[issueLink].claimant == msg.sender
        );

        uint payoutAmount = bounties[issueLink].totalAmount;
        bounties[issueLink].totalAmount = 0;
        BountyClearedEvent(issueLink, msg.sender);
        msg.sender.transfer(payoutAmount);
    }

    function getBountyInfo(string issueLink) constant returns (uint, BountyState, address) {
        return (bounties[issueLink].totalAmount, bounties[issueLink].state, bounties[issueLink].claimant);
    }

    function getBountyClaimInfo(string issueLink, string solutionLink) constant returns (uint, address) {
        return (
            bounties[issueLink].claims[solutionLink].donatorSupport,
            bounties[issueLink].claims[solutionLink].claimant
        );
    }

}
