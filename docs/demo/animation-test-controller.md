## Animation Test Controller

### Usage

```javascript
import {
  setup as setupAnimations,
  tearDown as tearDownAnimations,
  offset,
} from '@ampproject/animations/dist/src/testing/animation-test-controller.js';
…

describe('Some animation', () => {
  before(() => {
    setupAnimations();
  });
  
  after(() => {
    tearDownAnimations();
  });
  
  it('should render recorrectly 50ms in', () => {
    const testRoot = …;
    const animatingElement = …;
    doSomethingStartingAnAnimation();
    
    offset(50, testRoot);
    const {top} = animatingElement.getBoundingClientRect();
    expect(top).to.be.closeTo(100, 0.1);

    offset(100, testRoot); // Note, sets to t=100, not 150
    …
  });
});
```

Instead of testing positioning, it will likely make more sense to take a screenshot and compare it to an existing golden file.

### How it works

The setup call will pause all animations on the page by setting their `animation-play-state` to `paused`. This applies to both existing animations and those that are defined in the future. Once setup, the `offset` function moves all animations within a subtree to a specific time by specifying a negative `animation-duration`. This works correctly, even if you have already specified an `animation-delay` on an Element. The offset specified takes into account any existing animation delay, so it will work correctly if some of your animations already have delays.
