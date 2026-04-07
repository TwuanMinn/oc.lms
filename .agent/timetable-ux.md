## UI Pro Max Search Results
**Domain:** ux | **Query:** animation accessibility card
**Source:** ux-guidelines.csv | **Found:** 5 results

### Result 1
- **Category:** Animation
- **Issue:** Continuous Animation
- **Platform:** All
- **Description:** Infinite animations are distracting
- **Do:** Use for loading indicators only
- **Don't:** Use for decorative elements
- **Code Example Good:** animate-spin on loader
- **Code Example Bad:** animate-bounce on icons
- **Severity:** Medium

### Result 2
- **Category:** Animation
- **Issue:** Reduced Motion
- **Platform:** All
- **Description:** Respect user's motion preferences
- **Do:** Check prefers-reduced-motion media query
- **Don't:** Ignore accessibility motion settings
- **Code Example Good:** @media (prefers-reduced-motion: reduce)
- **Code Example Bad:** No motion query check
- **Severity:** High

### Result 3
- **Category:** Animation
- **Issue:** Easing Functions
- **Platform:** All
- **Description:** Linear motion feels robotic
- **Do:** Use ease-out for entering ease-in for exiting
- **Don't:** Use linear for UI transitions
- **Code Example Good:** ease-out
- **Code Example Bad:** linear
- **Severity:** Low

### Result 4
- **Category:** Animation
- **Issue:** Loading States
- **Platform:** All
- **Description:** Show feedback during async operations
- **Do:** Use skeleton screens or spinners
- **Don't:** Leave UI frozen with no feedback
- **Code Example Good:** animate-pulse skeleton
- **Code Example Bad:** Blank screen while loading
- **Severity:** High

### Result 5
- **Category:** Animation
- **Issue:** Duration Timing
- **Platform:** All
- **Description:** Animations should feel responsive not sluggish
- **Do:** Use 150-300ms for micro-interactions
- **Don't:** Use animations longer than 500ms for UI
- **Code Example Good:** transition-all duration-200
- **Code Example Bad:** duration-1000
- **Severity:** Medium

