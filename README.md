# Trig Worms

A pure Javascript application (with HTML and CSS of course!) that creates colourful animated art on an HTML canvas.

No external libraries at all have been used.

Users are in control, in the sense that they can change all sorts of parameters to vary the drawing.

Currently (February 2024) the app is in a nascent state.   There are doubtless many bugs, including some that I am aware of and all of which I intend to fix very soon!

I also have many more features I intend to implement, and will do so soon.

This `README` and the Help text will be expanded considerably in due course, so as to to document the app comprehensively.

In the meantime here are a couple of screenshots:
![](media/app_snapshot_00.png)
![](media/tw_05.png)
![](media/tw_06.jpg)
![](media/tw_07.jpg)
![](media/tw_04.png)
![](media/tw_10.png)
![](media/tw_11.png)

- And check out this video I made from the app, adding my own piano accompaniment:
- <https://www.youtube.com/watch?v=L64Ztsul7bA>


Do please try it out at <https://teraspora.github.io/trig_worms/>!   But don't expect it to work great on iPhones:  that's not a priority at the moment, large screens are the target.   It seems to work reasonably on Android, but I have not checked in detail.
If it crashes your browser, sorry, tough!

## TODO:

### Current
- Keyboard shortcuts
- Update this `README` with full documentation
- Update Help pane
- Allow user to vary curve parameters
- Allow user to specify own functions
- Allow save image to local storage
- Let user split canvas into 4, focus on current curve, with different parameters for each.
- Bubbles
- Other browsers - Safari showing sliders as black
- Mobile

### Longer-term
- Multiple canvases
- Refactor:
  - Organise inputs better
  - Use web components
- Mutate using shader
- Consider using Svelte

## Acknowledgements

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial 
- https://bucephalus.org/text/CanvasHandbook/CanvasHandbook.html
- https://www.youtube.com/@Frankslaboratory for inspiring me about:
  - the OOP approach to animation;
  - managing particles;
  - drawing rotationally symmetrical objects by using rotation within context save/restore
  - use of vector and scalar fields (aka 'flow fields') to influence motion
- https://www.youtube.com/@Radu for inspiration regarding
  - video pixel manipulation
  - audio oscillators
- http://buildnewgames.com/ for some interesting articles, a bit old, but much still relevant

