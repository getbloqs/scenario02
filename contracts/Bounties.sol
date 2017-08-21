pragma solidity ^0.4.11;

contract Bounties {

    enum BountyState { Open, Closed }

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
        require(msg.value > 0 && bytes(issueLink).length > 0);

        bounties[issueLink].totalAmount += msg.value;
        bounties[issueLink].donations[msg.sender] += msg.value;
    }

    function claimBounty(string issueLink, string solutionLink) {
        require(bytes(solutionLink).length > 0 && 
                bounties[issueLink].claims[solutionLink].claimant == address(0)); // address of claim is empty
           
        bounties[issueLink].claims[solutionLink].claimant = msg.sender;
        BountyClaimEvent(issueLink, solutionLink, msg.sender);
    }

    function supportClaim(string issueLink, string solutionLink) {
        require(
            bounties[issueLink].donations[msg.sender] > 0 &&  // donator must have made a donation
            !bounties[issueLink].claims[solutionLink].donatorSupported[msg.sender] && // not yet supported
            bounties[issueLink].state == BountyState.Open // Bounty must still be open
        ); 

        bounties[issueLink].claims[solutionLink].donatorSupported[msg.sender] = true;
        bounties[issueLink].claims[solutionLink].donatorSupport += (bounties[issueLink].donations[msg.sender] / bounties[issueLink].totalAmount) * 100;

        if (bounties[issueLink].claims[solutionLink].donatorSupport > 50) {
            bounties[issueLink].claimant = bounties[issueLink].claims[solutionLink].claimant;
            bounties[issueLink].state = BountyState.Closed;
            BountyClaimAcceptedEvent(issueLink, solutionLink, bounties[issueLink].claimant);
        }
    }

    function clearBounty(string issueLink) {
        require(
            bounties[issueLink].state == BountyState.Closed &&
            bounties[issueLink].claimant == msg.sender
        );

        let payoutAmount = bounties[issueLink].totalAmount;
        bounties[issueLink].totalAmount = 0;
        msg.sender.transfer(payoutAmount);
    }

}
