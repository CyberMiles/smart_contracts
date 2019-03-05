pragma lity ^1.2.7;
import "truffle/Assert.sol";

contract TestTruffleFramework {
  uint someValue;

  function beforeEach() public {
    someValue = 5;
  }

  function beforeEachAgain() public {
    someValue += 1;
  }

  function testSomeValueIsSix() public {
    uint expected = 6;

    Assert.equal(someValue, expected, "someValue should have been 6");
  }
}
